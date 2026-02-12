import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { ChatRoomService } from '../../../services/chat-room-service';
import { CurrentUser } from '../../../Models/auth/current-user';
import { AuthService } from '../../../services/auth-service';
import { MessageDTO } from '../../../Models/chatRoom/message.dto';
import { AsyncPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-join-chat-room',
  imports: [AsyncPipe, DatePipe, CommonModule, FormsModule],
  templateUrl: './join-chat-room.html',
  styleUrl: './join-chat-room.scss',
})
export class JoinChatRoom implements OnInit, OnDestroy {
    chatRoomId!: string;
    subscriptions: Subscription[] = [];
    currentUser: CurrentUser | null = null;
    message: string = '';
    messages$: Observable<MessageDTO[]> | null = null;

    constructor(private route: ActivatedRoute, 
                private chatRoomService: ChatRoomService,
                private authService: AuthService) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.authService.currentUser$.subscribe(user => {
                this.currentUser = user;
            })
        );
        this.chatRoomId = this.route.snapshot.paramMap.get('id')!;

        // Polling pour rafraîchir les messages toutes les secondes (utile pour quand les autres usagers envoient des messages,
        //  afin de les voir)
        // Note: This is a simple polling mechanism. For a real-time chat application,
        //  consider using WebSockets or Server-Sent Events (SSE) for better performance and user experience.
        interval(1000).subscribe(() => {
            this.chatRoomService.loadMessages(this.chatRoomId);
        });
        this.messages$ = this.chatRoomService.messages$;
        console.log('Current User in JoinChatRoom:', this.currentUser);
        console.log('Chat Room ID:', this.chatRoomId);
        console.log('Messages Observable:', this.messages$);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    sendMessage(): void {
      if (this.message.trim()) {
        this.subscriptions.push(
          this.chatRoomService.sendMessage(this.chatRoomId, this.message).subscribe({
            next: () => {
              this.message = '';
            },
            error: (err) => {
              console.error('Failed to send message', err);
            }
          })
        );
      }
    }
}
