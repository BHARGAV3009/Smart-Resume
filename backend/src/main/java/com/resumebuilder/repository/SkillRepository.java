package com.resumebuilder.repository;

import com.resumebuilder.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByResumeId(Long resumeId);
    void deleteByResumeId(Long resumeId);
}
