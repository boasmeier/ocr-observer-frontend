import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MyImage } from '../../models/image';
import { ImageService } from '../../services/image.service';
import { MessageService } from '../../services/message.service';
import { ImageIdIterator } from 'src/app/ImageIdIterator';

@Component({
    selector: 'images',
    templateUrl: './images.component.html',
    styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements AfterViewInit {
    images: MyImage[] = [];
    selectedImage?: MyImage;
    imageUploadActive: boolean;
    filterActive: boolean;
    filters: Map<string, boolean>;

    displayedColumns: string[] = ['idimage', 'name', 'mimetype', 'status'];

    dataSource: MatTableDataSource<MyImage> = new MatTableDataSource<MyImage>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private imageService: ImageService,
        private messageService: MessageService, private route: ActivatedRoute, private itr: ImageIdIterator) {
            this.imageUploadActive = false;
            this.filterActive = false;
            this.filters = new Map<string, boolean>();
            this.filters.set('uploadedFilterButton', true);
            this.filters.set('processedFilterButton', true);
            this.filters.set('approvedFilterButton', true);
            this.filters.set('exportedFilterButton', true);
    }

    onSelect(image: MyImage): void {
        this.selectedImage = image;
        this.messageService.info(`DatasetDetailComponent: Selected image id=${image.idimage}`);
    }

    ngAfterViewInit(): void {
        this.getImages();
    }

    getImages(): void {
        const iddataset = Number(this.route.snapshot.paramMap.get('iddataset'));
        this.imageService.getImagesWithState().subscribe(images => {
            this.images = images.filter(i => i.iddataset == iddataset);
            this.applyFilters();
            this.initImageIdIterator();
            this.initMatPaginator();
        });
    }

    private initMatPaginator(): void {
        this.dataSource = new MatTableDataSource<MyImage>(this.images);
        this.dataSource.paginator = this.paginator;
    }

    private initImageIdIterator(): void {
        let ids: Array<number> = [];
        this.images.forEach(i => ids.push(i.idimage));
        this.itr.setImageIds(ids);
    }

    delete(image: MyImage): void {
        this.images = this.images.filter(d => d !== image);
        this.imageService.deleteImage(image.idimage).subscribe();
    }

    handleImageUploadEvent(event: string) {
        this.getImages();
        this.messageService.info(event);
    }

    toggleImageUpload() {
        this.imageUploadActive = !this.imageUploadActive;
    }

    toggleFilter() {
        this.filterActive = !this.filterActive;
    }

    toggleUploadedFilter() {
        this.toggleFilterButton('uploadedFilterButton');
    }

    toggleProcessedFilter() {
        this.toggleFilterButton('processedFilterButton');
    }

    toggleApprovedFilter() {
        this.toggleFilterButton('approvedFilterButton');
    }

    toggleExportedFilter() {
        this.toggleFilterButton('exportedFilterButton');
    }

    private toggleFilterButton(buttonId: string) {
        const filterButton = document.getElementById(buttonId);

        if(!filterButton) {
            this.messageService.warn(`${buttonId} not found`);
            return;
        }

        if(this.filters.get(buttonId)) { 
            filterButton.classList.remove("btn-primary");
            filterButton.classList.add("btn-secondary");
        }
        else{
            filterButton.classList.remove("btn-secondary");
            filterButton.classList.add("btn-primary");
        }

        this.filters.set(buttonId, !this.filters.get(buttonId));

        this.getImages();
    }

    private applyFilters(): void {
        if(!this.filters.get('uploadedFilterButton')) {
            this.images = this.images.filter(i => i.state != 'Hochgeladen');
        }
        if(!this.filters.get('processedFilterButton')) {
            this.images = this.images.filter(i => i.state != 'Erkannt');
        }
        if(!this.filters.get('approvedFilterButton')) {
            this.images = this.images.filter(i => i.state != 'Bestaetigt');
        }
        if(!this.filters.get('exportedFilterButton')) {
            this.images = this.images.filter(i => i.state != 'Exportiert');
        }

        // sort by id ascending
        this.images.sort((i1, i2) => i1.idimage < i2.idimage ? -1 : 1 );
    }
}
