import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              //Remove the .apps.googleusercontent.com from the client id
              //MAKE SURE TO HIDE IT FROM GITHUB
              "468598579934-7mbb6qo1jeikpmb9rgpii9avnu4b7mjs"
            ),
          },
        ],
        onError: (err) => {
          debugger;
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    }]    
  
};
