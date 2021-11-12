import {Component, OnDestroy} from '@angular/core';
import {Client} from '@hapi/nes/lib/client';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'test-nes-socket';
  client: Client;

  messages$ = new BehaviorSubject<string[]>([]);

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

    this.log('constructor +', connectionUrl);


    const start = async () => {
      await client.connect();
      this.log('connect +');

      // const payload = await client.request('hello');  // Can also request '/h'
      //
      // console.log('payload', payload);
    };

    client.onUpdate = (message) => {
      console.log('broadcast', JSON.parse(message));
    };

    start().catch((err) => {
      this.log(err)
    });


    this.log('constructor +2');
  }

  public ngOnDestroy(): void {
    this.log('disconnect +');
    void this.client.disconnect();
  }

  // @ts-ignore
  private log(...data): void {
    const strs = data.map(String);
    console.log(data);
    this.messages$.next(this.messages$.value.concat(strs.join(' ')));
  }
}

