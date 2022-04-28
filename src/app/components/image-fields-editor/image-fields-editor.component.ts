import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { MyImage } from '../../models/image';
import { ImageSnippet } from '../../models/imageSnippet';
import { ImageService } from '../../services/image.service';
import { MessageService } from '../../services/message.service';
import { Subject } from 'rxjs';

@Component({
    selector: 'image-fields-editor',
    templateUrl: './image-fields-editor.component.html',
    styleUrls: ['./image-fields-editor.component.scss']
})
export class ImageFieldsEditorComponent implements OnInit, AfterViewInit {
    public image!: MyImage;
    public imageSnippet!: ImageSnippet;
    public updateHistoryEvent: Subject<string> = new Subject<string>();

    constructor(
        private route: ActivatedRoute,
        private imageService: ImageService,
        private location: Location,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {

    }

    goBack(): void {
        this.location.back();
    }

    delete(): void {
        const id = Number(this.route.snapshot.paramMap.get('idimage'));
        this.imageService.deleteImage(id).subscribe(() => {
            this.goBack();
        });
    }

    ngAfterViewInit(): void {
        this.getImage();
    }

    getImage(): void {
        const id = Number(this.route.snapshot.paramMap.get('idimage'));
        this.imageService.getImage(id).subscribe(image => {
            this.image = image[0];
            this.getImageFile(id);
        });
    }

    getImageFile(id: number): void {
        this.imageService.getImageFile(id).subscribe(blob => {
            const reader = new FileReader();
            const file: File = new File([blob], this.image.name);
            reader.addEventListener('load', (event: any) => {
                this.imageSnippet = new ImageSnippet(event.target.result, file);
            });
            if (blob) {
                reader.readAsDataURL(blob);
            }
        });
    }

    emitUpdateHistoryEventToChild(event: string) {
        this.updateHistoryEvent.next(event);
    }

    handleFieldsUpdateEvent(event: string) {
        this.emitUpdateHistoryEventToChild(event);
        this.messageService.info(`image-fields-editor: Received ${event}`);
    }
}
