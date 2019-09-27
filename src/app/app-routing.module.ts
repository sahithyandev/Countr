import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePage } from './home/home.page';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  // { path: 'home/countdowns', loadChildren: './home/countdowns/countdowns.module#CountdownsPageModule' },
  // { path: 'home/notes', loadChildren: './home/notes/notes.module#NotesPageModule' },
  // { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  // { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  { path: 'edit', loadChildren: './edit/edit.module#EditPageModule' },
  { path: 'details', loadChildren: './details/details.module#DetailsPageModule' },
  { path: 'add', loadChildren: './add/add.module#AddPageModule' },
  { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackPageModule' },
  // { path: 'noInternet', loadChildren: './no-internet/no-internet.module#NoInternetPageModule' },
  { path: 'categories', loadChildren: './categories/categories.module#CategoriesPageModule' },
  { path: 'category-countdowns', loadChildren: './category-countdowns/category-countdowns.module#CategoryCountdownsPageModule' },
  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
