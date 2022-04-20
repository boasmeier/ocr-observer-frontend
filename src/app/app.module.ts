import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AbbreviationPipe } from './AbbreviationPipe';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DatasetsComponent } from './components/datasets/datasets.component';
import { DatasetDetailComponent } from './components/dataset-detail/dataset-detail.component';
import { ImagesComponent } from './components/images/images.component';
import { ImageFieldsEditorComponent } from './components/image-fields-editor/image-fields-editor.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FieldsComponent } from './components/fields/fields.component';

@NgModule({
    declarations: [
        AbbreviationPipe,
        AppComponent,
        PageNotFoundComponent,
        DatasetsComponent,
        DatasetDetailComponent,
        ImagesComponent,
        ImageFieldsEditorComponent,
        ImageUploadComponent,
        FieldsComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
