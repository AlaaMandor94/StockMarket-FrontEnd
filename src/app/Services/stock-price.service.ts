import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockPriceService {
  private hubConnection!: HubConnection;
  private stockPriceSubject = new Subject<any>();

  stockPrice$ = this.stockPriceSubject.asObservable();

  constructor() {
    this.initializeSignalR();
  }

  private initializeSignalR(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:7288/stockHub') // Update with your SignalR hub URL
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connected');
        this.subscribeToStockPricesUpdatedEvent();
        this.callServerFunctionEveryTenSeconds();
      })
      .catch((err) => console.error('SignalR connection error:', err));
  }
  private subscribeToStockPricesUpdatedEvent() {
    this.hubConnection.on('StockPricesUpdated', (stocks: any[]) => {
      this.stockPriceSubject.next(stocks);
    });
  }
  private callServerFunctionEveryTenSeconds() {
    setInterval(() => {
      this.hubConnection.send('UpdateStockPrices').catch((err) => {
        console.error('Error calling server function:', err);
      });
    }, 10000); // Call the server function every 10 seconds (10000 milliseconds)
  }
}
