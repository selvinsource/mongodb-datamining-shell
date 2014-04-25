//Check User input
if (typeof inputCollectionName === 'undefined' || typeof target === 'undefined') {

	print("Please provide both a collection name and a target class");
	
}else{

	OneR(inputCollectionName,target);
	
}

function OneR(inputCollectionName,target){

	//Define temporary collections for intermediate processing
	var tmpOutCollectionName = "tmpOner";
	var tmpOutErrorCollectionName = "tmpOnerError";

	//Oner classification map reduce functions section
	//Map all attribute values of the dataset (excluding the _id) to the target classes (Yes and No)
	var onerMap = function(){
		for (var key in this) {
			if (this.hasOwnProperty(key) && key != target && key != '_id') {
				var value = {
					classNo : (this[target] == 'No') ? 1 : 0,
					classYes : (this[target] == 'Yes') ? 1 : 0,
					oneRule : (this[target] == 'No') ? "->No" : "->Yes",
					oneRuleCount : 1,
					totalCount : 1
				};
				emitKey = key + "=" + this[key];
				emit(emitKey,value);
			}
		}
	};
	//Reduce the attribute values by summing the target classes occurrence (Yes and No) and defining the One Rule
	var onerReduce = function (key, values){
		var reducedObject = {
			classNo : 0,
			classYes : 0,
			oneRule : '',
			oneRuleCount : 0,
			totalCount : 0
		};
		values.forEach( function(value) {
			reducedObject.classNo += value.classNo;
			reducedObject.classYes += value.classYes;
			reducedObject.oneRule = reducedObject.classNo > reducedObject.classYes ?  "->No" : "->Yes";
			reducedObject.oneRuleCount = reducedObject.classNo > reducedObject.classYes ?  reducedObject.classNo : reducedObject.classYes;
			reducedObject.totalCount += 1;
		});
		return reducedObject;
	};
	//Map the attributes to the rule count and total count to compute the error
	var onerMapError = function(){
		var key = this['_id'].substring(0,this['_id'].indexOf('='));
		var value = {
			oneRuleCount : this.value.oneRuleCount,
			totalCount : this.value.totalCount			
		};
		emit(key,value);
	};
	//Reduce the attributes by summing rule count and total count to compute the error
	var onerReduceError = function (key, values){
		var reducedObject = {
			oneRuleCount : 0,
			totalCount : 0			
		};
		values.forEach( function(value) {
			reducedObject.oneRuleCount += value.oneRuleCount;
			reducedObject.totalCount += value.totalCount;
		});
		return reducedObject;
	};
	//Compute the error for the attribute
	var onerFinalizeError = function (key, reducedVal){
		reducedVal.error = 1 - reducedVal.oneRuleCount/reducedVal.totalCount;
		return reducedVal;
	};

	//Algorithm execution
	//Execute the OneR map reduce
	var onerMapReduce = db.runCommand({
			mapReduce: inputCollectionName,
			map: onerMap,
			reduce: onerReduce,
			out : { replace : tmpOutCollectionName},
			scope : { target : target}
	});
	//Execute the OneR map reduce error
	var onerMapReduceError = db.runCommand({
			mapReduce: tmpOutCollectionName,
			map: onerMapError,
			reduce: onerReduceError,
			out : { replace : tmpOutErrorCollectionName},
			finalize : onerFinalizeError
	});
	//Select the attribute (or so called explanatory variable) with the smallest error
	var mostAccurateExplanatoryVar = db[tmpOutErrorCollectionName].find({},{"_id":1}).sort({"value.error":1}).limit(1).next();
	//Filter the OneR map reduce result by the most accurate explanatory variable
	var oneRule = db[tmpOutCollectionName].find({ "_id" : { "$regex" : "^"+mostAccurateExplanatoryVar["_id"]}},{ "value.oneRule" : 1 , "_id" : 1});
	
	//Print the final result
	print("=======OneR classification result for target class " + target + "=======");
	oneRule.forEach(function(obj){
		print(obj._id + obj.value.oneRule);
	});
	print("======= Done =======");
	
}
