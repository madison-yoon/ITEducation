package com.iteducation.config;

import com.iteducation.entity.Course;
import com.iteducation.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// DB가 비어 있을 때만 프로젝트용 교육과정 기본 데이터를 등록합니다.
@Component
public class CourseDataInitializer implements CommandLineRunner {
    private final CourseRepository courseRepository;

    public CourseDataInitializer(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public void run(String... args) {
        if (courseRepository.count() > 0) {
            return;
        }

        addCourse("AI·머신러닝 실무 개발자 과정", "AI", "Python과 머신러닝으로 데이터를 분석하고 예측 모델을 구현합니다.", "기초부터 머신러닝과 딥러닝까지 학습하고 영화 추천 프로젝트를 완성합니다.", "비전공자 및 전공자 모두 수강 가능", "6개월", "모집 중", "Python 기초 → 데이터 처리 → 머신러닝 → 딥러닝 → 영화 추천 프로젝트", "Python · NumPy · Pandas · Scikit-learn · PyTorch", true);
        addCourse("빅데이터 분석 전문가 과정", "DATA", "대규모 데이터를 분석하고 의미 있는 인사이트를 시각화합니다.", "데이터 수집, 전처리, 통계 분석과 시각화를 단계적으로 학습합니다.", "데이터 분석과 시각화에 관심 있는 사람", "5개월", "모집 예정", "Python·SQL → 전처리 → 통계 분석 → 시각화 → 분석 대시보드", "Python · SQL · Pandas · Spark", false);
        addCourse("생성형 AI 서비스 개발 과정", "GEN AI", "LLM과 RAG를 활용해 실제 문제를 해결하는 AI 서비스를 만듭니다.", "생성형 AI 원리와 API 활용법을 익히고 문서 질의응답 서비스를 구현합니다.", "생성형 AI를 실제 서비스에 적용하고 싶은 사람", "4개월", "모집 중", "API → LLM → 프롬프트 → 임베딩·RAG → 문서 질의응답", "Python · LLM API · Embedding · RAG", false);
        addCourse("AI 기반 웹 서비스 개발 과정", "WEB", "웹 기술과 AI를 연결해 사용 가능한 서비스를 구현합니다.", "웹 개발 기초부터 AI 기능을 연동한 통합 웹 플랫폼까지 제작합니다.", "웹 개발과 AI 연동을 함께 학습하고 싶은 사람", "6개월", "모집 마감", "Java → Spring Boot → React → MySQL → AI API 연동", "Java · Spring Boot · React · MySQL", false);
    }

    private void addCourse(String title, String category, String summary, String description,
                           String target, String duration, String status, String curriculum,
                           String skills, boolean featured) {
        Course course = new Course();
        course.setTitle(title);
        course.setCategory(category);
        course.setSummary(summary);
        course.setDescription(description);
        course.setTarget(target);
        course.setDuration(duration);
        course.setRecruitmentStatus(status);
        course.setCurriculum(curriculum);
        course.setSkills(skills);
        course.setFeatured(featured);
        courseRepository.save(course);
    }
}
