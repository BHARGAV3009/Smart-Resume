package com.resumebuilder.service;

import com.resumebuilder.dto.ScoreResponse;
import com.resumebuilder.model.*;
import com.resumebuilder.repository.ResumeRepository;
import com.resumebuilder.repository.ResumeScoreRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScoreService {

    private final ResumeRepository resumeRepository;
    private final ResumeScoreRepository scoreRepository;

    public ScoreService(ResumeRepository resumeRepository, ResumeScoreRepository scoreRepository) {
        this.resumeRepository = resumeRepository;
        this.scoreRepository = scoreRepository;
    }

    private static final List<String> TECH_KEYWORDS = Arrays.asList(
        "java", "python", "javascript", "react", "spring", "sql", "mysql", "mongodb", "aws",
        "docker", "kubernetes", "git", "agile", "scrum", "rest", "api", "microservices",
        "html", "css", "node", "angular", "vue", "typescript", "linux", "devops",
        "machine learning", "deep learning", "tensorflow", "data analysis", "excel",
        "communication", "leadership", "teamwork", "problem solving", "project management",
        "hibernate", "maven", "gradle", "junit", "spring boot", "redis"
    );

    public ScoreResponse analyze(Long resumeId) {
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
        double keywordScore = computeKeywordScore(resume);
        double formattingScore = computeFormattingScore(resume);
        double atsScore = Math.round((keywordScore * 0.5 + formattingScore * 0.5) * 10.0) / 10.0;
        List<String> suggestions = generateSuggestions(resume);

        ResumeScore score = scoreRepository.findByResumeId(resumeId).orElse(new ResumeScore());
        score.setResume(resume);
        score.setAtsScore(atsScore);
        score.setKeywordScore(Math.round(keywordScore * 10.0) / 10.0);
        score.setFormattingScore(Math.round(formattingScore * 10.0) / 10.0);
        score.setSuggestions(String.join("|", suggestions));
        score.setAnalyzedAt(LocalDateTime.now());
        scoreRepository.save(score);

        return buildResponse(score, resumeId, suggestions);
    }

    public ScoreResponse getScore(Long resumeId) {
        ResumeScore score = scoreRepository.findByResumeId(resumeId)
                .orElseThrow(() -> new RuntimeException("No score found. Please analyze first."));
        List<String> suggestions = score.getSuggestions() != null
                ? Arrays.asList(score.getSuggestions().split("\\|")) : List.of();
        return buildResponse(score, resumeId, suggestions);
    }

    private double computeKeywordScore(Resume resume) {
        String text = extractText(resume).toLowerCase();
        long matched = TECH_KEYWORDS.stream().filter(text::contains).count();
        return Math.min((double) matched / TECH_KEYWORDS.size() * 100 * 2.0, 100.0);
    }

    private double computeFormattingScore(Resume resume) {
        double score = 0;
        if (notBlank(resume.getFullName())) score += 5;
        if (notBlank(resume.getEmail())) score += 5;
        if (notBlank(resume.getPhone())) score += 5;
        if (notBlank(resume.getSummary())) score += 5;
        if (notBlank(resume.getLinkedIn())) score += 5;
        if (!resume.getEducations().isEmpty()) score += 20;
        int expCount = resume.getExperiences().size();
        if (expCount >= 1) score += 15;
        if (expCount >= 2) score += 10;
        int skillCount = resume.getSkills().size();
        if (skillCount >= 5) score += 15; else score += skillCount * 3;
        if (!resume.getProjects().isEmpty()) score += 10;
        if (resume.getProjects().size() >= 2) score += 5;
        return Math.min(score, 100.0);
    }

    private String extractText(Resume resume) {
        StringBuilder sb = new StringBuilder();
        if (resume.getSummary() != null) sb.append(resume.getSummary()).append(" ");
        resume.getSkills().forEach(s -> sb.append(s.getSkillName()).append(" "));
        resume.getExperiences().forEach(e -> sb.append(e.getRole()).append(" ").append(nvl(e.getDescription())).append(" "));
        resume.getProjects().forEach(p -> sb.append(p.getProjectName()).append(" ").append(nvl(p.getDescription())).append(" ").append(nvl(p.getTechStack())).append(" "));
        return sb.toString();
    }

    private List<String> generateSuggestions(Resume resume) {
        List<String> s = new ArrayList<>();
        if (!notBlank(resume.getSummary())) s.add("Add a professional summary to introduce yourself");
        if (resume.getEducations().isEmpty()) s.add("Add your educational background");
        if (resume.getExperiences().isEmpty()) s.add("Add work experience or internships");
        if (resume.getSkills().size() < 5) s.add("Add more skills (at least 5 recommended for ATS)");
        if (resume.getProjects().isEmpty()) s.add("Add projects to showcase your work");
        if (!notBlank(resume.getLinkedIn())) s.add("Add your LinkedIn profile URL");
        if (!notBlank(resume.getPhone())) s.add("Add a contact phone number");
        String text = extractText(resume).toLowerCase();
        List<String> missing = TECH_KEYWORDS.stream().filter(k -> !text.contains(k)).limit(5).collect(Collectors.toList());
        if (!missing.isEmpty()) s.add("Consider adding relevant keywords: " + String.join(", ", missing));
        return s;
    }

    private ScoreResponse buildResponse(ResumeScore score, Long resumeId, List<String> suggestions) {
        return new ScoreResponse(score.getId(), resumeId, score.getAtsScore(),
                score.getKeywordScore(), score.getFormattingScore(), suggestions, score.getAnalyzedAt());
    }

    private boolean notBlank(String s) { return s != null && !s.isBlank(); }
    private String nvl(String s) { return s != null ? s : ""; }
}
