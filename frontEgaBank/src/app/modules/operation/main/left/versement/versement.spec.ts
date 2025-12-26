import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Versement } from './versement';

describe('Versement', () => {
  let component: Versement;
  let fixture: ComponentFixture<Versement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Versement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Versement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
