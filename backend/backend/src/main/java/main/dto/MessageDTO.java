package main.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class MessageDTO implements Serializable {
    private String content;
    private Long chatId;
    private Long senderId;
}
