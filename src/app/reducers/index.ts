import {
    ActionReducerMap,
    MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment'
import { State as WriterState, writerReducer, writersFeatureKey } from './writers.reducer'

export interface State {
    [writersFeatureKey]: WriterState;
}

export const reducers: ActionReducerMap<State> = {
    [writersFeatureKey]: writerReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];