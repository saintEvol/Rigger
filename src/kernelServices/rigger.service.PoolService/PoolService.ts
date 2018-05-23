/**
* name 
*/
module rigger.service{
	export class PoolService extends AbsService{
		constructor(){
			super();
			this.objectPool = {};
		}

		/**
		 * 服务名
		 */
		public static serviceName:string = "rigger.service.PoolService";

		public static get instance():PoolService{
			return PoolService.getRunningService<PoolService>(PoolService.serviceName);
		}

		/**
         * 根据对象类型标识字符，获取对象池。
         * @param sign 对象类型标识字符。
         * @return 对象池。
         */
        static getPoolBySign(sign: string): Array<any>{ 
			return PoolService.instance.getPoolBySign(sign);
		}

        /**
         * 清除对象池的对象。
         * @param sign 对象类型标识字符。
         */
        static clearBySign(sign: string): void{
			PoolService.instance.clearBySign(sign);			
		}
		
        /**
         * 将对象放到对应类型标识的对象池中。
         * @param sign 对象类型标识字符。
         * @param item 对象。
         */
        static recover(sign: string, item: any): void{ 
			PoolService.instance.recover(sign, item);						
		}
		
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则根据传入的类型，创建一个新的对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param cls 用于创建该类型对象的类。
         * @return 此类型标识的一个对象。
         */
        static getItemByClass<T>(sign: string, cls: any): T{ 
			return PoolService.instance.getItemByClass<T>(sign, cls);						
			
		}

        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则使用传入的创建此类型对象的函数，新建一个对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param createFun 用于创建该类型对象的方法。
         * @return 此类型标识的一个对象。
         */
        static getItemByCreateFun<T>(sign: string, createFun: Function): T{ 
			return PoolService.instance.getItemByCreateFun<T>(sign, createFun);									
		}

        /**
         * 根据传入的对象类型标识字符，获取对象池中已存储的此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         * @param sign 对象类型标识字符。
         * @return 对象池中此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         */
        static getItem<T>(sign: string): T{
			return PoolService.instance.getItem<T>(sign);												
		}

		protected objectPool:{} = {};
		/**
         * 根据对象类型标识字符，获取对象池。
         * @param sign 对象类型标识字符。
         * @return 对象池。
         */
        getPoolBySign(sign: string): Array<any>{
			let arr:any[] = this.objectPool[sign];
			if(!arr) {
				this.objectPool[sign] = arr = [];

			}
			return arr;
		}

        /**
         * 清除对象池的对象。
         * @param sign 对象类型标识字符。
         */
        clearBySign(sign: string): void{
			delete this.objectPool[sign];
		}
        /**
         * 将对象放到对应类型标识的对象池中。
         * @param sign 对象类型标识字符。
         * @param item 对象。
         */
        recover(sign: string, item: any): void{
			let old:any[] = this.getPoolBySign(sign);
			old.push(item);
			
		}
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则根据传入的类型，创建一个新的对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param cls 用于创建该类型对象的类。
         * @return 此类型标识的一个对象。
         */
        getItemByClass<T>(sign: string, cls: any): T{
			let obj:T = this.getItem<T>(sign);
			if(obj) return obj;
			return new cls();
		}
        /**
         * <p>根据传入的对象类型标识字符，获取对象池中此类型标识的一个对象实例。</p>
         * <p>当对象池中无此类型标识的对象时，则使用传入的创建此类型对象的函数，新建一个对象返回。</p>
         * @param sign 对象类型标识字符。
         * @param createFun 用于创建该类型对象的方法。
         * @return 此类型标识的一个对象。
         */
        getItemByCreateFun<T>(sign: string, createFun: Function): T{
			let obj:T = this.getItem<T>(sign);
			if(obj) return obj;
			return createFun();
		}
        /**
         * 根据传入的对象类型标识字符，获取对象池中已存储的此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         * @param sign 对象类型标识字符。
         * @return 对象池中此类型的一个对象，如果对象池中无此类型的对象，则返回 null 。
         */
        getItem<T>(sign: string): T{
			let pool:T[] = this.getPoolBySign(sign);
			if(pool.length <= 0) return null;
			return pool.pop();
		}



		/**
		 * 服务被唤醒时的回调
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @param {any[]} startupArgs 启动参数
		 * 
		 * @example resultHandler.runWith([true]) 启动成功
		 */
		protected onStart(resultHandler:RiggerHandler, startupArgs:any[]):void{
			this.objectPool = {};
			resultHandler.success();
		}

		/**
		 * 停止服务时的回调
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @example resultHandler.runWith([true]) 服务停用成功
		 */
		protected onStop(resultHandler:RiggerHandler):void{
			this.objectPool = null;			
			resultHandler.success();
		}

		/**
		 * 启动服务时的回调
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @example resultHandler.runWith([true]) 重启
		 */
		protected onReStart(resultHandler:RiggerHandler):void{
			this.objectPool = {};			
			resultHandler.success();
		}
	}
}