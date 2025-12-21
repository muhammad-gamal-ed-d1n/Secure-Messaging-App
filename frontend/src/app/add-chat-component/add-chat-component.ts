import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit
} from '@angular/core';
import { User } from '../model/User';
import { UserService } from '../service/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {AuthService} from '../auth/auth service/AuthService';

@Component({
  selector: 'app-add-chat-component',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-chat-component.html',
  styleUrl: './add-chat-component.css',
})
export class AddChatComponent implements OnInit {
  @ViewChild('myInput') myInput!: ElementRef<HTMLInputElement>;
  ngOnInit() {
    this.authService.getCurrentUser().subscribe({
      next: (curr: User) => {
        this.currentUser = curr;
        this.cdr.detectChanges();
      }
    })
  }
  ngAfterViewInit(): void {
    this.myInput.nativeElement.focus();
  }

  @Output() closeSearchSignal = new EventEmitter<void>()
  @Output() currentChat = new EventEmitter<User>();
  currentInput: string = "";

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }
  currentUser!: User;
  users: User[] = []

  searchForUser() {
    if (this.currentInput !== "") {
      this.userService.searchForUserByUsername(this.currentInput).subscribe({
        next: (res) => {
          this.users = res.filter(user => user.username !== this.currentUser.username);
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
  outsideClick(event: MouseEvent) {
    // make sure the click is outside the modal
    if ((<HTMLElement>event.target).classList.contains('modal-container')) {
      this.closeModal();
    }
  }
  addUser(user: User) {
    this.currentChat.emit(user);
    this.closeModal();
  }
}
