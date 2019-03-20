/**
* name 
*/
module rigger {
	export enum ServiceStatus {
		/**
		 * 启动中
		 */
		Starting = 1,

		/**
		 * 运行中
		 */
		Running = 2,
	}

	// export class ServiceInfo {
	// 	constructor() {
	// 	}


	// }

	export class BaseApplication implements IApplication {
		constructor() {

		}

		/**
		 * 应用的单例
		 */
		public static get instance(): BaseApplication {
			if (!BaseApplication.mInstance) BaseApplication.mInstance = new BaseApplication();
			return BaseApplication.mInstance;
		}
		protected static mInstance: BaseApplication;

		public static replacedServiceMap: {} = {};

		/**
		 * 服务全名与其定义的映射
		 */
		public static serviceFullNameDefinitionMap: {} = {};

		/**
		 * 
		 * @param resultHandler 
		 * @param config 应用配置
		 */
		public start(resultHandler: RiggerHandler, startUpArgs?: any): void {
			// 启动核心服务
			this.startKernelService(new RiggerHandler(this, this.onAllServicesReady, [resultHandler]), startUpArgs);
		}

		/**
		 * 停止应用
		 */
		public stop(): void {

		}

		protected applicationConfig: config.ApplicationConfig;
		/**
		 * 设置配置文件
		 */
		setConfig(cfg: config.ApplicationConfig): void {
			this.applicationConfig = cfg;
		}

		/**
		 * 获取配置文件
		 */
		getConfig<T extends config.ApplicationConfig>(): T {
			return this.applicationConfig as T;
		}

		/**
		 * 
		 * @param serviceCls 
		 * @param cb 
		 */
		public startService<T extends service.AbsService>(serviceCls: any, cb: RiggerHandler, config: config.ServiceConfig = null, startUpArgs?: any): boolean {
			// 检查是否已经注册过
			let serviceName: string = serviceCls.serviceName;
			let service: T = this.getService<T>(serviceName);

			// 服务是否在运行
			if (service) return service.getServiceStatus() === ServiceStatus.Running;

			// 服务还没注册,新建服务并注册
			service = new serviceCls();
			// 设置服务状态
			service.setServiceStatus(ServiceStatus.Starting);
			// 注册服务			
			this.registerService(serviceName, service);

			if (config) {
				this.startServiceWithConfig(serviceCls, service, cb, config, startUpArgs);
			}
			else {
				// 获取配置,为启动服务作准备
				let configService: service.ConfigService = this.getRunningService<service.ConfigService>(rigger.service.ConfigService.serviceName);
				if (configService) {
					let serConfig: config.ServiceConfig = configService.getServiceConfig(serviceName);
					this.startServiceWithConfig(serviceCls, service, cb, serConfig, startUpArgs);
					// if(serConfig){
					// 	this.startServiceWithConfig(serviceCls, service, cb, serConfig);
					// }
					// else{
					// 	throw new Error(`Can Not Get Service Config for ${serviceName}`);
					// }
					// configService.getServiceConfig(serviceName, new RiggerHandler(this, this.startServiceWithConfig, [serviceCls, service, cb]));
				}
				// 配置服务特殊处理
				else if (serviceName === rigger.service.ConfigService.serviceName || serviceName === this.newConfigServiceName) {
					this.startServiceWithConfig(serviceCls, service, cb, null, startUpArgs);
				}
				else {
					throw new Error("Non-kernel service should be start after ConfigService");
				}
			}

			return false;
		}

		/**
		 * 
		 * @param service 
		 * @param cb 
		 * @param config 
		 * @param startUpArgs?
		 */
		public startServiceWithConfig<T extends rigger.service.AbsService>(cls: any, ser: rigger.service.AbsService,
			cb: RiggerHandler, config: rigger.config.ServiceConfig, startUpArgs?: any) {
			if (config) {
				if (!utils.Utils.isNullOrEmpty(config.fullName)) {
					cls.serviceName = config.fullName;
				}
				else {
					config.fullName = cls.serviceName;
				}
			}

			let deps: rigger.config.ServiceConfig[] = config ? config.services : [];
			if (deps && deps.length > 0) {
				for (var i: number = 0; i < deps.length; ++i) {
					let serviceCls: any = this.makeServiceClass(deps[i].fullName);
					if (!this.startService(serviceCls, new RiggerHandler(this, this.startServiceWithConfig, [cls, ser, cb, config, startUpArgs]), null, startUpArgs)) {
						return;
					}
				}
			}

			// 准备好了，直接启动
			this.doStartService(cls, ser, config, cb, startUpArgs);
		}

		/**
		 * 根据服务名获取服务
		 * @param serviceName 
		 */
		public getService<T extends rigger.service.AbsService>(serviceName: string): T {
			serviceName = this.getRealServiceName(serviceName);
			return this._serviceMap[serviceName];
		}

		/**
		 * 根据服务名获取运行中的服务
		 * @param serviceName 服务名 
		 */
		public getRunningService<T extends rigger.service.AbsService>(serviceName: string): T {
			let service: T = this.getService<T>(serviceName);
			if (!service) return null;
			if (service.getServiceStatus() === ServiceStatus.Running) return service;
			return null;
		}

		/**
		 * 所有的服务映射
		 */
		private _serviceMap: {} = {};
		/**
		 * 
		 * @param serviceName 
		 * @param service 
		 */
		public registerService(serviceName: string, service: rigger.service.IService): boolean {
			if (this.isServiceRegistered(serviceName)) return false;
			this._serviceMap[serviceName] = service;
			return true;
		}

		/**
		 * 
		 * @param serviceName 
		 */
		public unregisterService(serviceName: string): boolean {
			if (!this.isServiceRegistered(serviceName)) return false;

			delete this._serviceMap[serviceName];
			return true;
		}

