package com.meridian.keystone.dto;

import com.meridian.keystone.domain.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private UserRole role;

    private String title;
    private String location;
    private String aboutMe;
    private String phone;
    private String portfolioUrl;
    private String avatarUrl;
    private Integer profileCompletion;
    private Integer completedCourses;
    private Integer skillsVerified;
    private Integer internshipsDone;
    private String joinedYear;
}
