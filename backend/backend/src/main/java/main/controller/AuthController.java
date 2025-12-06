package main.controller;

import main.dto.JwtResponse;
import main.dto.AuthRequest;
import main.exception.UsernameExistsException;
import main.model.User;
import main.security.JwtService;
import main.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {

        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword())
            );

            UserDetails userd = (UserDetails) auth.getPrincipal();
            User user = userService.findUserByUsername(userd.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));
            String token = jwtService.generateToken(user);

            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
    
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthRequest req) {

        try {
            User user = new User(req);
            userService.createUser(user);
            String token = jwtService.generateToken(user);

            return ResponseEntity.ok(new JwtResponse(token));
        } catch (UsernameExistsException e) {
            return new ResponseEntity<String>("Username already exists", HttpStatus.CONFLICT);
        }
    }
}
