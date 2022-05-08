import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { DatasetDetailComponent } from './components/dataset-detail/dataset-detail.component';
import { ImageFieldsEditorComponent } from './components/image-fields-editor/image-fields-editor.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';

const routes: Routes = [
    { path: '', redirectTo: '/tasks', pathMatch: 'full' },
    { path: 'tasks', component: TasksComponent },
    { path: 'tasks/:idtask', component: TaskDetailComponent },
    { path: 'datasets', component: DatasetsComponent },
    { path: 'datasets/:iddataset', component: DatasetDetailComponent },
    { path: 'images/:idimage', component: ImageFieldsEditorComponent },
    { path: '**', component: PageNotFoundComponent }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
