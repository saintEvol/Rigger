/**
* 状态机的常用工具函数
*/
module rigger{
	export class FSMUtils{
		constructor(){

		}

		/**
		 * 状态机的参数条件判断：相等
		 * @param v 
		 */
		public static equal(v){
			return function(paramsV):boolean{
				return v === paramsV;
			}
		}

		public static notEqual(v){
			return function(paramsV):boolean{
				return v !== paramsV;
			}
		}

		/**
		 * 状态机的参数条件判断：参数值小于指定值
		 * @param v 
		 */
		public static less(v){
			return function(paramsV):boolean{
				return paramsV < v;
			}
		}

		/**
		 * 状态机的参数条件判断：参数值小于等于指定值
		 * @param v 
		 */
		public static lessEqual(v){
			return function(paramsV):boolean{
				return paramsV <= v;
			}
		}

		/**
		 * 状态机的参数条件判断：参数值大于指定值
		 * @param v 
		 */
		public static greater(v){
			return function(paramsV):boolean{
				return paramsV > v;
			}
		}

		/**
		 * 状态机的参数条件判断：参数值大于等于指定值
		 * @param v 
		 */
		public static greaterEqual(v){
			return function(paramsV):boolean{
				return paramsV >= v;
			}
		}
	}
}