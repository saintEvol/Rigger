declare module rigger.utils {
    class Byte {
        private dataView;
        /**
         * 默认长度
         */
        static defaultLenth: number;
        constructor(byteLen?: number | ArrayBuffer);
        clear(): void;
        /**
         * 有效内容的字节长度
         */
        /**
         * 占用内存的字节长度
         */
        readonly byteLength: number;
        readonly buffer: ArrayBuffer;
        /**
         * 当前位置(字节)
         */
        pos: number;
        littleEndian: boolean;
        /**
         * 从字节流当前位置读取8位整型值，此方法不会导致位置移动
         */
        getInt8(): number;
        /**
         * 从字节流当前位置读取16位整型值，此方法不会导致位置移动
         */
        getInt16(): number;
        /**
         * 从字节流当前位置读取32位整型值，此方法不会导致位置移动
         */
        getInt32(): number;
        /**
         * 从字节流当前位置读取64位整型值，此方法不会导致位置移动
         */
        getInt64(): number;
        /**
         * 从字节流当前位置读取8位无符号整型值，此方法不会导致位置移动
         */
        getUint8(): number;
        /**
         * 从字节流当前位置读取16位无符号整型值，此方法不会导致位置移动
         */
        getUint16(): number;
        /**
         * 从字节流当前位置读取32位无符号整型值，此方法不会导致位置移动
         */
        getUint32(): number;
        /**
         * 从字节流当前位置读取64位无符号整型值，此方法不会导致位置移动
         */
        getUint64(): number;
        /**
         * 从字节流当前位置读取8位整型值，并使当前位置向后移动8位
         */
        readInt8(): number;
        /**
         * 从字节流当前位置读取16位整型值，并使当前位置向后移动16位
         */
        readInt16(): number;
        /**
         * 从字节流当前位置读取32位整型值，并使当前位置向后移动32位
         */
        readInt32(): number;
        /**
         * 从字节流当前位置读取64位整型值，并使当前位置向后移动64位
         */
        readInt64(): number;
        /**
         * 从字节流当前位置读取8位无符号整型值，并使当前位置向后移动8位
         */
        readUint8(): number;
        /**
         * 从字节流当前位置读取16位无符号整型值，并使当前位置向后移动16位
         */
        readUint16(): number;
        /**
         * 从字节流当前位置读取32位无符号整型值，并使当前位置向后移动32位
         */
        readUint32(): number;
        /**
         * 从字节流当前位置读取64位无符号整型值，并使当前位置向后移动32位
         */
        readUint64(): number;
        /**
         * 写入一个8位的有符号值，并且使位置向后移动8位
         * @param v 写入的值
         */
        writeInt8(v: number): Byte;
        /**
         * 写入一个16位的有符号值，并且使位置向后移动16位
         * @param v 写入的值
         */
        writeInt16(v: number): Byte;
        /**
         * 写入一个32位的有符号值，并且使位置向后移动32位
         * @param v 写入的值
         */
        writeInt32(v: number): Byte;
        /**
         * 写入一个64位的有符号值，并且使位置向后移动64位
         * @param v 写入的值
         */
        writeInt64(v: number): Byte;
        /**
         * 写入一个8位的无符号值，并且使位置向后移动8位
         * @param v 写入的值
         */
        writeUint8(v: number): Byte;
        /**
         * 写入一个16位的无符号值，并且使位置向后移动16位
         * @param v 写入的值
         */
        writeUint16(v: number): Byte;
        /**
         * 写入一个32位的无符号值，并且使位置向后移动32位
         * @param v 写入的值
         */
        writeUint32(v: number): Byte;
        /**
         * 写入一个64位的无符号值，并且使位置向后移动64位
         * @param v 写入的值
         */
        writeUint64(v: number): Byte;
        writeFloat32(v: number): Byte;
        writeFloat64(v: number): Byte;
        /**
         * <p>将指定 arraybuffer 对象中的以 offset 为起始偏移量， length 为长度的字节序列写入字节流。</p>
         * <p>如果省略 length 参数，则使用默认长度 0，该方法将从 offset 开始写入整个缓冲区；如果还省略了 offset 参数，则写入整个缓冲区。</p>
         * <p>如果 offset 或 length 小于0，本函数将抛出异常。</p>
         * $NEXTBIG 由于没有判断length和arraybuffer的合法性，当开发者填写了错误的length值时，会导致写入多余的空白数据甚至内存溢出，为了避免影响开发者正在使用此方法的功能，下个重大版本会修复这些问题。
         * @param	arraybuffer	需要写入的 Arraybuffer 对象。
         * @param	offset		Arraybuffer 对象的索引的偏移量（以字节为单位）
         * @param	length		从 Arraybuffer 对象写入到 Byte 对象的长度（以字节为单位）
         */
        writeArrayBuffer(arraybuffer: ArrayBuffer, offset?: number, length?: number): Byte;
        /**
         * 将字节流重置为指定长度，重置后，所有内容清空
         * @param byteLen
         */
        protected ensureBuffer(needByteLen: number): void;
        protected init(byteLenOrBuffer: number | ArrayBuffer): void;
    }
}
