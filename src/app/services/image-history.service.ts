import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';
import { ImageHistory } from '../models/imageHistory';

@Injectable({
    providedIn: 'root'
})
export class ImageHistoryService {
    private url = environment.baseUrl + '/images/history';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient,
        private messageService: MessageService) {
    }

    /** GET history of image by id. Will 404 if id not found */
    getHistoryOfImageById(id: number): Observable<ImageHistory[]> {
        const url = `${this.url}/${id}`;
        return this.http.get<ImageHistory[]>(url).pipe(
            tap(_ => this.log(`fetched history of image with id=${id}`)),
            catchError(this.handleError<ImageHistory[]>(`getHistoryOfImageById id=${id}`))
        );
    }

    /**
    * Handle Http operation that failed.
    * Let the app continue.
    *
    * @param operation - name of the operation that failed
    * @param result - optional value to return as the observable result
    */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a FieldsService message with the MessageService */
    private log(message: string) {
        this.messageService.info(`ImageHistoryService: ${message}`);
    }
}
