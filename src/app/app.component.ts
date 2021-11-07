import {Component, OnDestroy} from '@angular/core';
import {Client} from '@hapi/nes/lib/client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'test-nes-socket';
  client: Client;

  constructor() {
    const {protocol} = window.location;
    const connectionUrl = (protocol === 'https:') ? `wss://127.0.0.1:8000/` : `ws://127.0.0.1:8000/`;

    const client = new Client(connectionUrl);
    this.client = client;

    // fetch('/nes/auth', {credentials: 'same-origin'})
    //   .then(() => client.connect({delay: 2000, retries: 3}))
    //   .then(() => {
    //     client.subscribe(`/some-subscribe-endpoint`, (data) => {
    //       // do something
    //     });
    //   });


    console.log('constructor +', connectionUrl);

    const start = async () => {
      await client.connect();
      console.log('connect +');

      const payload = await client.request('hello');  // Can also request '/h'
      // payload -> 'world!'
      console.log('payload', payload);
    };

    client.onUpdate = (update) => {
      // update -> 'welcome!'
      console.log('update', update);
    };

    void start();


    console.log('constructor +2');
  }

  public ngOnDestroy(): void {
    console.log('disconnect +');
    void this.client.disconnect();
  }
}
