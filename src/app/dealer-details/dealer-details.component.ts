import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { Dealer } from '../interfaces';
import { preventDefaultAndStopPropagation } from '../utils/utils';
import { StitchService } from '../stitch-service.service';

@Component({
  selector: 'app-dealer-details',
  templateUrl: './dealer-details.component.html',
  styleUrls: ['./dealer-details.component.css']
})
export class DealerDetailsComponent implements OnInit {
  dialogContent = null;
  dealer: Dealer;
  dealerAddress: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pouchDbService: StitchService,
    public sanitizer: DomSanitizer,
  ) { }

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.queryParamMap.get('id');
    this.dealer = await this.pouchDbService.getDealerById(id);
    this.dealerAddress = `${this.dealer.city}+${this.dealer.street}+${this.dealer.streetNumber}`;
  }

  openDialog(event: Event, content: string) {
    preventDefaultAndStopPropagation(event);
    this.dialogContent = content;
  }

  closeDialog() {
    this.dialogContent = null;
  }

  editDealer() {
    this.router.navigate(['/edit-dealer'], { queryParams: { id: this.dealer._id } });
  }

}
