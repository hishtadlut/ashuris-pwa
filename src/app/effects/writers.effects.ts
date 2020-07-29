import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType, OnInitEffects } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from 'rxjs/internal/scheduler/Action';
import { mergeMap, map, catchError, switchMap, tap } from 'rxjs/operators';
import { loadWriter, setWriter, loadWritersList, setWritersList } from '../actions/writers.actions';
import { StitchService } from '../stitch-service.service';
import { from } from 'rxjs';
import { JSDocCommentStmt } from '@angular/compiler';


@Injectable()
export class WritersEffects {
  constructor(private actions$: Actions, private stitchService: StitchService) { }
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
          map(writersList => setWritersList({ writersList: JSON.parse(JSON.stringify(writersList)) })),
          // catchError(() => of({ type: '[Movies API] Movies Loaded Error' }))
        )
      ),
    )
  )
}
