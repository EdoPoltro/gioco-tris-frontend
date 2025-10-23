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

  gameCode = "";

  constructor(
    private socketService: SocketService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ){}

  ngOnInit() {
    this.socketService.sendCreateGame();

    this.socketService.listenCodeGame((gameCode: string) => {
      console.log(gameCode)
      this.gameCode = gameCode;
      this.cdr.detectChanges();
    });

    this.socketService.listentStartGame((game: Game) => {
      console.log(game);
      this.socketService.setGame(game);
      this.socketService.setPlayerNumber('1');
      this.router.navigate(['/game',game.gameCode]);
    });
  }

  ngOnDestroy() {
    this.socketService.resetCreateGame()
  }

}
