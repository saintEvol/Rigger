/**
* 有限状态机的状态类
*/
module rigger {

	/**
	 * 状态机的状态数据
	 */
	export class FSMState {
		/**
		 * 
		 * @param state 状态名或标示符
		 */
		constructor(state: number | string) {
			this.mStateName = state;
			this.transitionsMap = {};
			this.mParamsStateRelationMap = {};
		}

		dispose() {
			this.mStateName = null;
			this.transitionsMap = null;
			this.mParamsStateRelationMap = null;
			this.enterActionManager.dispose();
			this.leaveActionManager.dispose();
		}

		private enterActionManager: rigger.utils.ListenerManager;
		/**
		 * 添加进入此状态时的动作,可以重复调用以增加多个动作
		 * 动作回调时会将旧状态与新状态名附加在传入参数末尾，如：
		 * function onEnter(extraArg..., oldState, newState){}
		 * @param whenEnterCaller 
		 * @param whenEnterMethod 
		 * @param whenEnterArgs 
		 */
		public addEnterAction(whenEnterCaller: any, whenEnterMethod: (...oldStateAndNewState: any[]) => any, ...whenEnterArgs: any[]) :FSMState{
			if (!this.enterActionManager) this.enterActionManager = new utils.ListenerManager();
			this.enterActionManager.on(whenEnterCaller, whenEnterMethod, whenEnterArgs);

			return this;
		}

		private leaveActionManager: rigger.utils.ListenerManager;
		/**
		 * 添加离开此状态时的动作,可以重复调用以增加多个动作
		 * 动作回调时会将旧状态与新状态名附加在传入参数末尾，如：
		 * function onEnter(extraArg..., oldState, newState){}
		 * @param whenLeaveCaller 
		 * @param whenLeaveMethod 
		 * @param whenLeaveArgs 
		 */
		public addLeaveAction(whenLeaveCaller: any, whenLeaveMethod: (...oldStateAndNewState: any[]) => any, ...whenLeaveArgs: any[]):FSMState {
			if (!this.leaveActionManager) this.leaveActionManager = new utils.ListenerManager();
			this.leaveActionManager.on(whenLeaveCaller, whenLeaveMethod, whenLeaveArgs);

			return this;
		}

		/**
		 * 执行进入动作
		 * @param oldState 
		 * @param newState 
		 */
		public executeEnterAction(fromState: number | string): void {
			if (this.enterActionManager) {
				this.enterActionManager.execute(fromState, this.stateName);
			}
		}

		/**
		 * 执行离开动作
		 * @param toState 
		 */
		public executeLeaveAction(toState: number | string): void {
			if (this.leaveActionManager) {
				this.leaveActionManager.execute(this.stateName, toState);
			}
		}

		/**
		 * 参数状态关系映射
		 */
		public get paramsStateRelationMap(): {} {
			return this.mParamsStateRelationMap;
		}
		private mParamsStateRelationMap: {} = {};

		/**
		 * 增加一个迁移（条件），此接口可以重复对同一个状态调用，以增加多个条件，此时，需要所有条件都满足后，状态才会发生迁移
		 * 返回FSMstate
		 * @param toState 目标状态
		 * @param paramsName 需要检查的参数名
		 * @param checkCaller 检查函数调用者
		 * @param checkMethod 检查函数
		 * @param args 额外参数
		 */
		public addTransition(toState: number | string, paramsName?: number | string, checkCaller?: any, checkMethod?: (paramsValue:any, fsm?:FSM, paramsName?:string | number, ...args) => boolean, ...args): FSMState {
			if(rigger.utils.Utils.isNullOrUndefined(toState)) return this;

			if (!rigger.utils.Utils.isNullOrUndefined(paramsName)) {
				let oldList: any[] = this.mParamsStateRelationMap[paramsName];
				if (!oldList) oldList = this.mParamsStateRelationMap[paramsName] = [];
				if (oldList.indexOf(toState) < 0) {
					oldList.push(toState);
				}
			}

			let oldTransition: FSMTransition = this.getTransition(toState);
			if (!oldTransition) oldTransition = this.setTransition(toState, new FSMTransition(toState));
			oldTransition.addCondition(paramsName, checkCaller, checkMethod, ...args);

			return this;
		}

		/**
		 * 当状态机的参数发生了变化时调用，返回新的状态，如果为null,则表示不满足迁移条件
		 * @param fsm 
		 * @param paramsName 
		 */
		public onParamsChange(fsm: FSM, paramsName: string | number): number | string {
			// 获取参数相关的目标状态
			let stateNames: any[] = this.mParamsStateRelationMap[paramsName];
			if (!stateNames || stateNames.length <= 0) return;
			for (var i = 0; i < stateNames.length; i++) {
				var stateName = stateNames[i];
				var transition: FSMTransition = this.transitionsMap[stateName];
				if (transition) {
					if (transition.check(fsm)) {
						return stateName;
					}
				}
			}

			return null;
		}

		/**
		 * 检查所有的transition，看是否有可以迁移的状态,并返回新状态，如果没可迁移状态，则返回NULL，
		 * @param fsm 
		 */
		public checkAllTransitions(fsm: FSM): number | string {
			for (var k in this.transitionsMap) {
				let transition: FSMTransition = this.transitionsMap[k];
				if (transition) {
					if (transition.check(fsm)) {
						return k;
					}
				}
			}

			return null;
		}

		public getTransition(toState:number | string):FSMTransition{
			return this.transitionsMap[toState];
		}

		protected setTransition(toState:number | string, transition:FSMTransition):FSMTransition{
			return this.transitionsMap[toState] = transition;
		}

		// public getRelatedTransitions(paramsName:string | number):FSMTransition[]{

		// }

		/**
		 * 状态名或标识
		 */
		public get stateName(): string | number {
			return this.mStateName;
		}
		private mStateName: string | number;

		/**
		 * 所有可能的变迁
		 */
		private transitionsMap: {};
	}
}