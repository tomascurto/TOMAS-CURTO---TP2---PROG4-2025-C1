import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexXAxis } from 'ng-apexcharts';
import { EstadisticasService } from '../../services/estadisticas.service';

@Component({
  standalone: true,
  selector: 'app-dashboard-estadisticas',
  imports: [CommonModule, ReactiveFormsModule, NgApexchartsModule],
  templateUrl: './dashboard-estadisticas.html',
  styleUrls: ['./dashboard-estadisticas.css']
})
export class DashboardEstadisticas {
  private estadisticasService = inject(EstadisticasService);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    desde: [this.fechaActual()],
    hasta: [this.fechaActual()],
  });

  usuariosSeries = signal<ApexAxisChartSeries>([]);
  usuariosChart = signal<ApexChart>({ type: 'bar', height: 350 });
  usuariosXAxis = signal<ApexXAxis>({ categories: [] });

  comentariosSeries = signal<ApexAxisChartSeries>([]);
  comentariosChart = signal<ApexChart>({ type: 'bar', height: 350 });
  comentariosXAxis = signal<ApexXAxis>({ categories: [] });

  totalComentarios = signal<number | null>(null);

  cargar() {
    const { desde, hasta } = this.form.value;

    this.estadisticasService.publicacionesPorUsuario(desde, hasta).subscribe((data) => {
      this.usuariosSeries.set([{ name: 'Publicaciones', data: data.map((d) => d.cantidad) }]);
      this.usuariosXAxis.set({ categories: data.map((d) => d.usuario) });
    });

    this.estadisticasService.totalComentarios(desde, hasta).subscribe((res) => {
      this.totalComentarios.set(res.cantidad);
    });

    this.estadisticasService.comentariosPorPublicacion(desde, hasta).subscribe((data) => {
      this.comentariosSeries.set([{ name: 'Comentarios', data: data.map((d) => d.cantidad) }]);
      this.comentariosXAxis.set({ categories: data.map((d) => d.publicacion) });
    });
  }

  private fechaActual(): string {
    return new Date().toISOString().split('T')[0];
  }
}