import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Dataset } from '../../models/dataset';
import { InsertDataset } from '../../models/insertDataset';
import { DatasetService } from '../../services/dataset.service';
import { MessageService } from '../../services/message.service';
import { InsertDimension } from 'src/app/models/insertDimension';
import { FieldsService } from 'src/app/services/fields.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'datasets',
    templateUrl: './datasets.component.html',
    styleUrls: ['./datasets.component.scss']
})
export class DatasetsComponent implements AfterViewInit {
    datasets: Dataset[] = [];
    displayedColumns: string[] = ['iddataset', 'name', 'description'];
    selectedDataset?: Dataset;
    insertFormActive: Boolean = false;
    datasetForm: FormGroup;
    submitted = false;
    submittedAndValid = false;
    isOnTaskDetail: boolean = false;

    dataSource: MatTableDataSource<Dataset> = new MatTableDataSource<Dataset>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private datasetService: DatasetService,
        private fieldsService: FieldsService,
        private messageService: MessageService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute) {
        this.datasetForm = this.getForm();
    }

    ngAfterViewInit() {
        this.getDatasets();
        this.isOnTaskDetail = Number(this.route.snapshot.paramMap.get('idtask')) >= 1;
    }

    getForm() {
        return this.formBuilder.group({
            name: ['', [
                Validators.required,
                Validators.pattern("^[^0-9`~!@#$%^&*()_+={}|:;“’<,>.?๐฿]*$")]
            ],
            description: ['', [Validators.max(20)]]
        });
    }

    onSubmit(data: any) {
        this.submitted = true;

        // stop here if form is invalid
        if (this.datasetForm.invalid) {
            return;
        }

        this.submittedAndValid = true;
        this.submitted = false;
        this.datasetForm = this.getForm();
        const inserDataset = this.parseFormData(data);
        console.log('Submit: ', inserDataset);
        this.add(inserDataset);
        this.toggleInsertForm();
        setTimeout(() => this.submittedAndValid = false, 5000);
        return;
    }

    parseFormData(data: any) {
        const insertDataset = new InsertDataset(
            data.idtask,
            data.name,
            data.description,
        );
        return insertDataset;
    }

    onSelect(dataset: Dataset): void {
        this.selectedDataset = dataset;
        this.messageService.info(`DatasetComponent: Selected dataset id=${dataset.iddataset}`);
    }

    getDatasets(): void {
        const idtask = Number(this.route.snapshot.paramMap.get('idtask'));
        this.datasetService.getDatasets().subscribe(datasets => {
            this.datasets = idtask >= 1 ? datasets.filter(d => d.idtask == idtask) : datasets;
            this.dataSource = new MatTableDataSource<Dataset>(datasets);
            this.dataSource.paginator = this.paginator;
        });
    }

    delete(dataset: Dataset): void {
        this.datasets = this.datasets.filter(d => d !== dataset);
        this.datasetService.deleteDataset(dataset.iddataset).subscribe();
    }

    toggleInsertForm() {
        this.insertFormActive = !this.insertFormActive;
    }

    exportFields() {
        this.fieldsService.getFieldsExport().subscribe(blob => {
            console.log(blob);
            const reader = new FileReader();
            const file: File = new File([blob], 'export.csv');
            reader.addEventListener('load', (event: any) => {
                //this.csv = new ImageSnippet(event.target.result, file);

                let fileUrl = URL.createObjectURL(file);
                let fileLink = document.createElement('a');

                fileLink.href = fileUrl;
                fileLink.setAttribute('download', file.name);
                document.body.appendChild(fileLink)

                fileLink.click();
            });
            if (blob) {
                reader.readAsDataURL(blob);
            }
        });
    }

    add(dataset: InsertDataset): void {
        dataset.idtask = Number(this.route.snapshot.paramMap.get('idtask'));
        dataset.name = dataset.name.trim();
        dataset.description = dataset.description.trim();
        this.datasetService.addDataset(dataset)
            .subscribe(() => {
                this.getDatasets();
            });
    }
}
