import {Component, Input, OnInit} from '@angular/core';
import {BannerType} from "../../../../types/banner.type";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {DialogService} from "../../services/dialog.service";

@Component({
  selector: 'slider-card',
  templateUrl: './slider-card.component.html',
  styleUrls: ['./slider-card.component.scss']
})
export class SliderCardComponent implements OnInit{

  @Input() banner!: BannerType;

  constructor(private sanitizer: DomSanitizer,
              private dialogService: DialogService) {
  }

  ngOnInit() {
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  openDialog(title: string) {
    this.dialogService.openPopupForm(title); //передаем данные для попап через сервис
  }

}
