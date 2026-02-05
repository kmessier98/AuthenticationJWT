import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { passwordMatchValidator } from '../../utils/functions';
import { Observable } from 'rxjs';

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
export class Register implements OnInit {
  profileForm!: FormGroup;
  roles: Role[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserRoles().subscribe((roles) => {
      this.roles = roles;
      this.profileForm = this.fb.group(
        {
          userName: ['', [Validators.required, Validators.minLength(3)]],
          password: ['', [Validators.required, Validators.minLength(6)]],
          confirmPassword: ['', Validators.required],
          role: [this.roles[0].value, Validators.required]
        },
        { validators: passwordMatchValidator }
      );
    });   
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
      // Ne pas utiliser, car je ne veux pas envoyer le confirmPassword au backend
      // const formData = {
      //  ...this.profileForm.value
      // };

      // formData without confirmPassword
      const { confirmPassword, ...formData } = this.profileForm.value;

      console.log('Form Data Submitted: ', formData);
    } else {
      console.log('Form is invalid');
    }
  }
}
