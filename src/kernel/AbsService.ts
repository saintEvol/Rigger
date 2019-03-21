/**
* name 
*/
module rigger.service {
	export abstract class AbsService implements IService, IExtendAble {
		constructor() {
		}

		/**
		 * 服务名
		 */
		public static serviceName: string = undefined;

		/**
		 * 获取应用
		 */
		getApplication<T extends BaseApplication>(): T {
			return this.application as T;
		}

		protected application: BaseApplication;
		/**
		 * 设置应用
		 * @param app 
		 */
		setApplication(app: BaseApplication): void {
			this.application = app;
			AbsService.setApplication(app);
		}

		protected static application: BaseApplication = null;
		static setApplication(app: BaseApplication): void {
			AbsService.application = app;
		}

		/**
		 * 获取正在运行的服务
		 * @param serviceName 
		 */
		public static getRunningService<T extends AbsService>(serviceName: string): T {
			return AbsService.application.getRunningService<T>(serviceName);
		}

		/**
		 * 启动服务
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @param {any[]} startupArgs 启动参数
		 * 
		 * @example resultHandler.runWith([true]) 启动成功
		 */
		start(resultHandler: RiggerHandler, serviceConfig: config.ServiceConfig, startupArgs?: any): void {
			this.mConfig = serviceConfig;
			// 启动插件
			this.startPlugins(new RiggerHandler(this, this.onAllPluginsStartComplete, [resultHandler, startupArgs]), 0, startupArgs);
		}




		/**
		 * 停止服务
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @example resultHandler.runWith([true]) 服务停用成功
		 */
		stop(resultHandler: RiggerHandler): void {
			this.stopPlugins(resultHandler);
			this.setApplication(null);
			this.clearMessages();
		}



		/**
		 * 启动服务
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @example resultHandler.runWith([true]) 重启
		 */
		reStart(resultHandler: RiggerHandler): void {
			this.onReStart(resultHandler);
		}

		protected messageListenerMap: {} = {};
		/**
		 * 订阅消息
		 * @param msg 
		 * @param caller 
		 * @param method 
		 * @param args 
		 */
		public onMessage(msg: string | number, caller: any, method: Function, ...args: any[]) {
			let mgr: rigger.utils.ListenerManager = this.messageListenerMap[msg];
			if (!mgr) {
				mgr = this.messageListenerMap[msg] = new rigger.utils.ListenerManager();
			}
			mgr.on(caller, method, args);
		}

		/**
		 * 取消消息的订阅
		 * @param msg 
		 * @param caller 
		 * @param method 
		 */
		public offMessage(msg: string | number, caller: any, method: Function) {
			let mgr: rigger.utils.ListenerManager = this.messageListenerMap[msg];
			if (mgr) {
				mgr.off(caller, method);
			}
		}

		/**
		 * 关闭指定消息中所有指定句柄的订阅
		 * @param msg 
		 * @param caller 
		 * @param method 
		 */
		public offAllMessages(msg: string | number, caller: any, method: Function) {
			let mgr: rigger.utils.ListenerManager = this.messageListenerMap[msg];
			if (mgr) {
				mgr.offAll(caller, method);
			}
		}

		/**
		 * 清除所有的消息订阅
		 */
		public clearMessages() {
			for (var key in this.messageListenerMap) {
				(<rigger.utils.ListenerManager>this.messageListenerMap[key]).clear();
				delete this.messageListenerMap[key];
			}

			this.messageListenerMap = {};
		}

		/**
		 * 派发消息
		 * @param msg 
		 * @param args 
		 */
		public dispatchMessage(msg: number | string, ...args: any[]) {
			let mgr: rigger.utils.ListenerManager = this.messageListenerMap[msg];
			if (mgr) {
				mgr.execute(...args);
			}
		}

		/**
		 * 服务被唤醒时的回调
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @param {any} startupArgs 启动参数
		 * 
		 * @example resultHandler.runWith([true]) 启动成功
		 */
		protected abstract onStart(resultHandler: RiggerHandler, startupArgs: any): void;

		/**
		 * 停止服务时的回调
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @example resultHandler.runWith([true]) 服务停用成功
		 */
		protected abstract onStop(resultHandler: RiggerHandler): void;

		/**
		 * 启动服务时的回调
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @example resultHandler.runWith([true]) 重启
		 */
		protected abstract onReStart(resultHandler: RiggerHandler): void;


		private extendedMethodMap: {};
		/**
		 * 
		 * @param methodName 
		 */
		extendMethod(methodName: string): void {
			// 初始化对象的可扩展方法映射表
			let map: {} = this.extendedMethodMap;
			if (!map) map = this.extendedMethodMap = {};
			if (!map[methodName]) map[methodName] = { prefixPlugins: [], suffixPlugins: [] };
		}

		/**
		 * 
		 * @param methodName 
		 * @param args 
		 */
		executeMethodPrefixExtension(methodName: string, args: any[]): any {
			// 获取所有的前置插件
			let pluginInfo: rigger.IMethodPluginInfo = this.extendedMethodMap[methodName];
			let plugins: any = pluginInfo.prefixPlugins;
			// 执行插件                      			
			return this.executeMethodExtension(plugins, methodName, args);
		}

