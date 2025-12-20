package main.repo;

import jakarta.transaction.Transactional;
import main.model.Chat;
import main.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepo extends JpaRepository<Message, Long> {
    Optional<Message> findMessageById(Long id);
    List<Message> findAll();
    List<Message> findMessageByChatId(Long chatId);
    @Modifying
    @Transactional // Ensures the update is committed to the DB
    @Query("UPDATE Message m SET m.state = 'read' " +
            "WHERE m.sender.id = :senderId " +
            "AND m.recipient.id = :userId ")
    void markMessagesAsRead(@Param("senderId") Long senderId, @Param("reciverId") Long reciverId);
    @Modifying
    @Transactional // Ensures the update is committed to the DB
    @Query("UPDATE Message m SET m.state = 'Recieved' " +
            "WHERE m.recipient.id = :userId " +
            "AND m.state = 'NotRead'")
    void markMessageAsRecived(@Param("reciverId") Long reciverId);
}
