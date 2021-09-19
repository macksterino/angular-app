import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { faFemale, faMale } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { SharedService } from '../shared.service';
import { ListItem } from '../sidebar/sidebar.component';

type TripHeader = {
	traveler: ListItem,
	gender: any,
	emails: Array<string>,
	error: string
}

type TripBody = {
	title: string,
	date: string,
	description: string,
	companions: Array<string>
}

@Component({
	selector: 'app-trips',
	templateUrl: './trips.component.html',
	styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {
	header: TripHeader | undefined;
	trips: Array<TripBody> | undefined;
	sentEventSubscription: Subscription;

	constructor(private httpClient: HttpClient, private sharedService: SharedService) {
		this.sentEventSubscription = this.sharedService.receiveEvent().subscribe((data: any) => {
			this.loadTripDetailsFromUsername(data.UserName);
		});
	}

	ngOnInit(): void {
		this.header = {} as TripHeader;
		this.trips = [];
	}

	public loadTripDetailsFromUsername(username: string): void {
		this.httpClient.get<any>(`https://services.odata.org/TripPinRESTierService/(S(12nxq1yut5r4o3emcqekyv5f))/People('${username}')?$expand=Trips($select=Name, Description, StartsAt, EndsAt, tags, ShareId)&orderby=desc`).subscribe(
			response => {
				this.header = {
					traveler: {
						UserName: response.UserName,
						FirstName: response.FirstName,
						LastName: response.LastName
					},
					gender: (response.Gender === 'Male') ? faMale : faFemale,
					emails: response.Emails,
					error: (response?.error?.code !== undefined) ? response.error.code : ''
				}

				this.trips = [];
				for (const trip of response.Trips) {
					this.trips?.push(
						{
							title: trip.Name,
							date: formatDate(trip.StartsAt, 'YYYY-MM-dd', 'sv-SE').concat(' till ', formatDate(trip.EndsAt, 'YYYY-MM-dd', 'sv-SE')),
							description: trip.Description,
							companions: this.getCompanions(trip.ShareId)
						}
					)
				}
			}
		);
	}

	private getCompanions(shareId: string): Array<string> {
		const companions: Array<string> = [];
		this.httpClient.get<any>(`https://services.odata.org/TripPinRESTierService/(S(bmmjuqhomfdnb1yj0vzldoqu))/People?$expand=Trips($filter=ShareId eq ${shareId})`).subscribe(
			response => {
				for (const person of response.value) {
					const traveler = this.header?.traveler.FirstName.concat(this.header.traveler.LastName);
					if (person.Trips.length != 0) {
						if (person.FirstName.concat(person.LastName) !== traveler) {
							companions.push(
								person.FirstName
							);
						}
					}
				}
			}
		);

		return companions;
	}

}
