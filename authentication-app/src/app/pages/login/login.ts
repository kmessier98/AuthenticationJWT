import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  subscriptions: Subscription[] = [];
  isSubmitting = false; 

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
    if (this.isSubmitting) return; // Prevent multiple submissions
                                   // Moins clean que l'utilisation de exhaustMap mais fonctionne correctement
    
    if (!this.isFormInvalid) {
      this.isSubmitting = true;
      const formData = this.loginForm.value;
      this.subscriptions.push(
        this.authService.login(formData.user, formData.password).subscribe({
          next: (token) => {
            console.log('Login successful, token:', token);
            //TODO save token in Local Storage
            this.isSubmitting = false;
            this.router.navigate(['/accueil']);
          },
          error: (error) => {
            if (error.status === 401) {
              this.loginForm.setErrors({
                serverError: "Nom d'utilisateur ou mot de passe incorrect.",
              });
              this.isSubmitting = false;
              return;
            }
          },
          complete: () => {
            this.isSubmitting = false;
          }
        }),
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
