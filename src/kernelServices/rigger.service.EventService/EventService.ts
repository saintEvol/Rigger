/**
 * 事件服务
 */
module rigger.service {
	export class EventService extends AbsService {
		constructor() {
			super();
			this._handlerMap = {};

		}

		/**
		 * 服务名
		 */
		public static serviceName: string = "rigger.service.EventService";

		public static get instance():EventService{
			return EventService.getRunningService<EventService>(EventService.serviceName);
		}

		/**
		 * 服务启动时的回调
		 * @param {RiggerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @param {any[]} startupArgs 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * 
		 * @example resultHandler.runWith([true]) 启动成功
		 */
		protected onStart(resultHandler:RiggerHandler, startupArgs?:any):void{
			resultHandler.success();

		}

		/**
		 * 停止服务时的回调
		 * @param {RiggerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @example resultHandler.runWith([true]) 服务停用成功
		 */
		protected onStop(resultHandler:RiggerHandler):void{
			this._handlerMap = null;			
			resultHandler.success();			
		}
		
		/**
		 * 启动服务时的回调
		 * @param {RiggerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @example resultHandler.runWith([true]) 重启
		 */
		protected onReStart(resultHandler:RiggerHandler):void{
			resultHandler.success();			
		}

		private HANDLER_FIELD_TYPE_CALLER = 1;
		private HANDLER_FIELD_TYPE_HANDLER = 2;
		private HANDLER_FIELD_TYPE_INSTANCE = 3;

		// public addProtocolListener(protocolId: number, caller: any, handler: GameEventHandler) {
		// 	this.addEventListener(protocolId, NetworkManager.instance, caller, handler);
		// }

		// public removeProtocolListener(protocolId: number, caller: any, handler: GameEventHandler) {
		// 	this.removeEventListener(protocolId, NetworkManager.instance, caller, handler);
		// }

		/**
		 * 注册事件监听
		 */
		public addEventListener(eventName: string | number, obj: any = null, caller: any, handler: Function) {
			try {
				var oldHandlers: Array<{}> = this._handlerMap[eventName];
				if (oldHandlers) {
					oldHandlers.push({ 1: caller, 2: handler, 3: obj });
				}
				else {
					this._handlerMap[eventName] = [{ 1: caller, 2: handler, 3: obj }];
				}
			} catch (error) {
				console.log("error when add event listener:" + error);
				console.log(error.stack);

			}

		}

		/**
		 * 移除事件监听
		 */
		public removeEventListener(eventName: any, obj: any, caller: any, handler: Function) {
			var hadHandlers: Array<{}> = this._handlerMap[eventName];
			var newHandlers: Array<{}> = [];
			if (hadHandlers) {
				for (var index = 0; index < hadHandlers.length; index++) {
					if (obj != hadHandlers[index][3] || caller != hadHandlers[index][1] || handler != hadHandlers[index][2]) {
						newHandlers.push(hadHandlers[index]);
					}
				}

				this._handlerMap[eventName] = newHandlers;
			}
		}

		/**
		 * 派发事件注册了的事件将被触发
		 */
		public dispatchEvent(eventName: string | number, obj: any = null, ...data: any[]) {
			var hadHandlers: Array<{}> = this._handlerMap[eventName];
			if (!hadHandlers) {
				return;
			}

			var fun: Function;
			for (var index = 0; index < hadHandlers.length; index++) {
				// 检查是不是监听的实例
				if (obj != hadHandlers[index][3]) {
					continue;
				}

				// 遍历回调列表
				fun = hadHandlers[index][2];
				try {
					fun.apply(hadHandlers[index][1], data);					
					// if (!data) {
					// 	fun.apply(hadHandlers[index][1]);
					// }
					// else {
					// 	fun.apply(hadHandlers[index][1], [data]);
					// }
				} catch (error) {

					console.log("error when dispatchEvent, EventName:" + eventName + ",Error:" + error);
					// Utils.stackTrace();
					console.log(error.stack);


				}
			}

		}

		/**
		 * 事件名与其对应的回调句柄的映射,以事件名为键，
		 * 回调结构{HANDLER_FIELD_TYPE_CALLER:caller, HANDLER_FIELD_TYPE_HANDLER:handler, HANDLER_FIELD_TYPE_INSTANCE:instance}
		 */
		private _handlerMap: Object;
	}
}