import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageFieldsEditorComponent } from './image-fields-editor.component';

describe('ImageFieldsEditorComponent', () => {
  let component: ImageFieldsEditorComponent;
  let fixture: ComponentFixture<ImageFieldsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageFieldsEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageFieldsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
