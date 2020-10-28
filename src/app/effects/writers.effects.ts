import { Injectable, OnDestroy } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { mergeMap, map } from 'rxjs/operators';
import {
  resetChangeUrgencyWritersList,
  LoadSomeActions,
  loadWritersList,
  setWritersList,
  putChangeUrgencyWritersList,
  loadDealerList,
  setDealerList,
  loadBookList,
  setBookList,
  putChangeUrgencyBookList,
  resetChangeUrgencyBookList,
} from '../actions/writers.actions';
import { StitchService } from '../stitch-service.service';
import { from, Subscription, Observable } from 'rxjs';
import { ChangeUrgencyWriter, ChangeUrgencyBook } from '../interfaces';
import { select, Store } from '@ngrx/store';
import { State } from '../reducers';

@Injectable()
export class WritersEffects implements OnInitEffects, OnDestroy {
  urgencyWritersList: ChangeUrgencyWriter[];
  urgencyWritersList$Subscription: Subscription;
  urgencyWritersList$: Observable<ChangeUrgencyWriter[]> = this.store$.pipe(
    select('writers', 'urgencyWritersList')
  );

  urgencyBookList: ChangeUrgencyBook[];
  urgencyBookList$Subscription: Subscription;
  urgencyBookList$: Observable<ChangeUrgencyBook[]> = this.store$.pipe(
    select('writers', 'urgencyBookList')
  );
  // tslint:disable-next-line: variable-name
  constructor(private actions$: Actions, private stitchService: StitchService, private store$: Store<State>) {
    this.urgencyWritersList$Subscription = this.urgencyWritersList$.subscribe((writersList) => this.urgencyWritersList = writersList);
    this.urgencyBookList$Subscription = this.urgencyBookList$.subscribe((bookList) => this.urgencyBookList = bookList);
  }

  loadWritersList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWritersList),
      mergeMap((action: any) => from(this.stitchService.getWriters())
        .pipe(
          mergeMap(writersList => [
            setWritersList({ writersList: JSON.parse(JSON.stringify(writersList)) }),
          ]),
          // catchError(() => of({ type: '[Movies API] Movies Loaded Error' }))
        )
      ),
    )
  );

  loadDealerList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDealerList),
      mergeMap((action: any) => from(this.stitchService.getDealers())
        .pipe(
          mergeMap(dealerList => [
            setDealerList({ dealerList: JSON.parse(JSON.stringify(dealerList)) }),
          ]),
        )
      ),
    )
  );

  loadBookList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBookList),
      mergeMap((action: any) => from(this.stitchService.getBooks())
        .pipe(
          mergeMap(bookList => [
            setBookList({ bookList: JSON.parse(JSON.stringify(bookList)) }),
          ]),
        )
      ),
    )
  );

  putChangeUrgencyWritersList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(putChangeUrgencyWritersList),
      mergeMap((action: any) => from(this.stitchService.updateDBFromUrgencyWritersList(this.urgencyWritersList))
        .pipe(
          mergeMap(_ => [
            loadWritersList(),
            resetChangeUrgencyWritersList(),
          ]),
        )
      ),
    )
  );

  putChangeUrgencyBookList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(putChangeUrgencyBookList),
      mergeMap((action: any) => from(this.stitchService.updateDBFromUrgencyBookList(this.urgencyBookList))
        .pipe(
          mergeMap(_ => [
            loadBookList(),
            resetChangeUrgencyBookList(),
          ]),
        )
      ),
    )
  );

  loadSomeActions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadSomeActions),
      mergeMap((action: any) => from(new Promise(resolve => { resolve(); }))
        .pipe(
          mergeMap(_ => [
            loadWritersList(),
            loadDealerList(),
            loadBookList(),
          ]),
        )
      ),
    )
  );



  ngrxOnInitEffects() {
    return LoadSomeActions();
  }

  ngOnDestroy() {
    this.urgencyWritersList$Subscription.unsubscribe();
    this.urgencyBookList$Subscription.unsubscribe();
  }

}
