import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  private socket: Socket;
  private gameCreated = false;
  private game: Game = {
    // Campi Obbligatori: da riempire con valori iniziali validi
    gameCode: 'NEW_GAME',
    player1: 'Host',
    status: 'waiting', 
    date: new Date(),
    
    // Campi Opzionali: impostati su undefined o valori di default
    id: undefined, 
    player2: undefined,
    currentPlayer: '1',
    activeQuadrant: null,
    
    // Inizializzazione della Board 9x9 (Array di 9 oggetti)
    board: Array.from({ length: 9 }, () => ({
        // 'dial' (la sezione) è un array di 9 stringhe vuote
        dial: Array(9).fill("") as string[],
        // Nessun vincitore iniziale per la sezione
        winner: '' as '1' | '2' | '' | 'P', 
    })),
  };
  private playerNumber: '1' | '2' | '' = '';

  constructor() {
    this.socket = io('http://localhost:3000'); // da cambiare con il vero endpoint quando il server verra hostato
  }

  sendCreateGame(){
    if(!this.gameCreated) {
      this.socket.emit('create-game');
      this.gameCreated = true;
    }
  }

  sendJoinGame(gameCode: string) {
    this.socket.emit("join-game", gameCode);
  }

  sendUpdateGame(i: number, j: number) {
    const move = {i, j, gameCode: this.game.gameCode};
    this.socket.emit("update-game", move);
  }

  listenUpdateGame(callback: (game: Game) => void) {
    this.socket.on("share-update-game", callback);
  }

  listenCodeGame(callback: (gameCode: string) => void) {
    this.socket.on("code-game", callback);
  }

  listentStartGame(callback: (msg: any) => void) { // da cambiare msg
    this.socket.on("start-game", callback);
  }

  listenJoinStatus(callback: (status: {success: Boolean, description: String}) => void) {
    this.socket.on("join-status", callback);
  }

  listenEndGame(callback: (winner: string) => void) {
    this.socket.on('end-game', callback);
  }

  offCodeGame(callback: (gameCode: string) => void) {
    this.socket.off("code-game", callback);
  }

  offStartGame(callback: (msg: any) => void) {
    this.socket.off("start-game", callback);
  }

  offJoinStatus(callback: (status: {success: Boolean, description: String}) => void) {
    this.socket.off("join-status", callback);
  }

  offEndGame(callback: (winner: string) => void) {
    this.socket.off('end-game', callback);
  }

  offUpdateGame(callback: (game: Game) => void) {
    this.socket.off("share-update-game", callback);
  }

  resetCreateGame() {
    this.gameCreated = false;
  }

  setPlayerNumber(playerNumber: '1' | '2') {
    this.playerNumber = playerNumber;
  }

  getPlayerNumber() {
    return this.playerNumber;
  }

  setGame(game: Game) {
    this.game = game;
  }

  getGame(): Game {
    return this.game;
  }

}
