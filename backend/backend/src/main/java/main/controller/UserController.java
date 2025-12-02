package main.controller;

import main.exception.UsernameExistsException;
import main.model.User;
import main.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/getAll")
    public ResponseEntity<List<User>> getAll() {
        return new ResponseEntity<>(userService.getAll(), HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            User newUser = userService.createUser(user);
            return new ResponseEntity<>(newUser, HttpStatus.CREATED);
        }
        catch (UsernameExistsException e) {
            return ResponseEntity.
                    status(HttpStatus.CONFLICT).
                    body(e.getMessage());
        }
    }

    @GetMapping("/search/{username}")
    public ResponseEntity<?> searchUsers(@PathVariable String username) {
        return new ResponseEntity<>(userService.searchUsers(username), HttpStatus.OK);
    }

}
