import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedService } from '../shared.service';

export type ListItem = {
	UserName: string,
	FirstName: string,
	LastName: string
}

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	listItems: Array<ListItem> | undefined;
	selectedItem: ListItem | undefined;
	@Output() clickedRow = new EventEmitter();

	constructor(private httpClient: HttpClient, private sharedService: SharedService) { }

	ngOnInit(): void {
		this.getListItems();
	}

	private getListItems(): void {
		this.httpClient.get<any>('https://services.odata.org/TripPinRESTierService/(S(y1zhhnavj3vvewm0ns3l12yo))/People?$select=FirstName,%20LastName,%20Username').subscribe(
			response => {
				this.listItems = response.value;
			});
	}

	public selectItem(item: ListItem): void {
		this.selectedItem = item;
		this.sharedService.sendEvent(item);
	}

	public selectNextItem(): void {
		const nextItem = this.sharedService.getNextItemInArray(this.listItems!, this.selectedItem);
		this.selectItem(nextItem as ListItem);
	}

	public selectPreviousItem(): void {
		const previousItem = this.sharedService.getPreviousItemInArray(this.listItems!, this.selectedItem);
		this.selectItem(previousItem as ListItem);
	}

}
