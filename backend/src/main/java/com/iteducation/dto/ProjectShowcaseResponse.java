package com.iteducation.dto;

import java.util.List;

/**
 * 공개 프로젝트 소개 화면에 제공하는 교육 설계 사례 DTO입니다.
 * 실제 수강생 실적이나 취업 성과와 혼동되지 않도록 응답에서 사례 성격을 명시합니다.
 */
public record ProjectShowcaseResponse(
        Long id,
        String title,
        String category,
        String duration,
        String teamSize,
        String description,
        String problem,
        String solution,
        List<String> features,
        List<String> stack,
        String result,
        List<String> deliverables,
        List<String> evaluationPoints,
        String disclosure
) {
}
