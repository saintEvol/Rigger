/**
* 有限状态机类
*/
module rigger {
	export class FSM {

		/**
		 * 状态机的当前状态名
		 */
		public get nowState(): string | number {
			return this.mNowStateName;
		}
		private mNowStateName: string | number = null;

		constructor() {
			this.stateMap = {};
			this.paramsMap = {};
			this.triggerMap = {};
		}

		dispose() {
			for (var k in this.paramsMap) {
				// (<FSMState>this.paramsMap[k]).dispose();
				delete this.paramsMap[k];
			}
			this.stateMap = null;
			this.paramsMap = null;
			this.triggerMap = null
		}

		/**
		 * 所有在状态映射
		 */
		private stateMap: {};

		/**
		 * 所有在参数值
		 */
		private paramsMap: {};

		/**
		 * 触发器映射
		 */
		private triggerMap: {};

		/**
		 * 启动状态机，一般在设置好所有参数，设置后再调用，只需要调用一次
		 */
		public start() {
			this.checkNowState();
		}

		/**
		 * 检查当前状态（是否可以迁移当前状态)
		 */
		private checkNowState() {
			let state: FSMState = this.stateMap[this.mNowStateName];
			if (!state) throw new Error(`can not find state in checkNowState:${this.mNowStateName}`);
			let newStateName: number | string = state.checkAllTransitions(this);
			if (newStateName) {
				this.transitToState(state, this.getState(newStateName));
			}
		}

		/**
		 * 给状态机添加一个状态，添加成功后会返回新添加的状态
		 * 如果原来已经有些STATE了则直接使用已有的
		 * @param stateName 
		 */
		public addState(stateName: number | string, ifDefault: boolean = false): FSMState {
			let state:FSMState = this.stateMap[stateName];
			if(!state) state = new FSMState(stateName);
			
			this.stateMap[stateName] = state;
			if (ifDefault || !this.mNowStateName) this.mNowStateName = stateName;
			return state;
		}

		/**
		 * 根据状态名或状态标识获取状态数据
		 * @param stateName 
		 */
		public getState(stateName: number | string): FSMState {
			return this.stateMap[stateName];
		}

		/**
		 * 获取参数值
		 * @param params 
		 */
		public getValue<T>(params: string | number): any {
			return <T>this.paramsMap[params];
		}

		/**
		 * 设置参数值
		 * @param params 
		 * @param value 
		 * @param ifTrigger 是否是触发器模式 ,此模式下，当参数关联的transition发生后，会将参数值置回原值
		 * 
		 */
		public setValue(params: string | number, value: any, ifTrigger: boolean = false) {
			if (ifTrigger) {
				this.triggerMap[params] = { oldValue: this.paramsMap[params] };
			}
			this.paramsMap[params] = value;

			this.onParamsChange(params);
		}

		/**
		 * 当参数发生改变时调用
		 * @param params 
		 */
		private onParamsChange(params: string | number) {
			let state: FSMState = this.stateMap[this.mNowStateName];
			if (!state) throw new Error(`can not find state:${this.mNowStateName}`);
			// 检查当前状态所有的迁移
			let newStateName: string | number = state.onParamsChange(this, params);
			if (!rigger.utils.Utils.isNullOrUndefined(newStateName)) {
				this.transitToState(state, this.getState(newStateName));
			}
		}

		/**
		 * 迁移到新状态
		 * @param oldState 
		 * @param newState 
		 */
		private transitToState(oldState: FSMState, newState: FSMState) {
			if (!newState) throw new Error(`trying to transit to a invalid new state`);

			let oldStateName: number | string = oldState.stateName;
			let newStateName: number | string = newState.stateName;

			// 回复trigger的状态
			let transition: FSMTransition = oldState.getTransition(newStateName);
			let conditions: FSMTransitionCondition[] = transition.conditions;
			let len: number = conditions.length;
			let params: number | string;
			let condition: FSMTransitionCondition;
			let trigger: { oldValue: any };
			for (var i = 0; i < len; i++) {
				condition = conditions[i];
				params = condition.paramsName
				trigger = this.triggerMap[params];
				if (trigger) {
					// 如果有trigger信息，则重置参数值,重置后可能再次引起状态迁移
					delete this.triggerMap[params];
					this.setValue(params, trigger.oldValue);
				}
			}

			// 执行旧状态的leave回调		
			oldState.executeLeaveAction(newStateName);
			this.mNowStateName = newStateName;
			// 执行新状态的enter回调
			this.getState(newStateName).executeEnterAction(oldStateName);

			if (oldState.stateName !== newState.stateName) {
				// 检查当前状态
				// 判断新旧状态是否相同，防止死循环
				this.checkNowState();
			}

		}

	}
}