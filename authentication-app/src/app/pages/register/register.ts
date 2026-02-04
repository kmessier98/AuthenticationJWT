import { Component } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  selectedRole = new FormControl('User');
}
