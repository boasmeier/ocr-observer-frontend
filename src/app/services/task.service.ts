import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Dataset } from '../models/dataset';
import { InsertDataset } from '../models/insertDataset';
import { environment } from 'src/environments/environment';
import { OcrObserverTask } from '../models/ocrObserverTask';
import { InsertTask } from '../models/insertTask';



@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private url = environment.baseUrl + '/tasks';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient,
        private messageService: MessageService) {
    }

    /** GET tasks from the server */
    getTasks(): Observable<OcrObserverTask[]> {
        return this.http.get<OcrObserverTask[]>(this.url)
            .pipe(
                tap(_ => this.log('fetched tasks')),
                catchError(this.handleError<OcrObserverTask[]>('getTasks', []))
            );
    }

    /** GET task by id. Will 404 if id not found */
    getTask(id: number): Observable<OcrObserverTask[]> {
        const url = `${this.url}/${id}`;
        return this.http.get<OcrObserverTask[]>(url).pipe(
            tap(_ => this.log(`fetched task id=${id}`)),
            catchError(this.handleError<OcrObserverTask[]>(`getTask id=${id}`))
        );
    }

    /** PUT: update the task on the server */
    updateTask(task: OcrObserverTask): Observable<any> {
        const url = `${this.url}/${task.idtask}`;
        return this.http.put<OcrObserverTask>(url, task, this.httpOptions).pipe(
            tap(_ => this.log(`updated task id=${task.idtask}`)),
            catchError(this.handleError<any>('updateTask'))
        );
    }

    /** POST: add a new task to the server */
    addTask(task: InsertTask): Observable<any> {
        this.log(JSON.stringify(task));
        return this.http.post<InsertTask>(this.url, task, this.httpOptions).pipe(
            tap((result: any) => this.log(`added task w/ id=${result.insertId}`)),
            catchError(this.handleError<InsertTask>('addTask'))
        );
    }

    /** DELETE: delete the task from the server */
    deleteTask(id: number): Observable<OcrObserverTask> {
        const url = `${this.url}/${id}`;
        return this.http.delete<OcrObserverTask>(url, this.httpOptions).pipe(
            tap(_ => this.log(`deleted task id=${id}`)),
            catchError(this.handleError<OcrObserverTask>('deleteTask'))
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

    /** Log a TaskService message with the MessageService */
    private log(message: string) {
        this.messageService.info(`TaskService: ${message}`);
    }
}
