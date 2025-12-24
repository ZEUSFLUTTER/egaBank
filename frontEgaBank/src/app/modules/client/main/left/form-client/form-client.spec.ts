import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormClient } from './form-client';

describe('FormClient', () => {
  let component: FormClient;
  let fixture: ComponentFixture<FormClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
