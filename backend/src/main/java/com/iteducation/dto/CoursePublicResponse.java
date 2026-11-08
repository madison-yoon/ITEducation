package com.iteducation.dto;

public record CoursePublicResponse(
        Long id,
        String title,
        String category,
        String summary,
        String description,
        String target,
        String duration,
        String recruitmentStatus,
        String imageUrl,
        String curriculum,
        String skills,
        boolean featured,
        String infoDisclosure
) {
}
