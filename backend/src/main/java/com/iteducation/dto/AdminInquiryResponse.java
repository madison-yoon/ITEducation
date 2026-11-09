package com.iteducation.dto;

import com.iteducation.entity.Inquiry;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 관리자 화면에 표시하는 필드만 포함합니다.
 * 내부 중복 판정용 정규화 연락처와 개인정보 동의 원본은 API 응답에서 제외합니다.
 */
public record AdminInquiryResponse(
        Long id,
        String name,
        String phone,
        String email,
        String courseTitle,
        LocalDate preferredDate,
        String preferredPeriod,
        String message,
        String status,
        String adminMemo,
        LocalDateTime createdAt
) {
    public static AdminInquiryResponse from(Inquiry inquiry) {
        return new AdminInquiryResponse(
                inquiry.getId(),
                inquiry.getName(),
                inquiry.getPhone(),
                inquiry.getEmail(),
                inquiry.getCourseTitle(),
                inquiry.getPreferredDate(),
                inquiry.getPreferredPeriod(),
                inquiry.getMessage(),
                inquiry.getStatus(),
                inquiry.getAdminMemo(),
                inquiry.getCreatedAt()
        );
    }
}
