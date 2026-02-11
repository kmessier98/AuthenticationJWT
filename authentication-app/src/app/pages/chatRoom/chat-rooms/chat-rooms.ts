import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChatRoomDTO } from '../../../Models/chatRoom/chat-room.dto';
import { AsyncPipe } from '@angular/common';
import { ChatRoom } from "../../../components/chat-room/chat-room";

@Component({
  selector: 'app-chat-rooms',
  imports: [AsyncPipe, ChatRoom],
  templateUrl: './chat-rooms.html',
  styleUrl: './chat-rooms.scss',
})
export class ChatRooms implements OnInit {
  chatRooms$: Observable<ChatRoomDTO[]> | null = null;

  ngOnInit(): void {
    this.chatRooms$ = of([
      { id: 1, name: 'Général', description: 'Salon de discussion général' },
      { id: 2, name: 'Support', description: 'Salon de support technique' },
      { id: 3, name: 'Off-topic', description: 'Salon de discussion hors sujet' },
    ]);
  }

  deleteChatRoom(chatRoomId: number): void {
    // Logic to delete the chat room (e.g., call API to delete chat room)
    console.log(`Chat room with ID ${chatRoomId} deleted`);
  }
}
