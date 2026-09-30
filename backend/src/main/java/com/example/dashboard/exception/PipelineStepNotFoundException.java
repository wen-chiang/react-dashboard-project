package com.example.dashboard.exception;

public class PipelineStepNotFoundException extends RuntimeException {

    public PipelineStepNotFoundException(String id) {
        super("No pipeline step found with id: " + id);
    }
}
