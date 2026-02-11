import { Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { ChatRoomDTO } from '../../Models/chatRoom/chat-room.dto';
import { AuthService } from '../../services/auth-service';
import { CurrentUser } from '../../Models/auth/current-user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-room',
  imports: [],
  templateUrl: './chat-room.html',
  styleUrl: './chat-room.scss',
})
export class ChatRoom implements OnInit, OnDestroy {
  @Input() chatRoom!: ChatRoomDTO;
  @Output() delete = new EventEmitter<number>();
  currentUser: CurrentUser | null = null;
  subscriptions: Subscription[] = [];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.auth.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
  }

  joinChatRoom(): void {
    // Logic to join the chat room (e.g., navigate to chat room page)
  }

  deleteChatRoom(): void {
    this.delete.emit(this.chatRoom.id); 
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
