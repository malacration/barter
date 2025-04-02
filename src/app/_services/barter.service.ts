import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  // Método para buscar dados do backend
  getPreco(): Observable<any> {
    let url = this.apiUrl+"/"
    return this.http.get<any>(this.apiUrl);
  }
}
