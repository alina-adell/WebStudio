import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute} from "@angular/router";
import {ArticlesCardType} from "../../../../types/articles-card.type";
import {ArticleType} from "../../../../types/article.type";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {CommentsParamsType} from "../../../../types/comments-params.type";
import {CommentsType} from "../../../../types/comments.type";
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SendCommentType} from "../../../../types/send-comment.type";
import {CommentService} from "../../../shared/services/comment.service";
import {AuthService} from "../../../core/auth/auth.service";
import {LoaderService} from "../../../shared/services/loader.service";
import {UserReactionsType} from "../../../../types/user-reactions.type";
import {CommentsToShowType} from "../../../../types/comments-to-show.type";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {


  article: ArticleType | null = null;
  relatedArticles: ArticlesCardType[] = [];
  isLogged: boolean = false;


  commentForm = this.fb.group({
    comment: ['', [Validators.required]],
  })

  articles: ArticlesCardType[] = [];
  commentParams: CommentsParamsType = {offset: 0, article: ''};

  comments: CommentsType | null = null;
  commentsToShow: CommentsToShowType | null = null;
  userReactions: UserReactionsType[] = [];
  showMore: boolean = false;

  // commentsToShow: CommentsType['comments'] = [ {
  //   id: "",
  //   text: "",
  //   date: "",
  //   likesCount: 0,
  //   dislikesCount: 0,
  //   user: {
  //     id: "",
  //     name: ""
  //   }
  // } ];


  constructor(private articleService: ArticleService,
              private commentService: CommentService,
              private sanitizer: DomSanitizer,
              private fb: FormBuilder,
              private _snackBar: MatSnackBar,
              private authService: AuthService,
              private loaderService: LoaderService,
              private activatedRoute: ActivatedRoute) {
  }


  ngOnInit() {
    this.isLogged = this.authService.isLoggedIn();
    this.loaderService.show();


    this.activatedRoute.params.subscribe(params => {
      this.articleService.getArticle(params['url'])
        .subscribe((data: ArticleType) => {
          if (!data) {
            this._snackBar.open('Ошибка получения ответа с сервера');
            throw new Error('Ошибка получения ответа с сервера');
          }
          this.article = data;
          if (this.article) {
            this.commentParams.article = this.article.id;
          }
          this.getComments();
        });
      this.articleService.getRelatedArticles(params['url'])
        .subscribe((data: ArticlesCardType[]) => {
          if (!data) {
            this._snackBar.open('Ошибка получения ответа с сервера');
            throw new Error('Ошибка получения ответа с сервера');
          }
          this.relatedArticles = data;

        })

    })

  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  getComments() {
    this.loaderService.show();
    if (this.article && this.article.commentsCount && this.article.commentsCount > 0) {

      this.commentService.getComments(this.commentParams)
        .subscribe((data: CommentsType) => {
          if (!data) {
            this._snackBar.open('ошибка получения запроса с сервера');
            throw new Error((data as DefaultResponseType).message);
          }
          this.comments = data;
          this.commentsToShow = data.comments;

          console.log('this.comments', this.comments);
          console.log('this.commentsToShow', this.commentsToShow)

          if (this.isLogged) {

            if (this.article && this.article.id) {
              this.commentService.getUserReactions(this.article.id)
                .subscribe((data: UserReactionsType[] | DefaultResponseType) => {
                  if (!(data as DefaultResponseType).error && (data as UserReactionsType[])) {
                    this.userReactions = (data as UserReactionsType[]);

                    // Проходимся по массиву комментариев
                    if (this.comments) {
                      this.comments.comments.forEach(comment => {
                        // Находим соответствующую реакцию пользователя
                        const reaction = this.userReactions.find(reaction => reaction.comment === comment.id);

                        // Если нашли реакцию, присваиваем её комментарию
                        if (reaction) {
                          comment.user.reaction = reaction.action;
                        }
                      });
                    }

                  } else if ((data as DefaultResponseType).error) {
                    this._snackBar.open((data as DefaultResponseType).message);
                    throw new Error((data as DefaultResponseType).message);
                  }

                })
            }

          }

          if (this.commentParams.offset === 0) {
            if (this.comments.comments.length > 3) {
              this.comments.comments = this.comments.comments.slice(0, 3) as CommentsType['comments'];
              this.showMore = true;
              this.commentParams.offset = 3;
              return;
            }
          }

          if (this.commentParams.offset) {
            this.commentParams.offset += 10;
            this.showMore = this.comments.allCount > this.commentParams.offset;
          }

        });
    }
  }

  // processComments() {
  //   this.commentsToShowCount += 10;
  //   if (this.comments) {
  //     this.commentsToShow = this.comments.comments.slice(0, this.commentsToShowCount) as CommentsType['comments'];
  //   }
  // }

  sendComment() {

    if (this.commentForm.invalid) {
      this._snackBar.open('Ошибка формы на старте');
    }


    if (this.commentForm.valid && this.commentForm.value.comment && this.article && this.article.id) {
      const paramsObject: SendCommentType = {
        "text": this.commentForm.value.comment,
        "article": this.article.id
      }

      this.commentService.sendComment(paramsObject)
        .subscribe({
          next: (data: SendCommentType | DefaultResponseType) => {
            if (!(data as DefaultResponseType).error) {
              this._snackBar.open((data as DefaultResponseType).message)
            } else if ((data as DefaultResponseType).error) {
              this._snackBar.open((data as DefaultResponseType).message);
              throw new Error((data as DefaultResponseType).message);
            }
            this.commentForm.reset();
            this.commentParams.offset = 0;
            this.getComments();
          },

          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка добавления комментария')
            }
          }
        })
    }
  }

  sendReaction(reaction: string, commentId: string) {
    if (this.isLogged) {
      this.commentService.sendReaction(reaction, commentId)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (!(data as DefaultResponseType).error) {
              if (reaction === 'violate') {
                this._snackBar.open('Жалоба отправлена');
                return;
              }
              this._snackBar.open((data as DefaultResponseType).message + " Ваш голос учтен")
            } else if ((data as DefaultResponseType).error) {
              this._snackBar.open((data as DefaultResponseType).message);
              throw new Error((data as DefaultResponseType).message);
            }
            if (this.commentParams.offset) {
              this.commentParams.offset -= 10;
              this.commentParams.offset = this.commentParams.offset < 0 ? 0 : this.commentParams.offset;
            };
            this.getComments();
          },

          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message)
            } else {
              this._snackBar.open('Ошибка добавления реакции на комментарий')
            }
          }
        })
    } else {
      this._snackBar.open('Только зарегистрированные пользователи могут оставлять реакции')
    }
  }
}


