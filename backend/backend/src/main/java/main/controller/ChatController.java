package main.controller;

import main.model.Chat;
import main.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/getAll")
    public List<Chat> getAll() {
        return chatService.getAll();
    }

    @GetMapping("/findByUserId/{id}")
    public List<Chat> getByUserId(@PathVariable Long id) {
        return chatService.findByUserId(id);
    }
}
