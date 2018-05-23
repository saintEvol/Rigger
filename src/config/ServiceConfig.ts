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
	export class ServiceConfig{
		constructor(){

		}

		/**
		 * 服务的全名
		 */
		public fullName:string = "";

		// 版本
		public version:string;

		/**
		 * 依赖的服务信息
		 */
		public services:config.DependentComponentInfo[][];

		/**
		 * 依赖的插件信息
		 */
		public plugins:config.DependentComponentInfo[];
	}
}