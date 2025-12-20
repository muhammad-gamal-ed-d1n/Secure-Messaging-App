package main.controller;

import main.dto.MessageDto;
import main.dto.SendMessageDto;
import main.model.Message;
import main.repo.MessageRepo;
import main.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
        return new ResponseEntity<>(messageService.createMessage(dto.senderId,dto.recipient_username,dto.content), HttpStatus.CREATED);
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
                                                               @RequestParam("otherUsername")String otheruser){
        List<MessageDto> messages = messageService.getMyMessages(id,otheruser);
        return ResponseEntity.ok(messages);
    }
    @PutMapping("/state")
    public ResponseEntity<Void> readMessages(@RequestParam("userId") Long userId, @RequestParam("chatId") Long chatId) {
        messageRepo.markMessagesAsRead(chatId, userId);
        return ResponseEntity.noContent().build();
    }
}
