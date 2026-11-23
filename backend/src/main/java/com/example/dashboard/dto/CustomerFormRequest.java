package com.example.dashboard.dto;

import lombok.Data;

/**
 * Backs the add-customer modal form (and doubles as the JSON body for the
 * matching /api/customers REST endpoint). Plain mutable bean so Spring MVC
 * can populate it via {@code @ModelAttribute} or {@code @RequestBody}.
 */
@Data
public class CustomerFormRequest {

    private String name;
    private String email;
    private String initials;
}
