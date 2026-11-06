package com.iteducation.repository;

import com.iteducation.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByStatusOrderByPinnedDescCreatedAtDesc(String status);
    List<Notice> findAllByOrderByPinnedDescCreatedAtDesc();
    List<Notice> findTop5ByOrderByCreatedAtDesc();
    long countByStatus(String status);
}
