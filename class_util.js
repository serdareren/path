var ClassUtil = (function(){

	/**
	 * singleton
	 * @returns {ClassUtil}
	 */
	function ClassUtil(){

	}

	ClassUtil.prototype = {
		extend: function(subClass, superClass){
			var subClassPrototype = {};
			this.extendPrototype(subClassPrototype, superClass.prototype);
			this.extendPrototype(subClassPrototype, subClass.prototype);
			subClassPrototype.constructor = subClass;
			
			subClass.prototype = subClassPrototype;
		},
		extendPrototype: function(targetPrototype, objectPrototype){
			for(var key in objectPrototype){
				if(objectPrototype.hasOwnProperty(key)){
					var descriptor = Object.getOwnPropertyDescriptor(objectPrototype, key);
					var getter = descriptor.get;
					var setter = descriptor.set;
					if(getter || setter){
						Object.defineProperty(targetPrototype, key, {
							get: getter, 
							set: setter, 
							enumerable: true
						});
					} else {
						targetPrototype[key] = objectPrototype[key];
					}
				}
			}
		},
		getGetterAndOrSetter: function(key, getter, setter){
			var getterSetter = {};
			getterSetter.enumerable = true;
			var camelKey = key[0].toUpperCase() + key.substring(1);
			if(getter){
				getterSetter.get = function(){ return this["get" + camelKey](); };
			}
			if(setter){
				getterSetter.set = function(val){ return this["set" + camelKey](val); };
			}
			return getterSetter;
		},
		defineGetterAndSetter: function(objectClass, key){
			Object.defineProperty(objectClass.prototype, key, this.getGetterAndOrSetter(key, true, true));
		},
		defineGetter: function(objectClass, key){
			Object.defineProperty(objectClass.prototype, key, this.getGetterAndOrSetter(key, true, false));
		},
		defineSetter: function(objectClass, key){
			Object.defineProperty(objectClass.prototype, key, this.getGetterAndOrSetter(key, false, true));
		}
	};

	return new ClassUtil();

}());

