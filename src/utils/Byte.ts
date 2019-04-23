module rigger.utils {
    export class Byte {
        private _dataView: DataView = null;
        private _allocated: number = 8;
        private _pos: number = 0;
        private _length: number = 0;
        private _u8d: Uint8Array = null;

        public static readonly BIG_ENDIAN = "bigEndian";
        public static readonly LITTLE_ENDIAN = "littleEndian";
        private static sysEndian = null;

        public static getSystemEndian() {
            if (!Byte.sysEndian) {
                var buffer = new ArrayBuffer(2);
                new DataView(buffer).setInt16(0, 256, true);
                Byte.sysEndian = (new Int16Array(buffer))[0] === 256 ? /*CLASS CONST:laya.utils.Byte.LITTLE_ENDIAN*/"littleEndian" :/*CLASS CONST:laya.utils.Byte.BIG_ENDIAN*/"bigEndian";
            }
            return Byte.sysEndian;
        }

        /**
         * 默认长度
         */
        public static defaultLenth: number = 0;

        constructor(data?: any) {
            this._allocated = 8;
            this._pos = 0;
            this._length = 0;
            this.littleEndian = false;

            if (data) {
                this._u8d = new Uint8Array(data);
                this._dataView = new DataView(this._u8d.buffer);
                this._length = this._dataView.byteLength;
            }
            else {
                this.resizeBuffer(this._allocated);
            }
        }


        clear() {
            this._pos = 0;
            this.length = 0;
        }

        /**
         * 有效内容的字节长度
         */
        // public contentLength: number = 0;

        /**
         * 占用内存的字节长度
         */
        public get byteLength(): number {
            return this._length;
        }

        /**
         * 当前位置(字节)
         */
        public get pos(): number {
            return this._pos;
        }

        /**
         * 
         */
        public set pos(value: number) {
            this._pos = value;
        }

        /**
         * 长度（字节）
         */
        public get length(): number {
            return this._length;
        }

        public set length(len: number) {
            if (this._allocated < len) {
                this.resizeBuffer(this._allocated = Math.floor(Math.max(len, this._allocated * 2)));
            }
            else if (this._allocated > len) {
                this.resizeBuffer(this._allocated = len);
            }

            this._length = len;
        }

        /**
         * 可用字节数（从当前位置到终点）
         */
        public get bytesAvailable(): number {
            return this._length - this._pos;
        }

        /**
         * 缓冲区
         */
        public get buffer() {
            let rstBuffer: ArrayBuffer = this._dataView.buffer;
            if (rstBuffer.byteLength == this.length) return rstBuffer;
            return rstBuffer.slice(0, this.length);
        }

        /**
         * 大小端标示
         */
        public get endian() {
            return this.littleEndian ? "littleEndian" : "bigEndian";
        }

        public set endian(endianStr: string) {
            this.littleEndian = (endianStr == "littleEndian");
        }

        public littleEndian: boolean = false;

        /**
        *<p>常用于解析固定格式的字节流。</p>
        *<p>先从字节流的当前字节偏移位置处读取一个 <code>Uint16</code> 值，然后以此值为长度，读取此长度的字符串,此方法不会导致位置移动。</p>
        *@return 读取的字符串。
        */
        public getString() {
            return this.rUTF(this.readUint16());
        }

        /**
        *读取 <code>len</code> 参数指定的长度的字符串。
        *@param len 要读取的字符串的长度。
        *@return 指定长度的字符串。
        */
        readCustomString(len: number) {
            let v: string = "", ulen: number = 0, c: number = 0, c2: number = 0, f: Function = String.fromCharCode;
            let u: Uint8Array = this._u8d, i: number = 0;
            while (len > 0) {
                c = u[this._pos];
                if (c < 0x80) {
                    v += f(c);
                    this._pos++;
                    len--;
                } else {
                    ulen = c - 0x80;
                    this._pos++;
                    len -= ulen;
                    while (ulen > 0) {
                        c = u[this._pos++];
                        c2 = u[this._pos++];
                        v += f((c2 << 8) | c);
                        ulen--;
                    }
                }
            }
            return v;
        }

        /**
        *从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象,此方法不会导致POS发生改变。
        *@param start 开始位置。
        *@param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
        *@return 读取的 Float32Array 对象。
        */
        public getFloat32Array(start: number, len: number): Float32Array {
            let end: number = start + len;
            end = (end > this._length) ? this._length : end;
            let v = new Float32Array(this._dataView.buffer.slice(start, end));
            return v;
        }

        /**
         * 
         * @param start 
         * @param len 
         */
        public getUint8Array(start: number, len: number): Uint8Array {
            let end: number = start + len;
            end = (end > this._length) ? this._length : end;
            return new Uint8Array(this._dataView.buffer.slice(start, end));
        }

        public getUint16Array(start: number, len: number): Uint16Array {
            let end: number = start + len;
            end = (end > this._length) ? this._length : end;
            return new Uint16Array(this._dataView.buffer.slice(start, end));
        }

        public getInt16Array(start: number, len: number): Int16Array {
            let end: number = start + len;
            end = (end > this._length) ? this._length : end;
            return new Int16Array(this._dataView.buffer.slice(start, end));
        }

        /**
        *从字节流中 <code>start</code> 参数指定的位置开始，读取 <code>len</code> 参数指定的字节数的数据，用于创建一个 <code>Float32Array</code> 对象并返回此对象。
        *@param start 开始位置。
        *@param len 需要读取的字节长度。如果要读取的长度超过可读取范围，则只返回可读范围内的值。
        *@return 读取的 Float32Array 对象。
        */
        public readFloat32Array(start: number, len: number) {
            let end: number = start + len;
            let ret = this.getFloat32Array(start, len);
            this._pos = end;
            return ret;
        }

        public readUint8Array(start: number, len: number): Uint8Array {
            let ret: Uint8Array = this.getUint8Array(start, len);
            this._pos = start + len;
            return ret;
        }

        public readUint16Array(start: number, len: number): Uint16Array {
            let ret: Uint16Array = this.getUint16Array(start, len);
            this._pos = start + len;
            return ret;
        }

        public readInt16Array(start: number, len: number): Int16Array {
            let ret: Int16Array = this.getInt16Array(start, len);
            this._pos = start + len;
            return ret;
        }

        /**
         * 从字节流当前位置读取8位整型值，此方法不会导致位置移动
         */
        public getInt8(): number {
            if (this._pos + 1 > this._length) throw new Error("getInt8 error - Out of bounds");
            return this._dataView.getInt8(this.pos);
        }

        /**
         * 从字节流当前位置读取16位整型值，此方法不会导致位置移动
         */
        public getInt16(): number {
            if (this._pos + 2 > this._length) throw new Error("getInt16 error - Out of bounds");
            return this._dataView.getInt16(this.pos, this.littleEndian);
        }

        /**
         * 从字节流当前位置读取32位整型值，此方法不会导致位置移动
         */
        public getInt32(): number {
            return this._dataView.getInt32(this.pos, this.littleEndian);
        }

        /**
         * 从字节流当前位置读取64位整型值，此方法不会导致位置移动
         */
        public getInt64(): number {
            let n1: number = this.readInt32();
            let n2: number = this.readInt32();
            this._pos -= 8;

            return rigger.utils.Utils.combineInt64([n1, n2]);
        }

        public getFloat32() {
            if (this._pos + 4 > this._length) throw "getFloat32 error - Out of bounds";
            return this._dataView.getFloat32(this._pos, this.littleEndian);
        }

        public getFloat64() {
            if (this._pos + 8 > this._length) throw "getFloat64 error - Out of bounds";
            return this._dataView.getFloat64(this._pos, this.littleEndian);
        }

        /**
         * 从字节流当前位置读取8位无符号整型值，此方法不会导致位置移动
         */
        public getUint8(): number {
            if (this._pos + 1 > this._length) throw new Error("getUint8 error - Out of bounds");
            return this._dataView.getUint8(this.pos);
        }

        /**
         * 从字节流当前位置读取16位无符号整型值，此方法不会导致位置移动
         */
        public getUint16(): number {
            if (this._pos + 2 > this._length) throw new Error("getUint16 error - Out of bounds");
            return this._dataView.getUint16(this._pos, this.littleEndian);
        }

        /**
         * 从字节流当前位置读取32位无符号整型值，此方法不会导致位置移动
         */
        public getUint32(): number {
            return this._dataView.getUint32(this.pos, this.littleEndian);
        }

        /**
         * 从字节流当前位置读取64位无符号整型值，此方法不会导致位置移动
         */
        public getUint64(): number {
            let n1: number = this.readUint32();
            let n2: number = this.readUint32();
            this._pos -= 8;

            return rigger.utils.Utils.combineInt64([n1, n2]);
        }

        /**
         * 从字节流当前位置读取8位整型值，并使当前位置向后移动8位
         */
        public readInt8(): number {
            let ret: number = this.getInt8();
            this._pos += 1;
            return ret;
        }

        /**
         * 从字节流当前位置读取16位整型值，并使当前位置向后移动16位
         */
        public readInt16(): number {
            let ret: number = this.getInt16();
            this._pos += 2;

            return ret;
        }

        /**
         * 从字节流当前位置读取32位整型值，并使当前位置向后移动32位
         */
        public readInt32(): number {
            let ret: number = this.getInt32();
            this._pos += 4;

            return ret;
        }

        /**
         * 从字节流当前位置读取64位整型值，并使当前位置向后移动64位
         */
        public readInt64(): number {
            let ret: number = this.getInt64();
            this._pos += 8;

            return ret;
        }

        /**
         * 从字节流当前位置读取8位无符号整型值，并使当前位置向后移动8位
         */
        public readUint8(): number {
            let ret: number = this.getUint8();
            this._pos += 1;

            return ret;
        }

        /**
         * 从字节流当前位置读取16位无符号整型值，并使当前位置向后移动16位
         */
        public readUint16(): number {
            let ret: number = this.getUint16();
            this._pos += 2;

            return ret;
        }

        /**
         * 从字节流当前位置读取32位无符号整型值，并使当前位置向后移动32位
         */
        public readUint32(): number {
            let ret: number = this.getUint32();
            this._pos += 4;

            return ret;
        }

        /**
         * 从字节流当前位置读取64位无符号整型值，并使当前位置向后移动32位
         */
        public readUint64(): number {
            let ret: number = this.getUint64();
            this._pos += 8;

            return ret;
        }

        public readFloat32(): number {
            let ret: number = this.getFloat32();
            this._pos += 4;

            return ret;
        }

        public readFloat64(): number {
            let ret: number = this.getFloat64();
            this._pos += 8;
            return ret;
        }

        /**
         * 写入一个8位的有符号值，并且使位置向后移动8位
         * @param v 写入的值
         */
        public writeInt8(v: number): Byte {
            this.ensureWrite(this._pos + 1);
            this._dataView.setInt8(this.pos, v);
            this._pos += 1;

            return this;
        }

        /**
         * 写入一个16位的有符号值，并且使位置向后移动16位
         * @param v 写入的值
         */
        public writeInt16(v: number): Byte {
            this.ensureWrite(this._pos + 2);
            this._dataView.setInt16(this.pos, v, this.littleEndian);
            this._pos += 2;

            return this;
        }

        /**
         * 写入一个32位的有符号值，并且使位置向后移动32位
         * @param v 写入的值
         */
        public writeInt32(v: number): Byte {
            this.ensureWrite(this._pos + 4);
            this._dataView.setInt32(this.pos, v, this.littleEndian);
            this._pos += 4;

            return this;
        }

        /**
         * 写入一个64位的有符号值，并且使位置向后移动64位
         * @param v 写入的值
         */
        public writeInt64(v: number): Byte {
            this.ensureWrite(this._pos + 8);
            // 将一个数字拆成2个数字
            let arr: number[] = rigger.utils.Utils.resoleInt64(v);
            // 将其作为两个32位有符号整型写入
            this.writeInt32(arr[0]).writeInt32(arr[1]);
            // this._pos += 8;

            return this;
        }


        /**
         * 写入一个8位的无符号值，并且使位置向后移动8位
         * @param v 写入的值
         */
        public writeUint8(v: number): Byte {
            this.ensureWrite(this._pos + 1);
            this._dataView.setUint8(this.pos, v);
            this._pos += 1;

            return this;
        }

        public writeByte(value): Byte {
            this.ensureWrite(this._pos + 1);
            this._dataView.setInt8(this._pos, value);
            this._pos += 1;

            return this;
        }

        public getByte(): number {
            return this.getInt8();
        }

        public readByte() {
            let ret: number = this.getByte();
            this._pos += 1;
            return ret;
        }

        /**
         * 写入一个16位的无符号值，并且使位置向后移动16位
         * @param v 写入的值
         */
        public writeUint16(v: number): Byte {
            this.ensureWrite(this._pos + 2);
            this._dataView.setUint16(this.pos, v, this.littleEndian);
            this._pos += 2;
            return this;
        }

        /**
         * 写入一个32位的无符号值，并且使位置向后移动32位
         * @param v 写入的值
         */
        public writeUint32(v: number): Byte {
            this.ensureWrite(this._pos + 4);
            this._dataView.setUint32(this.pos, v, this.littleEndian);
            this._pos += 4;

            return this;
        }

        /**
         * 写入一个64位的无符号值，并且使位置向后移动64位
         * @param v 写入的值
         */
        public writeUint64(v: number): Byte {
            this.ensureWrite(this._pos + 8);
            // 将一个数字拆成2个数字
            let arr: number[] = rigger.utils.Utils.resoleInt64(v);
            // 将其作为两个32位无符号整型写入
            this.writeUint32(arr[0]).writeUint32(arr[1]);
            // this.pos += 8;

            return this;
        }

        public writeFloat32(v: number): Byte {
            this.ensureWrite(this._pos + 4);
            this._dataView.setFloat32(this.pos, v, this.littleEndian);
            this._pos += 4;

            return this;
        }

        public writeFloat64(v: number): Byte {
            this.ensureWrite(this._pos + 8);
            this._dataView.setFloat64(this.pos, v, this.littleEndian);
            this._pos += 8;

            return this;
        }

        public writeUTFBytes(v):Byte {
            let value: string = v + "";
            for (var i = 0, sz = value.length; i < sz; i++) {
                var c = value.charCodeAt(i);
                if (c <= 0x7F) {
                    this.writeByte(c);
                } else if (c <= 0x7FF) {
                    this.ensureWrite(this._pos + 2);
                    this._u8d.set([0xC0 | (c >> 6), 0x80 | (c & 0x3F)], this._pos);
                    this._pos += 2;
                } else if (c <= 0xFFFF) {
                    this.ensureWrite(this._pos + 3);
                    this._u8d.set([0xE0 | (c >> 12), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)], this._pos);
                    this._pos += 3;
                } else {
                    this.ensureWrite(this._pos + 4);
                    this._u8d.set([0xF0 | (c >> 18), 0x80 | ((c >> 12) & 0x3F), 0x80 | ((c >> 6) & 0x3F), 0x80 | (c & 0x3F)], this._pos);
                    this._pos += 4;
                }
            }

            return this;
        }

        public writeUTFString(value): Byte {
            let tPos: number = this.pos;
            this.writeUint16(1);
            this.writeUTFBytes(value);
            var dPos = this.pos - tPos - 2;
            if (dPos >= 65536) {
                throw new Error("writeUTFString byte len more than 65536");
            }
            this._dataView.setUint16(tPos, dPos, this.littleEndian);

            return this;
        }

        public readUTFBytes(len: number = -1) {
            // (len === void 0) && (len = -1);
            if (len == 0) return "";
            let lastBytes: number = this.bytesAvailable;
            if (len > lastBytes) throw "readUTFBytes error - Out of bounds";
            len = len > 0 ? len : lastBytes;
            return this.rUTF(len);
        }

        public readUTFString() {
            return this.readUTFBytes(this.readUint16());
        }

        /**
         * <p>将指定 arraybuffer 对象中的以 offset 为起始偏移量， length 为长度的字节序列写入字节流。</p>
         * <p>如果省略 length 参数，则使用默认长度 0，该方法将从 offset 开始写入整个缓冲区；如果还省略了 offset 参数，则写入整个缓冲区。</p>
         * <p>如果 offset 或 length 小于0，本函数将抛出异常。</p>
         * $NEXTBIG 由于没有判断length和arraybuffer的合法性，当开发者填写了错误的length值时，会导致写入多余的空白数据甚至内存溢出，为了避免影响开发者正在使用此方法的功能，下个重大版本会修复这些问题。
         * @param	arraybuffer	需要写入的 Arraybuffer 对象。
         * @param	offset		Arraybuffer 对象的索引的偏移量（以字节为单位）
         * @param	length		从 Arraybuffer 对象写入到 Byte 对象的长度（以字节为单位）
         */
        writeArrayBuffer(arraybuffer: ArrayBuffer, offset: number = 0, length?: number): Byte {
            // let leftBytes: number = rigger.utils.Utils.isNullOrUndefined(length) ? arraybuffer.byteLength - offset : length;
            if (offset < 0 || length < 0) throw new Error("writeArrayBuffer error - Out of bounds");
            if (length == 0) length = arraybuffer.byteLength - offset;
            this.ensureWrite(this._pos + length);
            let uint8array: Uint8Array = new Uint8Array(arraybuffer);
            this._u8d.set(uint8array.subarray(offset, offset + length), this._pos);
            this._pos += length;

            return this;
        }

        /**
         * 将字节流重置为指定长度，重置后，所有内容清空
         * @param byteLen 
         */
        // public reset(byteLen?: number): void {
        // 	if (rigger.utils.Utils.isNullOrUndefined(byteLen)) byteLen = Byte.defaultLenth;
        // 	if (!this.dataView) {
        // 		this.init(byteLen)
        // 	}
        // 	else{
        // 		this.dataView = new DataView(this.dataView.buffer.slice(0, Math.min(this.dataView.byteLength, byteLen)));
        // 		// this.contentLength = 0;
        // 		this.pos = 0;
        // 	}
        // }

        // protected ensureBuffer(needByteLen: number) {
        //     // let pos: number = this.dataView.byteOffset;
        //     let has: number = this.byteLength - this.pos;
        //     if (has < needByteLen) {
        //         // let temp: DataView = new DataView(new ArrayBuffer(this.byteLength + needByteLen - has));
        //         // 扩展缓冲
        //         this.dataView =
        //             new DataView(
        //                 rigger.utils.Utils.transferArrayBuffer(this.dataView.buffer, this.byteLength + needByteLen - has)
        //             );

        //     }
        // }

        protected ensureWrite(lengthToEnsure) {
            if (this._length < lengthToEnsure) this._length = lengthToEnsure;
            if (this._allocated < lengthToEnsure) this.length = lengthToEnsure;
        }

        // protected init(byteLenOrBuffer: number | ArrayBuffer): void {
        //     if (rigger.utils.Utils.isNumber(byteLenOrBuffer)) {
        //         this.dataView = new DataView(new ArrayBuffer(byteLenOrBuffer));
        //     }
        //     else {
        //         this.dataView = new DataView(byteLenOrBuffer);
        //     }

        //     this.pos = 0;
        // }

        private resizeBuffer(len: number) {
            try {
                let newByteView: Uint8Array = new Uint8Array(len);
                if (this._u8d != null) {
                    if (this._u8d.length <= len) {
                        newByteView.set(this._u8d);
                    }
                    else {
                        newByteView.set(this._u8d.subarray(0, len));
                    }
                }
                this._u8d = newByteView;
                this._dataView = new DataView(newByteView.buffer);
            } catch (err) {
                throw "___resizeBuffer err:" + len;
            }
        }

        private rUTF(len: number) {
            var v = "", max = this._pos + len, c = 0, c2 = 0, c3 = 0, f = String.fromCharCode;
            var u = this._u8d, i = 0;
            while (this._pos < max) {
                c = u[this._pos++];
                if (c < 0x80) {
                    if (c != 0) {
                        v += f(c);
                    }
                } else if (c < 0xE0) {
                    v += f(((c & 0x3F) << 6) | (u[this._pos++] & 0x7F));
                } else if (c < 0xF0) {
                    c2 = u[this._pos++];
                    v += f(((c & 0x1F) << 12) | ((c2 & 0x7F) << 6) | (u[this._pos++] & 0x7F));
                } else {
                    c2 = u[this._pos++];
                    c3 = u[this._pos++];
                    v += f(((c & 0x0F) << 18) | ((c2 & 0x7F) << 12) | ((c3 << 6) & 0x7F) | (u[this._pos++] & 0x7F));
                }
                i++;
            }
            return v;
        }

        private getBuffer() {
            return this._dataView.buffer;
        }

    }
}