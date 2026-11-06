package com.iteducation.controller;

import com.iteducation.entity.Course;
import com.iteducation.repository.CourseRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
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

    public record CourseRequest(@NotBlank String title, String category, String summary,
                                String description, String target, String duration,
                                String recruitmentStatus, String imageUrl,
                                String curriculum, String skills, boolean featured) {}

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
        if (!List.of("모집 중", "모집 예정", "모집 마감").contains(request.recruitmentStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "모집 상태를 확인해 주세요.");
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
    }
}
