/**
* name 
*/
module rigger.config{
	export class PackageConfig{
		/**
		 * 服务的全名
		 */
		public fullName:string = "";
		// 版本
		public version:string;
		// 包依赖的自定义服务所在的根目录
		public customServicesRoot:string[] = [];
		/**
		 * 依赖的服务信息
		 */
		public packages:config.DependentComponentInfo[];
		constructor(){

		}
	}
}