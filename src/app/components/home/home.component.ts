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
  currencies;
  selectedCurrency = { id: 1, name: 'USD' } ;
  @ViewChild('myInput') myInput: ElementRef;
  @ViewChild('teraInput') teraInput: ElementRef;
  constructor(
    private _btfgService: BtfgService,
  ) {
    this.currencies = [
      { label: 'Select Currency', value: { id: 1, name: 'USD' }  },
      { label: 'USD', value: { id: 1, name: 'USD' } },
      { label: 'AUD', value: { id: 2, name: 'AUD' } },
      { label: 'BRL', value: { id: 3, name: 'BRL' } },
      { label: 'CAD', value: { id: 4, name: 'CAD' } },
      { label: 'CHF', value: { id: 5, name: 'CHF' } },
      { label: 'CLP', value: { id: 6, name: 'CLP' } },
      { label: 'CNY', value: { id: 7, name: 'CNY' } },
      { label: 'CZK', value: { id: 8, name: 'CZK' } },
      { label: 'DKK', value: { id: 9, name: 'DKK' } },
      { label: 'EUR', value: { id: 10, name: 'EUR' } },
      { label: 'GBP', value: { id: 11, name: 'GBP' } },
      { label: 'HKD', value: { id: 12, name: 'HKD' } },
      { label: 'HUF', value: { id: 13, name: 'HUF' } },
      { label: 'IDR', value: { id: 14, name: 'IDR' } },
      { label: 'ILS', value: { id: 15, name: 'ILS' } },
      { label: 'INR', value: { id: 16, name: 'INR' } },
      { label: 'JPY', value: { id: 17, name: 'JPY' } },
      { label: 'KRW', value: { id: 18, name: 'KRW' } },
      { label: 'MXN', value: { id: 19, name: 'MXN' } },
      { label: 'MYR', value: { id: 20, name: 'MYR' } },
      { label: 'NOK', value: { id: 21, name: 'NOK' } },
      { label: 'NZD', value: { id: 22, name: 'NZD' } },
      { label: 'PHP', value: { id: 23, name: 'PHP' } },
      { label: 'PKR', value: { id: 24, name: 'PKR' } },
      { label: 'PLN', value: { id: 25, name: 'PLN' } },
      { label: 'RUB', value: { id: 26, name: 'RUB' } },
      { label: 'SEK', value: { id: 27, name: 'SEK' } },
      { label: 'SGD', value: { id: 28, name: 'SGD' } },
      { label: 'THB', value: { id: 29, name: 'THB' } },
      { label: 'TRY', value: { id: 30, name: 'TRY' } },
      { label: 'TWD', value: { id: 31, name: 'TWD' } },
      { label: 'ZAR', value: { id: 32, name: 'ZAR' } },
    ];
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

    if (this.click >= 1) {

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
        if (this.payoutThreshhold == 'Pool Default') {
          this.payoutThreshhold = 20;
          this.payoutThreshholdString = null;
        }
        if (this.payoutThreshhold == 0) {
          this.payoutThreshholdString = 'Weekly';
        }
      })
      this._btfgService.getBurstInfo(this.selectedCurrency.name)
      .subscribe((data) => {
        switch (this.selectedCurrency.name) {
          case 'USD':
            this.burstPrice = data[0].price_usd;
            break;
          case 'AUD':
            this.burstPrice = data[0].price_aud;
            break;
          case 'BRL':
            this.burstPrice = data[0].price_brl;
            break;
          case 'CAD':
            this.burstPrice = data[0].price_cad;
            break;
          case 'CHF':
            this.burstPrice = data[0].price_chf;
            break;
          case 'CLP':
            this.burstPrice = data[0].price_clp;
            break;
          case 'CNY':
            this.burstPrice = data[0].price_cny;
            break;
          case 'CZK':
            this.burstPrice = data[0].price_czk;
            break;
          case 'DKK':
            this.burstPrice = data[0].price_dkk;
            break;
          case 'EUR':
            this.burstPrice = data[0].price_eur;
            break;
          case 'GBP':
            this.burstPrice = data[0].price_gbp;
            break;
          case 'HKD':
            this.burstPrice = data[0].price_hkd;
            break;
          case 'HUF':
            this.burstPrice = data[0].price_huf;
            break;
          case 'IDR':
            this.burstPrice = data[0].price_idr;
            break;
          case 'ILS':
            this.burstPrice = data[0].price_ils;
            break;
          case 'INR':
            this.burstPrice = data[0].price_inr;
            break;
          case 'JPY':
            this.burstPrice = data[0].price_jpy;
            break;
          case 'KRW':
            this.burstPrice = data[0].price_krw;
            break;
          case 'MXN':
            this.burstPrice = data[0].price_mxn;
            break;
          case 'MYR':
            this.burstPrice = data[0].price_myr;
            break;
          case 'NOK':
            this.burstPrice = data[0].price_nok;
            break;
          case 'NZD':
            this.burstPrice = data[0].price_nzd;
            break;
          case 'PHP':
            this.burstPrice = data[0].price_php;
            break;
          case 'PKR':
            this.burstPrice = data[0].price_pkr;
            break;
          case 'PLN':
            this.burstPrice = data[0].price_pln;
            break;
          case 'RUB':
            this.burstPrice = data[0].price_rub;
            break;
          case 'SEK':
            this.burstPrice = data[0].price_sek;
            break;
          case 'SGD':
            this.burstPrice = data[0].price_sgd;
            break;
          case 'THB':
            this.burstPrice = data[0].price_thb;
            break;
          case 'TRY':
            this.burstPrice = data[0].price_try;
            break;
          case 'TWD':
            this.burstPrice = data[0].price_twd;
            break;
          case 'ZAR':
            this.burstPrice = data[0].price_zar;
            break;
        }

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
  calcDeadline(tera) {
    this.result = 193016045 / tera;
  }

  selectAll() {
    this.myInput.nativeElement.select();
  }
  selectTera() {
    this.teraInput.nativeElement.select();
  }
}
