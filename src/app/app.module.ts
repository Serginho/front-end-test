import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HeaderModule} from './header/header.module';
import {BoxComponent} from './shared/box/box.component';
import {SelectorModule} from './selector/selector.module';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    BoxComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HeaderModule,
    SelectorModule,
    ReactiveFormsModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

