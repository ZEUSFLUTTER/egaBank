import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCompte } from './form-compte';

describe('FormCompte', () => {
  let component: FormCompte;
  let fixture: ComponentFixture<FormCompte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCompte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCompte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
