/**
* 依赖的组件的信息
*/
module rigger.config{
	export class DependentComponentInfo{
		/**
		 * 服务的完整名称，可以根据服务完整名称反映出服务类
		 */
		public fullName:string;

		/**
		 * 描述文字
		 */
		public desc:string;

		/**
		 * 版本
		 */
		public version:string;

		/**
		 * 服务源
		 */
		public src:string;

		/**
		 * 相关代码，资源存放位置
		 */
		public dest:string;
	}
}