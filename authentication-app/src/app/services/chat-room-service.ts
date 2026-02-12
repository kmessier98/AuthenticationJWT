import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { ChatRoomDTO } from '../Models/chatRoom/chat-room.dto';
import { MessageDTO } from '../Models/chatRoom/message.dto';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  apiUrl = 'https://localhost:7125/api/chatroom'; 
  private readonly chatRoomsSubjects = new BehaviorSubject<ChatRoomDTO[]>([]);
  private readonly messagesSubject = new BehaviorSubject<MessageDTO[]>([]);
  chatRooms$ = this.chatRoomsSubjects.asObservable();
  messages$ = this.messagesSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  loadChatRooms(): void {
    this.http.get<ChatRoomDTO[]>(this.apiUrl).subscribe({
      next: (chatRooms) => this.chatRoomsSubjects.next(chatRooms),
      error: (err) => console.error('Failed to load chat rooms', err)
    });
  }

  createChatRoom(name: string, description: string): Observable<void> {
    return this.http.post<ChatRoomDTO>(this.apiUrl, { name, description }).pipe(
      map((newChatRoom) => {
        const updatedChatRooms = [...this.chatRoomsSubjects.value, newChatRoom];
        this.chatRoomsSubjects.next(updatedChatRooms);
      }),
    );
  }

  deleteChatRoom(chatRoomId: number): void {
    this.http.delete(`${this.apiUrl}/${chatRoomId}`).subscribe({
      next: () => {
        const updatedChatRooms = this.chatRoomsSubjects.value.filter(cr => cr.id !== chatRoomId);
        this.chatRoomsSubjects.next(updatedChatRooms);
      },
      error: (err) => console.error('Failed to delete chat room', err)
    });
  }

  loadMessages(chatRoomId: string): void {
    this.http.get<any>(`${this.apiUrl}/${chatRoomId}`).subscribe({
      next: (chatRoom) => {
        const messages = chatRoom.messages as MessageDTO[];
        console.log('Loaded messages:', messages);
        this.messagesSubject.next(messages);
      },
      error: (err) => console.error('Failed to load messages', err)
    });
  }

  sendMessage(chatRoomId: string, content: string): Observable<void> {
    return this.http.post<MessageDTO>(`${this.apiUrl}/${chatRoomId}/messages`, { content }).pipe(
      map((newMessage) => {
        const updatedMessages = [...this.messagesSubject.value, newMessage];
        this.messagesSubject.next(updatedMessages);
      }),
      catchError((err) => {
        console.error('Failed to send message', err);
        throw err;
      })
    );
  }
}
