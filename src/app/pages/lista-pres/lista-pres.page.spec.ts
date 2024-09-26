import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaPresPage } from './lista-pres.page';

describe('ListaPresPage', () => {
  let component: ListaPresPage;
  let fixture: ComponentFixture<ListaPresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
