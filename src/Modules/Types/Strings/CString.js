export default class CString {
	writeCString(string) {
		this.writeUTF8String(string);
		this.writeUint8(0); // null terminator

		return this;
	}

	readCString() {
		const bytes = [];
		let byte;

		while ((a = this.readUint8()) !== 0) {
			bytes.push(byte);
		}

		return new TextDecoder().decode(new Uint8Array(bytes));
	}
}

