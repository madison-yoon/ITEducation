package com.iteducation.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 공개 API와 관리자 API가 일관된 오류 응답을 반환하도록 정리합니다.
 * 클라이언트에는 해결 가능한 메시지만 전달하고 내부 예외 정보는 노출하지 않습니다.
 */
@RestControllerAdvice
public class ApiExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);

    public record ApiError(
            Instant timestamp,
            int status,
            String error,
            String message,
            Map<String, String> fieldErrors
    ) {
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            fieldErrors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }

        String message = fieldErrors.values().stream().findFirst()
                .orElse("입력한 정보를 확인해 주세요.");
        return response(HttpStatus.BAD_REQUEST, message, fieldErrors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadableBody(HttpMessageNotReadableException exception) {
        return response(HttpStatus.BAD_REQUEST, "요청 본문 형식이나 날짜 값을 확인해 주세요.", Map.of());
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleTypeMismatch(MethodArgumentTypeMismatchException exception) {
        return response(HttpStatus.BAD_REQUEST, "요청 매개변수 형식을 확인해 주세요.", Map.of());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleStatus(ResponseStatusException exception) {
        HttpStatus status = HttpStatus.valueOf(exception.getStatusCode().value());
        String message = exception.getReason() == null || exception.getReason().isBlank()
                ? defaultMessage(status) : exception.getReason();
        return response(status, message, Map.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleUnexpected(Exception exception) {
        log.error("처리되지 않은 API 예외가 발생했습니다.", exception);
        return response(HttpStatus.INTERNAL_SERVER_ERROR,
                "요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", Map.of());
    }

    private ResponseEntity<ApiError> response(
            HttpStatus status,
            String message,
            Map<String, String> fieldErrors
    ) {
        ApiError body = new ApiError(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                fieldErrors
        );
        return ResponseEntity.status(status).body(body);
    }

    private String defaultMessage(HttpStatus status) {
        if (status == HttpStatus.NOT_FOUND) return "요청한 정보를 찾을 수 없습니다.";
        if (status == HttpStatus.FORBIDDEN) return "접근 권한이 없습니다.";
        if (status == HttpStatus.UNAUTHORIZED) return "로그인이 필요합니다.";
        return "요청을 처리할 수 없습니다.";
    }
}
