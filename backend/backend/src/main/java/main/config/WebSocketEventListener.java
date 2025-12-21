package main.config;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import main.dto.MessageDto;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");

        if (userId != null) {
            log.info("User Disconnected : {}", userId);
            MessageDto disconnectMessage = new MessageDto();
            disconnectMessage.setType(main.model.MessageType.LEAVE);
            disconnectMessage.setSenderId(userId);

            messageTemplate.convertAndSend("/topic/status", disconnectMessage);
        }
    }
}
