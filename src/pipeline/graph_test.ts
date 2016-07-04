import TestBase from '../test-base';
TestBase.setup();

import {Graph} from './graph';
import {Jsons} from '../jsons';
import {Mocks} from '../mock/mocks';
import {PipeUtil} from './pipe-util';


describe('pipeline.Graph', () => {
  describe('resolveArgument_', () => {
    it('should correctly resolve external argument', () => {
      let key = 'key';
      let value = 'value';
      let argMetaData = Mocks.object('argMetaData');
      argMetaData.isExternal = true;
      argMetaData.key = key;

      expect(Graph['resolveArgument_'](argMetaData, Mocks.object('context'), {[key]: value}))
          .toEqual(value);
    });

    it('should correctly resolve internal argument', () => {
      let forwardedKey = 'forwardedKey';
      let key = 'key';
      let externalKey = 'externalKey';
      let externalValue = 'externalValue';
      let value = 'value';
      let argMetaData = Mocks.object('argMetaData');
      argMetaData.isExternal = false;
      argMetaData.forwardedArguments = {
        [forwardedKey]: externalKey,
      };
      argMetaData.key = key;
      let context = Mocks.object('context');

      spyOn(Graph, 'run').and.returnValue(value);

      expect(Graph['resolveArgument_'](argMetaData, context, {[externalKey]: externalValue}))
          .toEqual(value);
      expect(Graph.run).toHaveBeenCalledWith(context, key, {[forwardedKey]: externalValue});
    });

    it('should throw error if the external argument cannot be resolved', () => {
      let argMetaData = Mocks.object('argMetaData');
      argMetaData.isExternal = true;
      argMetaData.key = 'key';

      expect(() => {
        Graph['resolveArgument_'](argMetaData, Mocks.object('context'), {});
      }).toThrowError(/resolve external argument/);
    });

    it('should throw error if a forwarded argument cannot be resolved', () => {
      let argMetaData = Mocks.object('argMetaData');
      argMetaData.isExternal = false;
      argMetaData.forwardedArguments = {
        'forwardedKey': 'externalKey',
      };
      argMetaData.key = 'key';
      let context = Mocks.object('context');

      expect(() => {
        Graph['resolveArgument_'](argMetaData, context, {});
      }).toThrowError(/resolve forwarded argument/);
    });
  });

  describe('run', () => {
    it('should run the node correctly', () => {
      let key = 'key';
      let externalArgs = Mocks.object('externalArgs');
      let prototype = Mocks.object('prototype');
      let context = Mocks.object('context');
      Jsons.setValue(context, 'constructor.prototype', prototype);

      let argData = Mocks.object('argData');
      let runResult = Mocks.object('runResult');
      let mockGraphNode = jasmine.createSpyObj('GraphNode', ['run']);
      mockGraphNode.args = [argData];
      mockGraphNode.run.and.returnValue(runResult);
      spyOn(PipeUtil, 'getNode').and.returnValue(mockGraphNode);

      let resolvedArg = Mocks.object('resolvedArg');
      spyOn(Graph, 'resolveArgument_').and.returnValue(resolvedArg);

      expect(Graph.run(context, key, externalArgs)).toEqual(runResult);
      expect(mockGraphNode.run).toHaveBeenCalledWith(context, [resolvedArg]);
      expect(Graph['resolveArgument_']).toHaveBeenCalledWith(argData, context, externalArgs);
      expect(PipeUtil.getNode).toHaveBeenCalledWith(prototype, key);
    });

    it('should throw error if the node cannot be found', () => {
      let context = Mocks.object('context');
      Jsons.setValue(context, 'constructor.prototype', Mocks.object('prototype'));

      spyOn(PipeUtil, 'getNode').and.returnValue(null);

      expect(() => {
        Graph.run(context, 'key', Mocks.object('externalArgs'));
      }).toThrowError(/No nodes found/);
    });
  });
});
