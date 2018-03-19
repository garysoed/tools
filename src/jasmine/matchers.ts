type AsymmetricMatcher = {asymmetricMatch: (value: any, ...args: any[]) => boolean};
type MapFn<T1, T2> = (value: T1) => T2;

class MatcherBuilder {
  constructor(private mapFns_: MapFn<any, any>[]) { }

  any<T>(ctor: new (...args: any[]) => T): T {
    return this.createMatcher_(jasmine.any(ctor) as any as AsymmetricMatcher) as any as T;
  }

  anyFunction<R>(): () => R;
  anyFunction<P1, R>(): (arg1: P1) => R;
  anyFunction(): any {
    return this.createMatcher_(jasmine.any(Function) as any as AsymmetricMatcher);
  }

  anyInstanceOf<T>(obj: T): T {
    return this
        .createMatcher_(jasmine.any(obj.constructor) as any as AsymmetricMatcher) as any as T;
  }

  anyString(): string {
    return this.createMatcher_(jasmine.any(String) as any as AsymmetricMatcher) as any as string;
  }

  anyThing(): any {
    return this.createMatcher_(jasmine.anything() as any as AsymmetricMatcher);
  }

  arrayContaining<T>(obj: T[]): T[] {
    return this.createMatcher_(jasmine.arrayContaining(obj)) as any as T[];
  }

  private createMatcher_(asymmetricMatcher: AsymmetricMatcher): AsymmetricMatcher {
    return {
      asymmetricMatch: (actual: any, ...args: any[]): boolean => {
        const mappedActual = this.mapFns_.reduce((previous, current) => {
          return current(previous);
        }, actual);
        return asymmetricMatcher.asymmetricMatch(mappedActual, ...args);
      },
    };
  }

  map(mapFn: MapFn<any, any>): MatcherBuilder {
    const fns = [...this.mapFns_];
    fns.push(mapFn);
    return new MatcherBuilder(fns);
  }

  objectContaining(obj: any): any {
    return this.createMatcher_(jasmine.objectContaining(obj) as any as AsymmetricMatcher);
  }

  stringMatching(regexp: RegExp): string {
    return this.createMatcher_(
        jasmine.stringMatching(regexp) as any as AsymmetricMatcher) as any as string;
  }
}

export const Matchers = new MatcherBuilder([]);
// TODO: anyTypeof
// TODO: anyNumberCloseTo
