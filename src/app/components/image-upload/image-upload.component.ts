import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { ImageService } from '../../services/image.service'
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ImageSnippet } from '../../models/imageSnippet';


@Component({
    selector: 'image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
    public selectedFile?: ImageSnippet;
    public uploadedAndValid: boolean = false;

    @Output() imageUploadEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor(private route: ActivatedRoute, private imageService: ImageService) {
    }

    private onSuccess() {
        if (this.selectedFile !== undefined) {
            this.uploadedAndValid = true;
            this.selectedFile.pending = false;
            this.selectedFile.status = 'ok';
            this.imageUploadEvent.emit("Event: Image upload");
            setTimeout(() => this.uploadedAndValid = false, 5000);
        }
    }

    private onError() {
        if (this.selectedFile !== undefined) {
            this.selectedFile.pending = false;
            this.selectedFile.status = 'fail';
            this.selectedFile.src = '';
        }
    }

    processFile(imageInput: any) {
        const file: File = imageInput.files[0];
        const reader = new FileReader();
        const iddataset = Number(this.route.snapshot.paramMap.get('iddataset'));

        reader.addEventListener('load', (event: any) => {
            this.selectedFile = new ImageSnippet(event.target.result, file);
            this.selectedFile.pending = true;
            this.imageService.addImage(this.selectedFile.file, iddataset).subscribe(
                (res) => {
                    this.onSuccess();
                },
                (err) => {
                    this.onError();
                })
        });
        reader.readAsDataURL(file);
    }
}
