import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/guard/auth.guard';
import { ErrorInterceptor } from './core/interceptor/error.interceptor';
import { TokenInterceptorService } from './core/interceptor/token.interceptor';
import { NoAuthGuard } from './core/guard/no-auth.guard';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { AuthModule } from './modules/auth/auth.module';
import { HomeComponent } from './modules/home/home.component';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { SharedModule } from './shared/shared.module';
import { API_URL_METHOD } from './utils/constants';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    NavbarComponent
  ],
  imports: [
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    CoreModule,
    HttpClientModule,
    AppRoutingModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['http://localhost:3000'],
        blacklistedRoutes: [API_URL_METHOD('login')]
      }
    })
  ],
  providers: [
    AuthGuard,
    NoAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
