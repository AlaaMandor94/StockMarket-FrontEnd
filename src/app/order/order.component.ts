import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  selectedStockId!: number;
  stocks!: any[];
  selectedStock: any = {};
  insertedOrder: any = {};
  order: any = {};
  orders!: any[];
  private httpOptions: any;

  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }
  ngOnInit(): void {
    this.stocksFetch();
    this.ordersFetch();
  }
  stocksFetch(): void {
    this.http
      .get<any[]>('https://localhost:7288/api/Stocks')
      .subscribe((stocks) => {
        this.stocks = stocks;
      });
  }
  ordersFetch(): void {
    this.http
      .get<any[]>('https://localhost:7288/api/Orders')
      .subscribe((orders) => {
        this.orders = orders;
      });
  }

  createOrder(): void {
    this.order.stockID = this.selectedStock.id;
    this.order.price = this.selectedStock.price;
    this.insertedOrder = {
      personName: this.order.personName,
      quantity: this.order.quantity,
      StockId: this.order.stock.id,
    };
    this.http
      .post<any>('https://localhost:7288/api/Orders', this.insertedOrder)
      .subscribe((order) => {
        console.log('Order created:', order);
        this.order = {}; // Clear the form fields
        this.ordersFetch(); // Update the order list
      });
  }
}
