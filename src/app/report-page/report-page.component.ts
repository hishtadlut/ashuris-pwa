import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book, Dealer, Writer } from '../interfaces';
import { ReportsService } from './reports.service';

@Component({
  selector: 'app-report-page',
  templateUrl: './report-page.component.html',
  styleUrls: ['./report-page.component.css']
})
export class ReportPageComponent implements OnInit, AfterContentInit, OnDestroy {
  constructor(public reportService: ReportsService) { }
  columns = [
    { name: 'firstName' },
    { name: 'lastName' },
    { name: 'telephone', width: 170 },
    { name: 'secondTelephone', width: 170 },
    { name: 'city' },
    { name: 'street' },
    { name: 'streetNumber', width: 130 },
    { name: 'apartmentNumber', width: 130 },
    { name: 'community', width: 158 },
  ];

  bookColumns = [
    { name: 'name', width: 270 },
    { name: 'community' },
  ];
  
  columnsHeb = []

  generalColumnsHeb = [
    'שם פרטי',
    'שם משפחה',
    ` טלפון ראשון `,
    'טלפון שני',
    'עיר',
    'רחוב',
    'מספר בנין',
    'מספר בית',
    'קהילה',
  ];

  bookColumnsHeb = [
    'שם פרטי',
    'קהילה',
  ];

  reportListSubscription: Subscription;
  reportList: any[]
  ngOnInit(): void {
    this.reportListSubscription = this.reportService.reportList.subscribe(
      (list => {
        if (list.length) {
          if ((list[0] as Writer)?.firstName) {
            this.columnsHeb = this.generalColumnsHeb
          } else {
            this.columnsHeb = this.bookColumnsHeb
          }
          this.reportList = this.reshapeListToTable(list);
        }
      })
    )
  }

  reshapeListToTable(list) {
    return list.map((item) => {
      let mappedItem = {}
      const isWriter = (item) => item.firstName !== undefined;
      if (isWriter(item)) {
        mappedItem = {
          firstName: item.firstName || '',
          lastName: item.lastName || '',
          telephone: item.telephone || '',
          secondTelephone: item.secondTelephone || '',
          city: item.city || '',
          street: item.street || '',
          streetNumber: item.streetNumber || '',
          apartmentNumber: item.apartmentNumber || '',
          community: item.communityDeatails?.community || '',
        }
      } else {
        mappedItem = {
          name: item.name || '',
          community: item.communityDeatails?.community || '',
        }
      }
      return mappedItem;
    })
  }

  ngAfterContentInit() {
    setTimeout(() => {
      Array.from(document.getElementsByClassName('datatable-header-cell-label')).forEach((header, i) => {
        header.textContent = this.columnsHeb[i];
      });
    }, 0)
  }

  async printPage() {
    Array.from(document.getElementsByClassName('ngx-datatable') as HTMLCollectionOf<HTMLElement>)[0].style.width = '260mm';
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 0)
    await new Promise(resolve => setTimeout(resolve, 300));
    window.print()
  }

  ngOnDestroy() {
    this.reportListSubscription.unsubscribe();
  }

}
