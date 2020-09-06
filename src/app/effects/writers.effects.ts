import { Injectable, OnDestroy } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { mergeMap, map } from 'rxjs/operators';
import {
  resetChangeUrgencyWritersList,
  setWriter,
  LoadSomeActions,
  loadWritersList,
  setWritersList,
  loadCitiesList,
  setCitiesList,
  loadCommunitiesList,
  setCommunitiesList,
  putChangeUrgencyWritersList,
  loadDealerList,
  setDealerList,
  setDealer,
  loadDealer
} from '../actions/writers.actions';
import { StitchService } from '../stitch-service.service';
import { from, Subscription, Observable } from 'rxjs';
import { ChangeUrgencyWriter } from '../interfaces';
import { select, Store } from '@ngrx/store';
import { State } from '../reducers';

@Injectable()
export class WritersEffects implements OnInitEffects, OnDestroy {
  urgencyWritersList: ChangeUrgencyWriter[];
  urgencyWritersList$Subscription: Subscription;
  urgencyWritersList$: Observable<ChangeUrgencyWriter[]> = this._store$.pipe(
    select('writers', 'urgencyWritersList')
  );
  // tslint:disable-next-line: variable-name
  constructor(private actions$: Actions, private stitchService: StitchService, private _store$: Store<State>) {
    this.urgencyWritersList$Subscription = this.urgencyWritersList$.subscribe((writersList) => this.urgencyWritersList = writersList);
  }

  loadWriter$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Writer] load Writer'),
      mergeMap((action: any) => from(this.stitchService.getWriter(action.writerId))
        .pipe(
          map(writer => setWriter({ writer: JSON.parse(JSON.stringify(writer)) })),
          // catchError(() => of({ type: '[Movies API] Movies Loaded Error' }))
        )
      ),
    )
  );

  loadDealer$ = createEffect(() =>
    this.actions$.pipe(
      ofType('[Dealers] load Dealer'),
      mergeMap((action: any) => from(this.stitchService.getDealerById(action.dealerId))
        .pipe(
          map(dealer => setDealer({ dealer: JSON.parse(JSON.stringify(dealer)) })),
          // catchError(() => of({ type: '[Movies API] Movies Loaded Error' }))
        )
      ),
    )
  );

  loadWritersList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWritersList),
      mergeMap((action: any) => from(this.stitchService.getWriters())
        .pipe(
          mergeMap(writersList => [
            setWritersList({ writersList: JSON.parse(JSON.stringify(writersList)) }),
            loadCitiesList(),
            loadCommunitiesList(),
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

  loadCitiesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCitiesList),
      mergeMap((action: any) => from(this.stitchService.getCities())
        .pipe(
          mergeMap(cities => [
            setCitiesList({ citiesList: cities }),
          ]),
          // catchError(() => of({ type: '[Movies API] Movies Loaded Error' }))
        )
      ),
    )
  );

  loadCommunitiesList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCommunitiesList),
      mergeMap((action: any) => from(this.stitchService.getCommunities())
        .pipe(
          mergeMap(communities => [
            setCommunitiesList({ communitiesList: communities.communities }),
          ]),
          // catchError(() => of({ type: '[Movies API] Movies Loaded Error' }))
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

  loadSomeActions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadSomeActions),
      mergeMap((action: any) => from(new Promise(resolve => { resolve(); }))
        .pipe(
          mergeMap(_ => [
            loadWritersList(),
            loadDealerList(),
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
  }
  // loadWritersListIntervals$ = createEffect(() =>
  //   interval(300000).pipe(
  //     map(_ => loadWritersList())
  //   )
  // )
}
