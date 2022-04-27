import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Fields } from '../models/fields';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FieldsService {
    private url = environment.baseUrl + '/fields';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient,
        private messageService: MessageService) {
    }

    /** GET fields from the server */
    public getFields(): Observable<Fields[]> {
        return this.http.get<Fields[]>(this.url)
            .pipe(
                tap(_ => this.log('fetched fields')),
                catchError(this.handleError<Fields[]>('getFields', []))
            );
    }

    /** GET fields by id. Will 404 if id not found */
    getFieldsById(id: number): Observable<Fields[]> {
        const url = `${this.url}/${id}`;
        return this.http.get<Fields[]>(url).pipe(
            tap(_ => this.log(`fetched field id=${id}`)),
            catchError(this.handleError<Fields[]>(`getFieldsById id=${id}`))
        );
    }

    /** PUT: update the fields on the server */
    updateFields(fields: Fields): Observable<any> {
        const url = `${this.url}/${fields.idfields}`;
        return this.http.put<Fields>(url, fields, this.httpOptions).pipe(
            tap(_ => this.log(`updated fields id=${fields.idfields}`)),
            catchError(this.handleError<any>('updateFields'))
        );
    }

    /** GET fields export as csv file */
    getFieldsExport(): Observable<Blob> {
        const url = `${this.url}/export`;
        return this.http.get(url, { responseType: 'blob'}).pipe(
            tap(_ => this.log(`fetched fields export`)),
            catchError(this.handleError<Blob>(`getFieldsExport`))
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
        this.messageService.info(`FieldsService: ${message}`);
    }
}
