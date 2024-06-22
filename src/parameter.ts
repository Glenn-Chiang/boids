export class Parameter {
  readonly defaultVal: number;
  readonly minVal: number;
  readonly maxVal: number;
  currentVal: number;

  constructor(defaultVal: number, min: number, max: number) {
    this.defaultVal = defaultVal;
    this.currentVal = defaultVal;
    this.minVal = min;
    this.maxVal = max;
  }

  setValue(newValue: number): void {
    this.currentVal = Math.max(this.minVal, Math.min(newValue, this.maxVal));
  }

  reset() {
    this.currentVal = this.defaultVal;
  }
}
