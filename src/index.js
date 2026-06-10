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

	constructor(capacity, littleEndian) {
		this.#capacity = capacity ?? ByteBuffer.DEFAULT_CAPACITY;

		this.limit = capacity ?? ByteBuffer.DEFAULT_CAPACITY;
		this.littleEndian = littleEndian ?? ByteBuffer.DEFAULT_ENDIAN;

		this.buffer = new ArrayBuffer(capacity);
		this.view = new DataView(this.buffer);

		this.offset = 0;
		this.markedOffset = -1;
	}

	static calculateUTF8Bytes(string) {
		const stringContents = new TextEncoder().encode(string);
		return stringContents.length;
	}

	writeIString(string) {
		this.writeUint32(string.length);
		this.writeUTF8String(string);

		return this;
	}

	writeVString(string) {
		this.writeVarint32(string.length);
		this.writeUTF8String(string);

		return this;
	}

	writeCString(string) {
		this.writeUTF8String(string);
		this.writeUint8(0); // null terminator

		return this;
	}

	writeUTF8String(string) {
		const stringContents = new TextEncoder().encode(string);
		stringContents.forEach(charCode => {
			this.writeUint8(charCode);
		});

		return this;
	}

	clone() {
		const bb = new ByteBuffer(this.capacity, this.littleEndian);
		bb.buffer = this.buffer;
		bb.view = this.view;

		return bb;
	}

	slice(beginning, end) {
		const bb = this.clone();
		bb.offset = beginning ?? this.offse;
		bb.limit = end ?? this.limit;

		return bb;
	}

	readBytes(length, offset) {
		return this.slice(offset, offset + length); 
	}

	writeBitSet(bitSet) {
		this.writeVarint32(bitSet.length);
		
		const numBytes = bitSet.length / 8;
		let bit = 0;

		for (let i = 0; i < numBytes; i++) {
			const byte = (bitSet[bit++] & 1) |
				(bitSet[bit++] & 1) << 1 |
				(bitSet[bit++] & 1) << 2 |
				(bitSet[bit++] & 1) << 3 |
				(bitSet[bit++] & 1) << 4 |
				(bitSet[bit++] & 1) << 5 |
				(bitSet[bit++] & 1) << 6 |
				(bitSet[bit++] & 1) << 7; 

			this.writeUint8(byte);
		}

		return this;
	}
}

ByteBuffer.prototype.__isByteBuffer__ = true;

