import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { ChatRoomDTO } from '../Models/chatRoom/chat-room.dto';
import { MessageDTO } from '../Models/chatRoom/message.dto';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  apiUrl = 'https://localhost:7125/api/chatroom'; 
    private hubConnection!: signalR.HubConnection;
  private readonly chatRoomsSubjects = new BehaviorSubject<ChatRoomDTO[]>([]);
  private readonly messagesSubject = new BehaviorSubject<MessageDTO[]>([]);
  chatRooms$ = this.chatRoomsSubjects.asObservable();
  messages$ = this.messagesSubject.asObservable();
  
  constructor(private http: HttpClient) {}

  // Initialise la connexion SignalR
  public startConnection(chatRoomId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7125/chathub?roomId=${chatRoomId}`) 
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('SignalR Error: ', err));

    // Écoute active : dès que le serveur parle, on met à jour la liste locale
    this.hubConnection.on('ReceiveMessage', (newMessage: MessageDTO) => {
      this.messagesSubject.next([...this.messagesSubject.value, newMessage]);
    });
  }

  public stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
    }
  }

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

  // Charge les messages 
  loadMessages(chatRoomId: string): void {
    this.http.get<any>(`${this.apiUrl}/${chatRoomId}`).subscribe({
      next: (chatRoom) => {
        const messages = chatRoom.messages as MessageDTO[];
        this.messagesSubject.next(messages);
      },
      error: (err) => console.error('Failed to load messages', err)
    });
  }

  sendMessage(chatRoomId: string, content: string): Observable<void> {
    // Les message sont mis a jour en temps réel via SignalR, donc ici on fait juste l'appel HTTP pour envoyer le message au serveur
    // Voir backend, on utilise le hub pour envoyer le message à tous les clients connectés, et le client reçoit le message via
    //  l'événement 'ReceiveMessage' du hub, qui met à jour la liste des messages affichés
    
    // Sinon sans signalR, voir la version commentée plus bas
    return this.http.post<void>(`${this.apiUrl}/${chatRoomId}/messages`, { content });
  }

  //Ancienne façon (sans le websocket signalR)
 /*  sendMessage(chatRoomId: string, content: string): Observable<void> {
    return this.http.post<MessageDTO>(`${this.apiUrl}/${chatRoomId}/messages`, { content })
    .pipe(
      map((newMessage) => {
        const updatedMessages = [...this.messagesSubject.value, newMessage];
        this.messagesSubject.next(updatedMessages);
      }),
      catchError((err) => {
        console.error('Failed to send message', err);
        throw err;
      })
    );
  } */
}
