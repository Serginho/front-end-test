import {NgModule} from '@angular/core';
import {SelectorComponent} from './selector.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  exports: [SelectorComponent],
  declarations: [SelectorComponent],
  providers: [],
})
export class SelectorModule {
}
