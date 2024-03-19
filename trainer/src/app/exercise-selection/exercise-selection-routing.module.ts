import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExerciseSelectionPage } from './exercise-selection.page';

const routes: Routes = [
  {
    path: '',
    component: ExerciseSelectionPage
  },
  {
    path: 'tabs/tab2',
    loadChildren: () => import('../tab2/tab2.module').then( m => m.Tab2PageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExerciseSelectionPageRoutingModule {}
