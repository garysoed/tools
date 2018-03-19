export interface RetryStrategy {
  onReject(error: any): Promise<RetryStrategy | null>;
}
