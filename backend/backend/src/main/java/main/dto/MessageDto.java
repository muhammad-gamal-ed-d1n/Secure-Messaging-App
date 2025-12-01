package main.dto;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
public class MessageDto implements Serializable {
    private Long id;
    private String content;
    private Long chatId;
    private Long senderId;
    private LocalDateTime timeStamp;
}
