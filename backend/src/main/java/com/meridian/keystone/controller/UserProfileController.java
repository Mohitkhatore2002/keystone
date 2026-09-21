package com.meridian.keystone.controller;

import com.meridian.keystone.domain.User;
import com.meridian.keystone.dto.UserDto;
import com.meridian.keystone.dto.UserProfileUpdateRequest;
import com.meridian.keystone.repository.UserRepository;
import com.meridian.keystone.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "Endpoints for managing user profile information")
public class UserProfileController {

    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get detailed user profile")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal != null ? principal.getId() : 1L;
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElseThrow());

        return ResponseEntity.ok(mapToDto(user));
    }

    @PutMapping
    @Operation(summary = "Update user profile information")
    public ResponseEntity<UserDto> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UserProfileUpdateRequest request) {
        
        Long userId = principal != null ? principal.getId() : 1L;
        User user = userRepository.findById(userId)
                .orElseGet(() -> userRepository.findAll().stream().findFirst().orElseThrow());

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            user.setEmail(request.getEmail());
        }
        if (request.getTitle() != null) user.setTitle(request.getTitle());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        if (request.getAboutMe() != null) user.setAboutMe(request.getAboutMe());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getPortfolioUrl() != null) user.setPortfolioUrl(request.getPortfolioUrl());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getCompletedCourses() != null) user.setCompletedCourses(request.getCompletedCourses());
        if (request.getSkillsVerified() != null) user.setSkillsVerified(request.getSkillsVerified());
        if (request.getInternshipsDone() != null) user.setInternshipsDone(request.getInternshipsDone());

        // Calculate profile completion percentage
        int score = 0;
        if (user.getName() != null && !user.getName().isBlank()) score += 20;
        if (user.getEmail() != null && !user.getEmail().isBlank()) score += 20;
        if (user.getTitle() != null && !user.getTitle().isBlank()) score += 15;
        if (user.getLocation() != null && !user.getLocation().isBlank()) score += 15;
        if (user.getAboutMe() != null && !user.getAboutMe().isBlank()) score += 15;
        if (user.getPhone() != null && !user.getPhone().isBlank()) score += 15;
        user.setProfileCompletion(Math.min(score, 100));

        User updated = userRepository.save(user);
        return ResponseEntity.ok(mapToDto(updated));
    }

    private UserDto mapToDto(User u) {
        String year = u.getCreatedAt() != null ? String.valueOf(u.getCreatedAt().getYear()) : "2026";
        return UserDto.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole())
                .title(u.getTitle() != null ? u.getTitle() : "Senior Dispatch & Field Operations Lead")
                .location(u.getLocation() != null ? u.getLocation() : "Central Dispatch Hub • Region 1")
                .aboutMe(u.getAboutMe() != null ? u.getAboutMe() : "Senior Field Operations Specialist managing dispatcher workflows, work order assignments, SLA compliance, and technician fleet logistics across Keystone Operations.")
                .phone(u.getPhone() != null ? u.getPhone() : "+1 (800) 555-0199")
                .portfolioUrl(u.getPortfolioUrl() != null ? u.getPortfolioUrl() : "https://keystone-ops.com/portal/dispatch")
                .avatarUrl(u.getAvatarUrl())
                .profileCompletion(u.getProfileCompletion() != null ? u.getProfileCompletion() : 85)
                .completedCourses(u.getCompletedCourses() != null ? u.getCompletedCourses() : 148)
                .skillsVerified(u.getSkillsVerified() != null ? u.getSkillsVerified() : 5)
                .internshipsDone(u.getInternshipsDone() != null ? u.getInternshipsDone() : 10)
                .joinedYear(year)
                .build();
    }
}
