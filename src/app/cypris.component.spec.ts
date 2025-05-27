import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Cypris } from './cypris.component';
import { provideHttpClient } from '@angular/common/http';

describe('Cypris', () => {
  let component: Cypris;
  let fixture: ComponentFixture<Cypris>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cypris],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cypris);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Grouping validation
  it('should evaluate grouping [drone AND (package OR delivery)] as valid', () => {
    expect(component.isGroupingValid('drone AND (package OR delivery)')).toBeTrue();
  });

  it('should evaluate grouping [drone AND (package OR delivery) AND (plane OR boat)] as valid', () => {
    expect(component.isGroupingValid('drone AND (package OR delivery) AND (plane OR boat)')).toBeTrue();
  });

  it('should evaluate grouping [drone AND (package OR (delivery AND (plane OR boat)))] as valid', () => {
    expect(component.isGroupingValid('drone AND (package OR (delivery AND (plane OR boat)))')).toBeTrue();
  });

  it('should evaluate grouping [drone AND (package OR delivery] as invalid', () => {
    expect(component.isGroupingValid('drone AND (package OR delivery')).toBeFalse();
  });

  it('should evaluate grouping [drone AND package OR delivery)] as invalid', () => {
    expect(component.isGroupingValid('drone AND package OR delivery)')).toBeFalse();
  });

  it('should evaluate grouping [drone AND (package OR (delivery AND plane)] as invalid', () => {
    expect(component.isGroupingValid('drone AND (package OR (delivery AND plane)')).toBeFalse();
  });

  it('should evaluate grouping [drone AND (package OR delivery) AND plane)] as invalid', () => {
    expect(component.isGroupingValid('drone AND (package OR delivery) AND plane)')).toBeFalse();
  });

});
