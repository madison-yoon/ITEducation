package com.iteducation.controller;

import com.iteducation.dto.ProjectShowcaseResponse;
import com.iteducation.entity.Course;
import com.iteducation.entity.Notice;
import com.iteducation.repository.CourseRepository;
import com.iteducation.repository.NoticeRepository;
import com.iteducation.service.ProjectCatalogService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicController {
    private final CourseRepository courses;
    private final NoticeRepository notices;
    private final ProjectCatalogService projects;

    public PublicController(
            CourseRepository courses,
            NoticeRepository notices,
            ProjectCatalogService projects
    ) {
        this.courses = courses;
        this.notices = notices;
        this.projects = projects;
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

    /**
     * 프로젝트 상세 정보는 프론트엔드와 같은 응답 구조로 제공합니다.
     * 응답의 disclosure 필드로 교육 설계 예시임을 명시합니다.
     */
    @GetMapping("/projects")
    public List<ProjectShowcaseResponse> projects() {
        return projects.findAll();
    }
}
