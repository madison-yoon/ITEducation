package com.iteducation.controller;

import com.iteducation.entity.Notice;
import com.iteducation.repository.NoticeRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/notices")
public class AdminNoticeController {
    private static final List<String> CATEGORIES =
            List.of("공지", "모집 안내", "교육과정", "교육 소식", "운영 안내");

    private final NoticeRepository notices;

    public AdminNoticeController(NoticeRepository notices) {
        this.notices = notices;
    }

    public record NoticeRequest(
            @NotBlank @Size(max = 180) String title,
            @NotBlank @Size(max = 20000) String content,
            @NotBlank @Size(max = 30) String status,
            @Size(max = 30) String category,
            boolean pinned
    ) {}

    @GetMapping
    public List<Notice> list() {
        return notices.findAllByOrderByPinnedDescCreatedAtDesc();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Notice create(@Valid @RequestBody NoticeRequest request) {
        Notice notice = new Notice();
        apply(notice, request);
        notice.setCreatedAt(LocalDateTime.now());
        notice.setUpdatedAt(LocalDateTime.now());
        return notices.save(notice);
    }

    @PutMapping("/{id}")
    public Notice update(@PathVariable Long id, @Valid @RequestBody NoticeRequest request) {
        Notice notice = notices.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        apply(notice, request);
        notice.setUpdatedAt(LocalDateTime.now());
        return notices.save(notice);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        if (!notices.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        notices.deleteById(id);
    }

    private void apply(Notice notice, NoticeRequest request) {
        if (!List.of("게시 중", "비공개").contains(request.status())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "게시 상태를 확인해 주세요.");
        }

        String category = request.category() == null || request.category().isBlank()
                ? "공지" : request.category().trim();
        if (!CATEGORIES.contains(category)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "공지 분류를 확인해 주세요.");
        }

        notice.setTitle(request.title().trim());
        notice.setContent(request.content().trim());
        notice.setCategory(category);
        notice.setPinned(request.pinned());
        notice.setStatus(request.status());
    }
}
