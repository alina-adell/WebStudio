import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {PopupFormComponent} from "../component/popup-form/popup-form.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openPopupForm(title: string) {
    const dialogConfig = {
      data: { title: title }
    };
    return this.dialog.open(PopupFormComponent, dialogConfig);
  }

  closePopupForm(dialogRef: MatDialogRef<any>) {
    dialogRef.close();
  }
}
