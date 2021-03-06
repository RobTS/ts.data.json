"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var result_1 = require("./result");
var JsonDecoder;
(function (JsonDecoder) {
    var Decoder = /** @class */ (function () {
        function Decoder(decodeFn) {
            this.decodeFn = decodeFn;
        }
        /**
         * Decodes a JSON object of type <a> and returns a Result<a>
         * @param json The JSON object
         */
        Decoder.prototype.decode = function (json) {
            return this.decodeFn(json);
        };
        /**
         * Decodes a JSON object of type <a> and calls onOk() on success or onErr() on failure, both return <b>
         * @param json The JSON object to decode
         * @param onOk function called when the decoder succeeds
         * @param onErr function called when the decoder fails
         */
        Decoder.prototype.onDecode = function (json, onOk, onErr) {
            var result = this.decode(json);
            if (result instanceof result_1.Ok) {
                return onOk(result.value);
            }
            else {
                return onErr(result.error);
            }
        };
        /**
         * Decodes a JSON object of type <a> and returns a Promise<a>
         * @param json The JSON object to decode
         */
        Decoder.prototype.decodePromise = function (json) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var result = _this.decode(json);
                if (result instanceof result_1.Ok) {
                    return resolve(result.value);
                }
                else {
                    return reject(result.error);
                }
            });
        };
        /**
         * Chains decoder result transformations
         * @param fn The transformation function
         */
        Decoder.prototype.map = function (fn) {
            var _this = this;
            return new Decoder(function (json) {
                var result = _this.decodeFn(json);
                if (result instanceof result_1.Ok) {
                    return result_1.ok(fn(result.value));
                }
                else {
                    return result_1.err(result.error);
                }
            });
        };
        /**
         * Chains decoders
         * @param fn Function that returns a new decoder
         */
        Decoder.prototype.then = function (fn) {
            var _this = this;
            return new Decoder(function (json) {
                var result = _this.decodeFn(json);
                if (result instanceof result_1.Ok) {
                    return fn(result.value).decode(json);
                }
                else {
                    return result_1.err(result.error);
                }
            });
        };
        return Decoder;
    }());
    JsonDecoder.Decoder = Decoder;
    /**
     * Decoder for recursive data structures.
     *
     * @param mkDecoder A function that returns a decoder
     */
    function lazy(mkDecoder) {
        return new Decoder(function (json) { return mkDecoder().decode(json); });
    }
    JsonDecoder.lazy = lazy;
    /**
     * Decoder for `string`.
     */
    JsonDecoder.string = new Decoder(function (json) {
        if (typeof json === 'string') {
            return result_1.ok(json);
        }
        else {
            return result_1.err($JsonDecoderErrors.primitiveError(json, 'string'));
        }
    });
    /**
     * Decoder for `number`.
     */
    JsonDecoder.number = new Decoder(function (json) {
        if (typeof json === 'number') {
            return result_1.ok(json);
        }
        else {
            return result_1.err($JsonDecoderErrors.primitiveError(json, 'number'));
        }
    });
    /**
     * Decoder for `boolean`.
     */
    JsonDecoder.boolean = new Decoder(function (json) {
        if (typeof json === 'boolean') {
            return result_1.ok(json);
        }
        else {
            return result_1.err($JsonDecoderErrors.primitiveError(json, 'boolean'));
        }
    });
    /**
     * Decoder for objects.
     *
     * @param decoders Key/value pairs of decoders for each object field.
     * @param decoderName How to display the name of the object being decoded in errors.
     * @param keyMap Optional map between json field names and user land field names.
     *               Useful when the client model does not match with what the server sends.
     */
    function object(decoders, decoderName, keyMap) {
        return new Decoder(function (json) {
            if (json !== null && typeof json === 'object') {
                var result = {};
                for (var key in decoders) {
                    if (decoders.hasOwnProperty(key)) {
                        if (keyMap && key in keyMap) {
                            var jsonKey = keyMap[key];
                            var r = decoders[key].decode(json[jsonKey]);
                            if (r instanceof result_1.Ok) {
                                result[key] = r.value;
                            }
                            else {
                                return result_1.err($JsonDecoderErrors.objectJsonKeyError(decoderName, key, jsonKey, r.error));
                            }
                        }
                        else {
                            var r = decoders[key].decode(json[key]);
                            if (r instanceof result_1.Ok) {
                                result[key] = r.value;
                            }
                            else {
                                return result_1.err($JsonDecoderErrors.objectError(decoderName, key, r.error));
                            }
                        }
                    }
                }
                return result_1.ok(result);
            }
            else {
                return result_1.err($JsonDecoderErrors.primitiveError(json, decoderName));
            }
        });
    }
    JsonDecoder.object = object;
    /**
     * Always succeeding decoder
     */
    JsonDecoder.succeed = new Decoder(function (json) {
        return result_1.ok(json);
    });
    /**
     * Always failing decoder
     */
    function fail(error) {
        return new Decoder(function (json) {
            return result_1.err(error);
        });
    }
    JsonDecoder.fail = fail;
    /**
     * Tries to decode with `decoder` and returns `defaultValue` on failure.
     * (It was called maybe() before)
     *
     * @param defaultValue The default value returned in case of decoding failure.
     * @param decoder The actual decoder to use.
     */
    function failover(defaultValue, decoder) {
        return new Decoder(function (json) {
            var result = decoder.decode(json);
            if (result instanceof result_1.Ok) {
                return result;
            }
            else {
                return result_1.ok(defaultValue);
            }
        });
    }
    JsonDecoder.failover = failover;
    /**
     * Tries to decode the provided json value with any of the provided `decoders`.
     * If all provided `decoders` fail, this decoder fails.
     * Otherwise, it returns the first successful decoder.
     *
     * @param decoders An array of decoders to try.
     */
    function oneOf(decoders, decoderName) {
        return new Decoder(function (json) {
            for (var i = 0; i < decoders.length; i++) {
                var result = decoders[i].decode(json);
                if (result instanceof result_1.Ok) {
                    return result;
                }
            }
            return result_1.err($JsonDecoderErrors.oneOfError(decoderName, json));
        });
    }
    JsonDecoder.oneOf = oneOf;
    /**
     * Tries to decode the provided json value with all of the provided `decoders`.
     * The order of the provided decoders matters: the output of one decoder is passed
     * as input to the next decoder. If any of the provided `decoders` fail, this
     * decoder fails. Otherwise, it returns the output of the last decoder.
     *
     * @param decoders a spread of decoders to use.
     */
    function allOf() {
        var decoders = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            decoders[_i] = arguments[_i];
        }
        return new Decoder(function (json) {
            return decoders.reduce(function (prev, curr) {
                return (prev instanceof result_1.Ok ? curr.decode(prev.value) : prev);
            }, result_1.ok(json));
        });
    }
    JsonDecoder.allOf = allOf;
    /**
     * Decoder for key/value pairs.
     *
     * @param decoder An object decoder for the values. All values must have the same shape or use oneOf otherwise.
     */
    JsonDecoder.dictionary = function (decoder, decoderName) {
        return new Decoder(function (json) {
            if (json !== null && typeof json === 'object') {
                var obj = {};
                for (var key in json) {
                    if (json.hasOwnProperty(key)) {
                        var result = decoder.decode(json[key]);
                        if (result instanceof result_1.Ok) {
                            obj[key] = result.value;
                        }
                        else {
                            return result_1.err($JsonDecoderErrors.dictionaryError(decoderName, key, result.error));
                        }
                    }
                }
                return result_1.ok(obj);
            }
            else {
                return result_1.err($JsonDecoderErrors.primitiveError(json, 'dictionary'));
            }
        });
    };
    /**
     * Decoder for Array<T>.
     *
     * @param decoder The decoder for the array element.
     */
    JsonDecoder.array = function (decoder, decoderName) {
        return new Decoder(function (json) {
            if (json instanceof Array) {
                var arr = [];
                for (var i = 0; i < json.length; i++) {
                    var result = decoder.decode(json[i]);
                    if (result instanceof result_1.Ok) {
                        arr.push(result.value);
                    }
                    else {
                        return result_1.err($JsonDecoderErrors.arrayError(decoderName, i, result.error));
                    }
                }
                return result_1.ok(arr);
            }
            else {
                return result_1.err($JsonDecoderErrors.primitiveError(json, 'array'));
            }
        });
    };
    /**
     * Decoder that only succeeds when json is strictly (===) `null`.
     * When succeeds it returns `defaultValue`.
     *
     * @param defaultValue The value returned when json is `null`.
     */
    function isNull(defaultValue) {
        return new Decoder(function (json) {
            if (json === null) {
                return result_1.ok(defaultValue);
            }
            else {
                return result_1.err($JsonDecoderErrors.nullError(json));
            }
        });
    }
    JsonDecoder.isNull = isNull;
    /**
     * Decoder that only succeeds when json is strictly (===) `undefined`.
     * When succeeds it returns `defaultValue`.
     *
     * @param defaultValue The value returned when json is `undefined`.
     */
    function isUndefined(defaultValue) {
        return new Decoder(function (json) {
            if (json === undefined) {
                return result_1.ok(defaultValue);
            }
            else {
                return result_1.err($JsonDecoderErrors.undefinedError(json));
            }
        });
    }
    JsonDecoder.isUndefined = isUndefined;
    /**
     * Decoder that always succeeds returning `value`.
     *
     * @param value The value returned.
     */
    JsonDecoder.constant = function (value) {
        return new Decoder(function (json) { return result_1.ok(value); });
    };
    /**
     * Decoder that only succeeds when json is strictly (===) `value`.
     * When succeeds it returns `value`.
     *
     * @param value The value returned on success.
     */
    function isExactly(value) {
        return new Decoder(function (json) {
            if (json === value) {
                return result_1.ok(value);
            }
            else {
                return result_1.err($JsonDecoderErrors.exactlyError(json, value));
            }
        });
    }
    JsonDecoder.isExactly = isExactly;
})(JsonDecoder = exports.JsonDecoder || (exports.JsonDecoder = {}));
var $JsonDecoderErrors;
(function ($JsonDecoderErrors) {
    $JsonDecoderErrors.primitiveError = function (value, tag) {
        return JSON.stringify(value) + " is not a valid " + tag;
    };
    $JsonDecoderErrors.exactlyError = function (json, value) {
        return JSON.stringify(json) + " is not exactly " + JSON.stringify(value);
    };
    $JsonDecoderErrors.undefinedError = function (json) {
        return JSON.stringify(json) + " is not undefined";
    };
    $JsonDecoderErrors.nullError = function (json) {
        return JSON.stringify(json) + " is not null";
    };
    $JsonDecoderErrors.dictionaryError = function (decoderName, key, error) {
        return "<" + decoderName + "> dictionary decoder failed at key \"" + key + "\" with error: " + error;
    };
    $JsonDecoderErrors.oneOfError = function (decoderName, json) {
        return "<" + decoderName + "> decoder failed because " + JSON.stringify(json) + " can't be decoded with any of the provided oneOf decoders";
    };
    $JsonDecoderErrors.objectError = function (decoderName, key, error) {
        return "<" + decoderName + "> decoder failed at key \"" + key + "\" with error: " + error;
    };
    $JsonDecoderErrors.arrayError = function (decoderName, index, error) {
        return "<" + decoderName + "> decoder failed at index \"" + index + "\" with error: " + error;
    };
    $JsonDecoderErrors.objectJsonKeyError = function (decoderName, key, jsonKey, error) {
        return "<" + decoderName + "> decoder failed at key \"" + key + "\" (mapped from the JSON key \"" + jsonKey + "\") with error: " + error;
    };
})($JsonDecoderErrors = exports.$JsonDecoderErrors || (exports.$JsonDecoderErrors = {}));