		/**
		 * 
		 * @param methodName 
		 * @param args 
		 * @param initResult 
		 */
		executeMethodSuffixExtension(methodName: string, args: any[], initResult: any): any {
			// 获取所有的后置插件
			let pluginInfo: rigger.IMethodPluginInfo = this.extendedMethodMap[methodName];
			let plugins: any = pluginInfo.suffixPlugins;
			// 执行
			return this.executeMethodExtension(plugins, methodName, args, initResult);
		}

		hasAnyPlugins(methodName: string): boolean {
			return this.extendedMethodMap[methodName] && (this.extendedMethodMap[methodName].prefixPlugins.length > 0 || this.extendedMethodMap[methodName].suffixPlugins.length > 0);
		}




		/**
		 * 是否就绪的标志位
		 */
		protected readyFlag: boolean = false;
		/**
		 * 服务是否就绪
		 */
		isReady(): boolean {
			return this.readyFlag;
		}

		/**
		 * 服务状态
		 */
		private _serviceStatus: ServiceStatus = ServiceStatus.Starting;
		/**
		 * 设置服务状态
		 * @param status 
		 */
		setServiceStatus(status: ServiceStatus): ServiceStatus {
			return this._serviceStatus = status;
		}

		/**
		 * 获取服务状态
		 */
		getServiceStatus(): ServiceStatus {
			return this._serviceStatus;
		}

		/**
		 * 服务的配置
		 */
		public get config(): config.ServiceConfig {
			return this.mConfig;
		}
		protected mConfig: config.ServiceConfig;

		/**
		 * 获取服务的配置
		 */
		public getConfig<T extends rigger.config.ServiceConfig>(): T {
			return this.mConfig as T;
		}

		/**
		 * 启动服务依赖的所有插件
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @param {any} startupArgs 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * 
		 * @example resultHandler.runWith([true]) 启动成功
		 */
		private startPlugins(resultHandler: RiggerHandler, index: number, startupArgs: any) {
			if (!this.mConfig) return resultHandler.success();
			let infos: config.DependentComponentInfo[] = this.mConfig.plugins;
			if (!infos) return resultHandler.success();
			if (index >= infos.length) return resultHandler.success();
			let pluginClass: any = this.makePluginClass(infos[index].fullName);
			let inst: IPlugin = new pluginClass();
			inst.setOwner(this);
			inst.start(new RiggerHandler(this, this.onPluginStartComplete, [resultHandler, index + 1, startupArgs, inst]), startupArgs)

		}

		protected plugins: IPlugin[] = [];
		/**
		 * 单个插件启动成功
		 * @param resultHandler 
		 * @param index 
		 * @param startupArgs 
		 * @param retCode 
		 */
		private onPluginStartComplete(resultHandler: RiggerHandler, index: number, startupArgs: any, plugin: IPlugin, retCode: number) {
			if (0 === retCode) {
				this.plugins.push(plugin);
				this.addPluginToMap(plugin);
				this.startPlugins(resultHandler, index, startupArgs);
			}
			else {
				throw new Error("failed to start plugin!");
			}
		}

		/**
		 * 所有的插件都启动成功了
		 * @param resultHandler 
		 * @param startupArgs 
		 */
		private onAllPluginsStartComplete(resultHandler: RiggerHandler, startupArgs: any) {
			this.onStart(resultHandler, startupArgs);
		}

		private stopPlugins(resultHandler: RiggerHandler): void {
			if (this.plugins.length <= 0) {
				delete this.extendedMethodMap;
				this.onAllPluginsStopComplete(resultHandler);
				return;
			}
			let plugin: IPlugin = this.plugins.pop();
			plugin.stop(new RiggerHandler(this, this.onPluginStopComplete, [plugin, resultHandler]));
		}

		private onPluginStopComplete(plugin: IPlugin, resultHandler: RiggerHandler, retCode: number) {
			plugin.setOwner(null);
			if (0 !== retCode) {
				console.log(`error when stop plugin, error code:${retCode}`);
			}

			this.stopPlugins(resultHandler);
		}

		/**
		 * 所有插件都停止了
		 * @param resultHandler 
		 */
		private onAllPluginsStopComplete(resultHandler: RiggerHandler): void {
			this.onStop(resultHandler);
		}

		private addPluginToMap(plugin: IPlugin) {
			//获取所有的扩展方法集
			let map: {} = this.extendedMethodMap;
			if (!map) return;
			let info: IMethodPluginInfo;
			for (var key in map) {
				if (map.hasOwnProperty(key) && typeof this[key] === "function" && typeof plugin[key] === "function") {
					info = map[key];
					if (PluginMode.Prefix === plugin.getPluginMode()) {
						info.prefixPlugins.push(plugin);
					}
					else {
						info.suffixPlugins.push(plugin);
					}
				}

			}
		}



		private executeMethodExtension(extensions: IPlugin[], methodName: string, args: any[], initRet: any = null): any {
			let plugin: IPlugin;
			for (var i: number = 0; i < extensions.length; ++i) {
				plugin = extensions[i];
				initRet = plugin[methodName].apply(plugin, args.concat([initRet]));
			}

			return initRet;
		}

		private makePluginClass(fullName: string): any {
			// 优先从注册信息中查找
			if (BaseApplication.pluginFullNameDefinitionMap && BaseApplication.pluginFullNameDefinitionMap[fullName]) return BaseApplication.pluginFullNameDefinitionMap[fullName];
			// 动态计算
			return eval(fullName);
		}
	}
}