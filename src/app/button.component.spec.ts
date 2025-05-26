import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonDemo } from './button.component';
import { provideHttpClient } from '@angular/common/http';

describe('ButtonDemo', () => {
  let component: ButtonDemo;
  let fixture: ComponentFixture<ButtonDemo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonDemo],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonDemo);
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
