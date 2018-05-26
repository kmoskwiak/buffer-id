# buffer-id
[![Build Status](https://travis-ci.org/kmoskwiak/buffer-id.svg?branch=master)](https://travis-ci.org/kmoskwiak/buffer-id)
## Install
```
npm install buffer-id
```
Create unique and reusable identifiers as buffers or arrays.

Example ids created by this module:
* `[0,0,0]` (as buffer `<00 00 00>`)
* `[0,1]` (as buffer `<00 01>`)
* `[0,0,0,0,255]` (as buffer `<00 00 00 00 ff>`)

## Use
Create store and pass some options to it. For example idStore with options:
* idLenggth = 3
* indexRange = 256

will be able to create ids of length 3 where first id will be [0,0,0] and last [255,255,255]. That gives 16777216 possilbe ids.


```js
// Require module
const BufferId = require('buffer-id');

// Create idStore
const idStore = new BufferId({
    idLength: 3,
    indexRange: 256
});

// Create id as array
const id = idStore.create(); // [0,0,0] 

// Create another id
const id2 = idStore.create(); // [0,0,1]

// Remove id from idStore and release it
idStore.remove(id2); 

// Create new id [0,0,1], since we released it in previous step 
const id3 = idStore.create(); // [0,0,1] 
```

## Options
### `idLength` - length of id
| type        | required | 
| ----------- |----------|
| Number      | true     |


### `indexRange` - specifies maximum values of each part of id
| type        | required | default  |
| ----------- |----------| ---------|
| Number      | false    | 256      |

Note that starting value is always 0, so range 256 will allow values form 0 to 255. If ids are intended to use as buffer there is no point setting indexRange greater than 256.

For example if idLength is set to 3:
* indexRange = 256 will produce ids from `[0,0,0]` (`<00 00 00>` as buffer) to `[255,255,255]` (`<ff ff ff>` as buffer) (that gives 16777216 ids)
* indexRange = 10 will produce ids from `[0,0,0]` (`<00 00 00>` as buffer) to `[9,9,9]` (`<09 09 09>` as buffer) (taht gives 1000 ids)


### `idFormat` - default format of ids (can be array or buffer)
| type                        | required | default  |
| --------------------------- |----------| ---------|
| String [`buffer`\|`array`]  | false    | array    |


## Methods
### `create`
Creates new id. New id is either `buffer` or `array` (depends on store settings).

### `remove`
Params:

| name    | type             | required  |
| ------- |------------------| ----------|
| id      | array \| buffer  | true      |

Removes id from store, so it can be reused. 

## Implementation
Tree is used as internal structore of idStore. Animations shows creating and removing id when idLength is 3 and indexRange is 3. Identifiers are from range [0,0,0] to [2,2,2].

![implementation of buffer-id](https://raw.githubusercontent.com/kmoskwiak/files/master/buffer-id/buffer-id.gif)


## Use case
This module can be used to create buffer ids which we can be sent to some service alongside with buffer message.

Lets say we have two microservices A and B, which can communicate using strings and buffers. Sending file from A to B could look like that:
1. A to B: "I am about to send file named cat.jpg",
2. B to A: "Ok, send it with id [0,0,0],

Then on the side of A:
```js
// we have cat.jpg in variable named cat
const id = Buffer.from([0,0,0]); // creates <Buffer 00 00 00>
const msg = Buffer.concat([id, cat]); // Ads id just before cat
```
3. A to B: `<Buffer 00 00 00 ff d2 03 04 ... e5 06 0f 08>`
4. B gets the message. Knowing that first 3 bytes is id it extracts cat from message and saves it as cat.jpg.


## Test
AVA is used for testing. To run tests just type command: 
```
npm run test
```
