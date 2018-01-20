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
  totalShares;
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
          this.totalShares = parseFloat(this.totalShares) + parseFloat(blockPayment.totalShare);
          console.log(this.totalShares.toFixed(8) )
        })
        this.shareList2 = this.paymentData.blockPaymentList[1].shareList;
        this.shareList3 = this.paymentData.blockPaymentList[2].shareList;
        if (this.shareList) {
          this.shareList.forEach(share => {
            //console.log(share['accountId'], this.walletId)
            if (share['accountId'] == this.walletId) {
              //console.log(share)
              this.shareArray.push(share);
            }
          })
        }
        if (this.shareList2) {
          this.shareList2.forEach(share => {
            if (share['accountId'] == this.walletId) {
              this.shareArray.push(share);
            }

          })
        }
        if (this.shareList3) {
          this.shareList3.forEach(share => {
            if (share['accountId'] == this.walletId) {
              this.shareArray.push(share);
            }

          })
        }
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
