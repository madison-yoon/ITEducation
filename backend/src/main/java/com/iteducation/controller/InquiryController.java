package com.iteducation.controller;
import com.iteducation.entity.Inquiry;
import com.iteducation.service.InquiryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Map;
@RestController @RequestMapping("/api/inquiries")
public class InquiryController {
 private final InquiryService service;
 public InquiryController(InquiryService service){this.service=service;}
 public record Request(@NotBlank String name,@NotBlank String phone,String email,@NotBlank String courseTitle,LocalDate preferredDate,String preferredPeriod,@NotBlank String message,boolean privacyConsent,boolean marketingConsent){}
 @PostMapping @ResponseStatus(HttpStatus.CREATED)
 public Map<String,String> create(@Valid @RequestBody Request r){
  Inquiry i=new Inquiry();i.setName(r.name());i.setPhone(r.phone());i.setEmail(r.email());i.setCourseTitle(r.courseTitle());i.setPreferredDate(r.preferredDate());i.setPreferredPeriod(r.preferredPeriod());i.setMessage(r.message());i.setPrivacyConsent(r.privacyConsent());i.setMarketingConsent(r.marketingConsent());
  return Map.of("receiptNo",service.create(i),"message","상담 신청이 접수되었습니다.");
 }
}