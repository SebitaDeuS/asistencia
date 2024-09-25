import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CodigoprofePage } from './codigoprofe.page';

describe('CodigoprofePage', () => {
  let component: CodigoprofePage;
  let fixture: ComponentFixture<CodigoprofePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CodigoprofePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
