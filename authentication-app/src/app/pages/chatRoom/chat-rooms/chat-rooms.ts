import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ChatRoomDTO } from '../../../Models/chatRoom/chat-room.dto';
import { AsyncPipe } from '@angular/common';
import { ChatRoom } from "../../../components/chat-room/chat-room";
import { ChatRoomService } from '../../../services/chat-room-service';
import { CurrentUser } from '../../../Models/auth/current-user';
import { AuthService } from '../../../services/auth-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-chat-rooms',
  imports: [AsyncPipe, ChatRoom, RouterLink],
  templateUrl: './chat-rooms.html',
  styleUrl: './chat-rooms.scss',
})
export class ChatRooms implements OnInit, OnDestroy {
  chatRooms$: Observable<ChatRoomDTO[]> | null = null;
  currentUser: CurrentUser | null = null;
  subscriptions: Subscription[] = [];

  constructor(private chatRoomService: ChatRoomService, private authService: AuthService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      })
    );
    this.chatRoomService.loadChatRooms();
    this.chatRooms$ = this.chatRoomService.chatRooms$;
  }

  deleteChatRoom(chatRoomId: number): void {
    this.chatRoomService.deleteChatRoom(chatRoomId);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
