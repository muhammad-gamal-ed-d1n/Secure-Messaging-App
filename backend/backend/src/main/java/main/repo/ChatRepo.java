package main.repo;

import main.model.Chat;
import main.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepo extends JpaRepository<Chat, Long> {
    List<Chat> findByUsers_Id(Long userId);

    @Query("""
        SELECT c FROM Chat c
        JOIN c.users u 
        WHERE u.id IN (:myId, :otherId) 
        GROUP BY c 
        HAVING COUNT(c.id) = 2 AND SIZE(c.users) = 2
    """)
    Optional<Chat> findChatBytwousersIds(
            @Param("myId") Long myId,
            @Param("otherId") Long otherId
    );
}
