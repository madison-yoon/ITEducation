package com.iteducation.repository;

import com.iteducation.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findAllByOrderByCreatedAtDesc();
    long countByRecruitmentStatus(String recruitmentStatus);\n    boolean existsByTitle(String title);
}
