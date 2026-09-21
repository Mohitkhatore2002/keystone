package com.meridian.keystone;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BCryptTest {
    @Test
    public void generateHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("password123");
        System.out.println("VALID_BCRYPT_HASH_BEGIN:" + hash + ":VALID_BCRYPT_HASH_END");
    }
}
