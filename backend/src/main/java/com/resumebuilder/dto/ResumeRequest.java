package com.resumebuilder.dto;

import java.util.List;

public class ResumeRequest {
    private String title;
    private String template;
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String summary;
    private String linkedIn;
    private String github;
    private List<EducationDTO> educations;
    private List<SkillDTO> skills;
    private List<ProjectDTO> projects;
    private List<ExperienceDTO> experiences;
    private List<CertificationDTO> certifications;

    public ResumeRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getTemplate() { return template; }
    public void setTemplate(String template) { this.template = template; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public String getLinkedIn() { return linkedIn; }
    public void setLinkedIn(String linkedIn) { this.linkedIn = linkedIn; }
    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }
    public List<EducationDTO> getEducations() { return educations; }
    public void setEducations(List<EducationDTO> educations) { this.educations = educations; }
    public List<SkillDTO> getSkills() { return skills; }
    public void setSkills(List<SkillDTO> skills) { this.skills = skills; }
    public List<ProjectDTO> getProjects() { return projects; }
    public void setProjects(List<ProjectDTO> projects) { this.projects = projects; }
    public List<ExperienceDTO> getExperiences() { return experiences; }
    public void setExperiences(List<ExperienceDTO> experiences) { this.experiences = experiences; }
    public List<CertificationDTO> getCertifications() { return certifications; }
    public void setCertifications(List<CertificationDTO> certifications) { this.certifications = certifications; }

    public static class EducationDTO {
        private Long id; private String institution; private String degree; private String year; private String gpa;
        public Long getId() { return id; } public void setId(Long id) { this.id = id; }
        public String getInstitution() { return institution; } public void setInstitution(String v) { institution = v; }
        public String getDegree() { return degree; } public void setDegree(String v) { degree = v; }
        public String getYear() { return year; } public void setYear(String v) { year = v; }
        public String getGpa() { return gpa; } public void setGpa(String v) { gpa = v; }
    }

    public static class SkillDTO {
        private Long id; private String skillName;
        public Long getId() { return id; } public void setId(Long id) { this.id = id; }
        public String getSkillName() { return skillName; } public void setSkillName(String v) { skillName = v; }
    }

    public static class ProjectDTO {
        private Long id; private String projectName; private String description; private String techStack; private String link;
        public Long getId() { return id; } public void setId(Long id) { this.id = id; }
        public String getProjectName() { return projectName; } public void setProjectName(String v) { projectName = v; }
        public String getDescription() { return description; } public void setDescription(String v) { description = v; }
        public String getTechStack() { return techStack; } public void setTechStack(String v) { techStack = v; }
        public String getLink() { return link; } public void setLink(String v) { link = v; }
    }

    public static class ExperienceDTO {
        private Long id; private String company; private String role; private String duration; private String description;
        public Long getId() { return id; } public void setId(Long id) { this.id = id; }
        public String getCompany() { return company; } public void setCompany(String v) { company = v; }
        public String getRole() { return role; } public void setRole(String v) { role = v; }
        public String getDuration() { return duration; } public void setDuration(String v) { duration = v; }
        public String getDescription() { return description; } public void setDescription(String v) { description = v; }
    }

    public static class CertificationDTO {
        private Long id; private String certName; private String issuer; private String year;
        public Long getId() { return id; } public void setId(Long id) { this.id = id; }
        public String getCertName() { return certName; } public void setCertName(String v) { certName = v; }
        public String getIssuer() { return issuer; } public void setIssuer(String v) { issuer = v; }
        public String getYear() { return year; } public void setYear(String v) { year = v; }
    }
}
