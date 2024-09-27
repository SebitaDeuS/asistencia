import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaOlvideContrasenniaPage } from './vista-olvide-contrasennia.page';

describe('VistaOlvideContrasenniaPage', () => {
  let component: VistaOlvideContrasenniaPage;
  let fixture: ComponentFixture<VistaOlvideContrasenniaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaOlvideContrasenniaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
