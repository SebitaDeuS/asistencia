import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaQrPage } from './vista-qr.page';

describe('VistaQrPage', () => {
  let component: VistaQrPage;
  let fixture: ComponentFixture<VistaQrPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
