package com.resumebuilder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "education")
public class Education {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id")
    @JsonIgnore
    private Resume resume;

    private String institution;
    private String degree;
    private String year;
    private String gpa;

    public Education() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }
    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    public String getGpa() { return gpa; }
    public void setGpa(String gpa) { this.gpa = gpa; }
}
