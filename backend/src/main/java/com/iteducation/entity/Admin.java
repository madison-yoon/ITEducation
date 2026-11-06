package com.iteducation.entity;
import jakarta.persistence.*;
import lombok.Getter; import lombok.NoArgsConstructor; import lombok.Setter;
@Entity @Getter @Setter @NoArgsConstructor @Table(name="admins")
public class Admin {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,unique=true) private String loginId;
    @Column(nullable=false) private String password;
    @Column(nullable=false) private String name;
    @Column(nullable=false) private String role="ADMIN";
}