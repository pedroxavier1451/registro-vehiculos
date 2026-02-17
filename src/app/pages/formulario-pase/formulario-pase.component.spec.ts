import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPaseComponent } from './formulario-pase.component';

describe('FormularioPaseComponent', () => {
  let component: FormularioPaseComponent;
  let fixture: ComponentFixture<FormularioPaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormularioPaseComponent]
    });
    fixture = TestBed.createComponent(FormularioPaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
