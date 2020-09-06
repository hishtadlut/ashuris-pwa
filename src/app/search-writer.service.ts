import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Writer, advancedSearchQuery } from './interfaces';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from './reducers';
import { StitchService } from './stitch-service.service';
import sift from 'sift';
import { setSearchWritersResult } from './actions/writers.actions';


@Injectable({ providedIn: 'root' })
export class SearchWriterService implements OnDestroy {
    writersToDisplay: Writer[] = [];
    writersList$: Observable<Writer[]> = this._store$.pipe(
        select('writers', 'writersList')
    );
    writersList$Subscription: Subscription;
    writersList: Writer[];
    constructor(private _store$: Store<State>, private pouchDbService: StitchService) {
        this.writersList$Subscription = this.writersList$.subscribe((writersList) => this.writersList = writersList);
    }

    findSoferAdvancedSearch(sofer: advancedSearchQuery) {

        const isAppropriateLevelsQuery = [];
        sofer.isAppropriateLevels.bad ? isAppropriateLevelsQuery.push({ 'level': 'לא מתאים' }) : '';
        sofer.isAppropriateLevels.good ? isAppropriateLevelsQuery.push({ 'level': 'מתאים' }) : '';
        sofer.isAppropriateLevels.veryGood ? isAppropriateLevelsQuery.push({ 'level': 'כדאי מאוד' }) : '';

        const goesToKotelQuery = [];
        if (sofer.goesToKotel === 'true') {
            goesToKotelQuery.push('true', '');
        } else if (sofer.goesToKotel === 'any') {
            goesToKotelQuery.push('true', 'false', '');
        } else {
            goesToKotelQuery.push('false');
        }

        const voatsInElectionQuery = [];
        if (sofer.voatsInElection === 'true') {
            voatsInElectionQuery.push('true', '');
        } else if (sofer.goesToKotel === 'any') {
            voatsInElectionQuery.push('true', 'false', '');
        } else {
            voatsInElectionQuery.push('false');
        }

        // all options are true or false.;
        const sameValueWritingLevelQuery = [...new Set(Object.values(sofer.writingLevel))].length;
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
            if (sofer.writingLevel[1]) {
                writingLevelQuery.push('זול');
            }
            if (sofer.writingLevel[2]) {
                writingLevelQuery.push('פחותה');
            }
            if (sofer.writingLevel[3]) {
                writingLevelQuery.push('בינוני');
            }
            if (sofer.writingLevel[4]) {
                writingLevelQuery.push('גבוהה');
            }
            if (sofer.writingLevel[5]) {
                writingLevelQuery.push('מיוחד');
            }
        }

        // all options are true or false.;
        const sameValueIsAppropriateQuery = [...new Set(Object.values(sofer.isAppropriateLevels))].length;
        const isAppropriateQuery = [];

        if (sameValueIsAppropriateQuery === 1) {
            isAppropriateQuery.push(
                'כדאי מאוד',
                'מתאים',
                'לא מתאים',
            );
        } else {
            if (sofer.isAppropriateLevels.bad === true) {
                isAppropriateQuery.push('לא מתאים');
            }
            if (sofer.isAppropriateLevels.good === true) {
                isAppropriateQuery.push('מתאים');
            }
            if (sofer.isAppropriateLevels.veryGood === true) {
                isAppropriateQuery.push('כדאי מאוד');
            }
        }

        // all options are true or false.;
        const sameValueLetterSizesQuery = [...new Set(Object.values(sofer.letterSizes))].length;
        const letterSizesQuery = [];

        if (sameValueLetterSizesQuery === 1) {
            letterSizesQuery.push(
                ...Object
                    .entries(sofer.letterSizes)
                    .map(([key, value]) => ({ [key]: true }))
            );
        } else {
            letterSizesQuery.push(
                ...Object
                    .entries(sofer.letterSizes)
                    .filter(([, booleanValue]) => booleanValue)
                    .map(([key]) => ({ [key]: true }))
            );
        }

