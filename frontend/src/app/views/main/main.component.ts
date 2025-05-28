import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../shared/services/article.service";
import {ArticlesCardType} from "../../../types/articles-card.type";
import {OwlOptions} from "ngx-owl-carousel-o";
import {BannerType} from "../../../types/banner.type";
import {MatDialog} from "@angular/material/dialog";
import {DialogService} from "../../shared/services/dialog.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{

  articles: ArticlesCardType[] = [];

  banners: BannerType[] = [
    {
      preTitle: 'Предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса <span>-15%</span>!',
      text: '',
      image: 'banner-1.png',
      consultType: 'Продвижение'
    },
    {
      preTitle: 'Акция',
      title: 'Нужен грамотный <span>копирайтер</span>? ',
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      image: 'banner-2.png',
      consultType: 'Копирайтинг'
    },
    {
      preTitle: 'Новость дня',
      title: '<span>6 место</span> в ТОП-10 SMM-агенств Москвы!',
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      image: 'banner-3.png',
      consultType: 'Реклама'
    },
  ]

  offers = [
    {
      image: 'offer-1.png',
      title: 'Создание сайтов',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500',
    },
    {
      image: 'offer-2.png',
      title: 'Продвижение',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500',
    },
    {
      image: 'offer-3.png',
      title: 'Реклама',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1 000',
    },
    {
      image: 'offer-4.png',
      title: 'Копирайтинг',
      text: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750',
    },
  ]

  reviews = [
    {
      name: 'Станислав',
      image: 'review-1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review-2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review-3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      name: 'Станислав',
      image: 'review-1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review-2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review-3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
  ]

  customOptionsSlider: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 0,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
    },
    nav: false
  }


  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  }

  constructor(private articleService: ArticleService,
              private dialog: MatDialog,
              private dialogService: DialogService) {
  }

  ngOnInit() {
    this.articleService.getTopArticles()
      .subscribe((data: ArticlesCardType[]) => {
        this.articles = data;
      })
  }

  openDialog(title: string) {
    this.dialogService.openPopupForm(title); //передаем данные для попап через сервис

    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.data = { title: title }; // Передаем данные в диалоговое окно
    // this.dialogRef = this.dialog.open(PopupFormComponent, dialogConfig);
    // this.dialog.open(PopupFormComponent, dialogConfig);
  }


}
