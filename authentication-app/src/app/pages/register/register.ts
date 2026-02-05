import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { passwordMatchValidator } from '../../utils/functions';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register implements OnInit, OnDestroy {
  profileForm!: FormGroup;
  roles: Role[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.getUserRoles().subscribe((roles) => {
        this.roles = roles;
        this.profileForm = this.fb.group(
          {
            userName: ['', [Validators.required, Validators.minLength(3)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            role: [this.roles[0].value, Validators.required],
          },
          { validators: passwordMatchValidator },
        );
      }),
    );
  }

  get isFormInvalid(): boolean {
    return this.profileForm.invalid;
  }

  get userName() {
    return this.profileForm.get('userName');
  }

  get password() {
    return this.profileForm.get('password');
  }

  get role() {
    return this.profileForm.get('role');
  }

  get confirmPassword() {
    return this.profileForm.get('confirmPassword');
  }

  onSubmit(): void {
    if (!this.isFormInvalid) {
      // const formData = {   // Ne pas utiliser, car je ne veux pas envoyer le confirmPassword au backend
      //  ...this.profileForm.value
      // AutreValue: this.AutreValue
      // };
      // ou bien
      // const formData = this.profileForm.value); // Ne pas utiliser, car je ne veux pas envoyer le confirmPassword au backend

      // formData without confirmPassword
      const { confirmPassword, ...formData } = this.profileForm.value;

      //TODO ne pas permettre de spam cliks sur le bouton submit
      this.subscriptions.push(
        this.authService.register(formData).subscribe({
          next: (response) => {
            //TODO rediriger vers login
            console.log('Registration successful:', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            //TODO catch le conflict d'utilisateur existant et afficher un message d'erreur approprié
            console.error('Registration failed:', error);
          },
        }),
      );
    } else {
      console.log('Form is invalid');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
