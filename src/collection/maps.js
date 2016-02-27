"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var base_fluent_1 = require('./base-fluent');
var FluentMap = (function (_super) {
    __extends(FluentMap, _super);
    function FluentMap(data) {
        _super.call(this, data);
    }
    FluentMap.prototype.forEach = function (fn) {
        this.data.forEach(function (value, key) {
            fn(key, value);
        });
        return this;
    };
    return FluentMap;
}(base_fluent_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    of: function (data) {
        return new FluentMap(data);
    },
};
