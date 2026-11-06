package com.iteducation.repository;
import com.iteducation.entity.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface InquiryRepository extends JpaRepository<Inquiry,Long> {
 boolean existsByNormalizedPhoneAndStatusIn(String phone,List<String> statuses);
 long countByStatus(String status);
 List<Inquiry> findTop10ByOrderByCreatedAtDesc();
}