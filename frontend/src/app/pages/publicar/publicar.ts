import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-publicar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publicar.html',
  styleUrl: './publicar.css'
})
export class Publicar {
  publicarForm: FormGroup;
  selectedImage?: File;
  errorMsg: string = '';
  successMsg: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.publicarForm = this.fb.group({
      titulo: ['', Validators.required],
      mensaje: ['', Validators.required],
      imagen: [null]
    });
  }

  onFileChange(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onSubmit() {
    if (this.publicarForm.invalid) return;

    const formData = new FormData();
    formData.append('titulo', this.publicarForm.get('titulo')?.value);
    formData.append('mensaje', this.publicarForm.get('mensaje')?.value);

    if (this.selectedImage) {
      formData.append('imagen', this.selectedImage);
    }

    this.http.post(`${environment.apiUrl}publicaciones`, formData).subscribe({
      next: () => {
        this.successMsg = '¡Publicación creada con éxito!';
        this.router.navigate(['/publicaciones']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al publicar';
      }
    });
  }
}