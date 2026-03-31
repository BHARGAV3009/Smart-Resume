package com.resumebuilder.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_scores")
public class ResumeScore {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", unique = true)
    @JsonIgnore
    private Resume resume;

    private Double atsScore;
    private Double keywordScore;
    private Double formattingScore;

    @Column(columnDefinition = "TEXT")
    private String suggestions;

    private LocalDateTime analyzedAt;

    public ResumeScore() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Resume getResume() { return resume; }
    public void setResume(Resume resume) { this.resume = resume; }
    public Double getAtsScore() { return atsScore; }
    public void setAtsScore(Double atsScore) { this.atsScore = atsScore; }
    public Double getKeywordScore() { return keywordScore; }
    public void setKeywordScore(Double keywordScore) { this.keywordScore = keywordScore; }
    public Double getFormattingScore() { return formattingScore; }
    public void setFormattingScore(Double formattingScore) { this.formattingScore = formattingScore; }
    public String getSuggestions() { return suggestions; }
    public void setSuggestions(String suggestions) { this.suggestions = suggestions; }
    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
    public void setAnalyzedAt(LocalDateTime analyzedAt) { this.analyzedAt = analyzedAt; }
}
