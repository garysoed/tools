import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { DisposableFunction } from '../dispose/disposable-function';
import { MonadUtil } from '../event/monad-util';
import { ImmutableSet } from '../immutable/immutable-set';
import { Mocks } from '../mock/mocks';
import {
  CHILD_LIST_CHANGE_ANNOTATIONS,
  ChildListChangeHandler } from '../webc/child-list-change-handler';


describe('webc.ChildListChangeHandler', () => {
  let handler: ChildListChangeHandler;

  beforeEach(() => {
    handler = new ChildListChangeHandler();
  });

  describe('createNodeList_', () => {
    it('should create the correct node list', () => {
      const node1 = Mocks.object('node1');
      const node2 = Mocks.object('node2');
      const node3 = Mocks.object('node3');
      const collection = {
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
      } as HTMLCollection;
      const nodeList = handler['createNodeList_'](collection);

      assert(nodeList.length).to.equal(3);
      assert(nodeList[0]).to.equal(node1);
      assert(nodeList[1]).to.equal(node2);
      assert(nodeList[2]).to.equal(node3);
      assert(nodeList.item(0)).to.equal(node1);
      assert(nodeList.item(1)).to.equal(node2);
      assert(nodeList.item(2)).to.equal(node3);
    });
  });

  describe('configure', () => {
    it('should create the mutation observer correctly, call the initial mutation and ' +
        'disconnects on dispose',
        () => {
          const mockInstance = jasmine.createSpyObj('Instance', ['addDisposable']);
          const mockObserver = jasmine.createSpyObj('Observer', ['disconnect', 'observe']);
          const createObserverSpy =
              spyOn(handler, 'createMutationObserver_').and.returnValue(mockObserver);

          const onMutationSpy = spyOn(handler, 'onMutation_');

          const nodeList = Mocks.object('nodeList');
          spyOn(handler, 'createNodeList_').and.returnValue(nodeList);

          const handlerKey1 = 'handlerKey1';
          const handlerKey2 = 'handlerKey2';
          const configs = ImmutableSet.of<any>([
            {handlerKey: handlerKey1},
            {handlerKey: handlerKey2},
          ]);

          const children = Mocks.object('children');
          const targetEl = Mocks.object('targetEl');
          targetEl.children = children;

          handler.configure(targetEl, mockInstance, configs);

          assert(mockInstance.addDisposable).to
              .haveBeenCalledWith(Matchers.any(DisposableFunction));
          mockInstance.addDisposable.calls.argsFor(0)[0].dispose();
          assert(mockObserver.disconnect).to.haveBeenCalledWith();

          assert(handler['onMutation_']).to.haveBeenCalledWith(
              mockInstance,
              Matchers.any<ImmutableSet<string>>(ImmutableSet),
              Matchers.any<ImmutableSet<MutationRecord>>(ImmutableSet));
          assert(onMutationSpy.calls.argsFor(0)[2] as ImmutableSet<any>).to.haveElements([
            Matchers.objectContaining({
              addedNodes: nodeList,
              removedNodes: {length: 0},
              target: targetEl,
              type: 'childList',
            })],
          );
          assert(onMutationSpy.calls.argsFor(0)[1] as Set<string>).to
              .haveElements([handlerKey1, handlerKey2]);

          assert(handler['createNodeList_']).to.haveBeenCalledWith(children);
          assert(mockObserver.observe).to.haveBeenCalledWith(targetEl, {childList: true});

          assert(handler['createMutationObserver_']).to
              .haveBeenCalledWith(mockInstance, Matchers.any<ImmutableSet<string>>(ImmutableSet));
          assert(createObserverSpy.calls.argsFor(0)[1] as Set<string>).to
              .haveElements([handlerKey1, handlerKey2]);
        });
  });

  describe('createDecorator', () => {
    it('should create the correct decorator', () => {
      const constructor = Mocks.object('constructor');
      const target = Mocks.object('target');
      target.constructor = constructor;

      const mockAnnotations = jasmine.createSpyObj('Annotations', ['attachValueToProperty']);
      spyOn(CHILD_LIST_CHANGE_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      const selector = 'selector';
      const propertyKey = 'propertyKey';
      const descriptor = Mocks.object('descriptor');

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
      const attachedValues = Mocks.object('attachedValues');
      const mockAnnotations = jasmine.createSpyObj('Annotations', ['getAttachedValues']);
      mockAnnotations.getAttachedValues.and.returnValue(attachedValues);

      spyOn(CHILD_LIST_CHANGE_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotations);

      const constructor = Mocks.object('constructor');
      const instance = Mocks.object('instance');
      instance.constructor = constructor;

      assert(handler.getConfigs(instance)).to.equal(attachedValues);
      assert(CHILD_LIST_CHANGE_ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
    });
  });

  describe('onMutation_', () => {
    it('should call the handler correctly', () => {
      const handlerKey1 = 'handlerKey1';
      const handlerKey2 = 'handlerKey2';
      const instance = Mocks.object('instance');

      const addedNodes1 = Mocks.object('addedNodes1');
      const removedNodes1 = Mocks.object('removedNodes1');
      const addedNodes2 = Mocks.object('addedNodes2');
      const removedNodes2 = Mocks.object('removedNodes2');
      const records = ImmutableSet.of<any>([
        {addedNodes: addedNodes1, removedNodes: removedNodes1},
        {addedNodes: addedNodes2, removedNodes: removedNodes2},
      ]);

      spyOn(MonadUtil, 'callFunction');

      handler['onMutation_'](instance, ImmutableSet.of([handlerKey1, handlerKey2]), records);

      assert(MonadUtil.callFunction).to.haveBeenCalledWith(
          {added: addedNodes1, type: 'gs-childlistchange', removed: removedNodes1},
          instance,
          handlerKey1);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(
          {added: addedNodes2, type: 'gs-childlistchange', removed: removedNodes2},
          instance,
          handlerKey2);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(
          {added: addedNodes1, type: 'gs-childlistchange', removed: removedNodes1},
          instance,
          handlerKey1);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(
          {added: addedNodes2, type: 'gs-childlistchange', removed: removedNodes2},
          instance,
          handlerKey2);
    });
  });
});
