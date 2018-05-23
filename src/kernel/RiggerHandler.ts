/**
* name 
*/
module rigger{
	export class RiggerHandler{

		protected _id:number;

		public get caller(){
			return this._caller;
		}
		private _caller:any;

		public get method(){
			return this._method;
		}
		private _method:Function;

		public get once():boolean{
			return this._once;
		}
		private _once:boolean = true;

		public get args(){
			return this._args;
		}
		private _args:any[];
		constructor(caller:any, func:Function, args:any[] = null, once:boolean = false){
			this._caller = caller;
			this._method = func;
			this._args = args;
			this._once = once;
		}

		dispose(){
			this._caller = null;
			this._method = null;
			this._args = null;
		}

		private static riggerHandlerSign:string = "_riggerHandlerSign";
		public static create(caller:any, fun:Function, args:any[] = null, once:boolean = true):RiggerHandler{
			let ret:RiggerHandler = service.PoolService.getItem<RiggerHandler>(RiggerHandler.riggerHandlerSign);
			if(ret){
				ret._caller = caller;
				ret._method = fun;
				ret._args = args;
				ret._once = once;

				return ret;
			}

			return new RiggerHandler(caller, fun, args, once);
		}

		/**
		 * 将一个RiggerHandler回收到对象池
		 * @param handler 
		 */
		public static recover(handler:rigger.RiggerHandler){
			handler.dispose();
			service.PoolService.recover(RiggerHandler.riggerHandlerSign, handler);
		}

		/**
		 * 将自身回收至对象池
		 */
		public recover(){
			RiggerHandler.recover(this);
		}

		/**
		 * 无参执行
		 */
		public run():any{
			if(this._method){
				return this._method.apply(this._caller, this._args);
			}
		}

		/**
		 * 带参执行
		 * @param args 
		 */
		public runWith(args:any[]):any{
			if(!args) return this.run();

			if(this._method){
				if(this._args){
					return this._method.apply(this._caller, this._args.concat(args));
				}
				else{
					return this._method.apply(this._caller, args);
				}
			}

			return null;
		}

		public success(){
			this.runWith([0]);
		}

		public fail(){
			this.runWith([1]);
		}
	}
}