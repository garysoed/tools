"use strict";
var test_base_1 = require('../test-base');
test_base_1.default.setup();
var base_service_1 = require('./base-service');
var test_dispose_1 = require('../testing/test-dispose');
describe('ng.BaseService', function () {
    var mockWindow;
    var service;
    beforeEach(function () {
        mockWindow = jasmine.createSpyObj('Window', ['addEventListener', 'removeEventListener']);
        service = new base_service_1.default(mockWindow);
        test_dispose_1.default.add(service);
    });
    describe('onBeforeUnload_', function () {
        it('should dispose itself on beforeunload', function () {
            spyOn(service, 'dispose');
            expect(mockWindow.addEventListener)
                .toHaveBeenCalledWith('beforeunload', jasmine.any(Function));
            mockWindow.addEventListener.calls.argsFor(0)[1]();
            expect(service.dispose).toHaveBeenCalledWith();
        });
    });
});
