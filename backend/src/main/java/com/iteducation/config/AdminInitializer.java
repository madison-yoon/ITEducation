package com.iteducation.config;

import com.iteducation.entity.Admin;
import com.iteducation.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {
    private final AdminRepository admins;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_INITIAL_LOGIN_ID:}")
    private String loginId;

    @Value("${ADMIN_INITIAL_PASSWORD:}")
    private String password;

    @Value("${ADMIN_INITIAL_NAME:최고 관리자}")
    private String name;

    public AdminInitializer(AdminRepository admins, PasswordEncoder passwordEncoder) {
        this.admins = admins;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (admins.count() > 0 || loginId.isBlank() || password.isBlank()) {
            return;
        }

        if (password.length() < 12) {
            throw new IllegalStateException("최초 관리자 비밀번호는 12자 이상이어야 합니다.");
        }

        Admin admin = new Admin();
        admin.setLoginId(loginId.trim());
        admin.setPassword(passwordEncoder.encode(password));
        admin.setName(name.trim());
        admin.setRole("SUPER_ADMIN");
        admins.save(admin);
    }
}
