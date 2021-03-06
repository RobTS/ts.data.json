"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var json_decoder_1 = require("./json-decoder");
var chai = require("chai");
var result_1 = require("./result");
var expect = chai.expect;
// Test utils
var expectOkWithValue = function (result, expectedValue) {
    return expect(result)
        .to.be.an.instanceof(result_1.Ok)
        .and.to.deep.equal(result_1.ok(expectedValue));
};
var expectErr = function (result) {
    return expect(result).to.be.an.instanceof(result_1.Err);
};
var expectErrWithMsg = function (result, expectedErrorMsg) {
    return expect(result)
        .to.be.an.instanceof(result_1.Err)
        .and.to.deep.equal(result_1.err(expectedErrorMsg));
};
// Tests
describe('json-decoder', function () {
    // string
    describe('string', function () {
        var tag = 'string';
        it('should decode a string', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.string.decode('hi'), 'hi');
        });
        it('should decode an empty string', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.string.decode(''), '');
        });
        it('should fail if not a string', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.string.decode(true), json_decoder_1.$JsonDecoderErrors.primitiveError(true, tag));
            expectErrWithMsg(json_decoder_1.JsonDecoder.string.decode(undefined), json_decoder_1.$JsonDecoderErrors.primitiveError(undefined, tag));
            expectErrWithMsg(json_decoder_1.JsonDecoder.string.decode(null), json_decoder_1.$JsonDecoderErrors.primitiveError(null, tag));
        });
    });
    // number
    describe('number', function () {
        var tag = 'number';
        it('should decode a number', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.number.decode(33), 33);
            expectOkWithValue(json_decoder_1.JsonDecoder.number.decode(3.3), 3.3);
        });
        it('should fail if not a number', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.number.decode('33'), json_decoder_1.$JsonDecoderErrors.primitiveError('33', tag));
            expectErrWithMsg(json_decoder_1.JsonDecoder.number.decode(null), json_decoder_1.$JsonDecoderErrors.primitiveError(null, tag));
            expectErrWithMsg(json_decoder_1.JsonDecoder.number.decode(undefined), json_decoder_1.$JsonDecoderErrors.primitiveError(undefined, tag));
        });
    });
    // boolean
    describe('boolean', function () {
        var tag = 'boolean';
        it('should decode a boolean', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.boolean.decode(true), true);
            expectOkWithValue(json_decoder_1.JsonDecoder.boolean.decode(false), false);
        });
        it('should fail if not a boolean', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.boolean.decode('1'), json_decoder_1.$JsonDecoderErrors.primitiveError('1', tag));
            expectErrWithMsg(json_decoder_1.JsonDecoder.boolean.decode(null), json_decoder_1.$JsonDecoderErrors.primitiveError(null, tag));
            expectErrWithMsg(json_decoder_1.JsonDecoder.boolean.decode(undefined), json_decoder_1.$JsonDecoderErrors.primitiveError(undefined, tag));
        });
    });
    // failover
    describe('failover (on failure provide a default value)', function () {
        it('should decode a value when value is provided', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.failover('', json_decoder_1.JsonDecoder.string).decode('algo'), 'algo');
        });
        it('should return the failoverValue when value is not provided', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.failover('failover value', json_decoder_1.JsonDecoder.string).decode(44), 'failover value');
            expectOkWithValue(json_decoder_1.JsonDecoder.failover(2.1, json_decoder_1.JsonDecoder.number).decode(null), 2.1);
            expectOkWithValue(json_decoder_1.JsonDecoder.failover(false, json_decoder_1.JsonDecoder.boolean).decode(undefined), false);
        });
    });
    // succeed
    describe('succeed', function () {
        it('should accept any value', function () {
            var someDataDecoder = json_decoder_1.JsonDecoder.object({ name: json_decoder_1.JsonDecoder.string, meta: json_decoder_1.JsonDecoder.succeed }, 'SomeData');
            var data = {
                name: 'John',
                meta: {
                    some: 'data'
                }
            };
            expectOkWithValue(someDataDecoder.decode(data), {
                name: 'John',
                meta: {
                    some: 'data'
                }
            });
        });
    });
    // oneOf
    describe('oneOf (union types)', function () {
        it('should pick the number decoder', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.oneOf([json_decoder_1.JsonDecoder.string, json_decoder_1.JsonDecoder.number], 'string | number').decode(1), 1);
        });
        it('should pick the string decoder', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.oneOf([json_decoder_1.JsonDecoder.string, json_decoder_1.JsonDecoder.number], 'string | number').decode('hola'), 'hola');
        });
        it('should fail when no matching decoders are found', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.oneOf([json_decoder_1.JsonDecoder.string, json_decoder_1.JsonDecoder.number], 'string | number').decode(true), json_decoder_1.$JsonDecoderErrors.oneOfError('string | number', true));
        });
    });
    // allOf
    describe('allOf', function () {
        it('should be equivalent to the string decoder', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.allOf(json_decoder_1.JsonDecoder.string).decode('hola'), 'hola');
        });
        it('should return output from the last decoder', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.allOf(json_decoder_1.JsonDecoder.string, json_decoder_1.JsonDecoder.failover(10, json_decoder_1.JsonDecoder.number)).decode('hola'), 10);
        });
        it('should fail if the first decoder fails', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.allOf(json_decoder_1.JsonDecoder.string, json_decoder_1.JsonDecoder.number).decode(10), json_decoder_1.$JsonDecoderErrors.primitiveError(10, 'string'));
        });
        it('should fail if the last decoder fails', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.allOf(json_decoder_1.JsonDecoder.string, json_decoder_1.JsonDecoder.number).decode('10'), json_decoder_1.$JsonDecoderErrors.primitiveError('10', 'number'));
        });
    });
    // object
    describe('object', function () {
        var userDecoder = json_decoder_1.JsonDecoder.object({
            firstname: json_decoder_1.JsonDecoder.string,
            lastname: json_decoder_1.JsonDecoder.string
        }, 'User');
        it('should decode a User', function () {
            var user = {
                firstname: 'John',
                lastname: 'Doe'
            };
            expectOkWithValue(userDecoder.decode(user), {
                firstname: 'John',
                lastname: 'Doe'
            });
        });
        var paymentDecoder = json_decoder_1.JsonDecoder.object({
            iban: json_decoder_1.JsonDecoder.string,
            valid: json_decoder_1.JsonDecoder.boolean,
            account_holder: userDecoder
        }, 'Payment');
        it('should decode a Payment (with a nested User)', function () {
            var payment = {
                iban: 'ES123456789',
                valid: true,
                account_holder: {
                    firstname: 'John',
                    lastname: 'Doe'
                }
            };
            expectOkWithValue(paymentDecoder.decode(payment), {
                iban: 'ES123456789',
                valid: true,
                account_holder: {
                    firstname: 'John',
                    lastname: 'Doe'
                }
            });
        });
        it('should not include properties that are not explicitly in the decoder', function () {
            var user = {
                firstname: 'John',
                lastname: 'Doe',
                extra: true
            };
            expect(userDecoder.decode(user))
                .to.be.an.instanceof(result_1.Ok)
                .and.not.to.have.nested.property('value.extra');
            expectOkWithValue(userDecoder.decode(user), {
                firstname: 'John',
                lastname: 'Doe'
            });
        });
        it('should fail decoding when any inner decode decoder fails', function () {
            var user = {
                firstname: 2,
                lastname: true
            };
            expectErrWithMsg(userDecoder.decode(user), json_decoder_1.$JsonDecoderErrors.objectError('User', 'firstname', json_decoder_1.$JsonDecoderErrors.primitiveError(2, 'string')));
        });
        it('should fail decoding when json is not an object', function () {
            expectErrWithMsg(userDecoder.decode(5), json_decoder_1.$JsonDecoderErrors.primitiveError(5, 'User'));
        });
        describe('with JSON key mappings', function () {
            var userDecoderWithKeyMap = json_decoder_1.JsonDecoder.object({
                firstname: json_decoder_1.JsonDecoder.string,
                lastname: json_decoder_1.JsonDecoder.string
            }, 'User', {
                firstname: 'fName',
                lastname: 'lName'
            });
            it('should decode a User object with JSON key mappings', function () {
                var json = {
                    fName: 'John',
                    lName: 'Doe'
                };
                expectOkWithValue(userDecoderWithKeyMap.decode(json), {
                    firstname: 'John',
                    lastname: 'Doe'
                });
            });
            it('should fail to denode a User object with JSON key mappings any of its decoders fails', function () {
                var json = {
                    fName: 5,
                    lName: 'Doe'
                };
                expectErrWithMsg(userDecoderWithKeyMap.decode(json), json_decoder_1.$JsonDecoderErrors.objectJsonKeyError('User', 'firstname', 'fName', json_decoder_1.$JsonDecoderErrors.primitiveError(5, 'string')));
            });
        });
    });
    // dictionary
    describe('dictionary (key / value pairs)', function () {
        var userDecoder = json_decoder_1.JsonDecoder.object({
            firstname: json_decoder_1.JsonDecoder.string,
            lastname: json_decoder_1.JsonDecoder.string
        }, 'User');
        var groupOfUsersDecoder = json_decoder_1.JsonDecoder.dictionary(userDecoder, 'Dict<User>');
        var groupDecoder = json_decoder_1.JsonDecoder.object({
            id: json_decoder_1.JsonDecoder.number,
            users: groupOfUsersDecoder
        }, 'Group');
        it('should decode a homogeneous dictionary', function () {
            var group = {
                id: 2,
                users: {
                    KJH764: {
                        firstname: 'John',
                        lastname: 'Johanson'
                    },
                    ASD345: {
                        firstname: 'Peter',
                        lastname: 'Peters'
                    }
                }
            };
            expectOkWithValue(groupDecoder.decode(group), {
                id: 2,
                users: {
                    KJH764: {
                        firstname: 'John',
                        lastname: 'Johanson'
                    },
                    ASD345: {
                        firstname: 'Peter',
                        lastname: 'Peters'
                    }
                }
            });
        });
        it('should fail to decode a primitive dictionary with an invalid value', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.dictionary(json_decoder_1.JsonDecoder.number, 'Dict<number>').decode({
                a: 1,
                b: 2,
                c: null
            }), json_decoder_1.$JsonDecoderErrors.dictionaryError('Dict<number>', 'c', json_decoder_1.$JsonDecoderErrors.primitiveError(null, 'number')));
        });
        it('should fail to decode a dictionary with a partial key/value pair object value', function () {
            var group = {
                id: 2,
                users: {
                    KJH764: {
                        firstname: 'John'
                    },
                    ASD345: {
                        firstname: 'Peter',
                        lastname: 'Peters'
                    }
                }
            };
            expectErrWithMsg(groupDecoder.decode(group), json_decoder_1.$JsonDecoderErrors.objectError('Group', 'users', json_decoder_1.$JsonDecoderErrors.dictionaryError('Dict<User>', 'KJH764', json_decoder_1.$JsonDecoderErrors.objectError('User', 'lastname', json_decoder_1.$JsonDecoderErrors.primitiveError(undefined, 'string')))));
        });
    });
    // array
    describe('array', function () {
        it('should decode a filled array', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.array(json_decoder_1.JsonDecoder.number, 'number[]').decode([
                1,
                2,
                3
            ]), [1, 2, 3]);
        });
        it('should decode an object array', function () {
            var userDecoder = json_decoder_1.JsonDecoder.object({
                firstname: json_decoder_1.JsonDecoder.string,
                lastname: json_decoder_1.JsonDecoder.string
            }, 'User');
            var users = [
                {
                    firstname: 'John',
                    lastname: 'Doe'
                },
                {
                    firstname: 'David',
                    lastname: 'Dow'
                }
            ];
            expectOkWithValue(json_decoder_1.JsonDecoder.array(userDecoder, 'User[]').decode(users), users.slice());
        });
        it('should decode an empty array', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.array(json_decoder_1.JsonDecoder.number, 'number[]').decode([]), []);
        });
        it('should fail to decode something other than an array', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.array(json_decoder_1.JsonDecoder.number, 'number[]').decode('hola'), json_decoder_1.$JsonDecoderErrors.primitiveError('hola', 'array'));
        });
        it('should fail to decode null or undefined', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.array(json_decoder_1.JsonDecoder.number, 'number[]').decode(null), json_decoder_1.$JsonDecoderErrors.primitiveError(null, 'array'));
            expectErrWithMsg(json_decoder_1.JsonDecoder.array(json_decoder_1.JsonDecoder.number, 'number[]').decode(undefined), json_decoder_1.$JsonDecoderErrors.primitiveError(undefined, 'array'));
        });
        it('should fail to decode a mixed array', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.array(json_decoder_1.JsonDecoder.number, 'number[]').decode([
                1,
                '2'
            ]), json_decoder_1.$JsonDecoderErrors.arrayError('number[]', 1, json_decoder_1.$JsonDecoderErrors.primitiveError('2', 'number')));
            expectErrWithMsg(json_decoder_1.JsonDecoder.array(json_decoder_1.JsonDecoder.number, 'number[]').decode(undefined), json_decoder_1.$JsonDecoderErrors.primitiveError(undefined, 'array'));
        });
    });
    // lazy
    describe('lazy (recursive decoders)', function () {
        var treeDecoder = json_decoder_1.JsonDecoder.object({
            value: json_decoder_1.JsonDecoder.string,
            children: json_decoder_1.JsonDecoder.oneOf([
                json_decoder_1.JsonDecoder.lazy(function () { return json_decoder_1.JsonDecoder.array(treeDecoder, 'Node<a>[]'); }),
                json_decoder_1.JsonDecoder.isUndefined([])
            ], 'Node<string>[] | isUndefined')
        }, 'Node<string>');
        var json = {
            value: 'root',
            children: [
                { value: '1' },
                { value: '2', children: [{ value: '2.1' }, { value: '2.2' }] },
                {
                    value: '3',
                    children: [
                        { value: '3.1', children: [] },
                        { value: '3.2', children: [{ value: '3.2.1' }] }
                    ]
                }
            ]
        };
        it('should decode a recursive tree data structure', function () {
            expectOkWithValue(treeDecoder.decode(json), {
                value: 'root',
                children: [
                    { value: '1', children: [] },
                    {
                        value: '2',
                        children: [
                            { value: '2.1', children: [] },
                            { value: '2.2', children: [] }
                        ]
                    },
                    {
                        value: '3',
                        children: [
                            { value: '3.1', children: [] },
                            { value: '3.2', children: [{ value: '3.2.1', children: [] }] }
                        ]
                    }
                ]
            });
        });
        it('should fail to decode a recursive tree data structure if any of its nodes fails', function () {
            var json = {
                value: 'root',
                children: [
                    { value: '1' },
                    { value: '2', children: [{ value: '2.1' }, { value: '2.2' }] },
                    {
                        value: '3',
                        children: [
                            { children: [] },
                            { value: '3.2', children: [{ value: '3.2.1' }] }
                        ]
                    }
                ]
            };
            expectErr(treeDecoder.decode(json));
        });
        it('should fail to decode a recursive tree data structure if the value is null or undefined', function () {
            expectErrWithMsg(treeDecoder.decode(null), json_decoder_1.$JsonDecoderErrors.primitiveError(null, 'Node<string>'));
            expectErrWithMsg(treeDecoder.decode(undefined), json_decoder_1.$JsonDecoderErrors.primitiveError(undefined, 'Node<string>'));
        });
    });
    // isNull
    describe('isNull (only allow null values to succeed decoding)', function () {
        it('should decode a null value into a default value', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.isNull('default value').decode(null), 'default value');
        });
        it('should fail to decode a non null value', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.isNull('default value').decode('hola'), json_decoder_1.$JsonDecoderErrors.nullError('hola'));
        });
    });
    // isUndefined
    describe('isUndefined (only allow undefined values to succeed decoding)', function () {
        it('should decode an undefined value into a default value', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.isUndefined('default value').decode(undefined), 'default value');
        });
        it('should fail to decode a non undefined value', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.isUndefined('default value').decode('hola'), json_decoder_1.$JsonDecoderErrors.undefinedError('hola'));
        });
    });
    // constant
    describe('constant (always return the provided value)', function () {
        it('should decode always to a constant value', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.constant('constant value').decode(999), 'constant value');
        });
        it('should decode undefined to a constant value', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.constant('constant value').decode(undefined), 'constant value');
        });
        it('should decode null to a constant value', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.constant('constant value').decode(null), 'constant value');
        });
    });
    // isExactly
    describe('isExactly (only succeed decoding when json is exactly like the provided value)', function () {
        it('should decode only if json is exactly some given value', function () {
            expectOkWithValue(json_decoder_1.JsonDecoder.isExactly(3.1).decode(3.1), 3.1);
            expectOkWithValue(json_decoder_1.JsonDecoder.isExactly(null).decode(null), null);
            expectOkWithValue(json_decoder_1.JsonDecoder.isExactly(undefined).decode(undefined), undefined);
        });
        it('should fail to decode when json is not exactly the given value', function () {
            expectErrWithMsg(json_decoder_1.JsonDecoder.isExactly(3.1).decode(3), json_decoder_1.$JsonDecoderErrors.exactlyError(3, 3.1));
        });
    });
    // Mixed
    describe('complex combinations', function () {
        var session_json = {
            id: 'xy-12345',
            name: {
                firstname: 'John',
                lastname: 'Doe'
            },
            payment: {
                iban: 'DE123456435343434343',
                valid: false
            },
            tracking: {
                uid: '3242314-jk4jle-3124324',
                ga: 'djsakdasjdkasdkaskdl'
            },
            addons: ['foo', 'bar']
        };
        var session_json2 = {
            id: 'xy-12345',
            name: {
                firstname: 'John',
                lastname: 'Doe'
            },
            payment: {
                iban: 'DE123456435343434343',
                valid: false,
                account_holder: {
                    firstname: 'Donald',
                    lastname: 'Duck'
                }
            },
            tracking: {
                uid: '3242314-jk4jle-3124324',
                ga: 'djsakdasjdkasdkaskdl'
            },
            addons: ['foo', 'bar']
        };
        var session_json_invalid = {
            id: 'xy-12345',
            name: {
                firstname: 'John',
                lastname: 'Doe'
            },
            payment: {
                iban: 'DE123456435343434343',
                valid: false
            },
            tracking: {
                uid: '3242314-jk4jle-3124324',
                ga: 'djsakdasjdkasdkaskdl'
            },
            addons: ['foo', 'bar', true]
        };
        var userDecoder = json_decoder_1.JsonDecoder.object({
            firstname: json_decoder_1.JsonDecoder.string,
            lastname: json_decoder_1.JsonDecoder.string
        }, 'User');
        var decodeSession = json_decoder_1.JsonDecoder.object({
            id: json_decoder_1.JsonDecoder.string,
            name: userDecoder,
            payment: json_decoder_1.JsonDecoder.object({
                iban: json_decoder_1.JsonDecoder.string,
                valid: json_decoder_1.JsonDecoder.boolean,
                account_holder: json_decoder_1.JsonDecoder.failover(undefined, json_decoder_1.JsonDecoder.object({
                    firstname: json_decoder_1.JsonDecoder.string,
                    lastname: json_decoder_1.JsonDecoder.string
                }, 'User'))
            }, 'Payment'),
            tracking: json_decoder_1.JsonDecoder.object({
                uid: json_decoder_1.JsonDecoder.string,
                ga: json_decoder_1.JsonDecoder.string
            }, 'Tracking'),
            addons: json_decoder_1.JsonDecoder.array(json_decoder_1.JsonDecoder.string, 'string[]')
        }, 'Session');
        it('should work', function () {
            expect(decodeSession.decode(session_json)).to.be.an.instanceOf(result_1.Ok);
        });
        it('should work', function () {
            expect(decodeSession.decode(session_json2)).to.be.an.instanceOf(result_1.Ok);
        });
        it('should not work', function () {
            expect(decodeSession.decode(session_json_invalid)).to.be.an.instanceOf(result_1.Err);
        });
    });
    describe('Decoder<a>', function () {
        describe('onDecode', function () {
            it('should take the onErr() route when the decoder fails', function () {
                var numberToStringWithDefault = json_decoder_1.JsonDecoder.number.onDecode(false, function (value) { return value.toString(16); }, function (error) { return '0'; });
                expect(numberToStringWithDefault).to.equal('0');
            });
            it('should take the onOk() route when the decoder succeeds', function () {
                var stringToNumber = json_decoder_1.JsonDecoder.string.onDecode('000000000001', function (value) { return parseInt(value, 10); }, function (error) { return 0; });
                expect(stringToNumber).to.equal(1);
            });
        });
        describe('decodePromise', function () {
            it('should resolve when decoding succeeds', function () { return __awaiter(_this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _a = expect;
                            return [4 /*yield*/, json_decoder_1.JsonDecoder.string.decodePromise('hola')];
                        case 1:
                            _a.apply(void 0, [_b.sent()]).to.equal('hola');
                            return [2 /*return*/];
                    }
                });
            }); });
            it('should reject when decoding fails', function () {
                json_decoder_1.JsonDecoder.string.decodePromise(2).catch(function (error) {
                    expect(error).to.equal(json_decoder_1.$JsonDecoderErrors.primitiveError(2, 'string'));
                });
            });
        });
        describe('map', function () {
            it('should transform a string date into a Date', function () {
                var stringToDateDecoder = json_decoder_1.JsonDecoder.string.map(function (stringDate) { return new Date(stringDate); });
                expect(stringToDateDecoder.decode('2018-12-21T18:22:25.490Z')
                    .value).to.be.an.instanceOf(Date);
            });
        });
        describe('then', function () {
            var squareDecoder = json_decoder_1.JsonDecoder.object({
                type: json_decoder_1.JsonDecoder.string,
                properties: json_decoder_1.JsonDecoder.object({
                    side: json_decoder_1.JsonDecoder.number
                }, 'SquareProps')
            }, 'Square');
            var rectangleDecoder = json_decoder_1.JsonDecoder.object({
                type: json_decoder_1.JsonDecoder.string,
                properties: json_decoder_1.JsonDecoder.object({
                    width: json_decoder_1.JsonDecoder.number,
                    height: json_decoder_1.JsonDecoder.number
                }, 'RectangleProps')
            }, 'Square');
            var shapeDecoder = json_decoder_1.JsonDecoder.object({
                type: json_decoder_1.JsonDecoder.string,
                properties: json_decoder_1.JsonDecoder.succeed
            }, 'Shape').then(function (value) {
                switch (value.type) {
                    case 'square':
                        return squareDecoder;
                    case 'rectangle':
                        return rectangleDecoder;
                    default:
                        return json_decoder_1.JsonDecoder.fail("<Shape> does not support type \"" + value.type + "\"");
                }
            });
            it('should chain Shape and Square decoders', function () {
                var square = {
                    type: 'square',
                    properties: {
                        side: 5
                    }
                };
                expectOkWithValue(shapeDecoder.decode(square), {
                    type: 'square',
                    properties: {
                        side: 5
                    }
                });
            });
            it('should chain Shape and Rectangle decoders', function () {
                var rect = {
                    type: 'rectangle',
                    properties: {
                        width: 5,
                        height: 3
                    }
                };
                expectOkWithValue(shapeDecoder.decode(rect), {
                    type: 'rectangle',
                    properties: {
                        width: 5,
                        height: 3
                    }
                });
            });
            it('should fail when Shape type is not supported', function () {
                var circle = {
                    type: 'circle',
                    properties: {
                        radius: 10
                    }
                };
                expectErrWithMsg(shapeDecoder.decode(circle), "<Shape> does not support type \"circle\"");
            });
        });
    });
    describe('readme examples', function () {
        var userDecoder = json_decoder_1.JsonDecoder.object({
            firstname: json_decoder_1.JsonDecoder.string,
            lastname: json_decoder_1.JsonDecoder.string
        }, 'User');
        it('should succeed', function () {
            var jsonObjectOk = {
                firstname: 'Damien',
                lastname: 'Jurado'
            };
            userDecoder
                .decodePromise(jsonObjectOk)
                .then(function (user) {
                console.log("User " + user.firstname + " " + user.lastname + " decoded successfully");
            })
                .catch(function (error) {
                console.error(error);
            });
        });
        it('should fail', function () {
            var jsonObjectKo = {
                firstname: 'Erik',
                lastname: null
            };
            userDecoder
                .decodePromise(jsonObjectKo)
                .then(function (user) {
                console.log('User decoded successfully');
            })
                .catch(function (error) {
                console.error(error);
            });
        });
    });
});
