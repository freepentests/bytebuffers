import writeUint8 from './Modules/'

export default class ByteBuffer {
	#capacity;

	static DEFAULT_CAPACITY = 16;
	static DEFAULT_ENDIAN = false;
	static DEFAULT_NOASSERT =  false; 
	static BIG_ENDIAN = false; // a constant that can be used instead of the boolean value when instantiating a new ByteBuffer
	static LITTLE_ENDIAN = true; // a constant that can be used instead of the boolean value when instantiating a new ByteBuffer

	static isByteBuffer(bb) {
		return bb && bb.__isByteBuffer__; 
	}

	constructor(capacity, littleEndian, noAssert) {
		this.#capacity = capacity ?? ByteBuffer.DEFAULT_CAPACITY;

		this.limit = capacity ?? ByteBuffer.DEFAULT_CAPACITY;
		this.littleEndian = littleEndian ?? ByteBuffer.DEFAULT_ENDIAN;
		this.noAssert = noAssert ?? ByteBuffer.DEFAULT_NOASSERT;

		this.buffer = Buffer.alloc(capacity);
		this.view = new DataView(buffer);

		this.offset = 0;
		this.markedOffset = -1;
	}
}

ByteBuffer.prototype.__isByteBuffer__ = true;



