package com.iteducation.service;
import com.iteducation.entity.Inquiry;
import com.iteducation.repository.InquiryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
@Service
public class InquiryService {
 private final InquiryRepository repository;
 public InquiryService(InquiryRepository repository){this.repository=repository;}
 @Transactional public String create(Inquiry item){
  if(!item.isPrivacyConsent())throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"개인정보 수집 및 이용 동의가 필요합니다.");
  String phone=item.getPhone()==null?"":item.getPhone().replaceAll("\\D","");
  if(phone.length()<9)throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"연락처를 확인해 주세요.");
  if(repository.existsByNormalizedPhoneAndStatusIn(phone,List.of("접수","상담 진행")))throw new ResponseStatusException(HttpStatus.CONFLICT,"진행 중인 상담이 있습니다.");
  item.setNormalizedPhone(phone);item.setStatus("접수");Inquiry saved=repository.save(item);
  return "ITA-"+LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE)+"-"+String.format("%06d",saved.getId());
 }
}