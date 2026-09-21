package com.meridian.keystone.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UserRole role;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(length = 150)
    @Builder.Default
    private String title = "Senior Dispatch & Field Operations Lead";

    @Column(length = 100)
    @Builder.Default
    private String location = "Central Dispatch Hub • Region 1";

    @Column(name = "about_me", length = 1000)
    @Builder.Default
    private String aboutMe = "Senior Field Operations Specialist managing dispatcher workflows, work order assignments, SLA compliance, and technician fleet logistics across Keystone Operations.";

    @Column(length = 30)
    @Builder.Default
    private String phone = "+1 (800) 555-0199";

    @Column(name = "portfolio_url", length = 255)
    @Builder.Default
    private String portfolioUrl = "https://keystone-ops.com/portal/dispatch";

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "profile_completion")
    @Builder.Default
    private Integer profileCompletion = 85;

    @Column(name = "completed_courses")
    @Builder.Default
    private Integer completedCourses = 148;

    @Column(name = "skills_verified")
    @Builder.Default
    private Integer skillsVerified = 5;

    @Column(name = "internships_done")
    @Builder.Default
    private Integer internshipsDone = 10;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (title == null) title = "Senior Dispatch & Field Operations Lead";
        if (location == null) location = "Central Dispatch Hub • Region 1";
        if (aboutMe == null) aboutMe = "Senior Field Operations Specialist managing dispatcher workflows, work order assignments, SLA compliance, and technician fleet logistics across Keystone Operations.";
        if (phone == null) phone = "+1 (800) 555-0199";
        if (portfolioUrl == null) portfolioUrl = "https://keystone-ops.com/portal/dispatch";
        if (profileCompletion == null) profileCompletion = 85;
        if (completedCourses == null) completedCourses = 148;
        if (skillsVerified == null) skillsVerified = 5;
        if (internshipsDone == null) internshipsDone = 10;
    }
}
