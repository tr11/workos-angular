import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthKitComponent } from './auth-kit.component';

describe('AuthKitComponent', () => {
  let component: AuthKitComponent;
  let fixture: ComponentFixture<AuthKitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthKitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
