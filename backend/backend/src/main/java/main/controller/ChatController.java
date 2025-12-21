package main.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import main.dto.ChatDto;
import main.model.Chat;
import main.model.User;
import main.service.ChatService;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/getAll")
    public List<Chat> getAll() {
        return chatService.getAll();
    }

    @GetMapping("/myChats")
    public ResponseEntity<List<ChatDto>> getByUserId(@AuthenticationPrincipal User user) {
        System.out.println("works");
        List<Chat> chats = chatService.findByUserId(user.getId());
        List<ChatDto> chatDtos = new ArrayList<>();
        for (Chat chat: chats) {
            chatDtos.add(new ChatDto(chat));
        }
        return new ResponseEntity<>(chatDtos, HttpStatus.OK);
    }
}
