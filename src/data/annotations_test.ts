import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Annotations} from './annotations';
import {Maps} from '../collection/maps';
import {Mocks} from '../mock/mocks';


describe('data.Annotations', () => {
  let annotations;

  beforeEach(() => {
    annotations = new Annotations();
  });

  describe('addField', () => {
    it('should add the given field key', () => {
      let key = 'key';
      annotations.addField(key);
      assert(annotations.annotatedFields).to.equal([key]);
    });
  });

  describe('getFieldValues', () => {
    it('should return the annotated fields with their values', () => {
      let field1 = 'field1';
      let field2 = 'field2';
      let value1 = Mocks.object('value1');
      let value2 = Mocks.object('value2');
      let object = {
        [field1]: value1,
        [field2]: value2,
        'ignored': 'ignored',
      };

      annotations.fieldKeys_ = [field1, field2];
      assert(Maps.of(annotations.getFieldValues(object)).asRecord()).to.equal({
        [field1]: value1,
        [field2]: value2,
      });
    });
  });

  describe('hasAnnotation', () => {
    it('should return true if the constructor has the annotation', () => {
      let ctor = Mocks.object('ctor');
      let annotation = Mocks.object('annotation');
      ctor[annotation] = Mocks.object('annotations');
      assert(Annotations.hasAnnotation(ctor, annotation)).to.equal(true);
    });

    it('should return false if the constructor does not have the annotation', () => {
      let ctor = Mocks.object('ctor');
      let annotation = Mocks.object('annotation');
      assert(Annotations.hasAnnotation(ctor, annotation)).to.equal(false);
    });
  });

  describe('of', () => {
    it('should create a new instance of annotations correctly', () => {
      let ctor = Mocks.object('ctor');
      let annotation = Symbol('annotation');
      let annotations = Annotations.of(ctor, annotation);
      assert(annotations).to.equal(jasmine.any(Annotations));
      assert(ctor[annotation]).to.be(annotations);
    });

    it('should reuse the existing instance of annotations', () => {
      let ctor = Mocks.object('ctor');
      let annotation = Symbol('annotation');
      let annotations = Annotations.of(ctor, annotation);
      assert(Annotations.of(ctor, annotation)).to.be(annotations);
    });
  });
});
