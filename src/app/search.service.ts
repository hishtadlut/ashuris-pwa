import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Writer, AdvancedSearchQuery, Book } from './interfaces';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from './reducers';
import { StitchService } from './stitch-service.service';
import { setAdvancedSearchResult } from './actions/writers.actions';
import { LocationPath, SearchFor } from './enums';


@Injectable({ providedIn: 'root' })
export class SearchService implements OnDestroy {
    writersToDisplay: Writer[] = [];
    writersList: Writer[];
    writersList$Subscription: Subscription;
    writersList$: Observable<Writer[]> = this.store$.pipe(
        select('writers', 'writersList')
    );

    bookList: Book[];
    bookList$Subscription: Subscription;
    bookList$: Observable<Book[]> = this.store$.pipe(
        select('writers', 'bookList')
    );
    constructor(private store$: Store<State>, private pouchDbService: StitchService) {
        this.writersList$Subscription = this.writersList$.subscribe((writersList) => this.writersList = writersList);
        this.bookList$Subscription = this.bookList$.subscribe((bookList) => this.bookList = bookList);
    }

    advancedSearch(query: AdvancedSearchQuery, searchFor: SearchFor, location: LocationPath) {

        const findInDbParms = {
            selector: {
                $and: [
                    {
                        $or: this.isAppropriateQuery(query.isAppropriateLevels)
                    },
                    {
                        $or: this.formatQuery(query.goesToKotel, 'goesToKotel')
                    },
                    {
                        $or: this.formatQuery(query.voatsInElection, 'voatsInElection')
                    },
                    {
                        $or: this.writingLevelQuery(query.writingLevel)
                    },
                    {
                        $or: this.writingTypesQuery(query.writingTypes, location)
                    },
                    {
                        $or: this.letterSizesQuery(query.letterSizes, location)
                    }
                ]
            }
        };

        const jsQuery = item => {
            if (query.priceOf === 'priceForTorahScrollPerPage' && item.pricesDeatails.isPricePerPage === 'מחיר לספר תורה') {
                const price = (item.pricesDeatails.priceForTorahScroll.price - 8700) / 245;
                return price >= query.lowestPrice && price <= query.highestPrice;
            }

            if (query.priceOf === 'priceForTorahScroll' && item.pricesDeatails.isPricePerPage === 'מחיר לספר תורה') {
                const price = (item.pricesDeatails.priceForTorahScroll.price * 245) + 8700;
                return price >= query.lowestPrice && price <= query.highestPrice;
            }

            if (query.priceOf === 'priceForMezuzah') {
                return (
                    item.pricesDeatails.priceForMezuzah.price >= query.lowestPrice
                    && item.pricesDeatails.priceForMezuzah.price <= query.highestPrice
                );
            }

            if (query.priceOf === 'priceForTefillin') {
                return (
                    item.pricesDeatails.priceForTefillin.price >= query.lowestPrice
                    && item.pricesDeatails.priceForTefillin.price <= query.highestPrice
                );
            }

            return (
                item.pricesDeatails.priceForTorahScroll.price >= query.lowestPrice
                && item.pricesDeatails.priceForTorahScroll.price <= query.highestPrice
            );
        };

        if (searchFor === SearchFor.WRITERS) {
            this.pouchDbService.localWritersDB.find(findInDbParms).then(result => {
                console.log(result);
                this.store$.dispatch(setAdvancedSearchResult({ items: result.docs.filter(jsQuery) }));
            });
        } else if (searchFor === SearchFor.BOOKS) {
            this.pouchDbService.localBooksDB.find(findInDbParms).then(result => {
                console.log(result);
                this.store$.dispatch(setAdvancedSearchResult({ items: result.docs.filter(jsQuery) }));
            });
        }
    }

    writersListFilter(filters) {
        const queryResult = this.writersList.filter(writer => {
            const cityQuery = (writer.city === filters.city || filters.city === '');
            const communityQuery = (writer.communityDeatails.community === filters.community || filters.community === '');
            const hasWritenBeforeQuery = writer.additionalDetails.hasWritenBefore.boolean === filters.hasWritenBefore;
            let isAppropriateQuery = false;
            if (!filters.isAppropriate.bad && !filters.isAppropriate.good && !filters.isAppropriate.veryGood) {
                isAppropriateQuery = true;
            } else {
                if (filters.isAppropriate.bad && (writer.isAppropriate.level === 'לא מתאים')) {
                    isAppropriateQuery = true;
                } else if (filters.isAppropriate.god && (writer.isAppropriate.level === 'מתאים')) {
                    isAppropriateQuery = true;
                } else if (filters.isAppropriate.veryGood && (writer.isAppropriate.level === 'כדאי מאוד')) {
                    isAppropriateQuery = true;
                }
            }
            return (cityQuery && communityQuery && hasWritenBeforeQuery && isAppropriateQuery);
        });

        return queryResult;
    }

    formatQuery(query: string, parameter: string): any[] {
        const path = `additionalDetails.${parameter}.boolean`;
        const queryResult = [];

        if (query === 'any') {
            queryResult.push(
                {
                    [path]: {
                        $eq: ''
                    }
                }
            );
        }

        if (query === 'true' || query === 'any') {
            queryResult.push(
                {
                    [path]: {
                        $eq: 'true'
                    }
                },
                {
                    [path]: {
                        $eq: 'false'
                    }
                }
            );
        } else {
            queryResult.push(
                {
                    [path]: {
                        $eq: 'false'
                    }
                }
            );
        }

        return queryResult;
    }

