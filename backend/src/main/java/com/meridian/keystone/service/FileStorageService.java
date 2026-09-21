package com.meridian.keystone.service;

import com.meridian.keystone.dto.FileUploadResponseDto;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation = Paths.get("uploads").toAbsolutePath().normalize();

    @PostConstruct
    public void init() {
        try {
            // Create main upload folder and subfolders for each section
            Files.createDirectories(rootLocation);
            Files.createDirectories(rootLocation.resolve("profiles"));
            Files.createDirectories(rootLocation.resolve("work-orders"));
            Files.createDirectories(rootLocation.resolve("signatures"));
            System.out.println("📁 [KEYSTONE FileStorage] Root upload storage initialized at: " + rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage directory structure", e);
        }
    }

    public FileUploadResponseDto storeFile(MultipartFile file, String category) {
        String cleanCategory = sanitizeCategory(category);
        Path categoryFolder = rootLocation.resolve(cleanCategory);

        try {
            Files.createDirectories(categoryFolder);
        } catch (IOException e) {
            throw new RuntimeException("Could not create category folder: " + cleanCategory, e);
        }

        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String extension = "";
        int extIndex = originalFileName.lastIndexOf(".");
        if (extIndex > 0) {
            extension = originalFileName.substring(extIndex);
        } else {
            extension = ".png";
        }

        String uniqueFileName = cleanCategory + "_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
        Path targetLocation = categoryFolder.resolve(uniqueFileName);

        try {
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String fileUrl = "/api/files/download/" + cleanCategory + "/" + uniqueFileName;

            return FileUploadResponseDto.builder()
                    .fileUrl(fileUrl)
                    .fileName(uniqueFileName)
                    .category(cleanCategory)
                    .sizeBytes(file.getSize())
                    .build();
        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + originalFileName + " in " + cleanCategory, e);
        }
    }

    public Resource loadFileAsResource(String category, String filename) {
        String cleanCategory = sanitizeCategory(category);
        try {
            Path filePath = rootLocation.resolve(cleanCategory).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found: " + category + "/" + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("File path invalid: " + category + "/" + filename, e);
        }
    }

    private String sanitizeCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            return "work-orders";
        }
        String clean = category.toLowerCase().trim();
        if (clean.equals("profiles") || clean.equals("profile")) return "profiles";
        if (clean.equals("signatures") || clean.equals("signature")) return "signatures";
        return "work-orders";
    }
}
