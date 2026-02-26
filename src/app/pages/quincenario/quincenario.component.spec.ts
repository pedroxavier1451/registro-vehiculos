import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuincenarioComponent } from './quincenario.component';

describe('QuincenarioComponent', () => {
  let component: QuincenarioComponent;
  let fixture: ComponentFixture<QuincenarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuincenarioComponent]
    });
    fixture = TestBed.createComponent(QuincenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
