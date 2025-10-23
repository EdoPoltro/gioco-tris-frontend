import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket-service';

@Component({
  selector: 'app-test',
  standalone: false,
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test implements OnInit {
constructor(private socketService: SocketService) {}

  ngOnInit(): void {

  }

  send() {

  }
}
