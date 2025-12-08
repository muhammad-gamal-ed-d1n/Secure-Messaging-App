package main.dto;

import lombok.Data;
import main.model.User;

@Data
public class UserDto {
    private Long id;
    private String username;

    public UserDto() {}
    public UserDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
    }
}
