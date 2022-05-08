import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { InsertTask } from 'src/app/models/insertTask';
import { OcrObserverTask } from 'src/app/models/ocrObserverTask';
import { MessageService } from 'src/app/services/message.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
    selector: 'tasks',
    templateUrl: './tasks.component.html',
    styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements AfterViewInit {
    tasks: OcrObserverTask[] = [];
    displayedColumns = ['idtask', 'name', 'description']
    selectedTask?: OcrObserverTask;
    insertFormActive: Boolean = false;
    taskForm: FormGroup;
    submitted = false;
    submittedAndValid = false;

    dataSource: MatTableDataSource<OcrObserverTask> = new MatTableDataSource<OcrObserverTask>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    
    constructor(private taskService: TaskService, private messageService: MessageService, private formBuilder: FormBuilder) {
        this.taskForm = this.getForm();
    }

    ngAfterViewInit(): void{
        this.getTasks();
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
        if (this.taskForm.invalid) {
            return;
        }

        this.submittedAndValid = true;
        this.submitted = false;
        this.taskForm = this.getForm();
        const insertTask = this.parseFormData(data);
        console.log('Submit: ', insertTask);
        this.add(insertTask);
        this.toggleInsertForm();
        setTimeout(() => this.submittedAndValid = false, 5000);
        return;
    }

    parseFormData(data: any) {
        const insertTask = new InsertTask(
            data.name,
            data.description,
        );
        return insertTask;
    }

    onSelect(task: OcrObserverTask): void {
        this.selectedTask = task;
        this.messageService.info(`TaskComponent: Selected dataset id=${task.idtask}`);
    }

    getTasks(): void {
        this.taskService.getTasks().subscribe(tasks => {
            this.tasks = tasks;
            this.dataSource = new MatTableDataSource<OcrObserverTask>(tasks);
            this.dataSource.paginator = this.paginator;
        });
    }

    delete(task: OcrObserverTask): void {
        this.tasks = this.tasks.filter(t => t !== task);
        this.taskService.deleteTask(task.idtask).subscribe();
    }

    toggleInsertForm() {
        this.insertFormActive = !this.insertFormActive;
    }

    add(task: InsertTask): void {
        task.name = task.name.trim();
        task.description = task.description.trim();
        this.taskService.addTask(task)
            .subscribe(() => {
                this.getTasks();
            });
    }
}
