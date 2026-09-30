package com.example.dashboard.web;

import com.example.dashboard.dto.PipelineStepDetail;
import com.example.dashboard.service.PipelineStepService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Backs the click-to-detail behavior on /orders/pipeline - clicking a step
 * fetches its detail from here rather than reading it out of static HTML.
 */
@RestController
@RequestMapping("/api/pipeline")
@RequiredArgsConstructor
public class PipelineApiController {

    private final PipelineStepService pipelineStepService;

    @GetMapping("/steps/{id}")
    public PipelineStepDetail step(@PathVariable String id) {
        return pipelineStepService.find(id);
    }
}
