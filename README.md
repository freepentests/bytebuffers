# Bytebuffers

Bytebuffers is the swiss army knife of binary data manipulation in JavaScript; it is a sophisticated, Java-like ByteBuffer implementation inspired by the bytebuffer.js JavaScript library. With specialized methods such as `writeUint64`, `writeVString`, `writeIString`, and `writeVarint`, this library enables developers to manage binary data with ease and efficiency.

Bytebuffers is mainly backwards-compatible with the bytebuffer.js library; however, only data manipulation via `ArrayBuffer`s are supported.

---

# Features

- Signed and unsigned integers from 8 to 64 bits (64 bit integer support may not be fully supported yet on older environments, so please ensure your runtime is fully up-to-date).
- 32-bit and 64-bit IEEE floating-point numbers.
- Support for multiple types of endianness (little endian and big endian).
- Base64, utf-8, hex, and binary encoding support - wrap hex strings and base64 strings into ByteBuffer instances.
- Support for writing bit sets (boolean arrays, e.g. `[true, true, false, true, false, false, true]`).
- Useful methods such as `slice`, `reset`, `reverse`, `flip`, etc.

---

# Example Usage

```js
import ByteBuffer from 'bytebuffers';

const age = 24;
const name = 'James';
const country = 'Italy';

const person = new ByteBuffer(100, true)
    .writeUint8(age)
    .writeCString(name)
    .writeCString(country)
    .flip();

console.log(`Age: ${person.readUint8()}\nName: ${person.readCString()}\nCountry: ${person.readCString()}`);
console.log(person.buffer);
```

---

# TODO

Todo list is sorted in descending order of importance/urgency.

- [x] Add support for reading strings and varints (and other data types whose read implementation have not been developed yet)
- [ ] Add dynamic resizing
- [ ] Add `compact` method
- [ ] Add documentation (both JSDoc and markdown documentation)
- [ ] Add more validation checks

