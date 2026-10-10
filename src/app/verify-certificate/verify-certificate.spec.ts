import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerifyCertificate } from './verify-certificate';

describe('VerifyCertificate', () => {
  let component: VerifyCertificate;
  let fixture: ComponentFixture<VerifyCertificate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyCertificate],
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyCertificate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
