package com.example.dashboard.web;

import com.example.dashboard.dto.SearchResult;
import com.example.dashboard.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * JSON mirror of /search so CLI/non-browser clients can query the same
 * orders+customers search without going through the Thymeleaf view.
 */
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchApiController {

    private final SearchService searchService;

    @GetMapping
    public SearchResult search(@RequestParam(required = false) String q) {
        return searchService.search(q);
    }
}
