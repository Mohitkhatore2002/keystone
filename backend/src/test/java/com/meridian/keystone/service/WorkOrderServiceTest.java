package com.meridian.keystone.service;

import com.meridian.keystone.domain.*;
import com.meridian.keystone.dto.AssignWorkOrderRequest;
import com.meridian.keystone.dto.StatusTransitionRequest;
import com.meridian.keystone.dto.WorkOrderDto;
import com.meridian.keystone.exception.ForbiddenAccessException;
import com.meridian.keystone.exception.IllegalStateTransitionException;
import com.meridian.keystone.repository.*;
import com.meridian.keystone.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkOrderServiceTest {

    @Mock
    private WorkOrderRepository workOrderRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private SiteRepository siteRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private WorkOrderStatusHistoryRepository historyRepository;
    @Mock
    private TimeLogRepository timeLogRepository;

    @Mock
    private SecurityContext securityContext;
    @Mock
    private Authentication authentication;

    @InjectMocks
    private WorkOrderService workOrderService;

    private User managerUser;
    private User dispatcherUser;
    private User techUser;
    private Customer customer;
    private Site site;
    private WorkOrder workOrder;

    @BeforeEach
    void setUp() {
        managerUser = User.builder().id(1L).name("Manager").email("manager@test.com").role(UserRole.MANAGER).build();
        dispatcherUser = User.builder().id(2L).name("Dispatcher").email("dispatcher@test.com").role(UserRole.DISPATCHER).build();
        techUser = User.builder().id(3L).name("Tech John").email("tech@test.com").role(UserRole.TECHNICIAN).build();

        customer = Customer.builder().id(10L).name("Acme Inc").contactEmail("customer@acme.com").build();
        site = Site.builder().id(20L).customer(customer).name("Building 1").address("123 Street").build();

        workOrder = WorkOrder.builder()
                .id(100L)
                .code("WO-100")
                .title("Test Job")
                .description("Test Description")
                .priority(WorkOrderPriority.HIGH)
                .status(WorkOrderStatus.NEW)
                .slaDueAt(LocalDateTime.now().plusHours(4))
                .customer(customer)
                .site(site)
                .build();
    }

    private void mockCurrentUser(User user) {
        UserPrincipal principal = UserPrincipal.create(user);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(principal);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    @DisplayName("Should assign work order successfully by Dispatcher")
    void testAssignWorkOrder_Success() {
        mockCurrentUser(dispatcherUser);
        when(workOrderRepository.findById(100L)).thenReturn(Optional.of(workOrder));
        when(userRepository.findById(3L)).thenReturn(Optional.of(techUser));
        when(workOrderRepository.save(any(WorkOrder.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AssignWorkOrderRequest request = new AssignWorkOrderRequest();
        request.setTechnicianId(3L);

        WorkOrderDto result = workOrderService.assignWorkOrder(100L, request);

        assertEquals(WorkOrderStatus.ASSIGNED, result.getStatus());
        assertEquals(3L, result.getAssignedToId());
        verify(historyRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Should allow Technician to start assigned job (ASSIGNED -> IN_PROGRESS)")
    void testTransitionStatus_TechStartJob() {
        mockCurrentUser(techUser);
        workOrder.setStatus(WorkOrderStatus.ASSIGNED);
        workOrder.setAssignedTo(techUser);

        when(workOrderRepository.findById(100L)).thenReturn(Optional.of(workOrder));
        when(workOrderRepository.save(any(WorkOrder.class))).thenAnswer(invocation -> invocation.getArgument(0));

        StatusTransitionRequest request = new StatusTransitionRequest();
        request.setToStatus(WorkOrderStatus.IN_PROGRESS);
        request.setNote("Starting work on site");

        WorkOrderDto result = workOrderService.transitionStatus(100L, request);

        assertEquals(WorkOrderStatus.IN_PROGRESS, result.getStatus());
    }

    @Test
    @DisplayName("Should reject illegal transition (NEW -> CLOSED)")
    void testTransitionStatus_IllegalTransition() {
        mockCurrentUser(managerUser);
        when(workOrderRepository.findById(100L)).thenReturn(Optional.of(workOrder));

        StatusTransitionRequest request = new StatusTransitionRequest();
        request.setToStatus(WorkOrderStatus.CLOSED);

        assertThrows(IllegalStateTransitionException.class, () -> workOrderService.transitionStatus(100L, request));
    }

    @Test
    @DisplayName("Should reject Technician attempting to CLOSE job")
    void testTransitionStatus_ForbiddenCloseByTech() {
        mockCurrentUser(techUser);
        workOrder.setStatus(WorkOrderStatus.COMPLETED);
        workOrder.setAssignedTo(techUser);

        when(workOrderRepository.findById(100L)).thenReturn(Optional.of(workOrder));

        StatusTransitionRequest request = new StatusTransitionRequest();
        request.setToStatus(WorkOrderStatus.CLOSED);

        assertThrows(ForbiddenAccessException.class, () -> workOrderService.transitionStatus(100L, request));
    }

    @Test
    @DisplayName("Should allow Manager to CLOSE a COMPLETED job")
    void testTransitionStatus_ManagerCloseJob() {
        mockCurrentUser(managerUser);
        workOrder.setStatus(WorkOrderStatus.COMPLETED);
        workOrder.setAssignedTo(techUser);

        when(workOrderRepository.findById(100L)).thenReturn(Optional.of(workOrder));
        when(workOrderRepository.save(any(WorkOrder.class))).thenAnswer(invocation -> invocation.getArgument(0));

        StatusTransitionRequest request = new StatusTransitionRequest();
        request.setToStatus(WorkOrderStatus.CLOSED);
        request.setNote("Sign-off verified");

        WorkOrderDto result = workOrderService.transitionStatus(100L, request);

        assertEquals(WorkOrderStatus.CLOSED, result.getStatus());
    }
}
