import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Game } from '../../models/game.model';
import { SocketService } from '../../services/socket-service';

@Component({
  selector: 'app-game-board',
  standalone: false,
  templateUrl: './game-board.html',
  styleUrl: './game-board.css'
})
export class GameBoard implements OnInit{

  game!: Game;

  constructor(
    private socketService: SocketService,
    private cdr: ChangeDetectorRef,
  ){}

  ngOnInit(){
    this.game = this.socketService.getGame();

    this.socketService.listenUpdateGame((game: Game) => {
      console.log("change detected");
      this.game = game;
      this.cdr.detectChanges();
    });

    this.socketService.listenEndGame((winner: string) => {
      alert("Il vincitore e' " + winner);
    });

  }
  
  makeMove(i: number, j: number){
    const currentPlayer = this.socketService.getPlayerNumber();
    const activeQuadrant = this.game.activeQuadrant;
    if (currentPlayer === this.game.currentPlayer && this.game.board[i].dial[j] === '' && (activeQuadrant == null || activeQuadrant == i) && this.game.board[i].winner == '')
      this.socketService.sendUpdateGame(i, j);
  }
}