		/**
		 * 服务是否注册过
		 * @param serviceName 
		 */
		public isServiceRegistered(serviceName: string) {
			return !!this.getService(serviceName);
		}

		/**
		 * 服务是否在运行
		 * @param serviceName 
		 */
		public isServiceRunning(serviceName: string): boolean {
			let service: rigger.service.IService = this.getService(serviceName);
			if (!service) return false;
			return service.getServiceStatus() === ServiceStatus.Running;
		}

		/**
		 * 所有服务就绪时的回调
		 * @param resultHandler 
		 */
		onAllServicesReady(resultHandler: rigger.RiggerHandler): void {
			resultHandler.success();
		}

		private newConfigServiceName: string;
		private makeServiceClass(serviceName: string): any {
			if (!BaseApplication.replacedServiceMap) return eval(serviceName);
			let newService: any = BaseApplication.replacedServiceMap[serviceName];
			if (rigger.utils.Utils.isNullOrUndefined(newService)) return this.doMakeServiceClass(serviceName);
			if (service.ConfigService.serviceName === serviceName) this.newConfigServiceName = newService.serviceName;
			return newService;
		}

		private doMakeServiceClass(serviceName: string): any{
			if(!BaseApplication.serviceFullNameDefinitionMap) return eval(serviceName);
			// 查找是否直接有映射
			let Def: Function = BaseApplication.serviceFullNameDefinitionMap[serviceName];
			if(Def){
				return Def;
			}
			else{
				return eval(serviceName);
			}
		}

		/**
		 * 获取真正的服务名(可以将服务名转换成被替换后的服务名)
		 * @param serviceName 
		 */
		private getRealServiceName(serviceName: string) {
			if (!BaseApplication.replacedServiceMap) return serviceName;
			let newService: any = BaseApplication.replacedServiceMap[serviceName];
			if (rigger.utils.Utils.isNullOrUndefined(newService)) return serviceName;
			return newService.serviceName;

		}

		private onKernelServiceReady(cb: RiggerHandler, startUpArgs?: any) {
			console.log("KernelService Ready!");
			this.startNonKernelService(cb, startUpArgs);
		}

		/**
		 * 启动核心服务
		 */
		private startKernelService(cb: RiggerHandler, startUpArgs?: any) {
			// 构造核心服务配置
			let kernelConfig: rigger.config.ServiceConfig = new rigger.config.ServiceConfig();

			// 配置服务
			let depService1: rigger.config.ServiceConfig = new rigger.config.ServiceConfig();
			depService1.fullName = rigger.service.ConfigService.serviceName;

			// 对象池服务
			let depService2: rigger.config.ServiceConfig = new rigger.config.ServiceConfig();
			depService2.fullName = rigger.service.PoolService.serviceName;

			// 事件服务
			let depService3: rigger.config.ServiceConfig = new rigger.config.ServiceConfig();
			depService3.fullName = rigger.service.EventService.serviceName;

			// 先启动配置服务,再启动其它依赖服务
			kernelConfig.services = [depService1, depService2, depService3];

			this.startService(this.makeServiceClass(rigger.service.KernelService.serviceName),
				new RiggerHandler(this, this.onKernelServiceReady, [cb, startUpArgs]), kernelConfig, startUpArgs);
		}

		/**
		 * 启动非核心服务（用户自己配置的）
		 * @param cb 
		 */
		private startNonKernelService(cb: RiggerHandler, startUpArgs?: any) {
			let configService: service.ConfigService = this.getRunningService<service.ConfigService>(service.ConfigService.serviceName);
			configService.getApplicationConfig(new RiggerHandler(this, this.startApplicationDependentService, [0, cb, startUpArgs]));
		}

		/**
		 * 启动应用依赖的各项服务
		 * @param index 
		 * @param appConfig 
		 */
		private startApplicationDependentService(index: number, cb: RiggerHandler, startUpArgs: any, appConfig: config.ApplicationConfig, ) {
			if (!appConfig) throw new Error("faild to get application config.");
			let serviceList: config.ServiceConfig[][] = appConfig.services;
			if (serviceList.length <= index) return cb.run();

			let ready: boolean = true;
			let serviceCls: any;
			for (var i: number = 0; i < serviceList[index].length; ++i) {
				serviceCls = this.makeServiceClass(serviceList[index][i].fullName);
				serviceCls.serviceName = serviceList[index][i].fullName;
				if (!this.startService(serviceCls, new RiggerHandler(this, this.startApplicationDependentService, [index, cb, startUpArgs, appConfig]), null, startUpArgs)) {
					ready = false;
				}
			}

			if (ready) {
				this.startApplicationDependentService(index + 1, cb, startUpArgs, appConfig);
			}

		}

		/**
		 * 启动服务
		 * @param service 
		 * @param cb 
		 * @param {...any[]} startUpArgs
		 */
		private doStartService(cls: any, service: rigger.service.IService, config: config.ServiceConfig, cb: RiggerHandler, startUpArgs: any) {
			service.setApplication(this);
			console.log(`starting ${cls.serviceName}`);
			service.start(new RiggerHandler(this, this.onServiceStartComplete, [cls, service, cb]), config, startUpArgs);
		}

		/**
		 * 服务启动完成
		 * @param service 
		 * @param cb 
		 * @param resutlCode 
		 */
		private onServiceStartComplete(cls: any, service: rigger.service.IService, cb: RiggerHandler, resutlCode: number) {
			if (0 === resutlCode) {
				service.setServiceStatus(ServiceStatus.Running);
				console.log(`${cls.serviceName} is ready.`);
				cb.run();
			}

		}

	}
}