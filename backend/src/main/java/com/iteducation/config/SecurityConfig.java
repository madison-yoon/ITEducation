package com.iteducation.config;
import com.iteducation.security.AdminDetailsService;
import org.springframework.context.annotation.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.*;
import java.util.List;
@Configuration
public class SecurityConfig {
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean SecurityFilterChain securityFilterChain(HttpSecurity http,AdminDetailsService users)throws Exception{
  http.cors(Customizer.withDefaults()).csrf(csrf->csrf.disable()).userDetailsService(users)
   .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
   .authorizeHttpRequests(a->a.requestMatchers("/api/admin/login").permitAll()
    .requestMatchers("/api/admin/accounts/**").hasRole("SUPER_ADMIN")
    .requestMatchers("/api/admin/**").hasAnyRole("SUPER_ADMIN","ADMIN")
    .requestMatchers("/api/**").permitAll().anyRequest().permitAll())
   .formLogin(f->f.loginProcessingUrl("/api/admin/login").usernameParameter("loginId").passwordParameter("password")
    .successHandler((req,res,auth)->{res.setContentType("application/json;charset=UTF-8");res.getWriter().write("{\\"success\\":true}");})
    .failureHandler((req,res,e)->{res.setStatus(401);res.setContentType("application/json;charset=UTF-8");res.getWriter().write("{\\"message\\":\\"아이디 또는 비밀번호를 확인해 주세요.\\"}");}))
   .logout(l->l.logoutUrl("/api/admin/logout").logoutSuccessHandler((req,res,auth)->{res.setContentType("application/json;charset=UTF-8");res.getWriter().write("{\\"success\\":true}");}));
  return http.build();
 }
 @Bean CorsConfigurationSource corsConfigurationSource(){
  CorsConfiguration c=new CorsConfiguration();c.setAllowedOrigins(List.of("http://localhost:5173"));c.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));c.setAllowedHeaders(List.of("*"));c.setAllowCredentials(true);
  UrlBasedCorsConfigurationSource s=new UrlBasedCorsConfigurationSource();s.registerCorsConfiguration("/**",c);return s;
 }
}