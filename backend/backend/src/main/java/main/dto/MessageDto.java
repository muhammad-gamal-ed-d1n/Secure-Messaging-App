package main.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import main.model.Message;

import java.io.Serializable;
import java.time.LocalDateTime;
@Getter
@Setter
@Data
public class MessageDto implements Serializable {
    private Long id;
    private String content;
    private Long chatId;
    private Long senderId;
    private LocalDateTime timeStamp;
    private String state;
    public MessageDto(Message message) {
        this.id = message.getId();
        this.content = message.getContent();
        this.timeStamp = message.getTimeStamp();
        this.chatId = message.getChat().getId();
        this.senderId = message.getSender().getId();
        this.state ="NotRead";
    }
}
