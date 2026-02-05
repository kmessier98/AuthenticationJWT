import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { form } from '@angular/forms/signals';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      user: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get isFormInvalid(): boolean {
    return this.loginForm.invalid;
  }

  get user() {
    return this.loginForm.get('user');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (!this.isFormInvalid) {
      //TODO call api. if response (token) is null, then show error message

      //TODO ne pas permettre de spam cliks sur le bouton submit
      //jai reussi a créer 2 user en spam clikant avec le meme nom
      const formData = this.loginForm.value;
      this.authService.login(formData.user, formData.password).subscribe({
        next: (token) => {
          console.log('Login successful, token:', token);
          this.router.navigate(['/accueil']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        },
      });
    }
  }
}
