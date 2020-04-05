import { merge, Observable } from 'rxjs';

export abstract class Runnable {
  private readonly setupObs$: Array<Observable<unknown>> = [];

  run(): Observable<unknown> {
    return merge(...this.setupObs$);
  }

  protected addSetup(obs: Observable<unknown>): void {
    this.setupObs$.push(obs);
  }
}
