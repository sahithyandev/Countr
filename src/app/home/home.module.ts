import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router'

import { IonicModule } from '@ionic/angular'

import { HomePage } from './home.page'

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
        { path: 'countdowns', loadChildren: './countdowns/countdowns.module#CountdownsPageModule' },
        { path: 'notes', loadChildren: './notes/notes.module#NotesPageModule' },
      ]
  },
  {
    path: '',
    redirectTo: 'home/countdowns',
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
