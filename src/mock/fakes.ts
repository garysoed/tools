type CallSpec = {args: any[], handler: (...args: any[]) => any};


class WhenBuilder {
  private readonly args_: any[];
  private readonly callSpecs_: CallSpec[];
  private readonly spy_: jasmine.Spy;

  constructor(args: any[], spy: jasmine.Spy, callSpecs: CallSpec[]) {
    this.args_ = args;
    this.callSpecs_ = callSpecs;
    this.spy_ = spy;
  }

  /**
   * @param handler Function to call if the condition matches.
   * @return The modified spy object.
   */
  call(handler: (...args: any[]) => any): FakesContinuationBuilder {
    const newCallSpecs = this.callSpecs_.concat([{args: this.args_, handler: handler}]);
    this.spy_.and.callFake((...args: any[]) => {
      const callSpec = newCallSpecs.find((callSpec: CallSpec) => {
        let matches = true;
        for (let i = 0; i < callSpec.args.length && matches; i++) {
          const arg = callSpec.args[i];
          if (typeof arg.jasmineMatches === 'function') {
            matches = matches && arg.jasmineMatches(args[i]);
          } else if (typeof arg.asymmetricMatch === 'function') {
            matches = matches && arg.asymmetricMatch(args[i]);
          } else if (!(arg instanceof Element) && typeof arg.matches === 'function') {
            matches = matches && arg.matches(args[i]);
          } else {
            matches = matches && (callSpec.args[i] === args[i]);
          }
        }

        return matches;
      });

      if (callSpec !== undefined) {
        return callSpec.handler(...args);
      }
    });
    return new FakesContinuationBuilder(this.spy_, newCallSpecs);
  }

  /**
   * @param value Value to resolve when the condition matches.
   * @return The modified spy object.
   */
  resolve(value?: any): FakesContinuationBuilder {
    return this.return(Promise.resolve(value));
  }

  /**
   * @param value Value to be returned when the condition matches.
   * @return The modified spy object.
   */
  return(value?: any): FakesContinuationBuilder {
    return this.call(() => value);
  }
}


class ElseBuilder {
  private readonly spy_: jasmine.Spy;
  private readonly whenBuilder_: WhenBuilder;

  constructor(spy: jasmine.Spy, callSpecs: CallSpec[]) {
    this.spy_ = spy;
    this.whenBuilder_ = new WhenBuilder([], spy, callSpecs);
  }

  /**
   * @param handler Function to call if the condition matches.
   * @return The modified spy object.
   */
  call(handler: (...args: any[]) => any): jasmine.Spy {
    this.whenBuilder_.call(handler);
    return this.spy_;
  }

  /**
   * @param value Value to resolve when the condition matches.
   * @return The modified spy object.
   */
  resolve(value?: any): jasmine.Spy {
    return this.return(Promise.resolve(value));
  }

  /**
   * @param value Value to be returned when the condition matches.
   * @return The modified spy object.
   */
  return(value?: any): jasmine.Spy {
    return this.call(() => value);
  }
}


class FakesContinuationBuilder {
  protected readonly callSpecs_: CallSpec[];
  protected readonly spy_: jasmine.Spy;

  constructor(spy: jasmine.Spy, callSpecs: CallSpec[]) {
    this.callSpecs_ = callSpecs;
    this.spy_ = spy;
  }

  /**
   * Starts a condition that always matches.
   * @return Builder to chain the behavior if the arguments match the call.
   */
  else(): ElseBuilder {
    return new ElseBuilder(this.spy_, this.callSpecs_);
  }

  /**
   * Starts a matching condition.
   * @param args Arguments to match. This also accepts jasmine matchers. If there are less specified
   *    arguments, the rest of the arguments are assumed to match.
   * @return Builder to chain the behavior if the arguments match the call.
   */
  when(...args: any[]): WhenBuilder {
    return new WhenBuilder(args, this.spy_, this.callSpecs_);
  }
}


/**
 * Sets up fake behavior for jasmine Spies.
 */
export class Fakes extends FakesContinuationBuilder {

  constructor(spy: jasmine.Spy) {
    super(spy, []);
  }

  /**
   * Calls the given handler always.
   * @param handler Handler to be called.
   * @return The modified spy object.
   */
  call(handler: (...args: any[]) => any): jasmine.Spy {
    return this.else().call(handler);
  }

  /**
   * @param spy The jasmine spy to set up the behavior for.
   * @return The Fakes object for chaining.
   */
  static build(spy: jasmine.Spy): Fakes {
    return new Fakes(spy);
  }
}

// TODO: Mutable
