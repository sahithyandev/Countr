import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CategoryCountdownsPage } from './category-countdowns.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryCountdownsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CategoryCountdownsPage]
})
export class CategoryCountdownsPageModule {}
