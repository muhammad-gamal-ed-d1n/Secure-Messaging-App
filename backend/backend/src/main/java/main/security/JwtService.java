package main.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import main.model.User;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import java.util.Date;
@Service
public class JwtService {
    private final String SECRET = "5abbeeh fe application.yaml ba3deen";

    public String generateToken(User user) {
        return Jwts.builder().
                setSubject(user.getUsername()).
                setIssuedAt(new Date()).
                setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)).
                signWith(SignatureAlgorithm.HS256, SECRET).
                compact();
    }

    public String extractUsername(String token) {
        return Jwts.parser().
                setSigningKey(SECRET).
                parseClaimsJwt(token).
                getBody().
                getSubject();
    }

    public boolean isValid(String token, User user) {
        try {
            return extractUsername(token).equals(user.getUsername());
        }
        catch (Exception e) {
            return false;
        }
    }
}
