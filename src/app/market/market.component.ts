import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StockPriceService } from '../Services/stock-price.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css'],
})
export class MarketComponent implements OnInit {
  stocks!: any[];
  private httpOptions: any;
  chartData: any[] = [];
  chartPlugins = [];
  chartLabels: any[] = [];
  chartOptions: any = {
    responsive: true,
  };

  chartLegend = true;
  chartType = 'line';

  constructor(
    private http: HttpClient,
    private stockPriceService: StockPriceService
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }
  ngOnInit(): void {
    this.fetchStocks();
    this.subscribeToStockPriceUpdates();
  }

  fetchStocks(): void {
    this.http
      .get<any[]>('https://localhost:7288/api/Stocks')
      .subscribe((stocks) => {
        this.stocks = stocks;
        this.updateChartData();
      });
  }
  private subscribeToStockPriceUpdates(): void {
    this.stockPriceService.stockPrice$.subscribe((updatedStocks) => {
      updatedStocks.forEach((updatedStock: { id: any; price: any }) => {
        const stock = this.stocks.find((s) => s.id === updatedStock.id);
        if (stock) {
          stock.price = updatedStock.price;
        }
      });
      this.updateChartData();
    });
  }
  private updateChartData(): void {
    this.chartData = [
      {
        data: this.stocks.map((stock) => stock.price),
        label: 'Stock Price',
      },
    ];
    this.chartLabels = this.stocks.map((stock) => stock.name);
  }
}
