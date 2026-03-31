package com.resumebuilder.repository;

import com.resumebuilder.model.ResumeScore;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ResumeScoreRepository extends JpaRepository<ResumeScore, Long> {
    Optional<ResumeScore> findByResumeId(Long resumeId);
}
