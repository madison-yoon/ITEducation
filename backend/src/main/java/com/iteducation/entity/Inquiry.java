package com.iteducation.entity;
import jakarta.persistence.*;
import lombok.Getter; import lombok.NoArgsConstructor; import lombok.Setter;
import java.time.LocalDate; import java.time.LocalDateTime;
@Entity @Getter @Setter @NoArgsConstructor
public class Inquiry {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false) private String name;
    @Column(nullable=false) private String phone;
    @Column(nullable=false,length=30) private String normalizedPhone;
    private String email;
    private Long courseId;
    private String courseTitle;
    private LocalDate preferredDate;
    private String preferredPeriod;
    @Column(nullable=false,columnDefinition="TEXT") private String message;
    private boolean privacyConsent;
    private boolean marketingConsent;
    @Column(nullable=false) private String status="접수";
    @Column(columnDefinition="TEXT") private String adminMemo;
    private LocalDateTime createdAt=LocalDateTime.now();
}