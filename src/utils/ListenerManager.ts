/**
* name 
*/
module rigger.utils{
	export class ListenerManager{
		constructor(){
		}

		dispose(){
			this.clear();
		}

		private handlers:RiggerHandler[];
		public on(caller:any, method:Function, args:any[], once:boolean = false){
			if(!this.handlers) this.handlers = [];
			this.handlers.push(new RiggerHandler(caller, method, args, once));
		}

		/**
		 * 解除回调
		 * @param caller 
		 * @param method 
		 */
		public off(caller:any, method:Function){
			if(!this.handlers || this.handlers.length <= 0) return;
			
			let tempHandlers:RiggerHandler[] = [];
			for (var i = 0; i < this.handlers.length; i++) {
				var handler = this.handlers[i];
				if(handler.caller === caller && handler.method === method){
					handler.recover();
					break;
				}
				else{
					tempHandlers.push(handler);
				}
			}

			// 把剩下的放回
			++i;
			for(; i < this.handlers.length; ++i){
				tempHandlers.push(this.handlers[i]);
			}
			this.handlers = tempHandlers;
		}

		/**
		 * 解除所有回调
		 * @param caller 
		 * @param method 
		 */
		public offAll(caller:any, method:Function){
			if(!this.handlers || this.handlers.length <= 0) return;

			let temp:RiggerHandler[] = [];
			let handlers:RiggerHandler[] = this.handlers;
			let len:number = handlers.length;
			for(var i:number = 0; i < len; ++i){
				if(caller !== handlers[i].caller || method !== handlers[i].method){
					temp.push(handlers[i]);
				}
				else{
					handlers[i].recover();
				}
			}

			this.handlers = temp;
		}

		/**
		 * 清除所有回调
		 */
		public clear(){
			if(!this.handlers || this.handlers.length <= 0) return;
			
			for (var i = 0; i < this.handlers.length; i++) {
				var handler = this.handlers[i];
				handler.recover();
			}
			this.handlers = null;
		}

		// public executeByArray(args:any[]){
		// 	let handlers:RiggerHandler[] = this.handlers;
		// 	let len:number = handlers.length;
		// 	for(var i:number = 0; i < len; ++i){
		// 		handlers[i].runWith(args);
		// 	}
		// }

		public execute(...args:any[]){
			if(!this.handlers || this.handlers.length <= 0) return;			
			// this.executeByArray(args);
			let handlers:RiggerHandler[] = this.handlers;
			let len:number = handlers.length;
			for(var i:number = 0; i < len; ++i){
				handlers[i].runWith(args);
			}
		}
	}
}