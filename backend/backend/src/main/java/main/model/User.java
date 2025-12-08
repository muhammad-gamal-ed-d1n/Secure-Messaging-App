package main.model;

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
    private String password;
    @ManyToMany(mappedBy = "users")
    private Set<Chat> chats;

    public void addChat(Chat chat) {
        chats.add(chat);
    }
}
