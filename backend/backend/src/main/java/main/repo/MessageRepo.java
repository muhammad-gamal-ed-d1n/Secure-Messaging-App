package main.repo;

import main.model.Chat;
import main.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {
    Optional<Message> findMessageById(Long id);
    List<Message> findAll();
    List<Message> findMessageByChatId(Long chatId);
}
