package com.iteducation.controller;

import com.iteducation.entity.Inquiry;
import com.iteducation.repository.InquiryRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/admin/inquiries")
public class AdminInquiryController {
    private final InquiryRepository inquiries;

    public AdminInquiryController(InquiryRepository inquiries) {
        this.inquiries = inquiries;
    }

    public record InquiryUpdate(@NotBlank String status, String adminMemo) {
    }

    @GetMapping
    public Page<Inquiry> list(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(50, Math.max(1, size));

        return inquiries.search(
                keyword.trim(),
                status.trim(),
                PageRequest.of(
                        safePage,
                        safeSize,
                        Sort.by(Sort.Direction.DESC, "createdAt")
                )
        );
    }

    @PatchMapping("/{id}")
    public Inquiry update(@PathVariable Long id, @Valid @RequestBody InquiryUpdate request) {
        if (!List.of("접수", "상담 진행", "상담 완료").contains(request.status())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "상담 상태를 확인해 주세요.");
        }

        Inquiry inquiry = inquiries.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        inquiry.setStatus(request.status());
        inquiry.setAdminMemo(request.adminMemo());
        return inquiries.save(inquiry);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!inquiries.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        inquiries.deleteById(id);
    }
}
