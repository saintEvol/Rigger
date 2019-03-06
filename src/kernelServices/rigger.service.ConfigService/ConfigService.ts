/**
* name 
*/
module rigger.service {
	export class ConfigInfo {
		constructor() {
			this.status = ConfigStaus.None;
			// this.handlers = [];
			this.data = null;
			// this.url = null;
		}

		/**
		 * 配置的当前状态
		 */
		public status: ConfigStaus;

		/**
		 * 配置获取成功后需要回调的句柄列表
		 */
		// public handlers: RiggerHandler[];

		/**
		 * 配置资源，如果加载成功，该字段会被初始化
		 */
		public data: config.ServiceConfig;

		/**
		 * 配置文件的URL地址
		 */
		// public url: string;
	}

	export enum ConfigStaus {
		None = 1,
		Loading = 2,
		Ready = 3,
	}

	export abstract class ConfigService extends service.AbsService {
		constructor() {
			super();
		}

		/**
		 * 启动服务
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @param {any[]} startupArgs 启动参数
		 * 
		 * @example resultHandler.runWith([true]) 启动成功
		 */
		start(resultHandler: RiggerHandler, serviceConfig: config.ServiceConfig, ...startupArgs: any[]): void {
			this.initApplicationConfig(resultHandler, serviceConfig, startupArgs);
		}

		/**
		 * 服务名
		 */
		public static serviceName: string = "rigger.service.ConfigService";

		/**
		 * 服务启动时的回调
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @param {any[]} startupArgs 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * 
		 * @example resultHandler.runWith([true]) 启动成功
		 */
		protected onStart(resultHandler: RiggerHandler, startupArgs: any[]): void {
			resultHandler.success();
			// 初始化应用的配置
			// if(!this.applicationConfig) {
			// 	this.applicationConfigHandlers.push(new rigger.RiggerHandler(this, this.onApplicationConfigInit, [resultHandler]));								
			// 	this.loadApplicationConfig();			
			// }
		}

		/**
		 * 停止服务时的回调
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务启动成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @example resultHandler.runWith([true]) 服务停用成功
		 */
		protected onStop(resultHandler: RiggerHandler): void {
			resultHandler.success();
		}

		/**
		 * 启动服务时的回调
		 * @param {ServerHandler} resultHandler 由服务启动者传递的一个回调句柄，当服务重启成功时，服务提供者应该以"true"参数回调，否则以"false"参数回调
		 * @example resultHandler.runWith([true]) 重启
		 */
		protected onReStart(resultHandler: RiggerHandler): void {
			resultHandler.success();
		}

		/**
		 * 获取应用的配置
		 * @param cb 获取到配置后，会以配置数据作为第一个附加参数回调句柄
		 */
		public getApplicationConfig(cb: RiggerHandler) {
			if (this.applicationConfig) return cb.runWith([this.applicationConfig]);
			this.applicationConfigHandlers.push(cb);

			this.loadConfig(this.makeApplicationConfigUrl(), this, this.onApplicationConfigLoad);
		}


		private _serviceConfigMap: {} = {};
		/**
		 * 获取服务配置
		 * @param serviceName 
		 */
		public getServiceConfig(serviceName: string): config.ServiceConfig {
			let configInfo: ConfigInfo = this.getServiceConfigInfo(serviceName);
			if (configInfo && configInfo.status === ConfigStaus.Ready) return configInfo.data;
			return null;
		}

		// protected loadServiceConfig(serviceName: string) {
		// 	this.loadConfig(this.makeServiceConfigUrl(serviceName), this, this.onServiceConfigLoad, [serviceName]);
		// }
		/**
		 * 服务配置加载完成
		 * @param serviceName 
		 * @param data 
		 */
		// protected onServiceConfigLoad(serviceName: string, data: string) {
		// 	data = utils.Utils.filterCommentsInJson(data);
		// 	let configInfo: ConfigInfo = this.getServiceConfigInfo(serviceName);
		// 	configInfo.data = utils.Utils.isNullOrEmpty(data) ? new config.ServiceConfig() : JSON.parse(data);
		// 	configInfo.status = ConfigStaus.Ready;
		// 	let cbs: RiggerHandler[] = configInfo.handlers;
		// 	if (!cbs) return;

		// 	configInfo.handlers = [];
		// 	for (var i: number = 0; i < cbs.length; ++i) {
		// 		cbs[i].runWith([configInfo.data]);
		// 	}

