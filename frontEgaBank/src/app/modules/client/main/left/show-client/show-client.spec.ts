import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowClient } from './show-client';

describe('ShowClient', () => {
  let component: ShowClient;
  let fixture: ComponentFixture<ShowClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
