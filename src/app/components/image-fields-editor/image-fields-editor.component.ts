import { Component, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { MyImage } from '../../models/image';
import { ImageSnippet } from '../../models/imageSnippet';
import { ImageService } from '../../services/image.service';
import { MessageService } from '../../services/message.service';
import { Subject } from 'rxjs';
import { ImageIdIterator } from 'src/app/ImageIdIterator';

@Component({
    selector: 'image-fields-editor',
    templateUrl: './image-fields-editor.component.html',
    styleUrls: ['./image-fields-editor.component.scss']
})
export class ImageFieldsEditorComponent implements OnInit, AfterViewInit {
    public image!: MyImage;
    public imageSnippet!: ImageSnippet;
    public updateHistoryEvent: Subject<string> = new Subject<string>();
    public displayNoMoreImagesMessage: boolean = false;
    public displayNoPreviousImagesMessage: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private imageService: ImageService,
        private location: Location,
        private messageService: MessageService,
        private itr: ImageIdIterator
    ) { 

    }

    ngOnInit(): void {

    }

    goBack(): void {
        // Small hack to properly reload component since we're navigating onto the same component
        const url = `/datasets/${this.image.iddataset}`
        this.router.navigateByUrl(url);
    }

    next(): void {
        if(this.itr.hasNext()) {
            const id = Number(this.route.snapshot.paramMap.get('idimage'));
            const nextImageId: number = this.itr.next();
            const newUrl = this.router.url.replace(id.toString(), nextImageId.toString());
            // Small hack to properly reload component since we're navigating onto the same component
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([newUrl]);
            });
        }
        else {
            this.displayNoMoreImagesMessage = true;
            setTimeout(() => this.displayNoMoreImagesMessage = false, 1500);
        }
    }

    previous(): void {
        if(this.itr.hasPrevious()) {
            const id = Number(this.route.snapshot.paramMap.get('idimage'));
            const nextImageId: number = this.itr.previous();
            const newUrl = this.router.url.replace(id.toString(), nextImageId.toString());
            // Small hack to properly reload component since we're navigating onto the same component
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([newUrl]);
            });
        }
        else {
            this.displayNoPreviousImagesMessage = true;
            setTimeout(() => this.displayNoPreviousImagesMessage = false, 1500);
        }
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
        console.log(id);
        console.log(this.route.snapshot);
        this.imageService.getImage(id).subscribe(image => {
            this.image = image[0];
            this.itr.setIndex(this.image.idimage);
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
