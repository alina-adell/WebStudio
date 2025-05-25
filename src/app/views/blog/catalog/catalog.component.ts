import {Component, Host, HostListener, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticlesCardType} from "../../../../types/articles-card.type";
import {CategoriesType} from "../../../../types/categories.type";
import {ActivatedRoute, Router} from "@angular/router";
import {FilteredCategoriesType} from "../../../../types/filtered-categories.type";
import {ActiveParamsType} from "../../../../types/active-params.type";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit{

  articles: ArticlesCardType[] = [];
  open = false;
  categories: CategoriesType[] = [];
  pages: number[] = [];
  filteredCategories: FilteredCategoriesType[] = [];
  activeParams: ActiveParamsType = {page: 1, categories: []};




  constructor(private articleService: ArticleService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {

    this.articleService.getCategories()
      .subscribe(data => {
        this.categories = data;

        this.activatedRoute.queryParams.subscribe(params => {

          if (params.hasOwnProperty('categories')) {
            this.activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']]; //если не массив, то сделали массивом
          }

          if (params.hasOwnProperty('page')) {
            this.activeParams.page = +params['page']; //+ чтобы сразу конвертировать в цифру
          }


          if (this.categories && this.categories.length > 0) {
            if (this.activeParams.categories && this.activeParams.categories.length > 0) {
              this.categories.forEach(item => {item.active = this.activeParams.categories.includes(item.url)});
              this.filteredCategories = this.categories.filter(category => this.activeParams.categories.includes(category.url)); //отфильтровали categories
            } else {
              this.filteredCategories = [];
              this.categories.forEach(item => {item.active = false});
            }

          }


          if (this.activeParams.categories && this.activeParams.page) {
            this.articleService.getArticlesWithParams(this.activeParams)
              .subscribe(data => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }
                this.articles = data.items;
              })
          } else {
            this.articleService.getArticles()
              .subscribe(data => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }
                this.articles = data.items;
              })
          }

        });
      })
  }


  removeAppliedFilter(appliedFilter: FilteredCategoriesType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.url);
    if (this.activeParams.categories && this.activeParams.categories.length === 0) {

      this.open = false;
    }

    this.activeParams.page = 1;

    this.router.navigate(['/catalog'], {queryParams: this.activeParams});
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], {queryParams: this.activeParams});
  }

  openPrevPage(){
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/catalog'], {queryParams: this.activeParams});
    }
  }
  openNextPage(){
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/catalog'], {queryParams: this.activeParams});
    }
  }
}
