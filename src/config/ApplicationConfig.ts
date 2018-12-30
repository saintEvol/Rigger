/**
* name 
*/
module rigger.config{
	export class ApplicationConfig{
		/**
		 * 工程类型,可用类型：rigger, serice, plugin, application
		 */
		projectType:string;

		/**
		 * 应用名称
		 */
		public applicationName:string = "Untitled App";

		/**
		 * 发布服务时，服务源码所在根目录
		 */
		public srcRoot:string = "./src";

		/**
		 * 库路径
		 */
		public libPathes:string[] = [];

		/**
		 * 输出目录根路径,主要用于发布Rigger或服务
		 */
		public outRoot:string = "./dist";

		/**
		 * 构建项目时，服务执行文件的目标位置,构建项目时会将相关配置复制到此目录下
		 */
		public binRoot:string = "./bin";

		/**
		 * 自定义的服务(非第三方服务，而是本地服务)根目录
		 */
		public customServicesRoot:string[];

		/**
		 * 应用需要启动的服务
		 */
		public services:DependentComponentInfo[][];

		/**
		 * 应用依赖的包
		 */
		public packages:DependentComponentInfo[];

		/**
		 * 依赖
		 */
		public deps:DependentComponentInfo[][];
	}
}