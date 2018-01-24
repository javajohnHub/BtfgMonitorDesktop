import { Component, OnInit } from '@angular/core';
import { BtfgService } from 'app/components/home/btfg.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  walletId: number;
  lastUpdated: string;
  currentBlock: number;
  walletBalance: number;
  blockData: any;
  walletData: any;
  totalShare = 0;
  minerShare = 0;
  poolBalance: number;
  estimatedRevenue: number;
  blockLabels: Array<string> = [];
  blockShares: Array<number> = [];
  pendingPayment: number;
  totalPending: number;
  currentBalance: number;
  address: string;
  name: string;
  description: string;
  loading: boolean;
  blockReward: number;
  paymentData: Object;

  constructor(private _btfgService: BtfgService) { }

  ngOnInit() {
    this.loading = true;
    const d = new Date();
    this.lastUpdated = d.toLocaleString();
    this.loading = false;
    setInterval(() => {
      this.reloadData()
      console.log('reloaded');
    }, 60000)
  }

  reloadData() {
    const d = new Date();
    this.lastUpdated = d.toLocaleString();
    this._burstData();
  }

  _burstData() {
    this.loading = true;
    this._btfgService.getBlockchainStatus()
      .subscribe((data) => {
        this.loading = true;
        this.currentBlock = data['numberOfBlocks'];
        this.loading = false;
      }, (err) => console.log(err))
    this._btfgService.getBlockInfo()
      .subscribe((data) => {
        this.loading = true;
        this.blockData = data;
      }, (err) => console.log(err), () => {
        this.blockReward = this.blockData['blocks'][0]['blockReward']
        this.loading = false;
      })
    this._btfgService.getPaymentInfo()
      .subscribe((data) => {
        this.loading = true;
        this.paymentData = data;
        if (this.paymentData) {
          if (this.paymentData['pendingPaymentList'][this.walletId]) {
            this.pendingPayment = this.paymentData['pendingPaymentList'][this.walletId]
          } else {
            this.pendingPayment = 0;
          }
          for (const pending_id of this.paymentData['pendingPaymentList']) {
            this.totalPending += this.paymentData['pendingPaymentList'][pending_id]
          }
          for (const block of this.paymentData['blockPaymentList']) {
            this.blockLabels.push(block['height']);
            this.totalShare += block['totalShare']
            let shareFound = 0;
            for (const share of block['shareList']) {
              if (share['accountId'] === this.walletId) {
                this.blockShares.push(share['share']);
                this.minerShare += share['share'];
                shareFound = 1;
              }
            }
            if (shareFound === 0) {
              this.blockShares.push(0.0);
            }
          }
        }
        if (this.totalShare === 0) {
          this.estimatedRevenue = 0;
        } else {
          this.estimatedRevenue = (this.minerShare * this.blockReward) / this.totalShare
        }
        this.loading = false;
      })
    this._btfgService.getWalletInfo(this.walletId)
      .subscribe((data) => {
        this.loading = true;
        this.walletData = data;
        this.currentBalance = (this.walletData['effectiveBalanceNXT'] / 100000000);
        this.address = this.walletData['accountRS'];
        if ('name' in this.walletData) {
          this.name = this.walletData['name']
        }
        if ('description' in this.walletData) {
          this.description = this.walletData['description']
        }
      }, (err) => console.log(err), () => {
        this.loading = false;
      })
  }

}
