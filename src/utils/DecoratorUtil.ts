/**
 * Decorator
 */
module rigger.utils {
    export class DecoratorUtil {
        constructor(parameters) {

        }

        /**
         * 反向映射装饰器,即以字段的值为键，以字段的键为值建立一个新的字段，只推荐常量用
         */
        public static retrievAble(v?: number) {
            return function (target: any, keyStr: string) {
                // console.log(`key str:${keyStr}, v:${v}`);
                v = v || target[keyStr];
                target[v] = keyStr;
            }
        }

        /**
         * 替换服务
         * @param oldServiceName 被替换的服务名 
         */
        public static replaceService(oldServiceName:string){
            return function(ctor:any, attrName:string){
                rigger.BaseApplication.replacedServiceMap[oldServiceName] = ctor;
            }
        }

        private static extendableMethodMapKey:string = "_$extendableMethodMapKey"
        public static makeExtendable(beReplacable:boolean = false){
            return DecoratorUtil.makeExtenasionMethod(beReplacable);
        }

        private static makeExtenasionMethod(replace: boolean):Function{
            return (target: IExtendAble, methodName: string, value: any) => {
                // 扩展对象的方法
                target.extendMethod(methodName);

                // 扩展方法
                return {
                    value: function (...args: any[]) {
                        // 执行前置插件
                        let obj: IExtendAble = this;
                        let preRet:any = obj.executeMethodPrefixExtension(methodName, args);

                        // 执行原方法
                        let tempRet: any;
                        if (replace && obj.hasAnyPlugins(methodName)) { 
                            tempRet = preRet;
                        } else { 
                            tempRet = value.value.apply(this, args); 
                        }

                        // 执行后置插件
                        return obj.executeMethodSuffixExtension(methodName, args, tempRet);
                    }
                }
            }
        }

        /**
         * 将方法申明为可扩展的（可以被插件扩展)
         * @param target 被扩展方法所在对象
         * @param methodName 被扩展的方法
         * @param value 属性描述符
         */
        private static doExtend(target:IExtendAble, methodName:string, value:any){
            
        }
    }
}
