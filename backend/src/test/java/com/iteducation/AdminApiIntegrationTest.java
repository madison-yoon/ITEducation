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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

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

    @Test
    void superAdminCanCreateCourseWithCsrfProtection() throws Exception {
        MockHttpSession session = login(SUPER_LOGIN);
        String token = csrfToken(session);

        mvc.perform(post("/api/admin/courses")
                        .session(session)
                        .header("X-CSRF-TOKEN", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"관리자 등록 과정\",\"category\":\"AI\",\"recruitmentStatus\":\"모집 중\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    void superAdminCanPublishNoticeAndPublicApiCanReadIt() throws Exception {
        MockHttpSession session = login(SUPER_LOGIN);
        String token = csrfToken(session);

        mvc.perform(post("/api/admin/notices")
                        .session(session)
                        .header("X-CSRF-TOKEN", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"통합 테스트 공지\",\"content\":\"공지 내용\",\"status\":\"게시 중\",\"category\":\"모집 안내\",\"pinned\":true}"))
                .andExpect(status().isCreated());

        mvc.perform(get("/api/notices"))
                .andExpect(status().isOk());
    }


    @Test
    void publicProjectApiReturnsStructuredReviewReadyExamples() throws Exception {
        mvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(6))
                .andExpect(jsonPath("$[0].problem").isNotEmpty())
                .andExpect(jsonPath("$[0].evaluationPoints").isArray())
                .andExpect(jsonPath("$[0].disclosure").value("교육 설계 예시"));
    }

    @Test
    void inquiryValidationReturnsFieldLevelErrorDetails() throws Exception {
        MvcResult tokenResult = mvc.perform(get("/api/csrf"))
                .andExpect(status().isOk())
                .andReturn();
        MockHttpSession session = (MockHttpSession) tokenResult.getRequest().getSession(false);
        String token = csrfToken(session);

        mvc.perform(post("/api/inquiries")
                        .session(session)
                        .header("X-CSRF-TOKEN", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"\",\"phone\":\"123\",\"email\":\"invalid\",\"courseTitle\":\"\",\"message\":\"짧음\",\"privacyConsent\":true}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").isNotEmpty())
                .andExpect(jsonPath("$.fieldErrors").isMap());
    }


    @Test
    void publicInquiryRequiresPrivacyConsent() throws Exception {
        MvcResult tokenResult = mvc.perform(get("/api/csrf"))
                .andExpect(status().isOk())
                .andReturn();
        MockHttpSession session = (MockHttpSession) tokenResult.getRequest().getSession(false);
        String token = csrfToken(session);

        mvc.perform(post("/api/inquiries")
                        .session(session)
                        .header("X-CSRF-TOKEN", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"테스트 사용자\",\"phone\":\"010-1234-5678\",\"courseTitle\":\"AI 교육과정\",\"message\":\"교육과정과 프로젝트 운영 방식이 궁금합니다.\",\"privacyConsent\":false,\"marketingConsent\":false}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("개인정보 수집 및 이용 동의가 필요합니다."));
    }

    @Test
    void duplicateActiveInquiryIsRejected() throws Exception {
        MvcResult tokenResult = mvc.perform(get("/api/csrf"))
                .andExpect(status().isOk())
                .andReturn();
        MockHttpSession session = (MockHttpSession) tokenResult.getRequest().getSession(false);
        String token = csrfToken(session);
        String requestBody = "{\"name\":\"테스트 사용자\",\"phone\":\"010-1234-5678\",\"courseTitle\":\"AI 교육과정\",\"message\":\"교육과정과 프로젝트 운영 방식이 궁금합니다.\",\"privacyConsent\":true,\"marketingConsent\":false}";

        mvc.perform(post("/api/inquiries")
                        .session(session)
                        .header("X-CSRF-TOKEN", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.receiptNo").isNotEmpty());

        mvc.perform(post("/api/inquiries")
                        .session(session)
                        .header("X-CSRF-TOKEN", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("진행 중인 상담이 있습니다. 기존 접수 건의 안내를 확인해 주세요."));
    }


    @Test
    void publicCourseApiHidesUnverifiedRecruitmentAndEligibilityData() throws Exception {
        mvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].recruitmentStatus").value("모집 정보 확인"))
                .andExpect(jsonPath("$[0].duration").value("운영 정보 확인"))
                .andExpect(jsonPath("$[0].target").value("지원 대상은 운영기관 확인 필요"))
                .andExpect(jsonPath("$[0].infoDisclosure").value("교육과정 구성 예시"));
    }

    @Test
    void verifiedCourseInformationCanBePublishedByAdministrator() throws Exception {
        MockHttpSession session = login(SUPER_LOGIN);
        String token = csrfToken(session);

        mvc.perform(post("/api/admin/courses")
                        .session(session)
                        .header("X-CSRF-TOKEN", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"검증된 AI 과정\",\"category\":\"AI\",\"summary\":\"검증 테스트 과정\",\"target\":\"지원 대상 확인 완료\",\"duration\":\"5개월\",\"recruitmentStatus\":\"모집 중\",\"operatingInfoVerified\":true}"))
                .andExpect(status().isCreated());

        mvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("검증된 AI 과정"))
                .andExpect(jsonPath("$[0].recruitmentStatus").value("모집 중"))
                .andExpect(jsonPath("$[0].duration").value("5개월"))
                .andExpect(jsonPath("$[0].target").value("지원 대상 확인 완료"))
                .andExpect(jsonPath("$[0].infoDisclosure").value("운영 정보 확인 완료"));
    }


    @Test
    void courseCannotBeMarkedVerifiedWithoutRequiredOperationDetails() throws Exception {
        MockHttpSession session = login(SUPER_LOGIN);
        String token = csrfToken(session);

        mvc.perform(post("/api/admin/courses")
                        .session(session)
                        .header("X-CSRF-TOKEN", token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"확인되지 않은 과정\",\"recruitmentStatus\":\"모집 정보 확인\",\"operatingInfoVerified\":true}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("운영정보 확인 완료로 공개하려면 모집 상태, 교육 기간, 지원 대상을 입력해 주세요."));
    }

    private String csrfToken(MockHttpSession session) throws Exception {
        MvcResult result = mvc.perform(get("/api/csrf").session(session))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
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
