import { Component, OnInit } from '@angular/core';
import * as io from "socket.io-client";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public API_URL: string = 'http://localhost:5000';
  public socket: SocketIOClient.Socket;
  public mice = {};

  constructor() { this.socket = io.connect(this.API_URL); }

  ngOnInit() {
      this.socket.on('mousemove', (event) => {
        let mouse = this.mice[event.id];
        if (!mouse) {
          const span = document.createElement('span');
          span.style.position = 'absolute';
          span.textContent = '🐊';
          this.mice[event.id] = span;
          mouse = span;
          document.body.appendChild(span);
        }
        mouse.style.top = event.y + 'px';
        mouse.style.left = event.x + 'px';
      });

      this.socket.on('message-client-disconnected', (id) => {
        console.log("user disconnected!");
        if (this.mice[id]) {
          document.body.removeChild(this.mice[id]);
        }
      });

      document.addEventListener("mousemove", (event) => {
        this.socket.emit('mousemove', {
          x: event.clientX,
          y: event.clientY
        });
      });
  }

}

