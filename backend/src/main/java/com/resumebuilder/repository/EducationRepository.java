package com.resumebuilder.repository;

import com.resumebuilder.model.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByResumeId(Long resumeId);
    void deleteByResumeId(Long resumeId);
}
