package com.iteducation.repository;

import com.iteducation.entity.Inquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    boolean existsByNormalizedPhoneAndStatusIn(String phone, List<String> statuses);

    long countByStatus(String status);

    List<Inquiry> findTop10ByOrderByCreatedAtDesc();

    /**
     * 검색과 페이지 분할을 데이터베이스에서 수행해 신청 건수가 늘어도
     * 관리자 화면이 전체 데이터를 메모리로 읽지 않도록 합니다.
     */
    @Query("""
            SELECT inquiry
            FROM Inquiry inquiry
            WHERE (:status = '' OR inquiry.status = :status)
              AND (
                    :keyword = ''
                    OR LOWER(inquiry.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR inquiry.phone LIKE CONCAT('%', :keyword, '%')
                    OR LOWER(COALESCE(inquiry.courseTitle, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
              )
            """)
    Page<Inquiry> search(
            @Param("keyword") String keyword,
            @Param("status") String status,
            Pageable pageable
    );
}
