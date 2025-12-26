import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateCompte } from './state-compte';

describe('StateCompte', () => {
  let component: StateCompte;
  let fixture: ComponentFixture<StateCompte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateCompte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StateCompte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
