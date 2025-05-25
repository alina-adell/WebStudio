import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ArticlesCardType} from "../../../types/articles-card.type";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {CategoriesType} from "../../../types/categories.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticleType} from "../../../types/article.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getTopArticles(): Observable<ArticlesCardType[]> {
    return this.http.get<ArticlesCardType[]>(environment.api + 'articles/top');
  }

  getArticlesWithParams(params: ActiveParamsType): Observable< {count: number, pages: number, items: ArticlesCardType[]}> {
    return this.http.get<{count: number, pages: number, items: ArticlesCardType[]}>(environment.api + 'articles', {
      params: params
    });
  }

  getArticles(): Observable< {count: number, pages: number, items: ArticlesCardType[]}> {
    return this.http.get<{count: number, pages: number, items: ArticlesCardType[]}>(environment.api + 'articles');
  }


  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url);
  }

  getRelatedArticles(url: string): Observable<ArticlesCardType[]> {
    return this.http.get<ArticlesCardType[]>(environment.api + 'articles/related/' + url);
  }


  getCategories(): Observable< CategoriesType[]> {
    return this.http.get<CategoriesType[]>(environment.api + 'categories');
  }
}
