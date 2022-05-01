import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ImageService } from '../../services/image.service'
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ImageSnippet } from '../../models/imageSnippet';


@Component({
    selector: 'image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
    public uploadedAndValid: boolean = false;
    public uploadPending: boolean = false;
    public uploadFailed: boolean = false;

    @Output() imageUploadEvent: EventEmitter<string> = new EventEmitter<string>();

    constructor(private route: ActivatedRoute, private imageService: ImageService) {
    }

    ngOnInit(): void {
        window.addEventListener("dragover", e => {
            e && e.preventDefault();
        }, false);
        window.addEventListener("drop", e => {
            e && e.preventDefault();
        }, false);
    }

    private onSuccess() {
        this.uploadedAndValid = true;
        this.uploadPending = false;
        this.imageUploadEvent.emit("Event: Image upload");
        setTimeout(() => this.uploadedAndValid = false, 5000);
    }

    private onError() {
        this.uploadFailed = true;
        this.uploadPending = false;
        setTimeout(() => this.uploadFailed = false, 5000);
    }

    dragenter(event: any) {
        event.preventDefault();
        event.stopPropagation();
        console.log('Drag enter');
    }

    dragover(event: any) {
        event.preventDefault();
        event.stopPropagation();
        console.log('Drag over');
    }

    async drop(event: any) {
        console.log('Drop received');
        const items = event.dataTransfer.items;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.kind === 'file') {
                const entry = item.webkitGetAsEntry();
                if (entry.isFile) {
                    this.processFile(await this.parseFileEntry(entry));
                } else if (entry.isDirectory) {
                    const fileEntries = await this.parseDirectoryEntry(entry);
                    let files: Array<File> = [];
                    for (let i = 0; i < fileEntries.length; i++) {
                        const file = await this.parseFileEntry(fileEntries[i]);
                        files.push(file)
                    }
                    this.processFolder(files);
                }
            }
        }
    }

    private parseFileEntry(fileEntry: any) {
        return new Promise<File>((resolve, reject) => {
            fileEntry.file(
                (file: File) => {
                    resolve(file);
                },
                (err: any) => {
                    reject(err);
                }
            );
        });
    }

    private parseDirectoryEntry(directoryEntry: any) {
        const directoryReader = directoryEntry.createReader();
        return new Promise<Array<any>>((resolve, reject) => {
            directoryReader.readEntries(
                (entries: Array<any>) => {
                    resolve(entries);
                },
                (err: any) => {
                    reject(err);
                }
            );
        });
    }


    processFile(imageInput: any) {
        const file: File = !(imageInput instanceof File) ? imageInput.files[0] : imageInput;
        const iddataset = Number(this.route.snapshot.paramMap.get('iddataset'));

        this.imageService.addImage(file, iddataset).subscribe(
            (res) => {
                this.onSuccess();
            },
            (err) => {
                this.onError();
            })
    }

    processFolder(files: any) {
        this.uploadPending = true;
        const iddataset = Number(this.route.snapshot.paramMap.get('iddataset'));

        let fileArray: Array<File> = [];
        for (let i = 0; i < files.length; i++) {

            const file: File = files[i];
            fileArray.push(file);
            console.log(file)
        };

        this.imageService.addMultipleImages(fileArray, iddataset).subscribe(
            (res) => {
                this.onSuccess();
            },
            (err) => {
                this.onError();
            });
    }
}
