package com.iteducation.security;
import com.iteducation.entity.Admin;
import com.iteducation.repository.AdminRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
@Service
public class AdminDetailsService implements UserDetailsService {
 private final AdminRepository repository;
 public AdminDetailsService(AdminRepository repository){this.repository=repository;}
 @Override public UserDetails loadUserByUsername(String loginId)throws UsernameNotFoundException{
  Admin a=repository.findByLoginId(loginId).orElseThrow(()->new UsernameNotFoundException("관리자 계정을 찾을 수 없습니다."));
  return User.withUsername(a.getLoginId()).password(a.getPassword()).roles(a.getRole()).build();
 }
}