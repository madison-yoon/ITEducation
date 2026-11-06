package com.iteducation.controller;

import com.iteducation.entity.Admin;
import com.iteducation.repository.AdminRepository;
import com.iteducation.repository.CourseRepository;
import com.iteducation.repository.InquiryRepository;
import com.iteducation.repository.NoticeRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminRepository admins;
    private final CourseRepository courses;
    private final InquiryRepository inquiries;
    private final NoticeRepository notices;
    private final PasswordEncoder passwordEncoder;

    public AdminController(AdminRepository admins, CourseRepository courses,
                           InquiryRepository inquiries, NoticeRepository notices,
                           PasswordEncoder passwordEncoder) {
        this.admins = admins;
        this.courses = courses;
        this.inquiries = inquiries;
        this.notices = notices;
        this.passwordEncoder = passwordEncoder;
    }

    public record AccountRequest(@NotBlank String loginId, @NotBlank String password,
                                 @NotBlank String name, @NotBlank String role) {}
    public record RoleRequest(@NotBlank String role) {}

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        Admin admin = findAdmin(authentication.getName());
        return Map.of("id", admin.getId(), "loginId", admin.getLoginId(),
                "name", admin.getName(), "role", admin.getRole());
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return Map.of(
                "courseCount", courses.count(),
                "openCourseCount", courses.countByRecruitmentStatus("모집 중"),
                "inquiryCount", inquiries.count(),
                "newInquiryCount", inquiries.countByStatus("접수"),
                "inProgressInquiryCount", inquiries.countByStatus("상담 진행"),
                "completedInquiryCount", inquiries.countByStatus("상담 완료"),
                "publishedNoticeCount", notices.countByStatus("게시 중"),
                "recentInquiries", inquiries.findTop10ByOrderByCreatedAtDesc()
        );
    }

    @GetMapping("/accounts")
    public List<Map<String, Object>> accounts() {
        return admins.findAll().stream().map(admin -> Map.<String, Object>of(
                "id", admin.getId(), "loginId", admin.getLoginId(),
                "name", admin.getName(), "role", admin.getRole()
        )).toList();
    }

    @PostMapping("/accounts")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createAccount(@Valid @RequestBody AccountRequest request) {
        if (admins.findByLoginId(request.loginId().trim()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 아이디입니다.");
        }
        if (!List.of("ADMIN", "SUPER_ADMIN").contains(request.role())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "올바르지 않은 권한입니다.");
        }
        Admin admin = new Admin();
        admin.setLoginId(request.loginId().trim());
        admin.setPassword(passwordEncoder.encode(request.password()));
        admin.setName(request.name().trim());
        admin.setRole(request.role());
        Admin saved = admins.save(admin);
        return Map.of("id", saved.getId(), "loginId", saved.getLoginId(),
                "name", saved.getName(), "role", saved.getRole());
    }

    @PatchMapping("/accounts/{id}/role")
    public Map<String, Object> changeRole(@PathVariable Long id, @Valid @RequestBody RoleRequest request) {
        if (!List.of("ADMIN", "SUPER_ADMIN").contains(request.role())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "올바르지 않은 권한입니다.");
        }
        Admin target = admins.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if ("SUPER_ADMIN".equals(target.getRole()) && "ADMIN".equals(request.role())
                && admins.countByRole("SUPER_ADMIN") <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "마지막 최고 관리자의 권한은 변경할 수 없습니다.");
        }
        target.setRole(request.role());
        admins.save(target);
        return Map.of("success", true);
    }

    @DeleteMapping("/accounts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(@PathVariable Long id, Authentication authentication) {
        Admin target = admins.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (target.getLoginId().equals(authentication.getName())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "현재 로그인한 계정은 삭제할 수 없습니다.");
        }
        if ("SUPER_ADMIN".equals(target.getRole()) && admins.countByRole("SUPER_ADMIN") <= 1) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "마지막 최고 관리자는 삭제할 수 없습니다.");
        }
        admins.delete(target);
    }

    private Admin findAdmin(String loginId) {
        return admins.findByLoginId(loginId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
}
