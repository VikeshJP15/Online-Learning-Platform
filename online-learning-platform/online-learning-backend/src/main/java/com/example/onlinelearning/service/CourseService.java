package com.example.onlinelearning.service;

import com.example.onlinelearning.model.Course;
import com.example.onlinelearning.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository repo;

    public List<Course> getAllCourses() {
        return repo.findAll();
    }

    public Course addCourse(Course course) {
        return repo.save(course);
    }
}