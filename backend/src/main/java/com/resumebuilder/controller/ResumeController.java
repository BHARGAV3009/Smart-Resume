package com.resumebuilder.controller;

import com.resumebuilder.dto.ResumeRequest;
import com.resumebuilder.model.Resume;
import com.resumebuilder.service.PdfService;
import com.resumebuilder.service.ResumeService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    private final ResumeService resumeService;
    private final PdfService pdfService;

    public ResumeController(ResumeService resumeService, PdfService pdfService) {
        this.resumeService = resumeService;
        this.pdfService = pdfService;
    }

    @GetMapping
    public ResponseEntity<List<Resume>> getAll(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(resumeService.getResumesByUser(user.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resume> getById(@PathVariable Long id) {
        return ResponseEntity.ok(resumeService.getResumeById(id));
    }

    @PostMapping
    public ResponseEntity<Resume> create(@RequestBody ResumeRequest req,
                                         @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(resumeService.saveOrUpdate(req, user.getUsername(), null));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resume> update(@PathVariable Long id,
                                         @RequestBody ResumeRequest req,
                                         @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(resumeService.saveOrUpdate(req, user.getUsername(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetails user) {
        resumeService.delete(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
        try {
            byte[] pdf = pdfService.generatePdf(id);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "resume.pdf");
            return ResponseEntity.ok().headers(headers).body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
