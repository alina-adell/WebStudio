import { Component } from '@angular/core';
import {DialogService} from "../../services/dialog.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private dialogService: DialogService) {
  }
  openDialog() {
    this.dialogService.openPopupForm('consult'); //передаем данные для попап через сервис
  }
}
