import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaAsistenciaPage } from './vista-asistencia.page';

describe('VistaAsistenciaPage', () => {
  let component: VistaAsistenciaPage;
  let fixture: ComponentFixture<VistaAsistenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaAsistenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
