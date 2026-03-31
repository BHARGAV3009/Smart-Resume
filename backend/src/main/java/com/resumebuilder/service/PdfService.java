package com.resumebuilder.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.resumebuilder.model.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    private final ResumeService resumeService;

    public PdfService(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    public byte[] generatePdf(Long resumeId) throws Exception {
        Resume resume = resumeService.getResumeById(resumeId);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4, 40, 40, 60, 40);
        PdfWriter.getInstance(doc, baos);
        doc.open();

        BaseColor accentColor = new BaseColor(99, 102, 241);
        Font nameFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, BaseColor.BLACK);
        Font headingFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, accentColor);
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.BLACK);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);
        Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 9, BaseColor.GRAY);

        if (set(resume.getFullName())) {
            Paragraph name = new Paragraph(resume.getFullName(), nameFont);
            name.setAlignment(Element.ALIGN_CENTER); doc.add(name);
        }

        StringBuilder contact = new StringBuilder();
        if (set(resume.getEmail())) contact.append(resume.getEmail()).append("  •  ");
        if (set(resume.getPhone())) contact.append(resume.getPhone()).append("  •  ");
        if (set(resume.getLocation())) contact.append(resume.getLocation());
        if (set(resume.getLinkedIn())) contact.append("  •  ").append(resume.getLinkedIn());
        if (set(resume.getGithub())) contact.append("  •  ").append(resume.getGithub());
        if (contact.length() > 0) {
            Paragraph cp = new Paragraph(contact.toString(), smallFont);
            cp.setAlignment(Element.ALIGN_CENTER); doc.add(cp);
        }
        doc.add(Chunk.NEWLINE);
        addLine(doc, accentColor);
        doc.add(Chunk.NEWLINE);

        if (set(resume.getSummary())) {
            addHeading(doc, "PROFESSIONAL SUMMARY", headingFont);
            doc.add(new Paragraph(resume.getSummary(), normalFont)); doc.add(Chunk.NEWLINE);
        }

        if (!resume.getExperiences().isEmpty()) {
            addHeading(doc, "WORK EXPERIENCE", headingFont);
            for (Experience exp : resume.getExperiences()) {
                doc.add(new Paragraph(exp.getRole() + " — " + exp.getCompany(), boldFont));
                if (set(exp.getDuration())) doc.add(new Paragraph(exp.getDuration(), smallFont));
                if (set(exp.getDescription())) doc.add(new Paragraph(exp.getDescription(), normalFont));
                doc.add(Chunk.NEWLINE);
            }
        }

        if (!resume.getEducations().isEmpty()) {
            addHeading(doc, "EDUCATION", headingFont);
            for (Education edu : resume.getEducations()) {
                doc.add(new Paragraph(edu.getDegree(), boldFont));
                String line = edu.getInstitution() + (set(edu.getYear()) ? " | " + edu.getYear() : "") + (set(edu.getGpa()) ? " | GPA: " + edu.getGpa() : "");
                doc.add(new Paragraph(line, smallFont)); doc.add(Chunk.NEWLINE);
            }
        }

        if (!resume.getSkills().isEmpty()) {
            addHeading(doc, "SKILLS", headingFont);
            String skills = resume.getSkills().stream().map(Skill::getSkillName).reduce("", (a, b) -> a.isEmpty() ? b : a + "  •  " + b);
            doc.add(new Paragraph(skills, normalFont)); doc.add(Chunk.NEWLINE);
        }

        if (!resume.getProjects().isEmpty()) {
            addHeading(doc, "PROJECTS", headingFont);
            for (Project proj : resume.getProjects()) {
                doc.add(new Paragraph(proj.getProjectName(), boldFont));
                if (set(proj.getTechStack())) doc.add(new Paragraph("Tech: " + proj.getTechStack(), smallFont));
                if (set(proj.getDescription())) doc.add(new Paragraph(proj.getDescription(), normalFont));
                doc.add(Chunk.NEWLINE);
            }
        }

        if (!resume.getCertifications().isEmpty()) {
            addHeading(doc, "CERTIFICATIONS", headingFont);
            for (Certification cert : resume.getCertifications()) {
                doc.add(new Paragraph(cert.getCertName() + " — " + nvl(cert.getIssuer()) + " (" + nvl(cert.getYear()) + ")", normalFont));
            }
        }

        doc.close();
        return baos.toByteArray();
    }

    private void addHeading(Document doc, String text, Font font) throws DocumentException {
        doc.add(new Paragraph(text, font)); doc.add(Chunk.NEWLINE);
    }

    private void addLine(Document doc, BaseColor color) throws DocumentException {
        LineSeparator ls = new LineSeparator(); ls.setLineColor(color); doc.add(new Chunk(ls));
    }

    private boolean set(String s) { return s != null && !s.isBlank(); }
    private String nvl(String s) { return s != null ? s : ""; }
}
