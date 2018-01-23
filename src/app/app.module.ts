import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import {  HttpClientModule } from '@angular/common/http';
import { MessageService } from './message.service';

import { AppComponent } from './app.component';
import { WordSpellComponent } from './word-spell/word-spell.component';
import { WordService } from './word.service';
import { RewardsComponent } from './rewards/rewards.component';

@NgModule({
  declarations: [
    AppComponent,
    WordSpellComponent,
    RewardsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
  	BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [WordService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
