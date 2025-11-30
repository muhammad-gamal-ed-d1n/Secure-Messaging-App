package main.service;

import jakarta.annotation.PostConstruct;
import main.exception.UsernameExistsException;
import main.model.User;
import main.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;

    @PostConstruct
    public void init() {
        create("mohamed", "pass1");
        create("mohammad", "pass2");
        create("mohamad", "pass3");
        create("mohammed", "pass4");
        create("mo", "pass5");
        create("moo", "pass6");
        create("moha", "pass7");
        create("mohaed", "pass8");
        create("moham", "pass9");
        create("mohd", "pass10");
        create("mohsen", "pass11");
        create("mohannad", "pass12");
        create("mohab", "pass13");
        create("mohib", "pass14");
        create("mona", "pass15");
        create("monir", "pass16");
    }

    private void create(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        this.createUser(user);
    }

    public List<User> getAll() {
        return userRepo.findAll();
    }

    public User createUser(User user) {
        String username = user.getUsername();

        if(userRepo.findUserByUsername(username).isEmpty()) {
            return userRepo.save(user);
        }
        else {
            throw new UsernameExistsException("Username '" + username + "' already exists");
        }
    }

    public User findUserById(Long id) {
        return userRepo.findUserById(id).get();
    }

    public Object searchUsers(String username) {
        Optional<User> match = userRepo.findUserByUsername(username);
        if(match.isPresent()) {
            return match.get();
        }

        List<User> fuzzy = userRepo.findByUsernameContainingIgnoreCase(username);
        return fuzzy;
    }
}
