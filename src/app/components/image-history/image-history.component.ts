import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ImageHistory } from 'src/app/models/imageHistory';
import { ImageHistoryService } from 'src/app/services/image-history.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
    selector: 'image-history',
    templateUrl: './image-history.component.html',
    styleUrls: ['./image-history.component.scss']
})
export class ImageHistoryComponent implements OnInit {
    imageHistory!: ImageHistory[];

    constructor(private imageHistoryService: ImageHistoryService,
        private messageService: MessageService, private route: ActivatedRoute) { }

    private eventsSubscription!: Subscription;

    @Input() events!: Observable<string>;

    ngOnInit(): void {
        this.getHistoryOfImage();
        this.eventsSubscription = this.events.subscribe(event => {
            this.getHistoryOfImage();
            this.messageService.info(`image-history: Received ${event}`);
        })
    }

    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }

    getHistoryOfImage(): void {
        const idimage = Number(this.route.snapshot.paramMap.get('idimage'));
        this.imageHistoryService.getHistoryOfImageById(idimage).subscribe(history => {
            this.imageHistory = history;
        });
    }

}
