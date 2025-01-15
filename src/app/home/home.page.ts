import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  InfiniteScrollCustomEvent,
  IonList,
  IonAvatar,
  IonSkeletonText,
  IonItem,
  IonAlert,
  IonLabel,
  IonBadge,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import { MovieService } from "../services/movie.service";
import { MovieResult } from "../services/interfaces";
import { catchError, finalize } from "rxjs";
import { DatePipe } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: [ 'home.page.scss' ],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonAvatar,
    IonSkeletonText,
    IonItem,
    IonAlert,
    IonLabel,
    DatePipe,
    RouterLink,
    IonBadge,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  ],
  standalone: true
})
export class HomePage {
  private movieService = inject(MovieService);
  private currentPage = 1;
  public movies: MovieResult[] = [];
  public error: any = null;
  public isLoading = false;
  public imageBaseUrl = 'https://image.tmdb.org/t/p';
  public dummyArray = new Array(5);

  constructor() {
    this.loadMovies();
  }

  loadMovies(event?: InfiniteScrollCustomEvent) {
    this.error = null;

    if(!event) {
      this.isLoading = true;
    }

    this.movieService
      .getTopRatedMovies(this.currentPage)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          if(event) {
            event.target.complete();
          }
        }),
        catchError(err => {
          this.error = err.error.status_message;
          return [];
        }),
      )
      .subscribe({
        next: res => {
          this.movies.push(...res.results);
        }
      })
  }

  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }
}
