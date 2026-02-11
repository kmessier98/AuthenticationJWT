import { Component, EventEmitter, Input, Output} from '@angular/core';
import { ChatRoomDTO } from '../../Models/chatRoom/chat-room.dto';

@Component({
  selector: 'app-chat-room',
  imports: [],
  templateUrl: './chat-room.html',
  styleUrl: './chat-room.scss',
})
export class ChatRoom {
  @Input() chatRoom!: ChatRoomDTO;
  @Output() delete = new EventEmitter<number>();

  joinChatRoom(): void {
    // Logic to join the chat room (e.g., navigate to chat room page)
  }

  deleteChatRoom(): void {
    this.delete.emit(this.chatRoom.id); 
  }
}
