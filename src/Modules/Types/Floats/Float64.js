export default class Float64 {
	writeFloat64(number) {
		this.float.setFloat64(this.offset, number, this.littleEndian);
		this.offset += 8;

		return this;
	}

	readFloat64() {
		const number = this.view.getFloat64(this.offset, this.littleEndian);
		this.offset += 8;

		return number;
	}
}

