export default class UTF8String {
	static calculateUTF8Bytes(string) {
		const stringContents = new TextEncoder().encode(string);
		return stringContents.length;
	}

	writeUTF8String(string) {
		const stringContents = new TextEncoder().encode(string);
		stringContents.forEach(charCode => {
			this.writeUint8(charCode);
		});

		return this;
	}
}

