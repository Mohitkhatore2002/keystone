package com.meridian.keystone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileUpdateRequest {
    private String name;
    private String email;
    private String title;
    private String location;
    private String aboutMe;
    private String phone;
    private String portfolioUrl;
    private String avatarUrl;
    private Integer completedCourses;
    private Integer skillsVerified;
    private Integer internshipsDone;
}
