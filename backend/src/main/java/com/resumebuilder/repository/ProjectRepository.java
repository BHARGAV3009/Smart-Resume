package com.resumebuilder.repository;

import com.resumebuilder.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByResumeId(Long resumeId);
    void deleteByResumeId(Long resumeId);
}
