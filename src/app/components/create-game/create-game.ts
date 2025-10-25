import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket-service';
import { Router } from '@angular/router';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-create-game',
  standalone: false,
  templateUrl: './create-game.html',
  styleUrl: './create-game.css'
})
export class CreateGame implements OnInit, OnDestroy{

  private startGameListener!: (game: Game) => void;
  private codeGameListener!: (gameCode: string) => void;
  gameCode: string = '';

  constructor(
    private socketService: SocketService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ){}

  ngOnInit() {
    this.socketService.sendCreateGame();

    this.codeGameListener = (gameCode: string) => {
      console.log(gameCode)
      this.gameCode = gameCode;
      this.cdr.detectChanges();
    };

    const startGameListener = (game: Game) => {
      // console.log(game);
      this.socketService.setLocalStorage(game.gameCode, '1');
      this.router.navigate(['/game',game.gameCode]);
    };

    this.socketService.listenCodeGame(this.codeGameListener);

    this.socketService.listentStartGame(startGameListener);
  }

  ngOnDestroy() {
    this.socketService.resetCreateGame();

    this.socketService.offCodeGame(this.codeGameListener);

    this.socketService.offStartGame(this.startGameListener);
  }

}
