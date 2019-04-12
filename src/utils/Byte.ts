module rigger.utils {
    export class Byte {
        private dataView: DataView = null;

        /**
         * 默认长度
         */
        public static defaultLenth: number = 0;

        constructor(byteLen?: number | ArrayBuffer) {
            if (rigger.utils.Utils.isNullOrUndefined(byteLen)) {
                byteLen = Byte.defaultLenth;
            }
            this.init(byteLen);
        }

        clear() {
            this.dataView = null;
            this.pos = 0;
        }

        /**
         * 有效内容的字节长度
         */
        // public contentLength: number = 0;

        /**
         * 占用内存的字节长度
         */
        public get byteLength(): number {
            if (this.dataView) return this.dataView.byteLength;
            return 0;
        }

        public get buffer(): ArrayBuffer {
            if (!this.dataView) return null;
            return this.dataView.buffer;
        }

        /**
         * 当前位置(字节)
         */
        public pos: number = 0;

        public littleEndian: boolean = false;

        /**
         * 从字节流当前位置读取8位整型值，此方法不会导致位置移动
         */
        public getInt8(): number {
            return this.dataView.getInt8(this.pos);
        }

        /**
         * 从字节流当前位置读取16位整型值，此方法不会导致位置移动
         */
        public getInt16(): number {
            return this.dataView.getInt16(this.pos, this.littleEndian);
        }

        /**
         * 从字节流当前位置读取32位整型值，此方法不会导致位置移动
         */
        public getInt32(): number {
            return this.dataView.getInt32(this.pos, this.littleEndian);
        }

        /**
         * 从字节流当前位置读取64位整型值，此方法不会导致位置移动
         */
        public getInt64(): number {
            let n1: number = this.readInt32();
            let n2: number = this.readInt32();
            this.pos -= 8;

            return rigger.utils.Utils.combineInt64([n1, n2]);
        }

        /**
         * 从字节流当前位置读取8位无符号整型值，此方法不会导致位置移动
         */
        public getUint8(): number {
            return this.dataView.getUint8(this.pos);
        }

        /**
         * 从字节流当前位置读取16位无符号整型值，此方法不会导致位置移动
         */
        public getUint16(): number {
            return this.dataView.getUint16(this.pos, this.littleEndian);
        }

        /**
         * 从字节流当前位置读取32位无符号整型值，此方法不会导致位置移动
         */
        public getUint32(): number {
            return this.dataView.getUint32(this.pos, this.littleEndian);
        }

        /**
         * 从字节流当前位置读取64位无符号整型值，此方法不会导致位置移动
         */
        public getUint64(): number {
            let n1: number = this.readUint32();
            let n2: number = this.readUint32();
            this.pos -= 8;

            return rigger.utils.Utils.combineInt64([n1, n2]);
        }

        /**
         * 从字节流当前位置读取8位整型值，并使当前位置向后移动8位
         */
        public readInt8(): number {
            let ret: number = this.getInt8();
            this.pos += 1;
            return ret;
        }

        /**
         * 从字节流当前位置读取16位整型值，并使当前位置向后移动16位
         */
        public readInt16(): number {
            let ret: number = this.getInt16();
            this.pos += 2;

            return ret;
        }

        /**
         * 从字节流当前位置读取32位整型值，并使当前位置向后移动32位
         */
        public readInt32(): number {
            let ret: number = this.getInt32();
            this.pos += 4;

            return ret;
        }

        /**
         * 从字节流当前位置读取64位整型值，并使当前位置向后移动64位
         */
        public readInt64(): number {
            let ret: number = this.getInt64();
            this.pos += 8;

            return ret;
        }

        /**
         * 从字节流当前位置读取8位无符号整型值，并使当前位置向后移动8位
         */
        public readUint8(): number {
            let ret: number = this.getUint8();
            this.pos += 1;

            return ret;
        }

        /**
         * 从字节流当前位置读取16位无符号整型值，并使当前位置向后移动16位
         */
        public readUint16(): number {
            let ret: number = this.getUint16();
            this.pos += 2;

            return ret;
        }

        /**
         * 从字节流当前位置读取32位无符号整型值，并使当前位置向后移动32位
         */
        public readUint32(): number {
            let ret: number = this.getUint32();
            this.pos += 4;

            return ret;
        }

        /**
         * 从字节流当前位置读取64位无符号整型值，并使当前位置向后移动32位
         */
        public readUint64(): number {
            let ret: number = this.getUint64();
            this.pos += 8;

            return ret;
        }

        /**
         * 写入一个8位的有符号值，并且使位置向后移动8位
         * @param v 写入的值
         */
        public writeInt8(v: number): Byte {
            this.ensureBuffer(1);
            this.dataView.setInt8(this.pos, v);
            this.pos += 1;

            return this;
        }

        /**
         * 写入一个16位的有符号值，并且使位置向后移动16位
         * @param v 写入的值
         */
        public writeInt16(v: number): Byte {
            this.ensureBuffer(2);
            this.dataView.setInt16(this.pos, v);
            this.pos += 2;

            return this;
        }

        /**
         * 写入一个32位的有符号值，并且使位置向后移动32位
         * @param v 写入的值
         */
        public writeInt32(v: number): Byte {
            this.ensureBuffer(4);
            this.dataView.setInt32(this.pos, v);
            this.pos += 4;

            return this;
        }

        /**
         * 写入一个64位的有符号值，并且使位置向后移动64位
         * @param v 写入的值
         */
        public writeInt64(v: number): Byte {
            this.ensureBuffer(8);
            // 将一个数字拆成2个数字
            let arr: number[] = rigger.utils.Utils.resoleInt64(v);
            // 将其作为两个32位有符号整型写入
            this.writeInt32(arr[0]).writeInt32(arr[1]);
            this.pos += 8;

            return this;
        }


        /**
         * 写入一个8位的无符号值，并且使位置向后移动8位
         * @param v 写入的值
         */
        public writeUint8(v: number): Byte {
            this.ensureBuffer(1);
            this.dataView.setUint8(this.pos, v);
            this.pos += 1;

            return this;
        }

        /**
         * 写入一个16位的无符号值，并且使位置向后移动16位
         * @param v 写入的值
         */
        public writeUint16(v: number): Byte {
            this.ensureBuffer(2);
            this.dataView.setUint16(this.pos, v);
            this.pos += 2;
            return this;
        }

        /**
         * 写入一个32位的无符号值，并且使位置向后移动32位
         * @param v 写入的值
         */
        public writeUint32(v: number): Byte {
            this.ensureBuffer(4);
            this.dataView.setUint32(this.pos, v);
            this.pos += 4;

            return this;
        }

        /**
         * 写入一个64位的无符号值，并且使位置向后移动64位
         * @param v 写入的值
         */
        public writeUint64(v: number): Byte {
            this.ensureBuffer(8);
            // 将一个数字拆成2个数字
            let arr: number[] = rigger.utils.Utils.resoleInt64(v);
            // 将其作为两个32位无符号整型写入
            this.writeUint32(arr[0]).writeUint32(arr[1]);
            this.pos += 8;

            return this;
        }

        public writeFloat32(v: number): Byte {
            this.ensureBuffer(4);
            this.dataView.setFloat32(this.pos, v);
            this.pos += 4;

            return this;
        }

        public writeFloat64(v: number): Byte {
            this.ensureBuffer(8);
            this.dataView.setFloat64(this.pos, v);
            this.pos += 8;

            return this;
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
            let leftBytes: number = rigger.utils.Utils.isNullOrUndefined(length) ? arraybuffer.byteLength - offset : length;

            if(ArrayBuffer.isView(arraybuffer)) {
                arraybuffer = arraybuffer.buffer;

            }
            this.ensureBuffer(leftBytes);
            rigger.utils.Utils.copyArrayBuffer(arraybuffer, offset, this.dataView.buffer, this.pos, leftBytes);

            return this
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

        protected ensureBuffer(needByteLen: number) {
            if (!this.dataView) {
                this.init(needByteLen);
            }
            else {
                // let pos: number = this.dataView.byteOffset;
                let has: number = this.byteLength - this.pos;
                if (has < needByteLen) {
                    // let temp: DataView = new DataView(new ArrayBuffer(this.byteLength + needByteLen - has));
                    // 扩展缓冲
                    this.dataView =
                        new DataView(
                            rigger.utils.Utils.transferArrayBuffer(this.dataView.buffer, this.byteLength + needByteLen - has)
                        );

                }
            }
        }

        protected init(byteLenOrBuffer: number | ArrayBuffer): void {
            if (rigger.utils.Utils.isNumber(byteLenOrBuffer)) {
                this.dataView = new DataView(new ArrayBuffer(byteLenOrBuffer));
            }
            else {
                this.dataView = new DataView(byteLenOrBuffer);
            }

            this.pos = 0;
        }
    }
}