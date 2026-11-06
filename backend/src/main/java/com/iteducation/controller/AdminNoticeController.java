package com.iteducation.controller;

import com.iteducation.entity.Notice;
import com.iteducation.repository.NoticeRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/notices")
public class AdminNoticeController {
    private final NoticeRepository notices;

    public AdminNoticeController(NoticeRepository notices) {
        this.notices = notices;
    }

    public record NoticeRequest(@NotBlank String title, @NotBlank String content,
                                @NotBlank String status) {}

    @GetMapping
    public List<Notice> list() {
        return notices.findAllByOrderByCreatedAtDesc();
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
        notice.setTitle(request.title().trim());
        notice.setContent(request.content());
        notice.setStatus(request.status());
    }
}
