import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaQuincenarioComponent } from './lista-quincenario.component';

describe('ListaQuincenarioComponent', () => {
  let component: ListaQuincenarioComponent;
  let fixture: ComponentFixture<ListaQuincenarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaQuincenarioComponent]
    });
    fixture = TestBed.createComponent(ListaQuincenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
