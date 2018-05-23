/**
* name 
*/
module rigger{
	/**
	 * 迁移条件
	 */
	export class FSMTransitionCondition {

		constructor(paramsName: string | number, handler: rigger.RiggerHandler) {
			this.paramsName = paramsName;
			this.checkHandler = handler;
		}

		dispose(){
			this.paramsName = null;
			if(this.checkHandler){
				this.checkHandler.recover();
			}
		}

		/**
		 * 参数名或标识
		 */
		paramsName: string | number;
		checkHandler: rigger.RiggerHandler;
		public check(fsm: rigger.FSM): boolean {
			if (this.checkHandler) {
				return this.checkHandler.runWith([fsm.getValue(this.paramsName), fsm, this.paramsName]);
			}

			return false;
		}

	}
}