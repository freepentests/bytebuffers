export default class Bytes {
	readBytes(length, offset) {
		return this.slice(offset, offset + length);
	}
}

