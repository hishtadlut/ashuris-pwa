import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { mergeMap, map } from 'rxjs/operators';
import { setWriter, loadWritersList, setWritersList, loadCitiesList, setCitiesList, loadCommunitiesList, setCommunitiesList } from '../actions/writers.actions';
import { StitchService } from '../stitch-service.service';
import { from, interval } from 'rxjs';


@Injectable()
export class WritersEffects implements OnInitEffects {
  constructor(private actions$: Actions, private stitchService: StitchService) { }

  ngrxOnInitEffects() {
    return loadWritersList();
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
  )

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
  // loadWritersListIntervals$ = createEffect(() =>
  //   interval(300000).pipe(
  //     map(_ => loadWritersList())
  //   )
  // )
}
