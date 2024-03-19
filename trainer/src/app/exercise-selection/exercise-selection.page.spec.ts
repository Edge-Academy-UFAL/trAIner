import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseSelectionPage } from './exercise-selection.page';

describe('ExerciseSelectionPage', () => {
  let component: ExerciseSelectionPage;
  let fixture: ComponentFixture<ExerciseSelectionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ExerciseSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
