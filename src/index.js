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
}

ByteBuffer.prototype.__isByteBuffer__ = true;

