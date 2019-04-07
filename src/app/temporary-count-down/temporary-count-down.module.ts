import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TemporaryCountDownPage } from './temporary-count-down.page';

const routes: Routes = [
  {
    path: '',
    component: TemporaryCountDownPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TemporaryCountDownPage]
})
export class TemporaryCountDownPageModule {}
