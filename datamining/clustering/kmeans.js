//Check User input
if (typeof inputCollectionName === 'undefined' || typeof k === 'undefined') {

	print("Please provide a collection name and the k number of clusters");

}else{

	KMeans(inputCollectionName,k);

}

//Utility function to compare objects
function sameObjects(x, y) {
   var sameObjects = true;
   for(var propertyName in x) {
      if(x[propertyName] !== y[propertyName]) {
         sameObjects = false;
         break;
      }
   }
   return sameObjects;
}

//Utility function to compare two centroids
function sameCentroids(centroid1, centroid2){
        var sameCentroids = true;
        for(var i = 0; i < centroid1.length; i++){
                for(var j = 0; j < centroid2.length; j++){
                        if(centroid1[i]['id']==centroid2[j]['id']){
                                sameCentroids = sameObjects(centroid1[i],centroid2[j]);
                        }
                }
        }
        return sameCentroids;
}


function KMeans(inputCollectionName,k){
	
	//Define temporary collections for processing
	var tmpOutCollectionName = "tmpKMeans";
 
 	//KMeans clustering map reduce functions section
 	//Map each document against each centroid by computing the Euclidean distance between them
	var kMeansMap = function(){
        var id = this['_id'];
        var a = this.a;
        var b = this.b;
        centroids.forEach( function(c) {
                var key = id;//document id
                //TODO: loop and sum all variables except id and _id on both side...
                //if categorical use == 0 or 1
                var value = { a : a, b : b, cluster : c.id, dist : Math.sqrt(Math.pow(c.a - a,2) + Math.pow(c.b - b,2))};
                emit(key,value);
        });
	}
	//Reduce each document by choosing the minimum distance to the centroids
	var kMeansReduce = function(key, values){
		var value = values[0];
       		for (var i = 1; i < values.length; i++) {
			if(values[i].dist < value.dist){
				value = values[i];
			}
		}
		return value;
	}
	
	//Select the first k documents from the input collection as random centroids
	var newCentroids = [];
	var i = 0;
	db[inputCollectionName].find().limit(k).forEach( function(centroid) {
        newCentroids[i] = centroid;
        newCentroids[i]['id']= 'c'+i;//centroid identifier
		delete newCentroids[i]['_id'];//remove mongodb identifier
        i++;
	});

	//Algorithm execution
	//Keep running the KMeans map reduce algorithm until the centroids are different (if the same it means the documents stay in the same cluster) 
	do{
		var currentCentroids = newCentroids;
		var kMapReduce = db.runCommand({
        	mapReduce: inputCollectionName,
        	map: kMeansMap,
        	reduce: kMeansReduce,
        	out : { replace : tmpOutCollectionName},
        	scope : { centroids : currentCentroids}
		});
		var newCentroids = [];
		var i = 0;
		db[tmpOutCollectionName].aggregate([ { $group : { _id : "$value.cluster", a : { $avg : "$value.a"}, b : { $avg : "$value.b"}}} ]).forEach( function(c) {
       	 	newCentroids[i] = c;
       	 	newCentroids[i]['id']= c['_id'];
        	delete newCentroids[i]['_id'];
        	i++;
		});
	} while ( !sameCentroids(currentCentroids, newCentroids) );
	
	//Print the final result
	print("=======KMeans clustering result for k = " + k + "=======");
	db[tmpOutCollectionName].find().forEach( function(d) {
		print("document: " + d._id + " assigned to cluster " + d.value.cluster);
	});
	print("======= Done =======");
	
}

