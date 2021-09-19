import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SharedService {
	private subject = new Subject<any>();

	public sendEvent(value?: any): void {
		this.subject.next(value);
	}

	public receiveEvent<T>(): Observable<T> {
		return this.subject.asObservable();
	}

	public getNextItemInArray<T>(array: Array<T>, currentElement: T): T {
		const currentIndex: number = array.indexOf(currentElement);
		const nextIndex: number = (currentIndex + 1) % array.length;

		return array[nextIndex];
	}

	public getPreviousItemInArray<T>(array: Array<T>, currentElement: T): T {
		const currentIndex: number = array.indexOf(currentElement);
		const previousIndex: number = (currentIndex + array.length - 1) % array.length;

		return array[previousIndex];
	}
}
