export interface CountUpOptions {
  startVal?: number;
  decimalPlaces?: number;
  duration?: number;
  useGrouping?: boolean;
  useEasing?: boolean;
  smartEasingThreshold?: number;
  smartEasingAmount?: number;
  separator?: string;
  decimal?: string;
  easingFn?: (t: number, b: number, c: number, d: number) => number;
  formattingFn?: (n: number) => string;
  prefix?: string;
  suffix?: string;
  numerals?: string[];
}
export declare class CountUp {
  private target;
  private endVal;
  private options?;
  version: string;
  private defaults;
  private el;
  private rAF;
  private startTime;
  private decimalMult;
  private remaining;
  private finalEndVal;
  private useEasing;
  private countDown;
  formattingFn: (num: number) => string;
  easingFn?: (t: number, b: number, c: number, d: number) => number;
  callback: (args?: any) => any;
  error: string;
  startVal: number;
  duration: number;
  paused: boolean;
  frameVal: number;
  constructor(target: string | HTMLElement | HTMLInputElement, endVal: number, options?: CountUpOptions);
  private determineDirectionAndSmartEasing;
  start(callback?: (args?: any) => any): void;
  pauseResume(): void;
  reset(): void;
  update(newEndVal: any): void;
  count: (timestamp: number) => void;
  printValue(val: number): void;
  ensureNumber(n: any): boolean;
  validateValue(value: number): number;
  private resetDuration;
  formatNumber: (num: number) => string;
  easeOutExpo: (t: number, b: number, c: number, d: number) => number;
}
