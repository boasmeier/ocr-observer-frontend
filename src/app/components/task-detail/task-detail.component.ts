import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OcrObserverTask } from 'src/app/models/ocrObserverTask';
import { MessageService } from 'src/app/services/message.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
    selector: 'task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
    @Input() task?: OcrObserverTask[];

    constructor(
        private route: ActivatedRoute,
        private taskService: TaskService,
        private location: Location,
        private messageService: MessageService
    ) {
    }

    ngOnInit(): void {
        this.getTask();
    }

    getTask(): void {
        const id = Number(this.route.snapshot.paramMap.get('idtask'));
        this.taskService.getTask(id)
            .subscribe(task => {
                this.task = task;
            });
    }

    goBack(): void {
        this.location.back();
    }

    save(): void {
        if (this.task) {
            this.taskService.updateTask(this.task[0])
                .subscribe(() => this.goBack());
        }
    }

    delete(): void {
        const id = Number(this.route.snapshot.paramMap.get('idtask'));
        this.taskService.deleteTask(id).subscribe(() => {
            this.goBack();
        });
    }
}