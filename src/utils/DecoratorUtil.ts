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
        public static retrievAble(v?: number) :(target: any, keyStr: string) => void{
            return DecoratorUtil.retrievAble(v);
        }

        /**
         * 反向映射装饰器,即以字段的值为键，以字段的键为值建立一个新的字段，只推荐常量用
         */
        public static retrievable(v?: number){
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

        /**
         * 类装饰器
         * 对服务或插件进行注册,此接口主要用于无法动态使用eval函数根据全名获取其类定义的情形
         * 使用此装饰器进行注册时，类应该至少定义了有效的"pluginName"或"serviceName"静态成员之一
         * @param ct 
         * @throws 如果被装饰的类中没有定义有效的"pluginName"或"serviceName"静态成员之一,会抛出错误
         * @example @register export default class TestPlugin {}
         */
        public static register(ct: Function){
            // 检查是否就可注册插件
            if(!Utils.isNullOrEmpty(ct["pluginName"])){
                BaseApplication.pluginFullNameDefinitionMap[ct["pluginName"]] = ct;
            }
            else{
                // 是否是可注册服务
                if(!Utils.isNullOrEmpty(ct["serviceName"])){
                    BaseApplication.serviceFullNameDefinitionMap[ct["serviceName"]] = ct;
                }
                else{
                    // 都不是，报错
                    throw new Error("not a registable service or plugin, please check, constructor:" + ct) ;
                }
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
