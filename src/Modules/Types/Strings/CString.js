export default class CString {
	writeCString(string) {
		this.writeUTF8String(string);
		this.writeUint8(0); // null terminator

		return this;
	}
}

