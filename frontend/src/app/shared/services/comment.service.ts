import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {CommentsParamsType} from "../../../types/comments-params.type";
import {Observable, tap} from "rxjs";
import {CommentsType} from "../../../types/comments.type";
import {environment} from "../../../environments/environment";
import {SendCommentType} from "../../../types/send-comment.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {UserReactionsType} from "../../../types/user-reactions.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {


  constructor(private http: HttpClient) { }


  getComments(params: CommentsParamsType): Observable<CommentsType> {
    return this.http.get<CommentsType>(environment.api + 'comments', {params: params} )
      .pipe(
        tap((response: CommentsType) => {
          response.comments.forEach(comment => {
            comment.date = this.formatDate(comment.date);
          });
        })
      )
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  }


  sendComment(data: SendCommentType): Observable<SendCommentType | DefaultResponseType> {
    return this.http.post<SendCommentType | DefaultResponseType>(environment.api + 'comments', data)
  }

  sendReaction(reaction: string, articleId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + articleId + '/apply-action', {
      action: reaction
    })
  }

  getUserReactions(articleId: string): Observable<UserReactionsType[] | DefaultResponseType> {
    const params = new HttpParams().set('articleId', articleId);
    return this.http.get<UserReactionsType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions', {params})
  }


  // addCommentTo(articleID: string, text: string): Observable<DefaultResponseType> {
  //   return this.http.post<DefaultResponseType>(environment.api + 'comments', {
  //     text: text,
  //     article: articleID,
  //   })
  // }

}
