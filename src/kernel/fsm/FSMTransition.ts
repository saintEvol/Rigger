/**
* name 
*/
module rigger {
	export class FSMTransition {
		constructor(toState: number | string) {
			this.toStateName = toState;
			this.mConditions = [];
		}

		dispose() {
			this.toStateName = null;
			for (var i = 0; i < this.mConditions.length; i++) {
				var cond = this.mConditions[i];
				cond.dispose();
			}
		}

		/**
		 * 迁移的目标状态名或标识符
		 */
		toStateName: string | number;

		/**
		 * 所有的条件
		 */
		public get conditions():FSMTransitionCondition[]{
			return this.mConditions;
		}

		/**
		 * 给迁移添加条件
		 * @param paramsName 参与判断的参数
		 * @param checkCaller 检查函数的调用者
		 * @param checkMethod 检查函数
		 * @param args 额外参数
		 */
		public addCondition(paramsName: number | string, checkCaller?: any, checkMethod?: (e, ...args) => boolean, ...args) {
			if (checkMethod && !utils.Utils.isNullOrUndefined(paramsName)) {
				let cond: FSMTransitionCondition = new FSMTransitionCondition(paramsName, RiggerHandler.create(checkCaller, checkMethod, args, false));
				this.mConditions.push(cond);
			}

		}

		public check(fsm: FSM) {
			for (var i = 0; i < this.mConditions.length; i++) {
				var cond = this.mConditions[i];
				if (!cond.check(fsm)) return false;
			}

			return true;
		}


		private mConditions: FSMTransitionCondition[] = [];



	}
}