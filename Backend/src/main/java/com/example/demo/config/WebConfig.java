package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class WebConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
      .allowedOrigins("https://AaliyahMcCollum.github.io")
      .allowedMethods("GET","POST","PUT","DELETE","PATCH","OPTIONS")
      .allowedHeaders("*")
      .allowCredentials(true);
  }
}
