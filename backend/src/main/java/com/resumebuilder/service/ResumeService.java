package com.resumebuilder.service;

import com.resumebuilder.dto.ResumeRequest;
import com.resumebuilder.model.*;
import com.resumebuilder.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    public ResumeService(ResumeRepository resumeRepository, UserRepository userRepository) {
        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    public List<Resume> getResumesByUser(String email) {
        User user = getUser(email);
        return resumeRepository.findByUserId(user.getId());
    }

    public Resume getResumeById(Long id) {
        return resumeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resume not found"));
    }

    @Transactional
    public Resume saveOrUpdate(ResumeRequest req, String email, Long resumeId) {
        User user = getUser(email);
        Resume resume;
        if (resumeId != null) {
            resume = resumeRepository.findById(resumeId)
                    .orElseThrow(() -> new RuntimeException("Resume not found"));
            if (!resume.getUser().getId().equals(user.getId())) throw new RuntimeException("Access denied");
            resume.getEducations().clear();
            resume.getSkills().clear();
            resume.getProjects().clear();
            resume.getExperiences().clear();
            resume.getCertifications().clear();
        } else {
            resume = new Resume();
            resume.setUser(user);
        }
        mapFields(resume, req);
        return resumeRepository.save(resume);
    }

    @Transactional
    public void delete(Long id, String email) {
        Resume resume = getResumeById(id);
        User user = getUser(email);
        if (!resume.getUser().getId().equals(user.getId())) throw new RuntimeException("Access denied");
        resumeRepository.delete(resume);
    }

    private void mapFields(Resume resume, ResumeRequest req) {
        resume.setTitle(req.getTitle() != null ? req.getTitle() : "My Resume");
        resume.setTemplate(req.getTemplate() != null ? req.getTemplate() : "classic");
        resume.setFullName(req.getFullName()); resume.setEmail(req.getEmail());
        resume.setPhone(req.getPhone()); resume.setLocation(req.getLocation());
        resume.setSummary(req.getSummary()); resume.setLinkedIn(req.getLinkedIn()); resume.setGithub(req.getGithub());

        if (req.getEducations() != null) req.getEducations().forEach(e -> {
            Education edu = new Education();
            edu.setInstitution(e.getInstitution()); edu.setDegree(e.getDegree());
            edu.setYear(e.getYear()); edu.setGpa(e.getGpa()); edu.setResume(resume);
            resume.getEducations().add(edu);
        });
        if (req.getSkills() != null) req.getSkills().forEach(s -> {
            Skill skill = new Skill(); skill.setSkillName(s.getSkillName()); skill.setResume(resume);
            resume.getSkills().add(skill);
        });
        if (req.getProjects() != null) req.getProjects().forEach(p -> {
            Project proj = new Project();
            proj.setProjectName(p.getProjectName()); proj.setDescription(p.getDescription());
            proj.setTechStack(p.getTechStack()); proj.setLink(p.getLink()); proj.setResume(resume);
            resume.getProjects().add(proj);
        });
        if (req.getExperiences() != null) req.getExperiences().forEach(ex -> {
            Experience exp = new Experience();
            exp.setCompany(ex.getCompany()); exp.setRole(ex.getRole());
            exp.setDuration(ex.getDuration()); exp.setDescription(ex.getDescription()); exp.setResume(resume);
            resume.getExperiences().add(exp);
        });
        if (req.getCertifications() != null) req.getCertifications().forEach(c -> {
            Certification cert = new Certification();
            cert.setCertName(c.getCertName()); cert.setIssuer(c.getIssuer()); cert.setYear(c.getYear()); cert.setResume(resume);
            resume.getCertifications().add(cert);
        });
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
