import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicacionesBajas } from './publicaciones-bajas';

describe('PublicacionesBajas', () => {
  let component: PublicacionesBajas;
  let fixture: ComponentFixture<PublicacionesBajas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionesBajas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicacionesBajas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