    writingLevelQuery(writingLevel: AdvancedSearchQuery['writingLevel']): { 'writingDeatails.writingLevel.level': { $eq: string; }; }[] {
        // all options are true or false.;
        const sameValueWritingLevelQuery = [...new Set(Object.values(writingLevel))].length;
        const writingLevelQuery = [];
        if (sameValueWritingLevelQuery === 1) {
            writingLevelQuery.push(
                '',
                'זול',
                'פחותה',
                'בינוני',
                'גבוהה',
                'מיוחד'
            );
        } else {
            if (writingLevel[1]) {
                writingLevelQuery.push('זול');
            }
            if (writingLevel[2]) {
                writingLevelQuery.push('פחותה');
            }
            if (writingLevel[3]) {
                writingLevelQuery.push('בינוני');
            }
            if (writingLevel[4]) {
                writingLevelQuery.push('גבוהה');
            }
            if (writingLevel[5]) {
                writingLevelQuery.push('מיוחד');
            }
        }

        return writingLevelQuery.map(level => {
            return {
                'writingDeatails.writingLevel.level': {
                    $eq: level
                }
            };
        });
    }

    isAppropriateQuery(isAppropriateLevels: AdvancedSearchQuery['isAppropriateLevels']): { 'isAppropriate.level': { $eq: string } }[] {
        // all options are true or false.;
        const sameValueIsAppropriateQuery = [...new Set(Object.values(isAppropriateLevels))].length;
        let isAppropriateQueryResult: { 'isAppropriate.level': { $eq: string } }[];
        const isAppropriateQuery = [];

        if (sameValueIsAppropriateQuery === 1) {
            isAppropriateQuery.push(
                'כדאי מאוד',
                'מתאים',
                'לא מתאים',
            );
        } else {
            if (isAppropriateLevels.bad === true) {
                isAppropriateQuery.push('לא מתאים');
            }
            if (isAppropriateLevels.good === true) {
                isAppropriateQuery.push('מתאים');
            }
            if (isAppropriateLevels.veryGood === true) {
                isAppropriateQuery.push('כדאי מאוד');
            }
        }

        isAppropriateQueryResult = isAppropriateQuery.map(level => {
            return {
                'isAppropriate.level': {
                    $eq: level
                }
            };
        });

        return isAppropriateQueryResult;
    }

    letterSizesQuery(
        letterSizes: AdvancedSearchQuery['letterSizes'],
        location: LocationPath
    ): { [x: string]: { $eq: boolean | string } }[] {
        // all options are true or false.;
        const sameValueLetterSizesQuery = [...new Set(Object.values(letterSizes))].length;
        const letterSizesQuery: { [x: string]: { $eq: boolean | string } }[] = [];

        if (sameValueLetterSizesQuery === 1) {
            letterSizesQuery.push(
                ...Object
                    .keys(letterSizes)
                    .map(([key]) => {
                        const isWriterSearch = location === LocationPath.WRITERS_ADVANCED_SEARCH;
                        const path = isWriterSearch ? `writingDeatails.letterSizes.${key}` : 'writingDeatails.letterSize.size';
                        return {
                            [path]: {
                                $eq: isWriterSearch ? true : key
                            }
                        };
                    })
            );
        } else {
            letterSizesQuery.push(
                ...Object
                    .entries(letterSizes)
                    .filter(([, booleanValue]) => booleanValue)
                    .map(([key]) => {
                        const isWriterSearch = location === LocationPath.WRITERS_ADVANCED_SEARCH;
                        const path = isWriterSearch ? `writingDeatails.letterSizes.${key}` : 'writingDeatails.letterSize.size';
                        return {
                            [path]: {
                                $eq: isWriterSearch ? true : key
                            }
                        };
                    })
            );
        }
        return letterSizesQuery;
    }

    writingTypesQuery(writingTypes: AdvancedSearchQuery['writingTypes'], location: LocationPath) {
        const sameValueWritingTypesQuery = [...new Set(Object.values(writingTypes))].length === 1;
        const writingTypesQuery = [];
        if (sameValueWritingTypesQuery) {
            writingTypesQuery.push(
                ...Object
                    .entries(writingTypes)
                    .map(([key]) => {
                        const isWriterSearch = location === LocationPath.WRITERS_ADVANCED_SEARCH;
                        const path = isWriterSearch ? `writingDeatails.writingTypes.types.${key}` : `writingDeatails.writingType`;
                        return {
                            [path]: {
                                $eq: isWriterSearch ? true : key
                            }
                        };
                    })
            );
        } else {
            writingTypesQuery.push(
                ...Object
                    .entries(writingTypes)
                    .filter(([, booleanValue]) => booleanValue)
                    .map(([key]) => {
                        const isWriterSearch = location === LocationPath.WRITERS_ADVANCED_SEARCH;
                        const path = isWriterSearch ? `writingDeatails.writingTypes.types.${key}` : `writingDeatails.writingType`;
                        return {
                            [path]: {
                                $eq: isWriterSearch ? true : key
                            }
                        };
                    })
            );
        }
        return writingTypesQuery;
    }

    ngOnDestroy() {
        this.writersList$Subscription.unsubscribe();
        this.bookList$Subscription.unsubscribe();
    }
}
