package com.example.onlinelearning.repository;

import com.example.onlinelearning.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
}