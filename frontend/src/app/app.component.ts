import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'web-studio';

  constructor(
      private router: Router,
      private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          const fragment = route.snapshot.fragment;
          if (fragment) {
            setTimeout(() => {
              const element = document.getElementById(fragment);
              if (element) {
                const yOffset = -80; // подстрой под высоту своего header!
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }, 100); // задержка, чтобы DOM успел обновиться
          }
        });
  }
}
