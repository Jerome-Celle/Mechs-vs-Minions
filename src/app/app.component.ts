import {Component, HostListener, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/Rx';
import {ServerSocket, Minion} from './mvmService';

const MINIONS = [{
  id: 1,
  posY: 2,
  posX: 3
}];
// cp -rv /root/mechs-vs-minions/dist/* /var/www/mvm
@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: 'app.component.html',
  providers: [ServerSocket]
})
export class AppComponent implements OnDestroy {
  minions = MINIONS;
  selectedMinion: Minion;
  ws: WebSocket;
  messages = [];

  connection;
  private socketSubscription: Subscription;

  constructor() {

    this.ws = new WebSocket('ws://celuiquibaille.xyz:8000/');

    const minionsLst = this.minions;
    this.ws.onopen = function (event) {
      console.log('Connexion établie.');

      // Lorsque la connexion se termine.
      this.onclose = function (event) {
        console.log('Connexion terminé.');
      };

      // Lorsque le serveur envoi un message.
      /*
      this.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log('Message:', data);
        if (data.payload.action = 'create') {
          minionsLst.push(data.payload.data);
        }

      };*/

      this.send(JSON.stringify({
        stream: 'minions',
        payload: {
          action: 'subscribe',
          data: {
            action: 'create'
          }
        }
      }));
    };
  }

  onSelect(minion: Minion): void {
    this.selectedMinion = minion;
    const msg = {
      stream: 'minions',
      payload: {
        action: 'create',
        data: {
          posX: minion.posX + 1,
          posY: minion.posY + 1,
        },
        request_id: 'some-guid'
      }
    };
    this.ws.send(JSON.stringify(msg));
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event.keyCode);
    const msg = {
      stream: 'minions',
      payload: {
        action: 'move',
        data: {
          pk: this.selectedMinion.id,
          pMove: event.keyCode,
        },
        request_id: 'some-guid'
      }
    };
    this.ws.send(msg);
  }

  ngOnDestroy() {

    this.connection.unsubscribe();

  }
}
