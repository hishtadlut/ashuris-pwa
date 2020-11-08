import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { State } from '../reducers';
import { areYouSureYouWantToRemove, fileToBase64 } from '../utils/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { StitchService } from '../stitch-service.service';
import { Location } from '@angular/common';
import { Address, Dealer } from '../interfaces';
import { loadDealerList } from '../actions/writers.actions';
import { GoogleMapsService } from '../google-maps-service.service';
import { LocalDbNames, LocationPath, RemoveItem } from '../enums';


@Component({
  selector: 'app-edit-dealer',
  templateUrl: './edit-dealer.component.html',
  styleUrls: ['./edit-dealer.component.css']
})
export class EditDealerComponent implements OnInit {
  editMode: boolean;
  dealerForm: FormGroup;
  dialogFormGroup: FormGroup = null;
  locationWithoutParameters = this.location.path().split('?')[0];
  locationPath: typeof LocationPath = LocationPath;

  citiesList: string[];
  citiesList$Subscription: Subscription;
  citiesList$: Observable<any> = this.store$.pipe(
    select('writers', 'citiesList')
  );
  textForSaveButton = 'הוסף סוחר למאגר';

  dealer: Dealer;

  constructor(
    private store$: Store<State>,
    private router: Router,
    private pouchDbService: StitchService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private googleMapsService: GoogleMapsService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.editMode = (this.location.path().split('?')[0] === '/edit-dealer');

    this.dealerForm = new FormGroup({

      note: new FormControl('', [
        // Validators.required,
      ]),
      firstName: new FormControl('', [
        Validators.required,
      ]),
      lastName: new FormControl('', [
        Validators.required,
      ]),
      telephone: new FormControl('', [
        // Validators.required,
        // Validators.pattern('^[0-9]*$'),
        // Validators.minLength(9),
      ]),
      secondTelephone: new FormControl('', [
        // Validators.required,
        // Validators.pattern('^[0-9]*$'),
        // Validators.minLength(9),
      ]),
      email: new FormControl('', [
        // Validators.required,
        // Validators.email,
      ]),
      city: new FormControl('', [
        // Validators.required,
      ]),
      street: new FormControl('', [
        // Validators.required,
      ]),
      coordinates: new FormControl(),
      streetNumber: new FormControl('', [
        // Validators.required,
      ]),
      apartmentNumber: new FormControl('', [
        // Validators.required,
      ]),
      profileImage: new FormControl('', [
        // Validators.required,
      ]),
    });

    this.citiesList$Subscription = this.citiesList$.subscribe(
      (cities) => this.citiesList = cities
    );

    if (this.editMode) {
      const id = this.activatedRoute.snapshot.queryParamMap.get('id');
      this.dealer = await this.pouchDbService.getDealerById(id);
      this.dealerForm.patchValue(this.dealer);
      this.textForSaveButton = 'שמור שינויים';
    } else if (!this.editMode) {
      this.googleMapsService.setAddressThroghGoogleMaps()
        .then((address: Address) => {
          this.dealerForm.controls.city.setValue(address.city);
          this.dealerForm.controls.street.setValue(address.street);
          this.dealerForm.controls.streetNumber.setValue(address.streetNumber);
          this.dealerForm.controls.coordinates.setValue(address.coordinates);
        });
    }
  }

  openDialog(formGroup: FormGroup) {
    this.dialogFormGroup = formGroup;
  }

  closeDialogAndDeleteChanges(noteValueBeforeChanges: string) {
    this.dialogFormGroup.controls.note.setValue(noteValueBeforeChanges);
    this.dialogFormGroup = null;
  }

  closeDialog() {
    this.dialogFormGroup = null;
  }

  onAddProfileImage(file: File) {
    fileToBase64(file)
      .then((base64File: string | ArrayBuffer) => {
        this.dealerForm.controls.profileImage.setValue(base64File);
      }).catch((err) => {
        console.log(err);
      });
  }

  onRemove() {
    if (areYouSureYouWantToRemove(RemoveItem.dealer)) {
      this.pouchDbService.removeItem(LocalDbNames.DEALERS, this.dealer);
    }
  }

  onSubmit() {
    if (this.dealerForm.valid) {
      this.pouchDbService.createDealer({ ...this.dealer, ...this.dealerForm.value });
      this.store$.dispatch(loadDealerList());
      if (this.location.path() === LocationPath.CREATE_DEALER_FOR_BOOK) {
        this.router.navigate([LocationPath.SAVE_ITEM]);
      } else {
        this.router.navigate(['/dealer-list-screen']);
      }
    } else {
      alert('יש למלא שם פרטי ושם משפחה');
    }
  }

}
