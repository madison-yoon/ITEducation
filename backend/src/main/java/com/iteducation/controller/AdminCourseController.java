package com.iteducation.controller;

import com.iteducation.entity.Course;
import com.iteducation.repository.CourseRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/courses")
public class AdminCourseController {
    private final CourseRepository courses;

    public AdminCourseController(CourseRepository courses) {
        this.courses = courses;
    }

    public record CourseRequest(
            @NotBlank @Size(max = 120) String title,
            @Size(max = 50) String category,
            @Size(max = 500) String summary,
            @Size(max = 5000) String description,
            @Size(max = 200) String target,
            @Size(max = 40) String duration,
            @Size(max = 30) String recruitmentStatus,
            @Size(max = 500) String imageUrl,
            @Size(max = 10000) String curriculum,
            @Size(max = 2000) String skills,
            boolean featured,
            boolean operatingInfoVerified
    ) {
    }

    @GetMapping
    public List<Course> list() {
        return courses.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Course create(@Valid @RequestBody CourseRequest request) {
        Course course = new Course();
        apply(course, request);
        return courses.save(course);
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        Course course = courses.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        apply(course, request);
        return courses.save(course);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!courses.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        courses.deleteById(id);
    }

    private void apply(Course course, CourseRequest request) {
        if (request.recruitmentStatus() == null
                || !List.of("모집 정보 확인", "모집 중", "모집 예정", "모집 마감")
                .contains(request.recruitmentStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "모집 상태를 확인해 주세요.");
        }

        if (request.operatingInfoVerified()
                && ("모집 정보 확인".equals(request.recruitmentStatus())
                || request.target() == null || request.target().isBlank()
                || request.duration() == null || request.duration().isBlank())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "운영정보 확인 완료로 공개하려면 모집 상태, 교육 기간, 지원 대상을 입력해 주세요."
            );
        }

        course.setTitle(request.title().trim());
        course.setCategory(request.category());
        course.setSummary(request.summary());
        course.setDescription(request.description());
        course.setTarget(request.target());
        course.setDuration(request.duration());
        course.setRecruitmentStatus(request.recruitmentStatus());
        course.setImageUrl(request.imageUrl());
        course.setCurriculum(request.curriculum());
        course.setSkills(request.skills());
        course.setFeatured(request.featured());
        course.setOperatingInfoVerified(request.operatingInfoVerified());
    }
}
