import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {DisposableFunction} from '../dispose/disposable-function';
import {Mocks} from '../mock/mocks';

import {
  CHILD_LIST_CHANGE_ANNOTATIONS,
  ChildListChangeConfig,
  ChildListChangeHandler} from './child-list-change-handler';


describe('webc.ChildListChangeHandler', () => {
  let handler: ChildListChangeHandler;

  beforeEach(() => {
    handler = new ChildListChangeHandler();
  });

  describe('createNodeList_', () => {
    it('should create the correct node list', () => {
      let node1 = Mocks.object('node1');
      let node2 = Mocks.object('node2');
      let node3 = Mocks.object('node3');
      let collection = <HTMLCollection> {
        item(index: number): any {
          switch (index) {
            case 0:
              return node1;
            case 1:
              return node2;
            case 2:
              return node3;
          }
        },
        length: 3,
      };
      let nodeList = handler['createNodeList_'](collection);

      assert(nodeList.length).to.equal(3);
      assert(nodeList[0]).to.equal(node1);
      assert(nodeList[1]).to.equal(node2);
      assert(nodeList[2]).to.equal(node3);
      assert(nodeList.item(0)).to.equal(node1);
      assert(nodeList.item(1)).to.equal(node2);
      assert(nodeList.item(2)).to.equal(node3);
    });
  });

  describe('onMutation_', () => {
    it('should call the handler correctly', () => {
      let mockHandler1 = jasmine.createSpy('Handler1');
      let mockHandler2 = jasmine.createSpy('Handler2');
      let handlerKey1 = 'handlerKey1';
      let handlerKey2 = 'handlerKey2';
      let instance = {[handlerKey1]: mockHandler1, [handlerKey2]: mockHandler2};

      let addedNodes1 = Mocks.object('addedNodes1');
      let removedNodes1 = Mocks.object('removedNodes1');
      let addedNodes2 = Mocks.object('addedNodes2');
      let removedNodes2 = Mocks.object('removedNodes2');
      let records: any[] = [
        {addedNodes: addedNodes1, removedNodes: removedNodes1},
        {addedNodes: addedNodes2, removedNodes: removedNodes2},
      ];

      handler['onMutation_'](instance, new Set([handlerKey1, handlerKey2]), records);

      assert(mockHandler1).to.haveBeenCalledWith(addedNodes1, removedNodes1);
      assert(mockHandler1).to.haveBeenCalledWith(addedNodes2, removedNodes2);
      assert(mockHandler2).to.haveBeenCalledWith(addedNodes1, removedNodes1);
      assert(mockHandler2).to.haveBeenCalledWith(addedNodes2, removedNodes2);
    });

    it('should do nothing if the handler cannot be found', () => {
      let handlerKey = 'handlerKey';
      let instance = {};

      let records: any[] = [{}];

      assert(() => {
        handler['onMutation_'](instance, new Set([handlerKey]), records);
      }).toNot.throw();
    });
  });

  describe('configure', () => {
    it('should create the mutation observer correctly, call the initial mutation and ' +
        'disconnects on dispose',
        () => {
          let mockInstance = jasmine.createSpyObj('Instance', ['addDisposable']);
          let mockObserver = jasmine.createSpyObj('Observer', ['disconnect', 'observe']);
          let createObserverSpy =
              spyOn(handler, 'createMutationObserver_').and.returnValue(mockObserver);

          let onMutationSpy = spyOn(handler, 'onMutation_');

          let nodeList = Mocks.object('nodeList');
          spyOn(handler, 'createNodeList_').and.returnValue(nodeList);

          let handlerKey1 = 'handlerKey1';
          let handlerKey2 = 'handlerKey2';
          let configs = <ChildListChangeConfig[]> [
            {handlerKey: handlerKey1},
            {handlerKey: handlerKey2},
          ];

          let children = Mocks.object('children');
          let targetEl = Mocks.object('targetEl');
          targetEl.children = children;

          handler.configure(targetEl, mockInstance, configs);

          assert(mockInstance.addDisposable).to
              .haveBeenCalledWith(Matchers.any(DisposableFunction));
          mockInstance.addDisposable.calls.argsFor(0)[0].dispose();
          assert(mockObserver.disconnect).to.haveBeenCalledWith();

          assert(handler['onMutation_']).to.haveBeenCalledWith(
              mockInstance,
              Matchers.any(Set),
              [Matchers.objectContaining({
                addedNodes: nodeList,
                removedNodes: {length: 0},
                target: targetEl,
                type: 'childList',
              })],
          );
          assert(<Set<string>> onMutationSpy.calls.argsFor(0)[1]).to
              .haveElements([handlerKey1, handlerKey2]);

          assert(handler['createNodeList_']).to.haveBeenCalledWith(children);
          assert(mockObserver.observe).to.haveBeenCalledWith(targetEl, {childList: true});

          assert(handler['createMutationObserver_']).to
              .haveBeenCalledWith(mockInstance, Matchers.any(Set));
          assert(<Set<string>> createObserverSpy.calls.argsFor(0)[1]).to
              .haveElements([handlerKey1, handlerKey2]);
        });
  });

  describe('createDecorator', () => {
    it('should create the correct decorator', () => {
      let constructor = Mocks.object('constructor');
      let target = Mocks.object('target');
      target.constructor = constructor;

      let mockAnnotations = jasmine.createSpyObj('Annotations', ['attachValueToProperty']);
      spyOn(CHILD_LIST_CHANGE_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      let selector = 'selector';
      let propertyKey = 'propertyKey';
      let descriptor = Mocks.object('descriptor');

      assert(handler.createDecorator(selector)(target, propertyKey, descriptor))
          .to.equal(descriptor);
      assert(mockAnnotations.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          {
            handlerKey: propertyKey,
            selector: selector,
          });
      assert(CHILD_LIST_CHANGE_ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
    });
  });

  describe('getConfigs', () => {
    it('should return the correct configs', () => {
      let attachedValues = Mocks.object('attachedValues');
      let mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(attachedValues);

      spyOn(CHILD_LIST_CHANGE_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      let constructor = Mocks.object('constructor');
      let instance = Mocks.object('instance');
      instance.constructor = constructor;

      assert(handler.getConfigs(instance)).to.equal(attachedValues);
      assert(CHILD_LIST_CHANGE_ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
    });
  });
});
