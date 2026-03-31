package com.resumebuilder.controller;

import com.resumebuilder.dto.ScoreResponse;
import com.resumebuilder.service.ScoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scores")
public class ScoreController {

    private final ScoreService scoreService;

    public ScoreController(ScoreService scoreService) {
        this.scoreService = scoreService;
    }

    @PostMapping("/analyze/{resumeId}")
    public ResponseEntity<ScoreResponse> analyze(@PathVariable Long resumeId) {
        return ResponseEntity.ok(scoreService.analyze(resumeId));
    }

    @GetMapping("/{resumeId}")
    public ResponseEntity<ScoreResponse> getScore(@PathVariable Long resumeId) {
        return ResponseEntity.ok(scoreService.getScore(resumeId));
    }
}
