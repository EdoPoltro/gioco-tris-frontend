import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { CreateGame } from './components/create-game/create-game';
import { JoinGame } from './components/join-game/join-game';
import { Test } from './components/test/test';
import { GameBoard } from './components/game-board/game-board';

const routes: Routes = [
  { path: "", component: Home },
  { path: "create-game", component: CreateGame },
  { path: "join-game", component: JoinGame },
  { path: "game/:codeGame", component: GameBoard },
  { path: "test", component: Test },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
