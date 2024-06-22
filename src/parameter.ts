export class Parameter {
  readonly defaultVal: number;
  readonly minVal: number;
  readonly maxVal: number;
  private _value: number;

  get value(): number {
    return this._value
  }

  constructor(defaultVal: number, min: number, max: number) {
    this.defaultVal = defaultVal;
    this._value = defaultVal;
    this.minVal = min;
    this.maxVal = max;
  }

  setValue(newValue: number): void {
    this._value = Math.max(this.minVal, Math.min(newValue, this.maxVal));
  }

  reset() {
    this._value = this.defaultVal;
  }
}
