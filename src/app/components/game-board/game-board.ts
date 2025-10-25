import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Game } from '../../models/game.model';
import { SocketService } from '../../services/socket-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-board',
  standalone: false,
  templateUrl: './game-board.html',
  styleUrl: './game-board.css'
})
export class GameBoard implements OnInit, OnDestroy{
  
  private updateGameListener!: (game: Game) => void;
  private endGameListener!: (winner: string) => void; 
  private reconnectGameListener!: (game: Game) => void;
  game!: Game;
  playerNumber!: string;

  constructor(
    private socketService: SocketService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ){}

  ngOnInit(){
    const gameCode = localStorage.getItem('game-code');
    const playerNumber = localStorage.getItem('player-number');

    if(!gameCode || !playerNumber)
      this.router.navigate(['/']);
    else{
      this.playerNumber = playerNumber;

      this.socketService.sendReconnectGame(gameCode, playerNumber);

      this.reconnectGameListener = (game: Game) => {
        this.game = game;
        this.cdr.detectChanges();
      }

      this.socketService.listenReconnectGame(this.reconnectGameListener);
    }

    this.updateGameListener = (game: Game) => {
      console.log("change detected");
      this.game = game;
      this.cdr.detectChanges();
    };

    this.endGameListener = (winner: string) => {
      alert("Il vincitore e' " + winner);
      this.socketService.removeLocalStorage();
    };

    this.socketService.listenUpdateGame(this.updateGameListener);

    this.socketService.listenEndGame(this.endGameListener);
  }

  ngOnDestroy() {
    this.socketService.offReconnectGame(this.reconnectGameListener);

    this.socketService.offUpdateGame(this.updateGameListener);

    this.socketService.offEndGame(this.endGameListener);
  }
  
  makeMove(i: number, j: number){
    const activeQuadrant = this.game.activeQuadrant;

    if (this.playerNumber === this.game.currentPlayer && this.game.board[i].dial[j] === '' && (activeQuadrant == null || activeQuadrant == i) && this.game.board[i].winner == '')
      this.socketService.sendUpdateGame(i, j, this.game.gameCode);
  }
}
