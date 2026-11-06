package com.iteducation.controller;

import com.iteducation.entity.Course;
import com.iteducation.entity.Notice;
import com.iteducation.repository.CourseRepository;
import com.iteducation.repository.NoticeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PublicController {
    private final CourseRepository courses;
    private final NoticeRepository notices;

    public PublicController(CourseRepository courses, NoticeRepository notices) {
        this.courses = courses;
        this.notices = notices;
    }

    @GetMapping("/courses")
    public List<Course> courses() {
        return courses.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/courses/{id}")
    public Course course(@PathVariable Long id) {
        return courses.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/notices")
    public List<Notice> notices() {
        return notices.findByStatusOrderByPinnedDescCreatedAtDesc("게시 중");
    }

    @GetMapping("/notices/{id}")
    public Notice notice(@PathVariable Long id) {
        Notice notice = notices.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!"게시 중".equals(notice.getStatus())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        return notice;
    }

    @GetMapping("/projects")
    public List<Map<String, String>> projects() {
        return List.of(
                Map.of("title", "AI 영화 추천 시스템", "category", "AI·머신러닝", "description", "사용자 선호 데이터 기반 추천 모델"),
                Map.of("title", "소비 데이터 분석 대시보드", "category", "빅데이터", "description", "대규모 소비 패턴 분석과 시각화"),
                Map.of("title", "문서 질의응답 AI 서비스", "category", "생성형 AI", "description", "문서 검색과 LLM 응답을 결합한 서비스"),
                Map.of("title", "AI 통합 웹 플랫폼", "category", "AI 웹서비스", "description", "AI 기능을 연결한 웹 서비스 예시")
        );
    }
}
