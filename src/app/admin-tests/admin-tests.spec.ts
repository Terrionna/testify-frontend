import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminTests } from './admin-tests';

describe('AdminTests', () => {
  let component: AdminTests;
  let fixture: ComponentFixture<AdminTests>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTests],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminTests);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
