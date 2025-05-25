import {Component, Input, OnInit} from '@angular/core';
import {ArticlesCardType} from "../../../../types/articles-card.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'blog-card',
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.scss']
})
export class BlogCardComponent {

  @Input() article!: ArticlesCardType;
  serverStaticPath = environment.serverStaticPath;

}
