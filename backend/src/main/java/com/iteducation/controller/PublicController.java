package com.iteducation.controller;

import com.iteducation.dto.CoursePublicResponse;
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
    public List<CoursePublicResponse> courses() {
        return courses.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toPublicCourse)
                .toList();
    }

    @GetMapping("/courses/{id}")
    public CoursePublicResponse course(@PathVariable Long id) {
        Course course = courses.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toPublicCourse(course);
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
    public List<ProjectShowcaseResponse> projects() {
        return projects.findAll();
    }

    private CoursePublicResponse toPublicCourse(Course course) {
        boolean verified = course.isOperatingInfoVerified();

        return new CoursePublicResponse(
                course.getId(),
                course.getTitle(),
                course.getCategory(),
                course.getSummary(),
                course.getDescription(),
                verified ? course.getTarget() : "지원 대상은 운영기관 확인 필요",
                verified ? course.getDuration() : "운영 정보 확인",
                verified ? course.getRecruitmentStatus() : "모집 정보 확인",
                course.getImageUrl(),
                course.getCurriculum(),
                course.getSkills(),
                course.isFeatured(),
                verified ? "운영 정보 확인 완료" : "교육과정 구성 예시"
        );
    }
}
