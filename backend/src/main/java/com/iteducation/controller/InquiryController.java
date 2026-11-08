package com.iteducation.controller;

import com.iteducation.entity.Inquiry;
import com.iteducation.service.InquiryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {
    private final InquiryService service;

    public InquiryController(InquiryService service) {
        this.service = service;
    }

    public record Request(
            @NotBlank(message = "이름을 입력해 주세요.")
            @Size(max = 40, message = "이름은 40자 이내로 입력해 주세요.")
            String name,

            @NotBlank(message = "연락처를 입력해 주세요.")
            @Size(max = 20, message = "연락처 형식을 확인해 주세요.")
            @Pattern(regexp = "^[0-9+() -]{9,20}$", message = "연락처에 숫자와 허용된 기호만 입력해 주세요.")
            String phone,

            @Email(message = "이메일 형식을 확인해 주세요.")
            @Size(max = 120, message = "이메일은 120자 이내로 입력해 주세요.")
            String email,

            @NotBlank(message = "관심 교육과정을 선택해 주세요.")
            @Size(max = 120, message = "교육과정명은 120자 이내로 입력해 주세요.")
            String courseTitle,

            LocalDate preferredDate,

            @Size(max = 40, message = "상담 희망 시간은 40자 이내로 입력해 주세요.")
            String preferredPeriod,

            @NotBlank(message = "상담 내용을 입력해 주세요.")
            @Size(min = 10, max = 2000, message = "상담 내용은 10자 이상 2,000자 이내로 입력해 주세요.")
            String message,

            boolean privacyConsent,
            boolean marketingConsent
    ) {
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> create(@Valid @RequestBody Request request) {
        Inquiry inquiry = new Inquiry();
        inquiry.setName(request.name().trim());
        inquiry.setPhone(request.phone().trim());
        inquiry.setEmail(request.email() == null || request.email().isBlank()
                ? null : request.email().trim());
        inquiry.setCourseTitle(request.courseTitle().trim());
        inquiry.setPreferredDate(request.preferredDate());
        inquiry.setPreferredPeriod(request.preferredPeriod() == null
                ? null : request.preferredPeriod().trim());
        inquiry.setMessage(request.message().trim());
        inquiry.setPrivacyConsent(request.privacyConsent());
        inquiry.setMarketingConsent(request.marketingConsent());

        return Map.of(
                "receiptNo", service.create(inquiry),
                "message", "상담 신청이 접수되었습니다."
        );
    }
}
