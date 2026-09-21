package com.meridian.keystone.controller;

import com.meridian.keystone.dto.FileUploadResponseDto;
import com.meridian.keystone.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "File Uploads", description = "Endpoints for disk-backed photo and file storage (profiles, work-orders, signatures)")
public class FileUploadController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload photo or file to specific backend disk folder (profiles, work-orders, signatures)")
    public ResponseEntity<FileUploadResponseDto> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false, defaultValue = "work-orders") String category) {

        FileUploadResponseDto response = fileStorageService.storeFile(file, category);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/download/{category}/{filename:.+}")
    @Operation(summary = "Stream file or image resource from backend disk folder")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String category,
            @PathVariable String filename,
            HttpServletRequest request) {

        Resource resource = fileStorageService.loadFileAsResource(category, filename);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // Default to octet-stream if type cannot be determined
        }

        if (contentType == null) {
            if (filename.endsWith(".png")) contentType = "image/png";
            else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) contentType = "image/jpeg";
            else if (filename.endsWith(".webp")) contentType = "image/webp";
            else if (filename.endsWith(".pdf")) contentType = "application/pdf";
            else contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
