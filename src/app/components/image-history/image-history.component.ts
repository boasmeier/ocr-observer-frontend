import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

    ngOnInit(): void {
        this.getHistoryOfImage();
    }

    getHistoryOfImage(): void {
        const idimage = Number(this.route.snapshot.paramMap.get('idimage'));
        this.imageHistoryService.getHistoryOfImageById(idimage).subscribe(history => {
            this.imageHistory = history;
        });
    }

}
