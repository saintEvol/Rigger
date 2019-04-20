/**
 * Utils
 */
module rigger.utils {
    export class Utils {

        constructor() {
        }

        /**
         * 截取数字的整数部分，直接丢弃其小数部分
         * @param v 
         */
        public static trunc(v: number): number {
            if ((<any>Math).trunc) return (<any>Math).trunc(v);

            v = +v;
            return (v - v % 1) || (!isFinite(v) || v === 0 ? v : v < 0 ? -0 : 0);
        }

        /**
         * 将一个64位整型转换成一个int型数组(高低位分离)
         * @public
         * @static
         * @method resoleInt64
         * @param {number} int64 需要转换的64位整型
         * @return {number[]} 一个包含两个32位整型的数组
         */
        public static resoleInt64(int64: number): number[] {
            var s = 2 ** 32;
            var r = int64 % s;
            var d = (int64 - r) / s;
            return [d, r];
        }

        /**
         * 将一个int数据组(高低位)转成一个long型
         * @public
         * @static
         * @method combineInt64
         * @param {number[]} ints 一个包含两个32位整型的数组
         * 
         */
        public static combineInt64(ints: number[]) {
            var s = 2 ** 32;
            return ints[0] * s + ints[1];
        }

        public static transferArrayBuffer(oldBuffer: ArrayBuffer, newByteLength: number): ArrayBuffer {
            if ((<any>ArrayBuffer).transfer) {
                return (<any>ArrayBuffer).transfer(oldBuffer, newByteLength);
            }

            oldBuffer = Object(oldBuffer);
            let dest: ArrayBuffer = new ArrayBuffer(newByteLength);
            // 是否分配内存失败
            if (!(dest instanceof ArrayBuffer)) {
                throw new TypeError("Source and destination must be ArrayBuffer instances");
            }
            Utils.copyArrayBuffer(oldBuffer, 0, dest, 0, oldBuffer.byteLength)
            return dest;
        }

        /**
         * 复制ArrayBuffer
         * @param source 
         * @param sourceStartByte 
         * @param dest 
         * @param destStartByte 
         * @param copyBytes 
         */
        public static copyArrayBuffer(source: ArrayBuffer, sourceStartByte: number, dest: ArrayBuffer, destStartByte: number, copyBytes: number, considerTraint: boolean = true) {
            if (dest.byteLength - destStartByte >= copyBytes) {
                let wordSizes: number[] = [8, 4, 2, 1];
                let leftBytes: number = copyBytes;
                let ViewClass: any = Uint8Array;
                let wordSize: number = 1;
                for (let i: number = 0; i < wordSizes.length; ++i) {
                    wordSize = wordSizes[i];
                    if (leftBytes >= wordSize) {
                        switch (wordSize) {
                            // 同时要检查对齐
                            case 8:
                                if (sourceStartByte % 8 == 0 && destStartByte % 8 == 0) {
                                    ViewClass = Float64Array
                                }
                                break;
                            case 4:
                                if (sourceStartByte % 4 == 0 && destStartByte % 4 == 0) {
                                    ViewClass = Float32Array
                                }
                                break;
                            case 2:
                                if (sourceStartByte % 2 == 0 && destStartByte % 2 == 0) {
                                    ViewClass = Uint16Array
                                }
                                break;
                            case 1:
                                ViewClass = Uint8Array;
                                break;
                            default:
                                ViewClass = Uint8Array;
                                break;
                        }

                        let viewSource = new ViewClass(source, sourceStartByte, Utils.trunc(leftBytes / wordSize));
                        let viewDest = new ViewClass(dest, destStartByte, viewSource.length);
                        for (let i: number = 0; i < viewSource.length; ++i) {
                            viewDest[i] = viewSource[i];
                        }

                        leftBytes -= viewSource.byteLength;
                        sourceStartByte += viewSource.byteLength;
                        destStartByte += viewSource.byteLength;
                    }
                }

            }
            else {
                throw new Error("Dest ArrayBuffer space not enough!");
            }
        }


        /**
         * 从数组中移除某一个元素
         * @public
         * @static
         * @method removeFromArray
         * @param {any[]} arr 需要操作的数组
         * @param {any} ele 需要移除的元素
         * @return {any[]} 移除元素后的新数组
         */
        public static removeFromArray(arr: any[], ele: any): any[] {
            var idx: number = arr.indexOf(ele);
            if (idx >= 0) {
                return Utils.removeAtFromArray(arr, idx);
            }

            return arr;
        }

