import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPlate } from './authPlate';

describe('AuthPlate', () => {
  let component: AuthPlate;
  let fixture: ComponentFixture<AuthPlate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPlate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthPlate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
