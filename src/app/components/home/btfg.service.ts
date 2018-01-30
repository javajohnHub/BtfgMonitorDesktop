import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx'

@Injectable()
export class BtfgService {

    constructor(private _http: HttpClient) {}

    getPaymentInfo(source) {
        return this._http.get(source);
    }
    getBlockchainStatus() {
        return this._http.get('https://wallet.burst.cryptoguru.org:8125/burst?requestType=getBlockchainStatus');
    }

    getWalletInfo(walletId) {
        return this._http.get('https://wallet.burst.cryptoguru.org:8125/burst?requestType=getAccount&account=' + walletId);
    }
    getBlockInfo() {
        return this._http.get('https://wallet.burst.cryptoguru.org:8125/burst?requestType=getBlocks&firstIndex=1&lastIndex=1');
    }
    getBurstInfo(currency) {
        return this._http.get('https://api.coinmarketcap.com/v1/ticker/burst/?convert=' + currency);
    }
    getThreshold(walletId) {
        return this._http.get('http://burst.btfg.space:8000/btfgminpayment.php?id=' + walletId);
    }
}


