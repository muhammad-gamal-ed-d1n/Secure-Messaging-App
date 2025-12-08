package main.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import main.dto.AuthRequest;

import java.io.Serializable;
import java.util.Set;

@Setter
@Getter
@Entity
public class User implements Serializable {

    public User() {}

    public User(AuthRequest req) {
        this.setUsername(req.getUsername());
        this.setPassword(req.getPassword());
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long id;

    private String username;
    @JsonIgnore
    private String password;
    @JsonIgnoreProperties("users")
    @ManyToMany(mappedBy = "users",fetch = FetchType.EAGER)
    private Set<Chat> chats;

    public void addChat(Chat chat) {
        chats.add(chat);
    }
}
