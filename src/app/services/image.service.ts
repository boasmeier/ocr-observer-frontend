import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { MyImage } from '../models/image';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    private imagesUrl = environment.baseUrl + '/images';
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient,
        private messageService: MessageService) {
    }

    /** GET images from the server */
    public getImages(): Observable<MyImage[]> {
        return this.http.get<MyImage[]>(this.imagesUrl)
            .pipe(
                tap(_ => this.log('fetched images')),
                catchError(this.handleError<MyImage[]>('getImages', []))
            );
    }

    /** GET images with state from the server */
    public getImagesWithState(): Observable<MyImage[]> {
        return this.http.get<MyImage[]>(this.imagesUrl + '/withState')
            .pipe(
                tap(_ => this.log('fetched images with state')),
                catchError(this.handleError<MyImage[]>('getImagesWithState', []))
            );
    }

    /** GET image by id. Will 404 if id not found */
    public getImage(id: number): Observable<MyImage[]> {
        const url = `${this.imagesUrl}/${id}`;
        return this.http.get<MyImage[]>(url).pipe(
            tap(_ => this.log(`fetched image id=${id}`)),
            catchError(this.handleError<MyImage[]>(`getImage id=${id}`))
        );
    }

    /** GET image file by id. Will 404 if id not found */
    public getImageFile(id: number): Observable<Blob> {
        const url = `${this.imagesUrl}/file/${id}`;
        return this.http.get(url, { responseType: 'blob' }).pipe(
            tap(_ => this.log(`fetched image file id=${id}`)),
            catchError(this.handleError<Blob>(`getImageFile id=${id}`))
        );
    }

    /** DELETE: delete the image from the server */
    public deleteImage(id: number): Observable<MyImage> {
        const url = `${this.imagesUrl}/${id}`;
        return this.http.delete<MyImage>(url, this.httpOptions).pipe(
            tap(_ => this.log(`deleted image id=${id}`)),
            catchError(this.handleError<MyImage>('deleteImage'))
        );
    }

    /** POST: add a new image to the server */
    public addImage(image: File, iddataset: number, category: string): Observable<any> {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('iddataset', String(iddataset));
        formData.append('category', category);
        return this.http.post(this.imagesUrl, formData).pipe(
            tap(_ => this.log(`added image to dataset id=${iddataset}`)),
            catchError(this.handleError('addImage'))
        );
    }

    /** POST: add multiple new images to the server */
    public addMultipleImages(images: Array<File>, iddataset: number, category: string): Observable<any> {
        const formData = new FormData();
        images.forEach(i => {
            formData.append('image', i);
        });
        formData.append('iddataset', String(iddataset));
        formData.append('category', category);
        return this.http.post(this.imagesUrl, formData).pipe(
            tap(_ => this.log(`added image to dataset id=${iddataset}`)),
            catchError(this.handleError('addImage'))
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

    /** Log a ImageService message with the MessageService */
    private log(message: string) {
        this.messageService.info(`ImageService: ${message}`);
    }
}
