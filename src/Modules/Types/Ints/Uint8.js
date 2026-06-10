ByteBuffer.prototype.writeInt8 = function(number) {
	this.view.setInt8(this.offset, number, this.littleEndian);
	return this;
}

ByteBuffer.prototype.writeUint8 = function(number) {
	this.view.setUint8(this.offset, number, this.littleEndian);
	return this;
}

ByteBuffer.prototype.readUint8 = function() {
	const number = this.view.getUint8(this.offset++, this.littleEndian);
	return number;
}

ByteBuffer.prototype.readInt8 = function() {
	const number = this.view.getInt8(this.offset++, this.littleEndian);
	return number;
}

ByteBuffer.prototype.writeByte = ByteBuffer.prototype.writeUint8;
ByteBuffer.prototype.writeUInt8 = ByteBuffer.prototype.writeUint8;
ByteBuffer.prototype.readUInt8 = ByteBuffer.prototype.readUint8;
ByteBuffer.prototype.readByte = ByteBuffer.prototype.readUint8;

