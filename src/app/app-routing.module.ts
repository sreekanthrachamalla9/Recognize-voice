import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoiceInputComponent } from './voice-input/voice-input.component';

const routes: Routes = [
 { path: '', redirectTo: 'voice-input', pathMatch: 'full' },
  { path: 'voice-input', component: VoiceInputComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
