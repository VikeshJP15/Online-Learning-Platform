package com.example.onlinelearning.controller;

import com.example.onlinelearning.model.Course;
import com.example.onlinelearning.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseService service;

    @GetMapping
    public List<Course> getCourses() {
        return service.getAllCourses();
    }

    @PostMapping
    public Course addCourse(@RequestBody Course course) {
        return service.addCourse(course);
    }
}