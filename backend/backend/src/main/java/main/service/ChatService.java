package main.service;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import main.model.Chat;
import main.model.User;
import main.repo.ChatRepo;
import main.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ChatService {

     @PostConstruct
     @Transactional
     public void init() {
         User user = userRepo.findUserByUsername("mohamed").get();

         User user2 = userRepo.findUserByUsername("mona").get();
         Chat chat = new Chat();
        Set<User> set = new HashSet<>();
        set.add(user);
         set.add(user2);
         chat.setUsers(set);
        Chat chat1 = createChat(chat);

         user.addChat(chat1);
         user2.addChat(chat1);
     }

    @Autowired
    private ChatRepo chatRepo;

    @Autowired
    private UserRepo userRepo;

    public List<Chat> getAll() {
        return chatRepo.findAll();
    }

    public List<Chat> findByUserId(Long id) {
        return chatRepo.findByUsers_Id(id);
    }

    public Chat createChat(Chat chat) {
        return chatRepo.save(chat);
    }
}
