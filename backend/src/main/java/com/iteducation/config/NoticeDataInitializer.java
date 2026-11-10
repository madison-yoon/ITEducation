package com.iteducation.config;

import com.iteducation.entity.Notice;
import com.iteducation.repository.NoticeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

// 공지 테이블이 비어 있는 신규 환경에만 사이트 시연용 공지 예시를 등록합니다.
@Component
public class NoticeDataInitializer implements CommandLineRunner {
    private final NoticeRepository notices;

    public NoticeDataInitializer(NoticeRepository notices) {
        this.notices = notices;
    }

    @Override
    public void run(String... args) {
        if (notices.count() > 0) return;

        LocalDateTime now = LocalDateTime.now();
        List<Notice> samples = List.of(
            notice("IT ACADEMY 홈페이지 이용 안내", "공지", true, now.minusHours(1),
                "IT ACADEMY 홈페이지를 방문해 주셔서 감사합니다.\n\n이 사이트에서는 교육과정의 학습 목표와 커리큘럼, 프로젝트 사례, 공지사항 및 상담 신청 정보를 확인할 수 있습니다.\n\n• 교육과정: 분야별 학습 주제와 단계별 실습 내용을 확인할 수 있습니다.\n• 프로젝트: 교육 과정에서 다룰 수 있는 결과물 설계 예시를 살펴볼 수 있습니다.\n• 상담 신청: 관심 분야와 학습 목표를 남기면 담당자가 확인할 수 있도록 접수합니다.\n\n교육 일정과 모집 조건은 별도 공지로 확정된 경우에만 안내합니다."),
            notice("교육과정 선택 전 확인하면 좋은 사항", "교육과정", false, now.minusDays(2),
                "교육과정을 선택할 때는 기술 이름뿐 아니라 학습 순서와 최종 결과물을 함께 확인하는 것이 좋습니다.\n\n• 학습 목표: 과정 종료 시 설명하고 구현할 수 있어야 하는 내용을 확인합니다.\n• 사전 지식: Python, SQL, JavaScript 등 시작 전에 필요한 기초 수준을 살펴봅니다.\n• 실습 비중: 개념 학습과 직접 코드를 작성하는 실습의 연결 방식을 확인합니다.\n• 프로젝트: 학습한 기술을 어떤 문제와 결과물에 적용하는지 확인합니다.\n\n개인의 경험과 학습 가능 시간에 따라 적합한 과정은 달라질 수 있으므로 상담 시 현재 수준과 목표를 함께 전달해 주세요."),
            notice("상담 신청 및 진행 절차 안내", "운영 안내", false, now.minusDays(4),
                "상담 신청은 관심 교육과정과 현재 학습 경험, 문의 내용을 바탕으로 진행됩니다.\n\n1. 상담 신청 화면에서 연락 가능한 정보와 희망 과정을 입력합니다.\n2. 확인하고 싶은 내용과 학습 목표를 구체적으로 작성합니다.\n3. 신청이 접수되면 접수 번호를 확인할 수 있습니다.\n4. 담당자는 접수 내용을 확인한 뒤 안내를 진행합니다.\n\n상담 가능 일정과 회신 방법은 운영기관의 실제 운영 조건에 따라 안내됩니다."),
            notice("AI·머신러닝 학습을 시작하기 전 준비 가이드", "교육 소식", false, now.minusDays(6),
                "AI·머신러닝 분야를 처음 학습한다면 Python 기초와 데이터 다루기부터 차근차근 익히는 것을 권장합니다.\n\n• Python: 변수, 조건문, 반복문, 함수와 자료구조\n• 데이터: CSV 파일 읽기, 표 형태 데이터 정리, 결측값 확인\n• 기초 수학·통계: 평균, 분산, 확률과 데이터 분포\n• 실습 환경: 코드 실행, 패키지 설치, 노트북 사용 방법\n\n모든 내용을 사전에 완벽하게 익혀야 하는 것은 아닙니다. 현재 가능한 수준을 기준으로 학습 순서를 상담에서 조정할 수 있습니다."),
            notice("프로젝트 포트폴리오 구성 방법", "교육 소식", false, now.minusDays(8),
                "프로젝트 포트폴리오는 화면 캡처만 나열하기보다 문제 정의부터 구현과 검증까지의 과정을 설명할 수 있어야 합니다.\n\n• 문제와 사용자: 어떤 불편을 해결하려 했는지 작성합니다.\n• 핵심 기능: 사용자가 수행할 수 있는 작업을 기능 단위로 정리합니다.\n• 기술 선택: 사용한 기술과 선택 이유를 설명합니다.\n• 검증 결과: 테스트 방법과 확인한 결과, 남은 한계를 기록합니다.\n• 기여 내용: 팀 프로젝트라면 본인이 맡은 역할과 구현 범위를 구분합니다.\n\nREADME, 실행 방법, 화면 이미지와 주요 설계 내용을 함께 정리하면 결과물을 검토하기 쉽습니다."),
            notice("온라인 학습 환경 및 실습 준비 안내", "운영 안내", false, now.minusDays(10),
                "실습 중심 학습을 준비할 때는 사용하는 PC와 개발 도구를 미리 점검하면 수업 중 환경 설정에 쓰는 시간을 줄일 수 있습니다.\n\n• 운영체제 업데이트와 저장 공간 확인\n• Chrome 등 최신 웹 브라우저 설치\n• Git과 코드 편집기 설치 및 기본 실행 확인\n• Python, Java 등 과정별 개발 환경 확인\n• 실습 파일을 저장할 폴더와 백업 위치 준비\n\n과정별 필수 프로그램과 버전은 실제 교육 운영 안내에 맞춰 별도로 확인해야 합니다."),
            notice("공지사항 검색 및 문의 기능 안내", "공지", false, now.minusDays(14),
                "공지사항 화면에서는 분류 필터와 검색 기능을 이용해 필요한 안내를 찾을 수 있습니다.\n\n• 분류 필터로 공지, 모집 안내, 교육과정, 교육 소식과 운영 안내를 구분합니다.\n• 검색창에서 제목과 본문에 포함된 단어를 검색할 수 있습니다.\n• 중요 공지는 목록 상단에 고정해 표시합니다.\n• 각 게시물을 선택하면 상세 내용과 목록 복귀 기능을 이용할 수 있습니다.\n\n사이트 이용 중 확인이 필요한 내용은 상담 신청 화면의 문의 내용에 남겨 주세요.")
        );

        notices.saveAll(samples);
    }

    private Notice notice(String title, String category, boolean pinned, LocalDateTime createdAt, String content) {
        Notice item = new Notice();
        item.setTitle(title);
        item.setCategory(category);
        item.setPinned(pinned);
        item.setStatus("게시 중");
        item.setCreatedAt(createdAt);
        item.setUpdatedAt(createdAt);
        item.setContent(content);
        return item;
    }
}
