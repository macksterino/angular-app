import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

export type Person = {
	userName: string,
	firstName: string,
	lastName: string
	gender: any,
	emails: Array<string>
}

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	people: Array<Person>;
	selectedPerson: Person;

	constructor(private httpClient: HttpClient, private sharedService: SharedService) {
		this.people = [];
		this.selectedPerson = {} as Person;
	}

	ngOnInit(): void {
		this.getPeople();
	}

	private getPeople(): void {
		this.httpClient.get<any>('https://services.odata.org/TripPinRESTierService/(S(y1zhhnavj3vvewm0ns3l12yo))/People?$select=FirstName,%20LastName,%20Username').subscribe(
			response => {
				for (const person of response.value) {
					this.people.push(
						{
							userName: person.UserName,
							firstName: person.FirstName,
							lastName: person.LastName,
							gender: person.Gender,
							emails: person.Emails
						}
					);
				}
			});
	}

	public selectPerson(person: Person): void {
		this.selectedPerson = person;
		this.sharedService.sendEvent(person);
	}

	public selectNextPerson(): void {
		const nextPerson = this.sharedService.getNextItemInArray(this.people, this.selectedPerson);
		this.selectPerson(nextPerson as Person);
	}

	public selectPreviousItem(): void {
		const previousPerson = this.sharedService.getPreviousItemInArray(this.people, this.selectedPerson);
		this.selectPerson(previousPerson as Person);
	}

}
