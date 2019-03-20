/**
* 服务插件的抽象基类
* 服务插件默认为后置插件
*/
module rigger {
	export abstract class AbsServicePlugin implements IPlugin {
		constructor() {
		}

		/**
		 * 开始插件（添加插件时调用)
		 */
		start(resultHandler: RiggerHandler, startupArgs: any): void {
			this.onStart(resultHandler, startupArgs);
		}

		/**
		 * 停止插件（卸载插件时调用)
		 */
		stop(resultHandler: RiggerHandler): void {
			this.onStop(resultHandler);
		}

		reStart(resultHandler: RiggerHandler) {
			this.onRestart(resultHandler);
		}

		protected owner: rigger.service.IService;
		/**
		 * 设置插件所有者
		 */
		setOwner(owner: rigger.service.IService) {
			this.owner = owner;
		}

		/**
		 * 获取插件所有者
		 */
		getOwner<T extends service.IService>(): T {
			return this.owner as T;
		}

		/**
		 * 获取插件模式（前置或后置）
		 */
		getPluginMode(): PluginMode {
			return this.pluginMode;
		}

		/**
		 * 插件模式
		 */
		protected pluginMode: PluginMode = PluginMode.Suffix;

		/**
		 * 插件开始时的回调 
		 * @param resultHandler 
		 * @param startupArgs 
		 */
		protected abstract onStart(resultHandler: RiggerHandler, startupArgs: any[]): void;

		/**
		 * 插件停止时的回调 
		 * @param resultHandler 
		 */
		protected abstract onStop(resultHandler: RiggerHandler): void;

		/**
		 * 插件重启时的回调
		 * @param resultHandler 
		 */
		protected abstract onRestart(resultHandler: RiggerHandler): void;




	}
}