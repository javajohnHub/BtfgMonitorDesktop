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
  account;
  address;
  name;
  description;
  estimateBaseline;
  lastUpdated;
  constructor(private _btfgService: BtfgService) { }

  ngOnInit() {
    if (localStorage.getItem('walletId')) {
      this.walletId = localStorage.getItem('walletId');
    }
    let d = new Date();
    this.lastUpdated = d.toLocaleString();
    this.reloadData();
    setInterval(() => {
      let dte = new Date();
      this.lastUpdated = dte.toLocaleString();
      this.reloadData()
      console.log('reloaded');
    }, 60000 )
  }

  reloadData() {
    if (!localStorage.getItem('walletId')) {
      localStorage.setItem('walletId', this.walletId)
    }
    this.walletData = this._btfgService.getWalletInfo(this.walletId)
      .subscribe(data => {
        this.walletData = data;
        this.account = this.walletData.account;
        this.name = this.walletData.name;
        this.description = this.walletData.description;
        this.address = this.walletData.accountRS;
        this.balance = (this.walletData.effectiveBalanceNXT / 100000000).toFixed(8)
        this.shareList.forEach(share => {

          if (share.accountId === parseInt(this.walletId, 10)) {
            if (!this.shareArray.includes(share.share)) {
              this.shareArray.push(share.share)
            }
          }
        })

      })
    this.paymentData = this._btfgService.getPaymentInfo()
      .subscribe(data => {
        this.paymentData = data;
        this.pendingPayments = this.paymentData.pendingPaymentList;
        this.pendingPayment = this.pendingPayments[this.walletId].toFixed(8);
        this.sentPayments = this.paymentData.sentPaymentList;
        this.sentPayment = this.sentPayments[this.walletId];
        this.shareList = this.paymentData.blockPaymentList[0].shareList;
        if (this.paymentData.blockPaymentList) {
          this.paymentData.blockPaymentList.forEach(blockPayment => {
            if(!this.blockArray.includes(blockPayment.height)) {
              this.blockArray.push(blockPayment.height)
              if (!this.totalShares.includes(blockPayment.totalShare)) {
                this.totalShares.push(blockPayment.totalShare);
              }
            }
          })
          this.total = this.totalShares.reduce((a, b) => a + b, 0);
        }
        if (this.shareList) {
          for (let i = 0; i < this.paymentData.blockPaymentList.length; i++) {
            for (let x = 0; x < this.paymentData.blockPaymentList[i].shareList.length; x++) {
              if (this.paymentData.blockPaymentList[i].shareList[x].accountId === this.walletId) {
                if (!this.shareArray.includes(this.paymentData.blockPaymentList[i].shareList[x].share)) {
                this.shareArray.push(this.paymentData.blockPaymentList[i].shareList[x].share);
                }
              }
            }
          }
          this.minerTotal = this.shareArray.reduce((a, b) => a + b, 0);
          if (this.sentPayments) {
            for (let j = 0; j < this.sentPayments.length; j++) {
              console.log(this.sentPayments[j].accountId === this.walletId)
              if (this.sentPayments[j].accountId === this.walletId) {
                this.lastPayment = this.sentPayments[j].amount;
              }
            }
          }
          this.loading = false;
        }
        
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
        this.estimateBaseline = (this.minerTotal * this.blockReward) / this.total;
        this.loading = false;
      });
  }

}
