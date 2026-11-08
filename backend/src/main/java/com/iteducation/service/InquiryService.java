package com.iteducation.service;

import com.iteducation.entity.Inquiry;
import com.iteducation.repository.CourseRepository;
import com.iteducation.repository.InquiryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class InquiryService {
    private static final List<String> ACTIVE_STATUSES = List.of("접수", "상담 진행");

    private final InquiryRepository repository;
    private final CourseRepository courses;

    public InquiryService(InquiryRepository repository, CourseRepository courses) {
        this.repository = repository;
        this.courses = courses;
    }

    @Transactional
    public String create(Inquiry item) {
        if (!item.isPrivacyConsent()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "개인정보 수집 및 이용 동의가 필요합니다."
            );
        }

        if (!courses.existsByTitle(item.getCourseTitle())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "선택한 교육과정을 찾을 수 없습니다."
            );
        }

        String normalizedPhone = item.getPhone() == null
                ? ""
                : item.getPhone().replaceAll("\\D", "");

        if (normalizedPhone.length() < 9 || normalizedPhone.length() > 15) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "연락처를 확인해 주세요.");
        }

        if (repository.existsByNormalizedPhoneAndStatusIn(normalizedPhone, ACTIVE_STATUSES)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "진행 중인 상담이 있습니다. 기존 접수 건의 안내를 확인해 주세요."
            );
        }

        item.setNormalizedPhone(normalizedPhone);
        item.setStatus("접수");
        Inquiry saved = repository.save(item);

        return "ITA-"
                + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE)
                + "-"
                + String.format("%06d", saved.getId());
    }
}
