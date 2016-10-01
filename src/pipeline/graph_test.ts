import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Graph} from './graph';
import {GraphNode} from './graph-node';
import {Mocks} from '../mock/mocks';
import {PipeUtil} from './pipe-util';


describe('pipeline.Graph', () => {
  describe('resolveArgument_', () => {
    it('should correctly resolve external argument', () => {
      let key = 'key';
      let value = 'value';
      let argMetaData = jasmine.createSpyObj('argMetaData', ['isExternal', 'getKey']);
      argMetaData.isExternal.and.returnValue(true);
      argMetaData.getKey.and.returnValue(key);

      assert(Graph['resolveArgument_'](argMetaData, Mocks.object('context'), {[key]: value}))
          .to.equal(value);
    });

    it('should correctly resolve internal argument', () => {
      let forwardedKey = 'forwardedKey';
      let key = 'key';
      let externalKey = 'externalKey';
      let externalValue = 'externalValue';
      let value = 'value';
      let argMetaData = jasmine.createSpyObj(
          'argMetaData',
          ['isExternal', 'getForwardedArguments', 'getKey']);
      argMetaData.isExternal.and.returnValue(false);
      argMetaData.getForwardedArguments.and.returnValue({
        [forwardedKey]: externalKey,
      });
      argMetaData.getKey.and.returnValue(key);
      let context = Mocks.object('context');

      spyOn(Graph, 'run').and.returnValue(value);

      assert(Graph['resolveArgument_'](argMetaData, context, {[externalKey]: externalValue}))
          .to.equal(value);
      assert(Graph.run).to.haveBeenCalledWith(context, key, {[forwardedKey]: externalValue});
    });

    it('should throw error if the external argument cannot be resolved', () => {
      let argMetaData = jasmine.createSpyObj('argMetaData', ['isExternal', 'getKey']);
      argMetaData.isExternal.and.returnValue(true);
      argMetaData.getKey.and.returnValue('key');

      assert(() => {
        Graph['resolveArgument_'](argMetaData, Mocks.object('context'), {});
      }).to.throwError(/resolve external argument/);
    });

    it('should throw error if a forwarded argument cannot be resolved', () => {
      let argMetaData = jasmine.createSpyObj(
          'argMetaData', ['isExternal', 'getForwardedArguments', 'getKey']);
      argMetaData.isExternal.and.returnValue(false);
      argMetaData.getForwardedArguments.and.returnValue({
        'forwardedKey': 'externalKey',
      });
      argMetaData.getKey.and.returnValue('key');
      let context = Mocks.object('context');

      assert(() => {
        Graph['resolveArgument_'](argMetaData, context, {});
      }).to.throwError(/resolve forwarded argument/);
    });
  });

  describe('run', () => {
    it('should run the node correctly', () => {
      let key = 'key';
      let externalArgs = Mocks.object('externalArgs');
      let prototype = Mocks.object('prototype');
      let context = {'constructor': {'prototype': prototype}};

      let argData = Mocks.object('argData');
      let runResult = Mocks.object('runResult');
      let mockGraphNode = jasmine.createSpyObj('GraphNode', ['getArgs', 'run']);
      mockGraphNode.getArgs.and.returnValue([argData]);
      mockGraphNode.run.and.returnValue(runResult);
      spyOn(PipeUtil, 'getNode').and.returnValue(mockGraphNode);

      let resolvedArg = Mocks.object('resolvedArg');
      spyOn(Graph, 'resolveArgument_').and.returnValue(resolvedArg);

      assert(Graph.run(context, key, externalArgs)).to.equal(runResult);
      assert((<GraphNode<any>> mockGraphNode).run).to.haveBeenCalledWith(context, [resolvedArg]);
      assert(Graph['resolveArgument_']).to.haveBeenCalledWith(argData, context, externalArgs);
      assert(PipeUtil.getNode).to.haveBeenCalledWith(prototype, key);
    });

    it('should throw error if the node cannot be found', () => {
      let context = {'constructor': {'prototype': Mocks.object('prototype')}};
      spyOn(PipeUtil, 'getNode').and.returnValue(null);

      assert(() => {
        Graph.run(context, 'key', Mocks.object('externalArgs'));
      }).to.throwError(/No nodes found/);
    });
  });
});
