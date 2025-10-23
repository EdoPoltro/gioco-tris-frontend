import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocketService } from '../../services/socket-service';
import { Router } from '@angular/router';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-join-game',
  standalone: false,
  templateUrl: './join-game.html',
  styleUrl: './join-game.css'
})
export class JoinGame implements OnInit, OnDestroy{

  private startGameListener!: (game: Game) => void;
  private joinStatusListener!: (status: {success: Boolean, description: String}) => void;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private socketService: SocketService,
    private router: Router,
  ){}

  ngOnInit(){
    const sixDigitPattern = /^\d{6}$/;

    this.form = this.fb.group({
      gameCode: ['', [
          Validators.required,
          Validators.pattern(sixDigitPattern),
        ]
      ]
    });

    this.joinStatusListener = (status: {success: Boolean, description: String}) => {
      if(!status.success){
        alert(status.description)
        this.form.reset();
      }
    }; 

    this.startGameListener = (game: Game) => {
      console.log(game);
      this.socketService.setGame(game);
      this.socketService.setPlayerNumber('2');
      this.router.navigate(['/game',game.gameCode]);
    };
    
    this.socketService.listenJoinStatus(this.joinStatusListener);

    this.socketService.listentStartGame(this.startGameListener);
  }

  ngOnDestroy() {
    this.socketService.offJoinStatus(this.joinStatusListener);
    
    this.socketService.offStartGame(this.startGameListener);
  }

  onSubmit(){
    this.socketService.sendJoinGame(this.form.value.gameCode);
  }

}
