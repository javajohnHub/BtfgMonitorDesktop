import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BtfgService } from 'app/components/home/btfg.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  walletId: string;
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
  chartData: any;
  options: Object;
  burstPrice: number;
  walletAmountUSD: number;
  pendingUSD: number;
  estimatedUSD: number;
  estimatedPercentage: number;
  payoutThreshhold: any;
  burstPriceBtc: number;
  buttonLabel = 'Get Info';
  click = 0;
  result;
  payoutThreshholdString;
  @ViewChild('myInput') myInput: ElementRef;
  @ViewChild('teraInput') teraInput: ElementRef;
  constructor(
    private _btfgService: BtfgService,
  ) { 
    
  }

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
    this.click++;
    
    if(this.click >= 1) {
  
      this.buttonLabel = 'Refresh';
      
    }
    if (this.walletId) {
      const d = new Date();
      this.lastUpdated = d.toLocaleString();
      this._burstData();
    }
  }

  _burstData() {
    this.loading = true;
    this._btfgService.getThreshold(this.walletId)
    .subscribe((data) => {
      this.payoutThreshhold = data['Threshold'];
      if(this.payoutThreshhold == 'Pool Default') {
        this.payoutThreshhold = 20;
        this.payoutThreshholdString = null;
      }
      console.log(this.payoutThreshhold)
      if(this.payoutThreshhold == 0 ) {
        this.payoutThreshholdString = 'Weekly';
      }
    })
    this._btfgService.getBurstInfo()
    .subscribe((data) => {
      this.burstPrice = data[0].price_usd;
      this.burstPriceBtc = data[0].price_btc;
    })
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
        this.blockShares = [];
        this.blockLabels = [];
        this.minerShare = 0;
        this.totalShare = 0;
        this.pendingUSD = 0;
        this.estimatedUSD = 0;
        this.estimatedPercentage = 0;
        this.paymentData = data;
        if (this.paymentData) {
          if (this.paymentData['pendingPaymentList'][this.walletId]) {
            this.pendingPayment = this.paymentData['pendingPaymentList'][this.walletId]
            this.pendingUSD = this.pendingPayment * this.burstPrice;
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
          this.estimatedRevenue = (this.minerShare * this.blockReward) / this.totalShare;
          this.estimatedPercentage = (this.minerShare / this.totalShare) * 100;
          this.estimatedUSD = this.estimatedRevenue * this.burstPrice;
        }
    
        this.chartData = {
          labels: this.blockLabels,
          datasets: [
              {
                  label: 'Current Round Shares',
                  backgroundColor: 'green',
                  borderColor: '#1E88E5',
                  data: this.blockShares
              },
          ]
      }
        this.loading = false;
      })
    this._btfgService.getWalletInfo(this.walletId)
      .subscribe((data) => {
        this.loading = true;
        this.walletData = data;
        this.currentBalance = (this.walletData['effectiveBalanceNXT'] / 100000000);
        this.walletAmountUSD = this.burstPrice * this.currentBalance;
      
     
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
  calcDeadline(tera){
   this.result = 193016045 / tera;
  }

  selectAll(){
    this.myInput.nativeElement.select();
  }
  selectTera(){
    this.teraInput.nativeElement.select();
  }
}