		// }

		/**
		 * 加载配置
		 * @param url 应用的配置的路径，此路径相对于bin目录
		 * @param caller 加载完成后的回调域
		 * @param method 加载完成后的回调方法
		 * @param args 加载完成后的回调参数
		 */
		protected abstract loadConfig(url: string, caller: any, method: Function, args?: any): void;

		protected onApplicationConfigInit(startCb: RiggerHandler) {
			console.log("App Config Inited");

			startCb.success();
		}

		private applicationConfig: config.ApplicationConfig;
		private applicationConfigHandlers: RiggerHandler[] = [];
		// private applicationConfigUrl:string;
		private onApplicationConfigLoad(data: string | config.ApplicationConfig) {
			if (utils.Utils.isString(data)) {
				this.applicationConfig = JSON.parse(utils.Utils.filterCommentsInJson(data));
			}
			else{
				this.applicationConfig = data;
			}

			// 处理应用配置
			this.treateApplicationConfig();

			// 回调
			for (var i: number = 0; i < this.applicationConfigHandlers.length; ++i) {
				this.applicationConfigHandlers[i].runWith([this.applicationConfig]);
			}

			// 清除回调
			this.applicationConfigHandlers = [];
		}

		private treateApplicationConfig() {
			// 从应用配置中获取所有的服务配置
			this.initServiceConfigs();
		}

		private initServiceConfigs() {
			if (!this._serviceConfigMap) this._serviceConfigMap = {};

			let appConfig: config.ApplicationConfig = this.applicationConfig;
			let serviceArrOfArr: config.ServiceConfig[][] = appConfig.services;
			for (var i: number = 0; i < serviceArrOfArr.length; ++i) {
				for (var j: number = 0; j < serviceArrOfArr[i].length; ++j) {
					let serConfig: config.ServiceConfig = serviceArrOfArr[i][j];
					let configInfo: ConfigInfo = this.getServiceConfigInfo(serConfig.fullName);

					configInfo.data = serConfig;
					configInfo.status = ConfigStaus.Ready;
				}
			}
		}

		private getServiceConfigInfo(serviceName: string): ConfigInfo {
			let info: ConfigInfo = this._serviceConfigMap[serviceName];
			if (!info) {
				info = new ConfigInfo();
				this._serviceConfigMap[serviceName] = info;
			}
			return info;
		}

		// private setServiceConfigInfo(serviceName: string, info: ConfigInfo) {
		// 	this._serviceConfigMap[serviceName] = info;
		// }

		/**
		 * 初始化应用的配置
		 * @param resultHandler 
		 * @param serviceConfig 
		 * @param startupArgs 
		 */
		private initApplicationConfig(resultHandler: RiggerHandler, serviceConfig: config.ServiceConfig, ...startupArgs: any[]) {
			this.getApplicationConfig(new RiggerHandler(this, this.doStart, [resultHandler, serviceConfig, startupArgs]));
		}

		/**
		 * @plugin rigger.utils.DecoratorUtil.makeExtendable(true)   
		 * 生成应用的配置的路径
		 * 
		*/
		@rigger.utils.DecoratorUtil.makeExtendable(true)
		protected makeApplicationConfigUrl(): string {
			return `rigger/riggerConfigs/RiggerConfig.json?${Math.random()}`;
		}

		// @rigger.utils.DecoratorUtil.makeExtendable(true)
		// protected makeServiceConfigUrl(serviceName: string): string {
		// 	if (rigger.utils.Utils.isNullOrUndefined(serviceName) || rigger.utils.Utils.isNullOrEmpty(serviceName)) {
		// 		return null;
		// 	}

		// 	// let strArr:string[] = serviceName.split(".");
		// 	// if(strArr.length <= 0) return null;
		// 	// return `rigger/riggerConfigs/serviceConfigs/${strArr[strArr.length - 1]}Config.json?${Math.random()}`;
		// 	return `rigger/riggerConfigs/serviceConfigs/${serviceName}.json?${Math.random()}`;

		// }

		private doStart(resultHandler: RiggerHandler, serviceConfig: config.ServiceConfig, startupArgs: any[], cfg: config.ApplicationConfig) {
			this.getApplication().setConfig(cfg);
			super.start(resultHandler, serviceConfig, startupArgs);
		}

	}
}