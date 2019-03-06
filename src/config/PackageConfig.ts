/**
* name 
*/
module rigger.config{
	export class PackageConfig{
		/**
		 * 包的全名
		 */
		public fullName:string = "";
		// 版本
		public version:string;
		// 包依赖的自定义服务所在的根目录
		public customServicesRoot:string[] = [];
		/**
		 * 依赖的包的信息
		 */
		public packages:config.DependentComponentInfo[];
		constructor(){

		}
	}
}