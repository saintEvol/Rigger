/**
* name 
*/
module rigger.config{
	// export class DependentService{
	// 	public fullName:string;
	// 	public src:string;		
	// 	public dest:string;
	// }

	/**
	 * 服务配置
	 */
	export class ServiceConfig extends DependentComponentInfo{
		constructor(){
			super();
		}

		/**
		 * 依赖的服务信息
		 */
		public services:config.ServiceConfig[];

		/**
		 * 依赖的插件信息
		 */
		public plugins:config.DependentComponentInfo[];
	}
}