import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosDashboard } from './usuarios-dashboard';

describe('UsuariosDashboard', () => {
  let component: UsuariosDashboard;
  let fixture: ComponentFixture<UsuariosDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
