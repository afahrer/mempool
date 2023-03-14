import { Component, ChangeDetectionStrategy, OnChanges, Input } from '@angular/core';
import { calcSegwitFeeGains } from '../../bitcoin.utils';
import { Transaction } from '../../interfaces/electrs.interface';

@Component({
  selector: 'app-tx-features',
  templateUrl: './tx-features.component.html',
  styleUrls: ['./tx-features.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TxFeaturesComponent implements OnChanges {
  @Input() tx: Transaction;

  segwitGains = {
    realizedSegwitGains: 0,
    potentialSegwitGains: 0,
    potentialP2shSegwitGains: 0,
    potentialTaprootGains: 0,
    realizedTaprootGains: 0
  };
  isRbfTransaction: boolean;
  isTaproot: boolean;

  segwitEnabled: boolean;
  rbfEnabled: boolean;
  taprootEnabled: boolean;

  constructor() { }

  ngOnChanges() {
    if (!this.tx) {
      return;
    }
    this.segwitEnabled = !this.tx.status.confirmed || this.tx.status.block_height >= 477120;
    this.taprootEnabled = !this.tx.status.confirmed || this.tx.status.block_height >= 709632;
    this.rbfEnabled = !this.tx.status.confirmed || this.tx.status.block_height > 399700;
    this.segwitGains = calcSegwitFeeGains(this.tx);
    this.isRbfTransaction = this.tx.vin.some((v) => v.sequence < 0xfffffffe);
    this.isTaproot = this.tx.vin.some((v) => v.prevout && v.prevout.scriptpubkey_type === 'v1_p2tr');
  }
}
