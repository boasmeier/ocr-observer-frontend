import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Credentials } from '../models/credentials';


@Injectable({
    providedIn: 'root'
})
export class LoginService {
    private loginUrl = 'http://localhost:3000/api/v0/login'
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient,
        private messageService: MessageService) {
    }

    /** POST: login to the server */
    login(credentials: Credentials): Observable<any> {
        this.log(JSON.stringify(credentials));
        return this.http.post<Credentials>(this.loginUrl, credentials, this.httpOptions).pipe(
            tap((result: any) => this.log(`login successful result=${result}`)),
            catchError(this.handleError<Credentials>('login'))
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

    /** Log a DatasetService message with the MessageService */
    private log(message: string) {
        this.messageService.info(`DatasetService: ${message}`);
    }
}
