import {Component, HostListener, Input, OnInit} from '@angular/core';
import {CategoriesType} from "../../../../types/categories.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'article-filter',
  templateUrl: './article-filter.component.html',
  styleUrls: ['./article-filter.component.scss']
})

export class ArticleFilterComponent implements OnInit {

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
  }


  @Input() categories: CategoriesType[] = [];
  @Input() open: boolean = false;


  //отследим клик на странице и если он не в поле фильтра, закроем фильтр
  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.open && (event.target as HTMLElement).className.indexOf('catalog-filter') === -1) {
      this.open = false
    }
  }

  activeParams: ActiveParamsType = {page: 1, categories: []};


  ngOnInit() {


    this.activatedRoute.queryParams.subscribe(params => {

        this.activeParams.categories = params['categories'] || []; // Установка значения по умолчанию

      if (this.categories && this.categories.length > 0) {
        this.categories.forEach(category => {
          category.active = this.activeParams.categories.includes(category.url);
        });
      }

    })
  }

  toggle() {
    this.open = !this.open;

    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      this.categories.forEach(category => {
        category.active = this.activeParams.categories.includes(category.url);
      });
    }

  }

  updateFilter(category: string) {


    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingCategoryParams = this.activeParams.categories.find(item => item === category)
      if (existingCategoryParams) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== category)
      } else if (!existingCategoryParams) {
        // this.activeParams.categories.push(category); //так не работало из-за бага Angular
        this.activeParams.categories = [...this.activeParams.categories, category]; //решается через создание копии и добавления нового значения
      }
    } else {
      this.activeParams.categories = [category]
    }

    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      this.categories.forEach(item => {
        item.active = this.activeParams.categories.includes(item.url);
      });
    } else {
      this.categories.forEach(item => {
        item.active = false;
      });
    }

    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {queryParams: this.activeParams});

  }

}
