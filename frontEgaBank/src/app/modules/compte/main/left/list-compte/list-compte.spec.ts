import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCompte } from './list-compte';

describe('ListCompte', () => {
  let component: ListCompte;
  let fixture: ComponentFixture<ListCompte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCompte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCompte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
