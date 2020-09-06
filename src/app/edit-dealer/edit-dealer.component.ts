import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { State } from '../reducers';
import { fileToBase64 } from '../utils/utils';
import { Router } from '@angular/router';
import { StitchService } from '../stitch-service.service';
import { Location } from '@angular/common';
import { Address, Dealer } from '../interfaces';
import { loadDealerList } from '../actions/writers.actions';
import { GoogleMapsService } from '../google-maps-service.service';


@Component({
  selector: 'app-edit-dealer',
  templateUrl: './edit-dealer.component.html',
  styleUrls: ['./edit-dealer.component.css']
})
export class EditDealerComponent implements OnInit {
  editMode: boolean;
  dealerForm: FormGroup;
  dialogFormGroup: FormGroup = null;

  citiesList: string[];
  citiesList$Subscription: Subscription;
  citiesList$: Observable<any> = this.store$.pipe(
    select('writers', 'citiesList')
  );
  textForSaveButton = 'הוסף סוחר למאגר';

  dealer$Subscription: Subscription;
  dealerId$: Observable<any> = this.store$.pipe(
    select('writers', 'currentDealerId')
  );
  dealer: Dealer;

  constructor(
    private store$: Store<State>,
    private router: Router,
    private stitchService: StitchService,
    private location: Location,
    private googleMapsService: GoogleMapsService,
  ) { }

  ngOnInit(): void {
    this.editMode = (this.location.path() === '/edit-dealer');

    this.dealerForm = new FormGroup({
      reminderState: new FormControl('off', [
        // Validators.required,
      ]),
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
      profileImage: new FormControl('assets/icons/Symbol 216 – 5.png', [
        // Validators.required,
      ]),
    });

    this.citiesList$Subscription = this.citiesList$.subscribe(
      (cities) => this.citiesList = cities
    );

    if (this.editMode) {
      this.dealer$Subscription = this.dealerId$.subscribe((dealerId: string) => {
        this.stitchService.getDealerById(dealerId)
        .then((dealer: Dealer) => {
          this.dealer = dealer;
          this.dealerForm.patchValue(dealer);
        });
      });
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

  onSubmit() {
    this.stitchService.createDealer({ ...this.dealer, ...this.dealerForm.value });
    this.store$.dispatch(loadDealerList());
    this.router.navigate(['/dealer-list-screen']);
  }

}
