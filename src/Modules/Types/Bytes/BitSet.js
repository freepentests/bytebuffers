export default class BitSet {
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

	readBitSet() {
		let bitSet = [];

		const length = this.readVarint();

		while (true) {
			const byte = this.readUint8();
			const bits
		}

		return bitSet;
	}
}

