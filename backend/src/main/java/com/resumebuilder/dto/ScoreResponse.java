package com.resumebuilder.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ScoreResponse {
    private Long id;
    private Long resumeId;
    private Double atsScore;
    private Double keywordScore;
    private Double formattingScore;
    private List<String> suggestions;
    private LocalDateTime analyzedAt;

    public ScoreResponse() {}

    public ScoreResponse(Long id, Long resumeId, Double atsScore, Double keywordScore,
                         Double formattingScore, List<String> suggestions, LocalDateTime analyzedAt) {
        this.id = id; this.resumeId = resumeId; this.atsScore = atsScore;
        this.keywordScore = keywordScore; this.formattingScore = formattingScore;
        this.suggestions = suggestions; this.analyzedAt = analyzedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }
    public Double getAtsScore() { return atsScore; }
    public void setAtsScore(Double atsScore) { this.atsScore = atsScore; }
    public Double getKeywordScore() { return keywordScore; }
    public void setKeywordScore(Double keywordScore) { this.keywordScore = keywordScore; }
    public Double getFormattingScore() { return formattingScore; }
    public void setFormattingScore(Double formattingScore) { this.formattingScore = formattingScore; }
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
    public LocalDateTime getAnalyzedAt() { return analyzedAt; }
    public void setAnalyzedAt(LocalDateTime analyzedAt) { this.analyzedAt = analyzedAt; }
}
