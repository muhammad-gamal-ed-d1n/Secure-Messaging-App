package main.dto;

import lombok.Data;
import main.model.Chat;

import java.util.List;

@Data
public class ChatDto {
    private Long id;
    private List<UserDto> users;

    public ChatDto(Chat chat) {
        this.id = chat.getId();
        chat.getUsers().forEach(user -> {
            this.users.add(new UserDto(user));
        });
    }
}
