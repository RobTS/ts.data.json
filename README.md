# JsonDecoder

[![Build Status](https://travis-ci.org/joanllenas/ts.data.json.svg?branch=master)](https://travis-ci.org/joanllenas/ts.data.json)
[![npm version](https://badge.fury.io/js/ts.data.json.svg)](https://badge.fury.io/js/ts.data.json)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Typescript type annotations give us compile-time guarantees, but at run-time, when data flows from the server to our clients, lots of things can go wrong.

JSON decoders validate the JSON before it comes into our program. So if the data has an unexpected structure, we learn about it immediately.

## Install

```
npm install ts.data.json --save
```

## Example

```ts
type User = {
  firstname: string;
  lastname: string;
};

const userDecoder = JsonDecoder.object<User>(
  {
    firstname: JsonDecoder.string,
    lastname: JsonDecoder.string
  },
  'User'
);

const jsonObjectOk = {
  firstname: 'Damien',
  lastname: 'Jurado'
};

userDecoder
  .decodePromise(jsonObjectOk)
  .then(user => {
    console.log(`User ${user.firstname} ${user.lastname} decoded successfully`);
  })
  .catch(error => {
    console.log(error);
  });

// Output: User Damien Jurado decoded successfully

const jsonObjectKo = {
  firstname: 'Erik',
  lastname: null
};

userDecoder
  .decodePromise(jsonObjectKo)
  .then(user => {
    console.log('User decoded successfully');
  })
  .catch(error => {
    console.error(error);
  });

// Output: <User> decoder failed at key "lastname" with error: null is not a valid string
```

## Api

### JsonDecoder.string

> `string: Decoder<string>`

Creates a `string` decoder.

```ts
JsonDecoder.string.decode('hi'); // Ok<string>({value: 'hi'})
JsonDecoder.string.decode(5); // Err({error: '5 is not a valid string'})
```

### JsonDecoder.number

> `number: Decoder<number>`

Creates a `number` decoder.

```ts
JsonDecoder.number.decode(99); // Ok<number>({value: 99})
JsonDecoder.string.decode('hola'); // Err({error: 'hola is not a valid number'})
```

### JsonDecoder.boolean

> `boolean: Decoder<boolean>`

Creates a `boolean` decoder.

```ts
JsonDecoder.boolean.decode(true); // Ok<boolean>({value: true})
JsonDecoder.boolean.decode(null); // Err({error: 'null is not a valid boolean'})
```

### JsonDecoder.object

> `object<a>(decoders: DecoderObject<a>, decoderName: string, keyMap?: DecoderObjectKeyMap<a>): Decoder<a>`

Creates an `object` decoder.

#### @param `decoders: DecoderObject<a>`

Key/value pair that has to comply with the `<a>` type.

#### @param `decoderName: string`

The type of the object we are decoding. i.e. `User`.
This is used to generate meaningful decoding error messages.

#### @param `keyMap?: DecoderObjectKeyMap<a>`

Optional key/value pair to map JSON-land keys with Model-land keys.
Useful when the JSON keys don't match with the decoded type keys.

#### Basic example

```ts
type User = {
  firstname: string;
  lastname: string;
};
const userDecoder = JsonDecoder.object<User>(
  {
    firstname: JsonDecoder.string,
    lastname: JsonDecoder.string
  },
  'User'
);

const jsonOk = {
  firstname: 'Damien',
  lastname: 'Jurado'
};
userDecoder.decode(jsonOk);
// Output: Ok<User>({value: {firstname: 'Damien', lastname: 'Jurado'}})

const jsonKo = {
  firstname: null,
  lastname: 'Satie'
};
userDecoder.decode(jsonKo);
// Output: Err({error: '<User> decoder failed at key "firstname" with error: null is not a valid string'})
```

#### keyMap example

```ts
const userDecoder = JsonDecoder.object<User>(
  {
    firstname: JsonDecoder.string,
    lastname: JsonDecoder.string
  },
  'User',
  {
    firstname: 'fName',
    lastname: 'lName'
  }
);

const jsonOk = {
  fName: 'Nick',
  lName: 'Drake'
};
userDecoder.decode(json);
// Output: Ok({value: {firstname: 'Nick', lastname: 'Drake'}})

const jsonKo = {
  fName: 'Nick'
};
userDecoder.decode(json);
// Output: Err({error: '<User> decoder failed at key "lastname" (mapped from the JSON key "lName") with error: undefined is not a valid string'})
```

### JsonDecoder.array

> `array<a>(decoder: Decoder<a>, decoderName: string): Decoder<Array<a>>`

Creates an `array` decoder.

#### @param `decoder: DecoderObject<a>`

The decoder used to decode every `Array<a>` item.

#### @param `decoderName: string`

The type of the object we are decoding. i.e. `User[]`.
This is used to generate meaningful decoding error messages.

```ts
JsonDecoder.array<number>(JsonDecoder.number, 'number[]').decode([1, 2, 3]);
// Output: Ok<number[]>({value: [1, 2, 3]})
JsonDecoder.array<number>(JsonDecoder.number, 'number[]').decode([1, '2', 3]);
// Output: Err({error: '<number[]> decoder failed at index 1 with error: "2" is not a valid number'})
```

_(Docs are a WIP)_
