import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup} from '@angular/forms';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './registro.html'
})
export class registro {
  registerForm: FormGroup;
  selectedFile?: File;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      birthDate: ['', Validators.required],
      bio: [''],
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const formData = new FormData();
    Object.entries(this.registerForm.value).forEach(([key, value]) =>
      formData.append(key, String(value))
    );

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    this.authService.register(formData).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.errorMsg = err.error.message;
      }
    });
  }
}
