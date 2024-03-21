import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExerciseSelectionPage } from './exercise-selection.page';

const routes: Routes = [
  {
    path: '',
    component: ExerciseSelectionPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseSelectionPageRoutingModule {}
