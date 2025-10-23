import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Home } from './components/home/home';
import { CreateGame } from './components/create-game/create-game';
import { JoinGame } from './components/join-game/join-game';
import { Test } from './components/test/test';
import { ReactiveFormsModule } from '@angular/forms';
import { GameBoard } from './components/game-board/game-board';

@NgModule({
  declarations: [
    App,
    Home,
    CreateGame,
    JoinGame,
    Test,
    GameBoard
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection()
  ],
  bootstrap: [App]
})
export class AppModule { }
