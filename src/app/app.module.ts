import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeSE from '@angular/common/locales/sv';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TripsComponent } from './trips/trips.component';
registerLocaleData(localeSE);


@NgModule({
	declarations: [
		AppComponent,
		SidebarComponent,
		TripsComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		FontAwesomeModule
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'sv-SE' },
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
