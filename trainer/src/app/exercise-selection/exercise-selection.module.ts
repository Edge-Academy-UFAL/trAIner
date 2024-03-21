import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExerciseSelectionPageRoutingModule } from './exercise-selection-routing.module';

import { ExerciseSelectionPage } from './exercise-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExerciseSelectionPageRoutingModule,
  ],
  declarations: [ExerciseSelectionPage],
})
export class ExerciseSelectionPageModule {}
