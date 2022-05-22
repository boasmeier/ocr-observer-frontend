import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Dataset } from '../../models/dataset';
import { DatasetService } from '../../services/dataset.service';
import { MessageService } from '../../services/message.service';
import { AbbreviationPipe } from '../../AbbreviationPipe';
import { MyImage } from '../../models/image';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';



@Component({
    selector: 'dataset-detail',
    templateUrl: './dataset-detail.component.html',
    styleUrls: ['./dataset-detail.component.scss']
})
export class DatasetDetailComponent implements OnInit {
    @Input() dataset!: Dataset[];


    constructor(
        private route: ActivatedRoute,
        private datasetService: DatasetService,
        private location: Location,
        private messageService: MessageService,
        public dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.getDataset();
    }

    getDataset(): void {
        const id = Number(this.route.snapshot.paramMap.get('iddataset'));
        this.datasetService.getDataset(id)
            .subscribe(dataset => {
                this.dataset = dataset;
            });
    }

    goBack(): void {
        this.location.back();
    }

    save(): void {
        if (this.dataset) {
            this.datasetService.updateDataset(this.dataset[0])
                .subscribe(() => this.goBack());
        }
    }

    delete(): void {
        const id = Number(this.route.snapshot.paramMap.get('iddataset'));
        this.datasetService.deleteDataset(id).subscribe(() => {
            this.goBack();
        });
    }

    openDeleteDialog(): void {
        let dialogRef = this.dialog.open(DeleteDialogComponent, {
            width: '50em',
            data: { 
                target: 'Datensatz', 
                targetId: this.dataset[0].iddataset, 
                dialogText: 'Löschen dieses Datensatzes wird auch alle beinhalteten Bilder und deren Felder löschen. Bist du sicher?' 
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Result: ${result}`);
            if(result) {
                this.delete();
            }
        });
    }
}
