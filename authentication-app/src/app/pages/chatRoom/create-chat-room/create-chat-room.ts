import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatRoomService } from '../../../services/chat-room-service';
import { EMPTY, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-chat-room',
  imports: [ReactiveFormsModule],
  templateUrl: './create-chat-room.html',
  styleUrl: './create-chat-room.scss',
})
export class CreateChatRoom implements OnInit, OnDestroy{
  subscriptions: Subscription[] = [];
  form!: FormGroup;

  constructor(private chatRoomService: ChatRoomService, private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  get name() {
    return this.form.get('name');
  }

  createChatRoom(): void {
    const { name, description } = this.form.value;
    this.subscriptions.push(this.chatRoomService.createChatRoom(name, description).subscribe({
      next: () => {
        this.router.navigate(['/chat-rooms']);
      },
      error: (err) => {
        if (err.status === 409) {
          this.form.get('name')?.setErrors({ conflict: 'Un salon de discussion avec ce nom existe déjà.' });
          return;
        }
        console.error('Failed to create chat room', err);
        // Handle error (e.g., show an error message)
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
