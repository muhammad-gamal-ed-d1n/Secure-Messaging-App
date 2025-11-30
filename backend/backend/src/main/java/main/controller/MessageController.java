package main.controller;

import main.model.Message;
import main.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @PostMapping("/create")
    public ResponseEntity<Message> createMessage(@RequestBody Message message) {
        return new ResponseEntity<>(messageService.createMessage(message), HttpStatus.CREATED);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Message>> getAllMessages() {
        return ResponseEntity.ok(messageService.getAll());
    }

    @GetMapping("/findMessageById/{id}")
    public ResponseEntity<Message> findMessageById(@PathVariable Long id) {
        return ResponseEntity.ok(messageService.findMessageById(id));
    }
}
