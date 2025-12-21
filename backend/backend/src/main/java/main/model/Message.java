package main.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class Message implements Serializable {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column(nullable = false, unique = true)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    @JsonIgnoreProperties("chats")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "recipient_id", nullable = false)
    @JsonIgnoreProperties("chats")
    private User recipient;

    private String content;
    private LocalDateTime timeStamp;

    @ManyToOne
    @JoinColumn(name = "chat_id")
    @JsonIgnoreProperties("messages")
    private Chat chat;

    @Enumerated(EnumType.STRING)
    private MessageType type;
}
