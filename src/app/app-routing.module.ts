import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { DatasetDetailComponent } from './components/dataset-detail/dataset-detail.component';
import { ImageFieldsEditorComponent } from './components/image-fields-editor/image-fields-editor.component';

const routes: Routes = [
    { path: '', redirectTo: '/datasets', pathMatch: 'full' },
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
