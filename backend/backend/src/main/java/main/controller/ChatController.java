package main.controller;

import main.dto.ChatDto;
import main.dto.MessageDto;
import main.model.Chat;
import main.model.Message;
import main.model.User;
import main.repo.MessageRepo;
import main.service.ChatService;
import main.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private MessageRepo messageRepo;
    @GetMapping("/getAll")
    public List<Chat> getAll() {
        return chatService.getAll();
    }

    @GetMapping("/myChats")
    public ResponseEntity<List<ChatDto>> getByUserId(@AuthenticationPrincipal User user) {
        List<Chat> chats = chatService.findByUserId(user.getId());
        messageRepo.markMessageAsRecived(user.getId());

        // 3. Convert to DTOs for the Frontend
        List<ChatDto> chatDtos = chats.stream()
                .map(ChatDto::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(chatDtos);
    }
}
