import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Book, Dealer, Writer } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  reportList: BehaviorSubject<Writer[] | Book[] | Dealer[]> = new BehaviorSubject([])
}