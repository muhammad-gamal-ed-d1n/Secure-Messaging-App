package main.dto;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import main.model.Message;
import main.model.MessageType;
@Getter
@Setter
@Data
@NoArgsConstructor
public class MessageDto implements Serializable {
    private Long id;
    private String content;
    private Long chatId;
    private Long senderId;
    private String recipientUsername;
    private LocalDateTime timeStamp;
    private boolean received;
    private MessageType type;

    private String state;
    public MessageDto(Message message) {
        this.id = message.getId();
        this.content = message.getContent();
        this.timeStamp = message.getTimeStamp();
        this.chatId = message.getChat().getId();
        this.senderId = message.getSender().getId();
        this.recipientUsername = message.getRecipient().getUsername();
        this.type = MessageType.CHAT;
        this.state = message.getState();
    }
}
