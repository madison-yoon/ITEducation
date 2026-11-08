package com.iteducation.entity;
import jakarta.persistence.*;
import lombok.Getter; import lombok.NoArgsConstructor; import lombok.Setter;
import java.time.LocalDateTime;
@Entity @Getter @Setter @NoArgsConstructor
public class Course {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,length=120) private String title;
    private String category;
    @Column(length=500) private String summary;
    @Column(columnDefinition="TEXT") private String description;
    private String target;
    private String duration;
    private String recruitmentStatus;
    private String imageUrl;
    @Column(columnDefinition="TEXT") private String curriculum;
    @Column(columnDefinition="TEXT") private String skills;
    private boolean featured;
    @Column(nullable=false, columnDefinition="boolean default false")
    private boolean operatingInfoVerified;
    private LocalDateTime createdAt=LocalDateTime.now();
}