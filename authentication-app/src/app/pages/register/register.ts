import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { passwordMatchValidator } from '../../utils/functions';
import { catchError, EMPTY, exhaustMap, finalize, Subject, Subscription, tap } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

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
  // Propriétés publique
  isSubmitting = false;
  profileForm!: FormGroup;
  roles: Role[] = [];
  subscriptions: Subscription[] = [];

  // Propriétés privée
  private submit$ = new Subject<void>();

  // Constructeur
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  // Méthodes du cycle de vie
  ngOnInit(): void {
    this.initializeForm();
    this.listenToSubmit();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.submit$.complete();
  }

  // Getters
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

  // Méthodes publiques
  onSubmit(): void {
    if (!this.isFormInvalid) {
      this.submit$.next();
    } else {
      console.log('Form is invalid');
    }
  }

  // Méthodes privées
  private initializeForm(): void {
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

  // Ecoute les soumissions de formulaire pour gérer l'état d'envoi et les appels au service d'authentification
  // en évitant les soumissions multiples (exhaustMap)
  private listenToSubmit(): void {
    this.submit$
      .pipe(
        exhaustMap(() => {
          this.isSubmitting = true;
          // Exclude confirmPassword from the form data
          const { confirmPassword, ...formData } = this.profileForm.value;

          return this.authService.register(formData).pipe(
            //Succès uniquement
            tap(() => {
              // debugger; // Aide a comprendre le flux d'execution
              this.router.navigate(['/login']);
            }),

            //Gestion des erreurs
            catchError((error) => {
              // debugger; // Aide a comprendre le flux d'execution
              if (error.status === 409) {
                this.profileForm.setErrors({ serverError: "Nom d'utilisateur déjà pris." });
                return EMPTY; // ne pas propager d"erreur
              }

              console.error('Registration failed:', error);
              return EMPTY; // ne pas propager d"erreur
            }),

            finalize(() => {
              //debugger; // Aide a comprendre le flux d'execution
              this.isSubmitting = false;
            }),
          );
        }),
      )
      .subscribe();
  }
}
