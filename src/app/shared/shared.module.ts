import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogCardComponent } from './component/blog-card/blog-card.component';
import {RouterModule} from "@angular/router";
import { SliderCardComponent } from './component/slider-card/slider-card.component';
import { PopupFormComponent } from './component/popup-form/popup-form.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ArticleFilterComponent } from './component/article-filter/article-filter.component';
import { LoaderComponent } from './component/loader/loader.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";



@NgModule({
  declarations: [
    BlogCardComponent,
    SliderCardComponent,
    PopupFormComponent,
    ArticleFilterComponent,
    LoaderComponent,
  ],
    imports: [
        CommonModule,
        RouterModule,
      FormsModule,
      ReactiveFormsModule,
      MatDialogModule,
      MatInputModule,
      MatSelectModule,
      MatProgressSpinnerModule,
      MatFormFieldModule
    ],
  exports: [
    BlogCardComponent,
    SliderCardComponent,
    PopupFormComponent,
    LoaderComponent,
    ArticleFilterComponent
  ]
})
export class SharedModule { }
