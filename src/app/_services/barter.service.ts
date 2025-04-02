import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root' // Torna o service disponível em toda a aplicação
})
export class BarterService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private config : ConfigService) {
    this.apiUrl = config.apiUrl+"/barter"
  }

  getPreco(produto: string): Observable<any> {
    let params = new HttpParams().set('itemCode', produto);
    let url = `${this.apiUrl}`;
    return this.http.get<any>(url, { params });
}
}
