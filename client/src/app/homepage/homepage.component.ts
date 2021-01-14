import { Component, OnInit } from '@angular/core';
//import * as io from "socket.io-client";
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  public API_URL: string = 'https://api.maximemnt.synology.me/';
  public socket;
  public mice = {};
  private socketID:any;

  constructor() { }

  setupSocketConnection(){
    this.socket = io(this.API_URL);
  }

  ngOnInit() {
    this.setupSocketConnection();

      this.socket.on('mousemove', (event) => {
        let mouse = this.mice[event.id];
        if (!mouse && event.id != this.socket.id) {
          const span = document.createElement('span');
          span.style.position = 'absolute';
          span.textContent = '🐊';
          this.mice[event.id] = span;
          mouse = span;
          document.body.appendChild(span);
        }
        if(event.id != this.socket.id){
          mouse.style.top = event.y + 'px';
          mouse.style.left = event.x + 'px';
        }      
      });

      this.socket.on('message-client-disconnected', (id) => {
        console.log("user disconnected!");
        if (this.mice[id]) {
          document.body.removeChild(this.mice[id]);
        }
      });

      try {
        document.addEventListener("mousemove", (event) => {
          this.socket.emit('mousemove', {
            x: event.clientX,
            y: event.clientY
          });
        });
      } catch (error) {
        console.error("mouse unavailable 😥");
      }
      
  }

}

