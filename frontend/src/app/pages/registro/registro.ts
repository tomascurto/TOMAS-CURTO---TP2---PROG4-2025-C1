import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup} from '@angular/forms';
import { Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-registro',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class Registro {
  @Input() esAdmin: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  registerForm: FormGroup;
  selectedFile?: File;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('Login component loaded');
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

    if (this.esAdmin) {
      this.authService.register(formData).subscribe({
        next: () => {
          this.cerrar.emit(); 
        },
        error: (err) => {
          this.errorMsg = err.error?.message || 'Error al crear el usuario desde el panel admin';
        }
      });
    }
    else {
      this.authService.register(formData).subscribe({
        next: () => {
          const loginData = {
            usernameOrEmail: this.registerForm.value.username, 
            password: this.registerForm.value.password
          };

          this.authService.login(loginData).subscribe({
            next: (res) => {
              localStorage.setItem('token', res.token);
              this.router.navigate(['/publicaciones']);
            },
            error: (err) => {
              console.error('Error en login automático:', err);
              this.errorMsg = 'El registro fue exitoso pero no se pudo iniciar sesión.';
              this.router.navigate(['/login']);
            }
          });
        },
        error: (err) => {
          this.errorMsg = err.error.message;
        }
      });
    }
  }
}
