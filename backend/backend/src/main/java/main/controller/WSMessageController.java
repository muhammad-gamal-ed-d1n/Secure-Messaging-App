package main.controller;

import main.dto.MessageDto;
import main.dto.SendMessageDto;
import main.model.Message;
import main.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WSMessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public void processMessage(@Payload SendMessageDto chatMessage) {

        Message saved = messageService.createMessage(
                chatMessage.senderId,
                chatMessage.recipient_username,
                chatMessage.content
        );


        MessageDto dto = new MessageDto(saved);
        messagingTemplate.convertAndSend("/topic/messages/" + dto.getChatId(), dto);
    }
}