        const sameValueWritingTypesQuery = [...new Set(Object.values(sofer.writingTypes))].length === 1;
        const writingTypesQuery = [];
        if (sameValueWritingTypesQuery) {
            if (sofer.writingTypes.welish === true) {
                writingTypesQuery.push({ ari: true }, { Welish: true }, { beitYosef: true });
            }
        } else {
            if (sofer.writingTypes.ari === true) {
                writingTypesQuery.push({ ari: true });
            }
            if (sofer.writingTypes.welish === true) {
                writingTypesQuery.push({ Welish: true });
            }
            if (sofer.writingTypes.beitYosef === true) {
                writingTypesQuery.push({ beitYosef: true });
            }
        }

        const queryResult = this.writersList.filter(
            sift({
                $and: [
                    {
                        isAppropriate: { $or: isAppropriateLevelsQuery },
                        'additionalDetails.goesToKotel.boolean': { $or: goesToKotelQuery },
                        'additionalDetails.voatsInElection.boolean': { $or: voatsInElectionQuery },
                        'writingDeatails.writingLevel.level': { $or: writingLevelQuery },
                        'isAppropriate.level': { $or: isAppropriateQuery },
                        'writingDeatails.letterSizes': { $or: letterSizesQuery },
                        'writingDeatails.writingTypes.types': { $or: writingTypesQuery },
                    }
                ]
            })
        );
        const finalResult = queryResult.filter(soferfromDb => {
            if (sofer.priceOf === 'priceForTorahScrollPerPage' && soferfromDb.pricesDeatails.isPricePerPage === 'מחיר לספר תורה') {
                let price = (soferfromDb.pricesDeatails.priceForTorahScroll.price - 8700) / 245;
                return price >= sofer.lowestPrice && price <= sofer.highestPrice;
            }

            if (sofer.priceOf === 'priceForTorahScroll' && soferfromDb.pricesDeatails.isPricePerPage === 'מחיר לספר תורה') {
                let price = (soferfromDb.pricesDeatails.priceForTorahScroll.price * 245) + 8700;
                return price >= sofer.lowestPrice && price <= sofer.highestPrice;
            }

            if (sofer.priceOf === 'priceForMezuzah') {
                return (soferfromDb.pricesDeatails.priceForMezuzah.price >= sofer.lowestPrice && soferfromDb.pricesDeatails.priceForMezuzah.price <= sofer.highestPrice);
            }

            if (sofer.priceOf === 'priceForTefillin') {
                return (soferfromDb.pricesDeatails.priceForTefillin.price >= sofer.lowestPrice && soferfromDb.pricesDeatails.priceForTefillin.price <= sofer.highestPrice);
            }

            return (soferfromDb.pricesDeatails.priceForTorahScroll.price >= sofer.lowestPrice && soferfromDb.pricesDeatails.priceForTorahScroll.price <= sofer.highestPrice);
        });

        this._store$.dispatch(setSearchWritersResult({ writers: finalResult }));
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
            // good: new FormControl(true),
            //     veryGood: new FormControl(true),

            return (cityQuery && communityQuery && hasWritenBeforeQuery && isAppropriateQuery);
            // isAppropriate: { $or: isAppropriateLevelsQuery },
            // 'additionalDetails.goesToKotel.boolean': { $or: goesToKotelQuery },
            // 'additionalDetails.voatsInElection.boolean': { $or: voatsInElectionQuery },
            // 'writingDeatails.writingLevel.level': { $or: writingLevelQuery },
            // 'isAppropriate.level': { $or: isAppropriateQuery },
            // 'writingDeatails.letterSizes': { $or: letterSizesQuery },
            // 'writingDeatails.writingTypes.types': { $or: writingTypesQuery },
        });

        return queryResult;
    }

    ngOnDestroy() {
        this.writersList$Subscription.unsubscribe();
    }
}
