package com.service.java_service.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.service.java_service.model.AnalisisRequest;
import com.service.java_service.model.Job;
import com.service.java_service.services.JobService;

@RestController
@RequestMapping("/analyze")
public class AnalisisController {

    private final JobService jobService;

    public AnalisisController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<Job> analizar(@RequestBody AnalisisRequest request) {
        Job job = jobService.analizarTexto(request.getJobId());

        if (job == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(job);
    }

}