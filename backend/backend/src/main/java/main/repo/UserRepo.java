package main.repo;

import jakarta.annotation.PostConstruct;
import main.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    void deleteUserById(Long id);
    Optional<User> findUserById(Long id);
    Optional<User> findUserByUsername(String username);
    List<User> findByUsernameContainingIgnoreCase(String username);
}
