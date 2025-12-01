package main.service;

import main.model.Chat;
import main.repo.ChatRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class ChatService {

    @Autowired
    private ChatRepo chatRepo;

    public List<Chat> getAll() {
        return chatRepo.findAll();
    }

    public List<Chat> findByUserId(Long id) {
        return chatRepo.findByUsers_Id(id);
    }
}
