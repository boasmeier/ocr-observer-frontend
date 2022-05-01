import { Injectable } from "@angular/core";
import { MessageService } from "./services/message.service";

@Injectable({
    providedIn: 'root'
})
export class ImageIdIterator {
    private imageIds: Array<number> = [];
    private currentIndex: number = 0;

    constructor(private messageService: MessageService) {
    }

    public setImageIds(ids: Array<number>) {
        this.imageIds = ids;
    }

    public setIndex(idimage: number) {
        this.currentIndex = this.imageIds.indexOf(idimage);
    }

    public reset() {
        this.currentIndex = 0;
    }

    public next(): number {
        this.currentIndex++;
        return this.imageIds[this.currentIndex];       
    }

    public hasNext(): boolean {
        return (this.currentIndex+1 in this.imageIds) ? true : false;
    }
}