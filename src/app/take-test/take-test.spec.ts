import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TakeTest } from './take-test';

describe('TakeTest', () => {
  let component: TakeTest;
  let fixture: ComponentFixture<TakeTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakeTest],
    }).compileComponents();

    fixture = TestBed.createComponent(TakeTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
