import { Component } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { exercises } from '../tab2/exercise-functions2';

@Component({
  selector: 'app-exercise-selection',
  templateUrl: './exercise-selection.page.html',
  styleUrls: ['./exercise-selection.page.scss'],
})
export class ExerciseSelectionPage  {
  allExercises!: any[];

  constructor(private router: Router) {
    this.allExercises = Object.keys(exercises).map((exercise) => ({
      name: exercise,
      image: exercises[exercise].image,
    }));
    console.log(this.allExercises);
  }

  selectExercise(exercise: string) {
    this.router.navigate(['tabs/tab2'], { queryParams: { selectExercise: exercise } });
  }
}
