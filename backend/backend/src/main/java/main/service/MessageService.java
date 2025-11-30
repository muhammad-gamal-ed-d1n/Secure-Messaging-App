package main.service;

import main.model.Message;
import main.repo.MessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {
    @Autowired
    MessageRepo messageRepo;

    public Message createMessage(Message message) {
        message.setTimeStamp(LocalDateTime.now());
        return messageRepo.save(message);
    }

    public List<Message> getAll() {
        return messageRepo.findAll();
    }

    public Message findMessageById(Long id) {
        return messageRepo.findMessageById(id).get();
    }
}
