/**
* 核心服务
*/
module rigger.service{
	export class KernelService extends service.AbsService{
		constructor(){
			super();
		}

		/**
		 * 服务名
		 */
		public static serviceName:string = "rigger.service.KernelService";

		/**
		 * 服务启动时的回调
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @param {any[]} startupArgs 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * 
		 * @example resultHandler.runWith([true]) 启动成功
		 */
		protected onStart(resultHandler:RiggerHandler, startupArgs:any[]):void{
			resultHandler.success();

		}

		/**
		 * 停止服务时的回调
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @example resultHandler.runWith([true]) 服务停用成功
		 */
		protected onStop(resultHandler:RiggerHandler):void{
			resultHandler.success();			
		}
		
		/**
		 * 启动服务时的回调
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @example resultHandler.runWith([true]) 重启
		 */
		protected onReStart(resultHandler:RiggerHandler):void{
			resultHandler.success();			
		}

	}
}