        /**
         * 从数组查找并返回符合条件的第一个元素的索引，只返回最先查找到的满足条件的元素的索引,如果没找到则返回-1
         * @param arr 要查找的数组
         * @param conditionFun 过滤条件函数,当返回true时，则返回，否则继续查找,该函数第一个参数是数组的元素，第二个参数是当前元素的索引，第三个参数是数组本身
         * @param startIndex 开始查找的索引
         */
        public static findIndexFromArray<T>(arr: T[], conditionFun: (ele: T, idx?: number, arr?: T[]) => boolean, startIndex: number = 0): number {
            if (startIndex >= arr.length) {
                return -1;
            }

            for (; startIndex < arr.length; ++startIndex) {
                if (conditionFun(arr[startIndex], startIndex, arr)) {
                    return startIndex;
                }
            }

            return -1;
        }



        /**
         * 从数组中移除指定位置的元素
         */
        public static removeAtFromArray(arr: Array<any>, idx: number) {
            arr.splice(idx, 1);
            return arr;
        }




        public static stackTrace(count: number = 10) {
            var i = 0;
            var fun = arguments.callee;
            console.log("***----------------------------------------** " + (i + 1));
            while (fun && i < count) {
                fun = fun.arguments.callee.caller;
                console.log(fun);
                i++;
                console.log("***---------------------------------------- ** " + (i + 1));
            }
        }

        /**
         * 随机:[min, max]
         */
        public static random(min: number, max: number) {
            var range: number = max - min;
            var rand = Math.random();
            return min + Math.round(rand * range);
        }




        /** 保留n位小数，不四舍五入，9.8 -> 9.80 */
        private static toFixed(val: number, decimalNum: number) {
            if (decimalNum == 0) return val.toString();
            let s = val.toFixed(decimalNum + 1);
            return s.substr(0, s.length - 1);
        }



        /** 取数字文本,向下取整，789 -> 78.9, 4567 -> "456" */
        private static getValStrMax3(val: number) {
            let val2 = val % 10;
            let val1 = Math.floor(val / 10);
            if (val1 >= 100) return val1.toString();
            else return val1 + "." + val2;
        }



        public static getQueryString(name): string {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            // var r = "?openid=xxxx&openkey=yyyyyy&platform=1".substr(1).match(reg);

            if (r != null) {
                return r[2];
            }
            return null;
        }


        /**
         * 判断参数是否是一个字符串
         */
        public static isString(str): str is string {
            return typeof str === "string";
        }

        /**
         * 是否是数组
         */
        public static isArray(arr: any): arr is Array<any> {
            return arr instanceof Array;
        }


        /**
         * 检查是否为空或未定义
         */
        public static isNullOrUndefined(obj: any) {
            return obj === null || obj === undefined;
        }

        /**
         * 字符串是否为空或空串
         */
        public static isNullOrEmpty(str: string): boolean {
            return utils.Utils.isNullOrUndefined(str) || str.length <= 0;
        }

        /**
         * 判断值是否是一个数字(而不管是否可以转化成一个数字)
         * @param {any} value 
         */
        public static isNumber(value: any): value is number {
            if (Utils.isNullOrUndefined(value)) return false;
            if (Utils.isString(value)) return false;
            return !isNaN(value);
        }

        /**
         * 判断一人数字是否是整数
         * @param {number} num 需要进行判断的数字
         */
        public static isInteger(num: number): boolean {
            return 0 === num % 1;
        }

        /**
         * 判断是不是一个有效的资源url对象
         * 
         */
        public static isAssetsUrlObject(url: Object): url is { url: string, type: any } {
            return url.hasOwnProperty("url") && url.hasOwnProperty("type");
            // return url["url"] && url["type"];
        }

        /**
         * 从数组中获取ID为指定值的对象
         * @param arr 
         * @param id
         */
        static getById(arr: { id: any }[], id: any): any {
            let idx: number = Utils.findIndexFromArray(arr, (ele, i, array) => {
                return ele.id === id;
            })
            if (idx < 0) return null;

            return arr[idx];
        }

        /**
         * 过滤掉JSON文本中的注释
         * @param json 
         */
        static filterCommentsInJson(json: string): string {
            return json.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
        }

        /**
         * 生成服务名
         * @param name 
         */
        // static makeServiceName(name:string):string{
        //     return `$${name}`;
        // }

    }
}
