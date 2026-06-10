export default class VString {
	writeVString(string) {
		this.writeVarint32(string.length);
		this.writeUTF8String(string);

		return this;
	}
}

