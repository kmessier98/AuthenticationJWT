import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { catchError, EMPTY, exhaustMap, finalize, map, Observable, Subject, Subscription, tap } from 'rxjs';
import { CurrentUser } from '../../Models/auth/current-user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profil',
  imports: [ReactiveFormsModule],
  templateUrl: './profil.html',
  styleUrl: './profil.scss',
})
export class Profil implements OnInit, OnDestroy {
  private submit$ = new Subject<void>();
  currentUser: CurrentUser | null = null;
  profileForm!: FormGroup;
  roles: any[] = [];
  isSubmitting = false; 
  subscriptions: Subscription[] = [];
  showSuccessMessage = false;

  constructor(private authService: AuthService, private fb: FormBuilder, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subscriptions.push(this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.initializeForm();
      this.listenToSubmit();
    }));
  }

  get username() {
    return this.profileForm.get('username');
  }

  get role() {
    return this.profileForm.get('role');
  }

  get isFormInvalid(): boolean {
    return this.profileForm.invalid;
  }

  private initializeForm(): void {
    this.authService.getUserRoles().subscribe((roles) => {
      this.roles = roles;
      this.profileForm = this.fb.group(
        {
          username: [this.currentUser?.username, [Validators.required, Validators.minLength(3)]],
          role: [this.currentUser?.role, Validators.required],
        }
      );
    });
  }

  private listenToSubmit(): void {
    this.submit$
      .pipe(
        tap(() => { this.isSubmitting = true; this.showSuccessMessage = false; }),
        exhaustMap(() => {     
          const formData = {id: this.currentUser?.id, ...this.profileForm.value};   
          return this.authService.updateUserProfile(formData).pipe(
            finalize(() => { 
              this.isSubmitting = false;
              this.cdr.markForCheck();
            }),
            catchError(error => {
              if (error.status === 400) {
                this.profileForm.setErrors({ serverError: error.error.message || 'Une erreur est survenue lors de la mise à jour du profil.' });
              } 
              else if (error.status === 404) {
                this.profileForm.setErrors({ serverError: 'Utilisateur non trouvé. Veuillez réessayer.' });
              }
              else if (error.status === 409) {
                this.profileForm.setErrors({ serverError: 'Le nom d\'utilisateur est déjà pris. Veuillez en choisir un autre.' });
              }
              else { 
                this.profileForm.setErrors({ serverError: 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.' });
              }

              return EMPTY;  // 👈 retourne un Observable vide, donc le subscribe ne tombe pas en erreur
            })
          );
        }),   
      )
      .subscribe(response => {
        console.log('Profile updated successfully', response);
        this.showSuccessMessage = true;
      });
  }

  onSubmit(): void {  
    if (!this.isFormInvalid) {
      this.submit$.next();
    } 
    else {
      this.profileForm.markAllAsTouched();  
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.submit$.complete();
  }
}
