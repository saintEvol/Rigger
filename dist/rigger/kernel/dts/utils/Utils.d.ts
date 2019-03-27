/**
 * Utils
 */
declare module rigger.utils {
    class Utils {
        constructor();
        /**
         * 从数组中移除某一个元素
         * @public
         * @static
         * @method removeFromArray
         * @param {any[]} arr 需要操作的数组
         * @param {any} ele 需要移除的元素
         * @return {any[]} 移除元素后的新数组
         */
        static removeFromArray(arr: any[], ele: any): any[];
        /**
         * 从数组查找并返回符合条件的第一个元素的索引，只返回最先查找到的满足条件的元素的索引,如果没找到则返回-1
         * @param arr 要查找的数组
         * @param conditionFun 过滤条件函数,当返回true时，则返回，否则继续查找,该函数第一个参数是数组的元素，第二个参数是当前元素的索引，第三个参数是数组本身
         * @param startIndex 开始查找的索引
         */
        static findIndexFromArray<T>(arr: T[], conditionFun: (ele: T, idx?: number, arr?: T[]) => boolean, startIndex?: number): number;
        /**
         * 从数组中移除指定位置的元素
         */
        static removeAtFromArray(arr: Array<any>, idx: number): any[];
        static stackTrace(count?: number): void;
        /**
         * 随机:[min, max]
         */
        static random(min: number, max: number): number;
        /** 保留n位小数，不四舍五入，9.8 -> 9.80 */
        private static toFixed;
        /** 取数字文本,向下取整，789 -> 78.9, 4567 -> "456" */
        private static getValStrMax3;
        static getQueryString(name: any): string;
        /**
         * 判断参数是否是一个字符串
         */
        static isString(str: any): str is string;
        /**
         * 是否是数组
         */
        static isArray(arr: any): arr is Array<any>;
        /**
         * 检查是否为空或未定义
         */
        static isNullOrUndefined(obj: any): boolean;
        /**
         * 字符串是否为空或空串
         */
        static isNullOrEmpty(str: string): boolean;
        /**
         * 判断值是否是一个数字(而不管是否可以转化成一个数字)
         * @param {any} value
         */
        static isNumber(value: any): boolean;
        /**
         * 判断一人数字是否是整数
         * @param {number} num 需要进行判断的数字
         */
        static isInteger(num: number): boolean;
        /**
         * 判断是不是一个有效的资源url对象
         */
        static isAssetsUrlObject(url: Object): url is {
            url: string;
            type: any;
        };
        /**
         * 从数组中获取ID为指定值的对象
         * @param arr
         * @param id
         */
        static getById(arr: {
            id: any;
        }[], id: any): any;
        /**
         * 过滤掉JSON文本中的注释
         * @param json
         */
        static filterCommentsInJson(json: string): string;
    }
}
