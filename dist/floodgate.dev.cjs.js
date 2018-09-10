/** floodgate v0.0.6 : commonjs bundle **/
/** DEVELOPMENT FILE **/
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var PropTypes = require('prop-types');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var generator = /*#__PURE__*/regeneratorRuntime.mark(function generator(data, yieldLength, initialYieldLength) {
    var currentIndex, firstYield;
    return regeneratorRuntime.wrap(function generator$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    currentIndex = 0;

                case 1:
                    if (!(currentIndex <= data.length - 1)) {
                        _context.next = 8;
                        break;
                    }

                    firstYield = currentIndex === 0;
                    _context.next = 5;
                    return [].concat(toConsumableArray(data)).splice(currentIndex, firstYield && initialYieldLength >= 0 ? initialYieldLength : yieldLength);

                case 5:
                    currentIndex = firstYield && initialYieldLength >= 0 ? currentIndex + initialYieldLength : currentIndex + yieldLength;
                    _context.next = 1;
                    break;

                case 8:
                case "end":
                    return _context.stop();
            }
        }
    }, generator, this);
});

var Floodgate = function (_React$Component) {
    inherits(Floodgate, _React$Component);

    // methods
    function Floodgate(props) {
        classCallCheck(this, Floodgate);

        var _this = possibleConstructorReturn(this, (Floodgate.__proto__ || Object.getPrototypeOf(Floodgate)).call(this, props));

        var data = props.data,
            increment = props.increment,
            initial = props.initial;

        _this.queue = generator(data, increment, initial);
        _this.data = data;
        _this.state = {
            renderedItems: [],
            allItemsRendered: false
        };
        _this.loadAll = _this.loadAll.bind(_this);
        _this.loadNext = _this.loadNext.bind(_this);
        _this.reset = _this.reset.bind(_this);
        return _this;
    }

    createClass(Floodgate, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.loadNext();
        }
    }, {
        key: "reset",
        value: function reset() {
            var _this2 = this;

            var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                callback = _ref.callback;

            this.queue = generator(this.data, this.props.increment, this.props.initial);
            this.setState(function (prevState) {
                return {
                    renderedItems: [],
                    allItemsRendered: false
                };
            }, function () {
                return _this2.loadNext({ callback: callback });
            });
        }
    }, {
        key: "loadAll",
        value: function loadAll() {
            var _this3 = this;

            var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
                suppressWarning: false
            },
                callback = _ref2.callback,
                suppressWarning = _ref2.suppressWarning;

            !this.state.allItemsRendered && this.setState(function (prevState) {
                return {
                    renderedItems: _this3.data,
                    allItemsRendered: true
                };
            }, function () {
                return callback && callback(_this3.state);
            }) || this.state.allItemsRendered && !suppressWarning && console.warn("Floodgate: All items are rendered");
        }
    }, {
        key: "loadNext",
        value: function loadNext() {
            var _this4 = this;

            var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                callback = _ref3.callback;

            !this.state.allItemsRendered && this.setState(function (prevState) {
                // Get next iteratable
                var _queue$next = _this4.queue.next(),
                    value = _queue$next.value;
                // Check if array value exists and has at least one element


                var valueIsAvailable = value !== null && value !== undefined && value.length > 0;
                // Combine new items with rendered items from state
                var newRenderedData = [].concat(toConsumableArray(prevState.renderedItems), toConsumableArray(valueIsAvailable ? value : []));
                // Check if all data items have been rendered
                var dataLengthMatches = newRenderedData.length === _this4.data.length;
                return {
                    renderedItems: newRenderedData,
                    allItemsRendered: !valueIsAvailable || valueIsAvailable && dataLengthMatches ? true : false
                };
            }, function () {
                return callback && callback(_this4.state);
            });
        }
    }, {
        key: "render",
        value: function render() {
            var loadAll = this.loadAll,
                loadNext = this.loadNext,
                reset = this.reset;
            var _state = this.state,
                renderedItems = _state.renderedItems,
                allItemsRendered = _state.allItemsRendered;

            return this.props.children({
                items: renderedItems,
                loadComplete: allItemsRendered,
                loadAll: loadAll,
                loadNext: loadNext,
                reset: reset
            });
        }
    }]);
    return Floodgate;
}(React.Component);
// static props


Floodgate.propTypes = {
    children: PropTypes.func,
    data: PropTypes.array.isRequired,
    initial: PropTypes.number,
    increment: PropTypes.number
};
Floodgate.defaultProps = {
    initial: 5,
    increment: 5
};

exports['default'] = Floodgate;
//# sourceMappingURL=floodgate.dev.cjs.js.map
