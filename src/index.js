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

	writeInt8(number) {
		this.view.setInt8(this.offset++, number, this.littleEndian);
		return this;
	}

	writeUint8(number) {
		this.view.setUint8(this.offset++, number, this.littleEndian);
		return this;
	}

	readUint8() {
		const number = this.view.getUint8(this.offset++, this.littleEndian);
		return number;
	}

	readInt8() {
		const number = this.view.getInt8(this.offset++, this.littleEndian);
		return number;
	}

	writeInt16(number) {
		this.view.setInt16(this.offset, number, this.littleEndian);
		this.offset += 2;

		return this;
	}

	writeUint16(number) {
		this.view.setUint16(this.offset, number, this.littleEndian);
		this.offset += 2;

		return this;
	}

	readInt16() {
		const number = this.view.getInt16(this.offset++, this.littleEndian);
		this.offset += 2;

		return number;
	}

	readUint16() {
		const number = this.view.getUint16(this.offset, this.littleEndian);
		this.offset += 2;

		return number;
	}

	writeInt32(number) {
		this.view.setInt32(this.offset, number, this.littleEndian);
		this.offset += 4;

		return this;
	}

	writeUint32(number) {
		this.view.setUint32(this.offset, number, this.littleEndian);
		this.offset += 4;

		return this;
	}

	readInt32() {
		const number = this.view.getInt32(this.offset++, this.littleEndian);
		this.offset += 4;

		return number;
	}

	readUint32() {
		const number = this.view.getUint32(this.offset, this.littleEndian);
		this.offset += 4;

		return number;
	}

	static calculateUTF8Bytes(string) {
		const stringContents = new TextEncoder().encode(string);
		return stringContents.length;
	}
	
	writeFloat32(number) {
		this.float.setFloat32(this.offset, number, this.littleEndian);
		this.offset += 4;

		return this;
	}

	writeFloat64(number) {
		this.float.setFloat64(this.offset, number, this.littleEndian);
		this.offset += 8;

		return this;
	}

	readFloat32() {
		const number = this.view.getFloat32(this.offset, this.littleEndian);
		this.offset += 4;

		return number;
	}

	readFloat64() {
		const number = this.view.getFloat64(this.offset, this.littleEndian);
		this.offset += 8;

		return number;
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

	static zigZagEncode32(number) {
		// https://lemire.me/blog/2022/11/25/making-all-your-integers-positive-with-zigzag-encoding/
		return (Math.abs(number) * 2) + (number < 0 ? -1 : 0);
	}

	static zigZagDecode32(number) {
		const isEven = number % 2 === 0;
		return isEven ? (number / 2) : -(number + 1) / 2;
	}

	writeVarint32(number) {
		// https://dev.to/lukaszwojcikdev/base128-algorithm-tool-for-encoding-and-decoding-text-data-34ld
		while (number) {
			let byte = number & 0x7F
			number >>>= 7;
			if (number !== 0) byte |= 0x80;
			this.writeUint8(byte);
		} 

		return this;
	}

	writeVarint32ZigZag(number) {
		this.writeVarint32(ByteBuffer.zigZagEncode32(number));

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

