import { Injectable, InjectionToken, Inject } from '@angular/core';

// Criar um InjectionToken para a configuração
export const APP_CONFIG = new InjectionToken<any>('app.config');

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  constructor(@Inject(APP_CONFIG) config: any) {
    this.config = config || {}; // Se for `null`, usa um objeto vazio
  }

  get apiUrl(): string {
    return this.config.apiUrl || 'http://localhost:3000'; // Retorna a URL da API ou um valor padrão
  }

  get(key: string): any {
    return this.config[key]; // Acessa qualquer configuração dinamicamente
  }
}
