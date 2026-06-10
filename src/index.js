export default class ByteBuffer {
	#capacity;

	static DEFAULT_CAPACITY = 16;
	static MAX_VARINT64_BYTES = 10;
	static MAX_VARINT32_BYTES = 5;
	static DEFAULT_ENDIAN = false;
	static BIG_ENDIAN = false; // a constant that can be used instead of the boolean value when instantiating a new ByteBuffer
	static LITTLE_ENDIAN = true; // a constant that can be used instead of the boolean value when instantiating a new ByteBuffer

	static isByteBuffer(bb) {
		return bb && bb.__isByteBuffer__; 
	}

	static fromBinary(binary, littleEndian) {
		if (binary instanceof Uint8Array || binary instanceof Uint8ClampedArray) binary = binary.buffer;
		const bb = new ByteBuffer(binary.byteLength, littleEndian);
		bb.buffer = binary;
		bb.view = new DataView(binary);

		return bb;
	}

	static fromHex(value, littleEndian) {
		if (value.length % 2 !== 0) throw new Error('Hex string length mismatch; expected multiple of 2');

		const splitHexStringIntoTwoCharacterPairs = (string) => {
			if (string.length === 2) return string;

			return [
				string.slice(0, 2),
				splitHexStringIntoTwoCharacterPairs(string.slice(2))
			];
		};
	}

	static wrap(value, encoding, littleEndian) {
		if (typeof encoding !== 'string') throw new Error(`encoding must be of type string, got ${typeof encoding}`);

		switch (encoding) {
			case 'binary':
				return ByteBuffer.fromBinary(value, littleEndian);

			case 'hex':
				return ByteBuffer.fromHex(value, littleEndian);

			default:
				throw new TypeError(`Unrecognized encoding type: ${encoding}`);
		}
	}

	constructor(capacity, littleEndian) {
		this.#capacity = capacity ?? ByteBuffer.DEFAULT_CAPACITY;

		this.limit = capacity ?? ByteBuffer.DEFAULT_CAPACITY;
		this.littleEndian = littleEndian ?? ByteBuffer.DEFAULT_ENDIAN;

		this.buffer = new ArrayBuffer(capacity);
		this.view = new DataView(this.buffer);

		this.offset = 0;
		this.markedOffset = -1;
	}

	flip() {
		this.limit = this.offset;
		this.offset = 0;

		return this;
	}

	clear() {
		this.limit = this.#capacity;
		this.markedOffset = -1;
		this.offset = 0;
		
		return this;
	}

	capacity() {
		return this.#capacity;
	}

	compact() {
		// implement later

		return this;
	}

	clone() {
		const bb = new ByteBuffer(this.#capacity, this.littleEndian);
		bb.buffer = this.buffer;
		bb.view = this.view;

		return bb;
	}

	fill(value, beginning, end) {
		beginning = beginning ?? this.offset;
		end = end ?? this.limit;

		if (value && typeof value === 'string') value = value.charCodeAt(0);

		for (let i = beginning; i < end; i++) this.view.setUint8(i, value);

		return this;
	}

	mark(offset) {
		offset = offset ?? this.offset;
		this.markedOffset = offset;

		return this;
	}

	order(littleEndian) {
		this.littleEndian = Boolean(littleEndian); 
		return this;
	}

	LE(littleEndian) {
		this.littleEndian = typeof littleEndian !== 'undefined' ? Boolean(littleEndian) : false;

		return this;
	}

	BE(bigEndian) {
		this.littleEndian = typeof bigEndian !== 'undefined' ? !bigEndian : false;

		return this;
	}

	remaining() {
		return this.limit - this.offset;
	}

	reset() {
		if (this.markedOffset !== -1) {
			this.offset = this.markedOffset;
			this.markedOffset = -1;
		} else {
			this.offset = 0;
		}

		return this;
	}

	resize(capacity) {
		this.#capacity = capacity;

		const typedArray = new Uint8Array(new ArrayBuffer(this.#capacity));
		typedArray.set(this.buffer);

		this.buffer = typedArray.buffer;
		this.view = new DataView(this.buffer);

		return this;
	}

	reverse() {
		const typedArray = new Uint8Array(this.buffer);
		const newTypedArray = new Uint8Array(typedArray.length);

		for (let i = 0; i < typedArray.length; i++) {
			newTypedArray[typedArray.length - i] = typedArray[i];
		}

		this.buffer = newTypedArray.buffer;

		return this;
	}

	skip(places) {
		this.offset += places;
		return this;
	}

	toBuffer(forceCopy) {
		if (forceCopy) {
			const typedArray = new Uint8Array(this.buffer.byteLength);
			typedArray.set(new Uint8Array(this.buffer));
			return typedArray.buffer;
		}

		return this.buffer.slice(this.offset, this.limit);
	}

	slice(beginning, end) {
		const bb = this.clone();
		bb.offset = beginning ?? this.offset;
		bb.limit = end ?? this.limit;

		return bb;
	}
}

ByteBuffer.prototype.__isByteBuffer__ = true;

