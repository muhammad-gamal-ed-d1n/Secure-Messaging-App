package main.service;

import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import main.dto.MessageDto;
import main.model.Chat;
import main.model.Message;
import main.model.User;
import main.repo.ChatRepo;
import main.repo.MessageRepo;
import main.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {
    @Autowired
    MessageRepo messageRepo;

    @Autowired
    ChatRepo chatRepo;
    @Autowired
    UserRepo userRepo;

//    @PostConstruct
//    @Transactional
//    public void createMockMessages(){
//        System.out.println("messages created");
//        User mohamed = userRepo.findUserByUsername("mohamed").orElseThrow(()->  new RuntimeException("not found"));
//        User mona = userRepo.findUserByUsername("mona").orElseThrow(()->  new RuntimeException("not found"));

//        Optional<Chat> existingChat = chatRepo.findChatBytwousersIds(mohamed.getId(), mona.getId());

//        Chat mohamedMona = existingChat.orElseGet(() ->{
//            Chat newChat = new Chat();
//            Set<User> users = new HashSet<>();
//            users.add(mohamed);
//            users.add(mona);
//            newChat.setUsers(users);
//            return chatRepo.save(newChat);
//        });
//        Message m1 = new Message();
//        m1.setContent("Hey mona, how are you?");
//        m1.setSender(mohamed); // Sender ID is implicitly mohamed's ID
//        m1.setRecipient(mona);   // Recipient ID is implicitly mona's ID
//        m1.setChat(mohamedMona);
//        m1.setTimeStamp(LocalDateTime.now().minusMinutes(5)); // 5 minutes ago
//        // If your Message entity has a 'recived' boolean:
//        // m1.setRecived(false);
//        messageRepo.save(m1);

//        // Message 2: mona to mohamed
//        Message m2 = new Message();
//        m2.setContent("I'm great, mohamed! Thanks for checking in.");
//        m2.setSender(mona);
//        m2.setRecipient(mohamed);
//        m2.setChat(mohamedMona);
//        m2.setTimeStamp(LocalDateTime.now().minusMinutes(2)); // 2 minutes ago
//        // m2.setRecived(true);
//        messageRepo.save(m2);

//        // Message 3: mohamed to mona (Latest)
//        Message m3 = new Message();
//        m3.setContent("See you later!");
//        m3.setSender(mohamed);
//        m3.setRecipient(mona);
//        m3.setChat(mohamedMona);
//        m3.setTimeStamp(LocalDateTime.now()); // Now
//        // m3.setRecived(false);
//        messageRepo.save(m3);


//        System.out.println("--- Mock Data Creation Complete. ---");

//    }

    public Message createMessage(Long senderId,String recipientId,String content) {
        User sender = userRepo.findUserById(senderId).orElseThrow(()-> new RuntimeException("sender not found"));
        User recipient = userRepo.findUserByUsername(recipientId).orElseThrow(()-> new RuntimeException("recipient not found"));
        Optional<Chat> chatOptional = chatRepo.findChatBytwousersIds(senderId, recipient.getId());
        Chat chat = chatOptional.orElseGet(()->{
         Chat newchat = new Chat();
         Set<User> users = new HashSet<>();
         users.add(sender);
         users.add(recipient);
         newchat.setUsers(users);
         return chatRepo.save(newchat);
        });
        Message newmessage = new Message();
        newmessage.setContent(content);
        newmessage.setChat(chat);
        newmessage.setSender(sender);
        newmessage.setRecipient(recipient);
        newmessage.setTimeStamp(LocalDateTime.now());
        return messageRepo.save(newmessage);
    }

    public List<Message> getAll() {
        return messageRepo.findAll();
    }

    public Message findMessageById(Long id) {
        return messageRepo.findMessageById(id).get();
    }
    @Transactional
    public List<MessageDto> getMyMessages(Long id, String otherusers){
        User otheruser = userRepo.findUserByUsername(otherusers).orElseThrow(() -> new RuntimeException("otheruser not found"));
        Long otheruserId = otheruser.getId();
        Optional<Chat> chatOptional = chatRepo.findChatBytwousersIds(id,otheruserId);
        if(chatOptional.isEmpty()){
            return Collections.emptyList();
        }
        Chat chat = chatOptional.get();

        return chat.getMessages().stream().
                sorted(Comparator.
                        comparing(Message::getTimeStamp)).
                map(message -> {
                    MessageDto dto = new MessageDto(message);
                    if(id.equals(message.getSender().getId())){
                        dto.setReceived(false);
                    }
                    else {
                        dto.setReceived(true);
                    }
                    return dto;
                }).
                collect(Collectors.toList());
    }
}
