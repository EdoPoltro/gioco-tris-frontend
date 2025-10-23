import { Component, OnInit } from '@angular/core';
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
export class JoinGame implements OnInit{

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
          Validators.pattern(sixDigitPattern)
        ]
      ]
    });

    this.socketService.listenJoinStatus((msg: any) => { // ha success e description
      if(!msg.success){
        alert(msg.description)
        this.form.reset();
      }
    });
    this.socketService.listentStartGame((game: Game) => {
      console.log(game);
      this.socketService.setGame(game);
      this.socketService.setPlayerNumber('2');
      this.router.navigate(['/game',game.gameCode]);
    });
  }

  onSubmit(){
    this.socketService.sendJoinGame(this.form.value.gameCode);
  }

}
