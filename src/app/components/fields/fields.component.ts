import { Component, OnInit, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Fields } from 'src/app/models/fields';
import { MyImage } from 'src/app/models/image';
import { InsertAnnotation } from 'src/app/models/insertAnnotation';
import { FieldsService } from '../../services/fields.service';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'fields',
    templateUrl: './fields.component.html',
    styleUrls: ['./fields.component.scss']
})
export class FieldsComponent implements OnInit {
    fields!: Fields;
    @Input() image!: MyImage;

    constructor(private fieldsService: FieldsService,
        private messageService: MessageService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.getAnnotations();
    }

    getAnnotations(): void {
        const idimage = Number(this.route.snapshot.paramMap.get('idimage'));
        this.fieldsService.getFieldsById(this.image.idfields).subscribe(annotation => {
            this.fields = annotation[0];
        });
    }

    save(): void {
        const annotation = this.fields;
        this.fieldsService.updateFields(annotation)
            .subscribe(() => {
            });
    }
}
