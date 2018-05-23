/**
* name 
*/
module rigger{
	export interface IMethodPluginInfo{
		/**
		 * 前置插件
		 */
		prefixPlugins:IPlugin[];

		/**
		 * 后置插件
		 */
		suffixPlugins:IPlugin[];
	}
}