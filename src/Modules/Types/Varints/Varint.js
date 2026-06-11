export default class Varint {
	static zigZagEncode(number) {
		// https://lemire.me/blog/2022/11/25/making-all-your-integers-positive-with-zigzag-encoding/
		return (Math.abs(number) * 2) + (number < 0 ? -1 : 0);
	}

	static zigZagDecode(number) {
		const isEven = number % 2 === 0;
		return isEven ? (number / 2) : -(number + 1) / 2;
	}

	writeVarint(number) {
		if (number === 0) {
			return (this.writeUint8(number), this);
		}

		while (number) {
			let byte = number & 0x7F
			number >>>= 7;
			if (number !== 0) byte |= 0x80;
			this.writeUint8(byte);
		} 

		return this;
	}

	readVarint() {
		let number = 0;
		let shift = 0;

		while (true) {
			const byte = this.readUint8();
			number += (byte & 0x7F) << shift;
			shift += 7;

			if (!(byte & 0x80)) break;
		}

		return number;
	}

	writeVarintZigZag(number) {
		this.writeVarint(Varint.zigZagEncode32(number));

		return this;
	}
}

