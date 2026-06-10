export default class ByteBuffer {
	#capacity;

	static DEFAULT_CAPACITY = 16;
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

	writeIString(string) {
		this.writeUint32(string.length);
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
}

ByteBuffer.prototype.__isByteBuffer__ = true;

ByteBuffer.prototype.writeUInt8 = ByteBuffer.prototype.writeUint8;
ByteBuffer.prototype.readUInt8 = ByteBuffer.prototype.readUint8;
ByteBuffer.prototype.writeByte = ByteBuffer.prototype.writeUint8;
ByteBuffer.prototype.readByte = ByteBuffer.prototype.readUint8;

