import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx'

@Injectable()
export class BtfgService {

    constructor(private _http: HttpClient) {}

    getPaymentInfo() {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');
        return this._http.get('http://burst.btfg.space/pool-payments.json', { headers: headers });
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
}


