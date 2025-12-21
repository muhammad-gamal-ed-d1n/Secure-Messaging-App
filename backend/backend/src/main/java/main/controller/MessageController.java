package main.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import main.dto.MessageDto;
import main.dto.SendMessageDto;
import main.model.Message;
import main.repo.MessageRepo;
import main.service.MessageService;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/message")
public class MessageController {

    @Autowired
    private MessageService messageService;
    @Autowired
    private MessageRepo messageRepo;

    @PostMapping("/create")
    public ResponseEntity<Message> createMessage(@RequestBody SendMessageDto dto) {
        return new ResponseEntity<>(messageService.createMessage(dto.senderId, dto.recipient_username, dto.content), HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Message>> getAllMessages() {
        return ResponseEntity.ok(messageService.getAll());
    }

    @GetMapping("/findMessageById/{id}")
    public ResponseEntity<Message> findMessageById(@PathVariable Long id) {
        return ResponseEntity.ok(messageService.findMessageById(id));
    }

    @GetMapping("/allmessages")
    public ResponseEntity<List<MessageDto>> getMessageByUserId(@RequestParam("myId") Long id,
            @RequestParam("otherUsername") String otheruser) {
        List<MessageDto> messages = messageService.getMyMessages(id, otheruser);
        return ResponseEntity.ok(messages);
    }

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.sendMessage")
    public MessageDto sendMessage(@Payload MessageDto messageDto) {
        messageService.createMessage(messageDto.getSenderId(), messageDto.getRecipientUsername(), messageDto.getContent());
        messagingTemplate.convertAndSendToUser(messageDto.getRecipientUsername(), "/queue/messages", messageDto);
        return messageDto;
    }

    @MessageMapping("/chat.addUser")
    public MessageDto addUser(@Payload MessageDto messageDto, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("userId", messageDto.getSenderId());

        messageDto.setType(main.model.MessageType.JOIN);
        messagingTemplate.convertAndSend("/topic/status", messageDto);
        
        return messageDto;
    }
    
    @PutMapping("/state")
    public ResponseEntity<Void> readMessages(@RequestParam("sender") String sender, @RequestParam("reciver") Long reciver) {
        messageRepo.markMessagesAsRead(sender,reciver);
        return ResponseEntity.noContent().build();
    }
}
