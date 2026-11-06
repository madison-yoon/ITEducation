package com.iteducation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iteducation.entity.Admin;
import com.iteducation.repository.AdminRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminApiIntegrationTest {
    private static final String PASSWORD = "LocalTestPassword2026!";
    private static final String SUPER_LOGIN = "root-admin";
    private static final String NORMAL_LOGIN = "content-admin";

    @Autowired
    private MockMvc mvc;

    @Autowired
    private AdminRepository admins;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void prepareAdmins() {
        admins.deleteAll();
        saveAdmin(SUPER_LOGIN, "SUPER_ADMIN");
        saveAdmin(NORMAL_LOGIN, "ADMIN");
    }

    @Test
    void publicCourseApiIsAvailableWithoutLogin() throws Exception {
        mvc.perform(get("/api/courses"))
                .andExpect(status().isOk());
    }

    @Test
    void adminApiRequiresAuthentication() throws Exception {
        mvc.perform(get("/api/admin/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void normalAdminCanUseOperationsButCannotManageAccounts() throws Exception {
        MockHttpSession session = login(NORMAL_LOGIN);

        mvc.perform(get("/api/admin/dashboard").session(session))
                .andExpect(status().isOk());

        mvc.perform(get("/api/admin/accounts").session(session))
                .andExpect(status().isForbidden());
    }

    @Test
    void superAdminCanManageAdministratorAccountList() throws Exception {
        MockHttpSession session = login(SUPER_LOGIN);

        mvc.perform(get("/api/admin/accounts").session(session))
                .andExpect(status().isOk());
    }

    @Test
    void stateChangingAdminRequestRequiresCsrfToken() throws Exception {
        MockHttpSession session = login(SUPER_LOGIN);

        mvc.perform(post("/api/admin/courses")
                        .session(session)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"테스트 과정\",\"recruitmentStatus\":\"모집 중\"}"))
                .andExpect(status().isForbidden());
    }

    private void saveAdmin(String loginId, String role) {
        Admin admin = new Admin();
        admin.setLoginId(loginId);
        admin.setPassword(passwordEncoder.encode(PASSWORD));
        admin.setName(loginId);
        admin.setRole(role);
        admins.save(admin);
    }

    private MockHttpSession login(String loginId) throws Exception {
        MvcResult tokenResult = mvc.perform(get("/api/csrf"))
                .andExpect(status().isOk())
                .andReturn();

        MockHttpSession session = (MockHttpSession) tokenResult.getRequest().getSession(false);
        JsonNode tokenJson = objectMapper.readTree(tokenResult.getResponse().getContentAsString());
        String token = tokenJson.get("token").asText();

        MvcResult loginResult = mvc.perform(post("/api/admin/login")
                        .session(session)
                        .header("X-CSRF-TOKEN", token)
                        .param("loginId", loginId)
                        .param("password", PASSWORD))
                .andExpect(status().isOk())
                .andReturn();

        return (MockHttpSession) loginResult.getRequest().getSession(false);
    }
}
