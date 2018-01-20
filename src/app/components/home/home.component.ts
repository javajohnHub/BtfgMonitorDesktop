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
  shareList2;
  shareArray = [];
  loading;
  pendingPayments;
  pendingPayment;
  sentPayments;
  lastPayment;
  lastBlock;
  balance;
  blockReward;
  sentPayment;
  shareList3;
  totalShares = [];
  blockArray = [];
  total;
  minerTotal;
  constructor(private _btfgService: BtfgService) { }

  ngOnInit() {
    if (localStorage.getItem('walletId')) {
      this.walletId = localStorage.getItem('walletId');
      this.getData();
    }
    this.loading = true;

    this.paymentData = this._btfgService.getPaymentInfo()
      .subscribe(data => {
        this.paymentData = data;
        this.pendingPayments = this.paymentData.pendingPaymentList;
        this.pendingPayment = this.pendingPayments[this.walletId];
        this.sentPayments = this.paymentData.sentPaymentList;
        this.sentPayment = this.sentPayments[this.walletId];
        this.shareList = this.paymentData.blockPaymentList[0].shareList;
        this.paymentData.blockPaymentList.forEach(blockPayment => {
          this.blockArray.push(blockPayment.height)
          this.totalShares.push(blockPayment.totalShare);
          this.total = this.totalShares.reduce((a, b) => a + b, 0);

        })
      
        if (this.shareList) {
          for(let i = 0; i < this.paymentData.blockPaymentList.length; i++){
            for(let x = 0; x < this.paymentData.blockPaymentList[i].shareList.length; x++){
              if(this.paymentData.blockPaymentList[i].shareList[x].accountId == this.walletId){
                this.shareArray.push(this.paymentData.blockPaymentList[i].shareList[x].share);
              }
            }
          }
          this.minerTotal = this.shareArray.reduce((a, b) => a + b, 0);
          //console.log(this.shareArray)
        if (this.sentPayments) {
          this.sentPayments.forEach(payment => {
            if (payment.accountId == this.walletId) {
              this.lastPayment = payment;
            }
          })

        }
        this.loading = false;
      });

    this.loading = true;
    this.blockChainStatus = this._btfgService.getBlockchainStatus()
      .subscribe(data => {
        this.blockChainStatus = data;
        this.lastBlock = this.blockChainStatus.numberOfBlocks;
        this.loading = false;
      });

    this.loading = true;
    this.blockData = this._btfgService.getBlockInfo()
      .subscribe(data => {
        this.blockData = data;
        this.blockReward = this.blockData.blocks[0].blockReward;
        this.loading = false;
      });
  }

  getData() {
    this.loading = true;
    if (!localStorage.getItem('walletId')) {
      localStorage.setItem('walletId', this.walletId)
    }

    this.walletData = this._btfgService.getWalletInfo(this.walletId)
      .subscribe(data => {
        this.walletData = data;
        this.balance = this.walletData.effectiveBalanceNXT;
        this.shareList.forEach(share => {

          if (share.accountId == parseInt(this.walletId, 10)) {

            this.shareArray.push(share.share)
          }
        })

      })
    this.loading = false;

  }

}
