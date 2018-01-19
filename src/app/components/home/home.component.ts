import { Component, OnInit } from '@angular/core';
import { BtfgService } from 'app/components/home/btfg.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  paymentData;
  walletId;
  blockChainStatus;
  walletData;
  blockData;
  shareList;
  shareArray = [];
  loading;
  constructor(private _btfgService: BtfgService) { }

  ngOnInit() {
    if(localStorage.getItem('walletId')){
      this.walletId = localStorage.getItem('walletId');
    }
    this.loading = true;
    this.paymentData = this._btfgService.getPaymentInfo()
    .subscribe(data => {
      this.paymentData = data;
      this.shareList = this.paymentData.blockPaymentList;
      this.loading = false;
    });

    
    this.loading = true;
    this.blockChainStatus = this._btfgService.getBlockchainStatus()
    .subscribe(data => {
      this.blockChainStatus = data;
      this.loading = false;
    });

    this.loading = true;
    this.blockData = this._btfgService.getBlockInfo()
    .subscribe(data => {
      this.blockData = data;
      this.loading = false;
    });
  }

  getData() {
    this.loading = true;
    if(!localStorage.getItem('walletId')){
      localStorage.setItem('walletId', this.walletId)
    }
    
    this.walletData = this._btfgService.getWalletInfo(this.walletId)
    .subscribe(data => {
      this.walletData = data;
      if(this.shareList){
        if(this.shareList[this.walletId]){
          console.log(this.shareList[this.walletId])
          this.shareArray.push(this.shareList[this.walletId])
        }
      }
      this.loading = false;
    });
    
  }
  get getShareArray(){
    return this.shareArray;
  }

}
