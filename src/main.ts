import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';
import { APP_CONFIG, ConfigService } from './app/_services/config.service';
import { provideHttpClient } from '@angular/common/http';

// fetch('assets/config.json')
//   .then(response => response.json())
//   .then(conf => {
//     bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err))
//     // @ts-ignore
//     window['app-config'] = conf;
//   })


async function main() {
  // Carregar config.json antes de iniciar o Angular
  const response = await fetch('/assets/config.json');
  const configData = await response.json();

  console.log("Config carregado:", configData); // Verifique no console

  // Atualizar os providers do appConfig para incluir o APP_CONFIG
  const newAppConfig = {
    ...appConfig,
    providers: [
      ...(appConfig.providers || []),
      provideHttpClient(), // Para habilitar HttpClient no app
      { provide: APP_CONFIG, useValue: configData } // Injetar a configuração carregada
    ]
  };

  // Inicializar a aplicação
  bootstrapApplication(AppComponent, newAppConfig).catch((err) =>
    console.error('Erro ao iniciar o app:', err)
  );
}

main();
