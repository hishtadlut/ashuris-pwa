import { Injectable, OnDestroy } from '@angular/core';
import { Writer, AdvancedSearchQuery, Book, WriterListFilters } from './interfaces';
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
                    // {
                    //     $or: this.isAppropriateQuery(query.isAppropriateLevels)
                    // },
                    // {
                    //     $or: this.formatQuery(query.goesToKotel, 'goesToKotel')
                    // },
                    // {
                    //     $or: this.formatQuery(query.voatsInElection, 'voatsInElection')
                    // },
                    // {
                    //     $or: this.writingLevelQuery(query.writingLevel)
                    // },
                    // {
                    //     $or: this.writingTypesQuery(query.writingTypes, location)
                    // },
                    {
                        $or: this.letterSizesQuery(query.letterSizes, location)
                    }
                ]
            }
        };

        const jsQuery = item => {
            if (query.lowestPrice.toString() === '' || query.highestPrice.toString() === '') {
                return true;
            }
            if (query.priceOf === 'priceForTorahScrollPerPage' && item.pricesDeatails.isPricePerPage === 'מחיר לספר תורה') {
                const price = (item.pricesDeatails.priceForTorahScroll.price - 8700) / 245;
                return price >= query.lowestPrice && price <= query.highestPrice;
            }

            if (query.priceOf === 'priceForTorahScrollPerPage' && item.pricesDeatails.isPricePerPage === 'מחיר לעמוד') {
                const price = item.pricesDeatails.priceForTorahScroll.price;
                return price >= query.lowestPrice && price <= query.highestPrice;
            }

            if (query.priceOf === 'priceForTorahScroll' && item.pricesDeatails.isPricePerPage === 'מחיר לספר תורה') {
                const price = item.pricesDeatails.priceForTorahScroll.price;
                return price >= query.lowestPrice && price <= query.highestPrice;
            }

            if (query.priceOf === 'priceForTorahScroll' && item.pricesDeatails.isPricePerPage === 'מחיר לעמוד') {
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
                const filter = result.docs
                    .filter(item => {
                        if (
                            (
                                (query.writingTypes.ari === false)
                                && (query.writingTypes.beitYosef === false)
                                && (query.writingTypes.welish === false)
                            )
                            ||
                            (
                                (query.writingTypes.ari === true)
                                && (query.writingTypes.beitYosef === true)
                                && (query.writingTypes.welish === true)
                            )
                        ) {
                            return true;
                        }
                        if (query.writingTypes.ari && item.writingDeatails.writingTypes.types.ari) {
                            return true;
                        }
                        if (query.writingTypes.beitYosef && item.writingDeatails.writingTypes.types.beitYosef) {
                            return true;
                        }
                        if (query.writingTypes.welish && item.writingDeatails.writingTypes.types.Welish) {
                            return true;
                        }
                    })
                    .filter(item => {
                        if (
                            (
                                (query.writingLevel[1] === false)
                                && (query.writingLevel[2] === false)
                                && (query.writingLevel[3] === false)
                                && (query.writingLevel[4] === false)
                                && (query.writingLevel[5] === false)
                            )
                            ||
                            (
                                (query.writingLevel[1] === true)
                                && (query.writingLevel[2] === true)
                                && (query.writingLevel[3] === true)
                                && (query.writingLevel[4] === true)
                                && (query.writingLevel[5] === true)
                            )
                        ) {
                            return true;
                        }
                        if (query.writingLevel[1] && item.writingDeatails.writingLevel.level === 'זול') {
                            return true;
                        }
                        if (query.writingLevel[2] && item.writingDeatails.writingLevel.level === 'פחותה') {
                            return true;
                        }
                        if (query.writingLevel[3] && item.writingDeatails.writingLevel.level === 'בינוני') {
                            return true;
                        }
                        if (query.writingLevel[4] && item.writingDeatails.writingLevel.level === 'גבוהה') {
                            return true;
                        }
                        if (query.writingLevel[5] && item.writingDeatails.writingLevel.level === 'מיוחד') {
                            return true;
                        }
                    })
                    .filter(item => {
                        if (query.goesToKotel === 'false') {
                            return item.additionalDetails.goesToKotel.boolean === 'false';
                        }
                        return true;
                    })
                    .filter(item => {
                        if (
                            (
                                (query.isAppropriateLevels.bad === false)
                                && (query.isAppropriateLevels.good === false)
                                && (query.isAppropriateLevels.veryGood === false)
                            )
                            ||
                            (
                                (query.isAppropriateLevels.bad === true)
                                && (query.isAppropriateLevels.good === true)
                                && (query.isAppropriateLevels.veryGood === true)
                            )
                        ) {
                            return true;
                        }
                        if (query.isAppropriateLevels.bad && item.isAppropriate.level === 'לא מתאים') {
                            return true;
                        }
                        if (query.isAppropriateLevels.good && item.isAppropriate.level === 'מתאים') {
                            return true;
                        }
                        if (query.isAppropriateLevels.veryGood && item.isAppropriate.level === 'כדאי מאוד') {
                            return true;
                        }
                    })
                    .filter(item => {
                        if (query.voatsInElection === 'false') {
                            return item.additionalDetails.voatsInElection.boolean === 'false';
                        }
                        return true;
                    })
                    .filter(jsQuery);
                this.store$.dispatch(setAdvancedSearchResult({ items: filter }));
            });
        } else if (searchFor === SearchFor.BOOKS) {
            const writingTypes = {
                ari: 'אר"י',
                beitYosef: 'בית יוסף',
                welish: 'וועליש',
            };
            this.pouchDbService.localBooksDB.find(findInDbParms).then(result => {
                const filter = result.docs.filter(item => {
                    if (query.voatsInElection === 'false') {
                        return item.additionalDetails.voatsInElection.boolean === 'false';
                    }
                    return true;
                }).filter(item => {
                    if (query.goesToKotel === 'false') {
                        return item.additionalDetails.voatsInElection.boolean === 'false';
                    }
                    return true;
                }).filter(item => {
                    if (
                        (
                            (query.isAppropriateLevels.bad === false)
                            && (query.isAppropriateLevels.good === false)
                            && (query.isAppropriateLevels.veryGood === false)
                        )
                        ||
                        (
                            (query.isAppropriateLevels.bad === true)
                            && (query.isAppropriateLevels.good === true)
                            && (query.isAppropriateLevels.veryGood === true)
                        )
                    ) {
                        return true;
                    }
                    if (query.isAppropriateLevels.bad && item.isAppropriate.level === 'לא מתאים') {
                        return true;
                    }
                    if (query.isAppropriateLevels.good && item.isAppropriate.level === 'מתאים') {
                        return true;
                    }
                    if (query.isAppropriateLevels.veryGood && item.isAppropriate.level === 'כדאי מאוד') {
                        return true;
                    }
                }).filter(item => {
                    if (
                        (
                            (query.writingLevel[1] === false)
                            && (query.writingLevel[2] === false)
                            && (query.writingLevel[3] === false)
                            && (query.writingLevel[4] === false)
                            && (query.writingLevel[5] === false)
                        )
                        ||
                        (
                            (query.writingLevel[1] === true)
                            && (query.writingLevel[2] === true)
                            && (query.writingLevel[3] === true)
                            && (query.writingLevel[4] === true)
                            && (query.writingLevel[5] === true)
                        )
                    ) {
                        return true;
                    }
                    if (query.writingLevel[1] && item.writingDeatails.writingLevel.level === 'זול') {
                        return true;
                    }
                    if (query.writingLevel[2] && item.writingDeatails.writingLevel.level === 'פחותה') {
                        return true;
                    }
                    if (query.writingLevel[3] && item.writingDeatails.writingLevel.level === 'בינוני') {
                        return true;
                    }
                    if (query.writingLevel[4] && item.writingDeatails.writingLevel.level === 'גבוהה') {
                        return true;
                    }
                    if (query.writingLevel[5] && item.writingDeatails.writingLevel.level === 'מיוחד') {
                        return true;
                    }
                }).filter(item => {
                    if (
                        (
                            (query.writingTypes.ari === false)
                            && (query.writingTypes.beitYosef === false)
                            && (query.writingTypes.welish === false)
                        )
                        ||
                        (
                            (query.writingTypes.ari === true)
                            && (query.writingTypes.beitYosef === true)
                            && (query.writingTypes.welish === true)
                        )
                    ) {
                        return true;
                    }
                    if (query.writingTypes.ari && item.writingDeatails.writingType === writingTypes.ari) {
                        return true;
                    }
                    if (query.writingTypes.beitYosef && item.writingDeatails.writingType === writingTypes.beitYosef) {
                        return true;
                    }
                    if (query.writingTypes.welish && item.writingDeatails.writingType === writingTypes.welish) {
                        return true;
                    }
                });
                this.store$.dispatch(setAdvancedSearchResult({ items: result.docs.filter(jsQuery) }));
            });
        }
    }

    writerListFilter(filters: WriterListFilters) {
        const queryResult = this.writersList.filter(writer => {
            const cityQuery = (writer.city === filters.city || filters.city === '');
            const communityQuery = (writer.communityDeatails.community === filters.community || filters.community === '');

            let hasWritenBeforeQuery = false;
            if ((filters.hasWritenBefore === true) && (writer.additionalDetails.hasWritenBefore.boolean === 'true')) {
                hasWritenBeforeQuery = true;
            }
            if ((filters.hasNotWritenBefore === true) && (writer.additionalDetails.hasWritenBefore.boolean !== 'true')) {
                hasWritenBeforeQuery = true;
            }

            let isWritingRegularlyQuery = false;
            if ((filters.isWritingRegularly.writingRegularly) && (writer.isWritingRegularly.boolean)) {
                isWritingRegularlyQuery = true;
            }
            if ((filters.isWritingRegularly.notWritingRegularly) && (!writer.isWritingRegularly.boolean)) {
                isWritingRegularlyQuery = true;
            }

            let isAppropriateQuery = false;
            if (!filters.isAppropriate.bad && !filters.isAppropriate.good && !filters.isAppropriate.veryGood) {
                isAppropriateQuery = true;
            } else {
                if (filters.isAppropriate.bad && (writer.isAppropriate.level === 'לא מתאים')) {
                    isAppropriateQuery = true;
                } else if (filters.isAppropriate.good && (writer.isAppropriate.level === 'מתאים')) {
                    isAppropriateQuery = true;
                } else if (filters.isAppropriate.veryGood && (writer.isAppropriate.level === 'כדאי מאוד')) {
                    isAppropriateQuery = true;
                }
            }
            return (cityQuery && communityQuery && hasWritenBeforeQuery && isAppropriateQuery && isWritingRegularlyQuery);
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
        const letterSizesQuery = [];

        if (sameValueLetterSizesQuery === 1) {
            letterSizesQuery.push(
                ...Object
                    .entries(letterSizes)
                    .map(([key]) => {
                        const isWriterSearch = location === LocationPath.WRITERS_ADVANCED_SEARCH;
                        const path = isWriterSearch ? `writingDeatails.letterSizes.${key}` : 'writingDeatails.letterSize.size';
                        return {
                            [path]: {
                                $exists: true
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
