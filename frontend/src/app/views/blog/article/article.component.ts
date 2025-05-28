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
                .subscribe({
                    next: (data: ArticleType) => {
                        if (!data) {
                            this._snackBar.open('Ошибка получения ответа с сервера');
                            this.loaderService.hide();
                            throw new Error('Ошибка получения ответа с сервера');
                        }
                        this.article = data;
                        if (this.article) {
                            this.commentParams.article = this.article.id;
                        }
                        this.getComments(); // Лоадер скроется в getComments
                    },
                    error: () => {
                        this.loaderService.hide();
                    }
                });
            this.articleService.getRelatedArticles(params['url'])
                .subscribe({
                    next: (data: ArticlesCardType[]) => {
                        if (!data) {
                            this._snackBar.open('Ошибка получения ответа с сервера');
                            this.loaderService.hide();
                            throw new Error('Ошибка получения ответа с сервера');
                        }
                        this.relatedArticles = data;
                    },
                    error: () => {
                        this.loaderService.hide();
                    }
                });
        });
    }

    sanitizeHtml(html: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    getComments() {
        this.loaderService.show();
        if (this.article && this.article.commentsCount && this.article.commentsCount > 0) {
            this.commentService.getComments(this.commentParams)
                .subscribe({
                    next: (data: CommentsType) => {
                        if (!data) {
                            this._snackBar.open('ошибка получения запроса с сервера');
                            this.loaderService.hide();
                            throw new Error((data as DefaultResponseType).message);
                        }
                        this.comments = data;
                        this.commentsToShow = data.comments;

                        console.log('this.comments', this.comments);
                        console.log('this.commentsToShow', this.commentsToShow)

                        if (this.isLogged && this.article && this.article.id) {
                            this.commentService.getUserReactions(this.article.id)
                                .subscribe({
                                    next: (data: UserReactionsType[] | DefaultResponseType) => {
                                        if (!(data as DefaultResponseType).error && (data as UserReactionsType[])) {
                                            this.userReactions = (data as UserReactionsType[]);
                                            if (this.comments) {
                                                this.comments.comments.forEach(comment => {
                                                    const reaction = this.userReactions.find(reaction => reaction.comment === comment.id);
                                                    if (reaction) {
                                                        comment.user.reaction = reaction.action;
                                                    }
                                                });
                                            }
                                        } else if ((data as DefaultResponseType).error) {
                                            this._snackBar.open((data as DefaultResponseType).message);
                                        }
                                        this.loaderService.hide(); // скрываем лоадер после получения реакций
                                    },
                                    error: () => {
                                        this.loaderService.hide();
                                    }
                                });
                        } else {
                            this.loaderService.hide(); // скрываем лоадер если не нужен второй запрос
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
                    },
                    error: () => {
                        this.loaderService.hide();
                    }
                });
        } else {
            this.loaderService.hide(); // если нет комментариев, скрываем лоадер
        }
    }

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
