import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QRProfePage } from './qrprofe.page';

describe('QRProfePage', () => {
  let component: QRProfePage;
  let fixture: ComponentFixture<QRProfePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(QRProfePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
