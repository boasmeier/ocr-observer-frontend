import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OcrObserverTask } from 'src/app/models/ocrObserverTask';
import { MessageService } from 'src/app/services/message.service';
import { TaskService } from 'src/app/services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
    selector: 'task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
    @Input() task!: OcrObserverTask[];

    constructor(
        private route: ActivatedRoute,
        private taskService: TaskService,
        private router: Router,
        private location: Location,
        private messageService: MessageService,
        public dialog: MatDialog
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
        const url = `/tasks`
        this.router.navigateByUrl(url);
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

    openDeleteDialog(): void {
        let dialogRef = this.dialog.open(DeleteDialogComponent, {
            width: '50em',
            data: { 
                target: 'Auftrag',
                targetId: this.task[0].idtask,
                dialogText: 'Löschen dieses Auftrags wird auch alle beinhalteten Datensätze, deren Bilder und entspechende Felder löschen. Bist du sicher?'
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
