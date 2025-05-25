import {Component, ElementRef, Inject, TemplateRef, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {OrderType} from "../../../../types/order.type";
import {OrderService} from "../../services/order.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogService} from "../../services/dialog.service";

interface Title {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'popup-form',
  templateUrl: './popup-form.component.html',
  styleUrls: ['./popup-form.component.scss']
})
export class PopupFormComponent {

  @ViewChild('thankYouPage') thankYouPage!: TemplateRef<ElementRef>;
  dialogRefNew: MatDialogRef<any> | null = null;

  selectedValue!: string;
  orderForm!: FormGroup;
  isError: boolean = false;
  isConsult: boolean = false;

  titles: Title[] = [
    {value: 'site', viewValue: 'Создание сайтов'},
    {value: 'promo', viewValue: 'Продвижение'},
    {value: 'adv', viewValue: 'Реклама'},
    {value: 'text', viewValue: 'Копирайтинг'}
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string },
              private fb: FormBuilder,
              private orderService: OrderService,
              private dialog: MatDialog,
              private dialogService: DialogService,
              private router: Router,
              private dialogRef: MatDialogRef<PopupFormComponent>,
              private _snackBar: MatSnackBar) {

    if (data.title == 'consult') {
      this.isConsult = true;
      this.selectedValue = 'consult';
    } else {
      this.isConsult = false;
      const foundTitle = this.titles.find(title => title.viewValue === data.title); //найдем какой value соответствует title из main
      this.selectedValue = foundTitle ? foundTitle.value : this.titles[0].value; //и подставим этот value в форму или первый в массиве, если не найдем

    }
    this.orderForm = this.fb.group({
      title: [this.selectedValue, Validators.required],
      name: ['', [Validators.required, Validators.pattern('^[A-ZА-Я][a-zа-яё]*$')]], //Только буквы и первая заглавная
      phone: ['', [Validators.required, Validators.pattern('^[0-9()-\\s]*$')]] //только цифры и пробел -()
    });
  }

  sendRequest() {

    if(this.orderForm.valid && this.orderForm.value.name && this.orderForm.value.phone
      && this.orderForm.value.title) {


      const type = this.isConsult ? 'consultation' : 'order';
      const paramsObject: OrderType = {
        name: this.orderForm.value.name,
        phone: this.orderForm.value.phone,
        service: this.orderForm.value.title,
        type: type
      }

      this.orderService.createOrder(paramsObject)
        .subscribe({
          next: (data: OrderType | DefaultResponseType) => {
            if ((data as DefaultResponseType).error) {
              throw new Error((data as DefaultResponseType).message);
            }
            if (this.dialogRef) {
              this.dialogService.closePopupForm(this.dialogRef);
            }
            this.openThankYouPage();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this.isError = true;
            }
          }
        })

    }
  }

  openThankYouPage() {
    this.dialogRefNew = this.dialog.open(this.thankYouPage);
    this.dialogRefNew.backdropClick().subscribe(() => {
      this.router.navigate(['/']); // Переведем пользователя на главную по клику мимо попапа
    });

  }

  closeThankYouPage() {
    this.dialogRefNew?.close();
  }
}



