import { ChangeDetectorRef, Component, EventEmitter, Injectable, Output } from '@angular/core';
import { User } from '../model/User';
import { UserService } from '../service/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Injectable()
@Component({
  selector: 'app-add-chat-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-chat-component.html',
  styleUrl: './add-chat-component.css',
})
export class AddChatComponent {

  @Output() closeSearchSignal = new EventEmitter<void>()

  currentInput: string = "";

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  users: User[] = []

  searchForUser() {
    if (this.currentInput !== "") {
      this.userService.searchForUserByUsername(this.currentInput).subscribe({
        next: (res) => {
          this.users = res;
          this.cdr.detectChanges()
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
    else {
      this.users = [];
    }
  }

  closeModal() {
    this.closeSearchSignal.emit()
  }
}
