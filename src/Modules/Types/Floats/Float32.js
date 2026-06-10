export default class Float32 {
	writeFloat32(number) {
		this.float.setFloat32(this.offset, number, this.littleEndian);
		this.offset += 4;

		return this;
	}

	readFloat32() {
		const number = this.view.getFloat32(this.offset, this.littleEndian);
		this.offset += 4;

		return number;
	}
}

