import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { exercises } from '../tab2/exercise-functions2';
import { any, string } from '@tensorflow/tfjs-core';
import { state } from '@angular/animations';

@Component({
  selector: 'app-exercise-selection',
  templateUrl: './exercise-selection.page.html',
  styleUrls: ['./exercise-selection.page.scss'],
})
export class ExerciseSelectionPage implements OnInit {
  allExercises!: any[];

  constructor(private router: Router) {
    this.allExercises = Object.keys(exercises);
  }

  ngOnInit() {
  }

  selectExercise(exercise: string) {
    //console.log(this.selectExercise);
    
    this.router.navigate(['tabs/tab2'], { state: { selectExercise: exercise } });
  }
}
