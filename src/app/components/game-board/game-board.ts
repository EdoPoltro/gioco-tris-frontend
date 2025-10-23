import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../../models/game.model';
import { SocketService } from '../../services/socket-service';

@Component({
  selector: 'app-game-board',
  standalone: false,
  templateUrl: './game-board.html',
  styleUrl: './game-board.css'
})
export class GameBoard implements OnInit, OnDestroy{
  
  private updateGameListener!: (game: Game) => void;
  private endGameListener!: (winner: string) => void; 
  game!: Game;

  constructor(
    private socketService: SocketService,
    private cdr: ChangeDetectorRef,
  ){}

  ngOnInit(){
    this.game = this.socketService.getGame();

    this.updateGameListener = (game: Game) => {
      console.log("change detected");
      this.game = game;
      this.socketService.setGame(game);
      this.cdr.detectChanges();
    };

    this.endGameListener = (winner: string) => {
      alert("Il vincitore e' " + winner);
    };

    this.socketService.listenUpdateGame(this.updateGameListener);

    this.socketService.listenEndGame(this.endGameListener);
  }

  ngOnDestroy() {
    this.socketService.offUpdateGame(this.updateGameListener);

    this.socketService.offEndGame(this.endGameListener);
  }
  
  makeMove(i: number, j: number){
    const currentPlayer = this.socketService.getPlayerNumber();
    
    const activeQuadrant = this.game.activeQuadrant;

    if (currentPlayer === this.game.currentPlayer && this.game.board[i].dial[j] === '' && (activeQuadrant == null || activeQuadrant == i) && this.game.board[i].winner == '')
      this.socketService.sendUpdateGame(i, j);
  }
}
