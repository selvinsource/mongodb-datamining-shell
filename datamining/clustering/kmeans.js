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
		var document = this;
		centroids.forEach( function(centroid) {
			var key = document['_id'];//document id
			var value = {cluster : centroid.id, dist : 0, class : document['class']};
			for(var cProp in centroid) {
				if(cProp != 'id') {
					value[cProp] = document[cProp];
						value.dist += Math.pow(centroid[cProp] - document[cProp],2);
				}
			}
			value.dist = Math.sqrt(value.dist);
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
	var group = { _id : "$value.cluster" };
	db[inputCollectionName].find().limit(k).forEach( function(centroid) {
		newCentroids[i] = centroid;
		newCentroids[i]['id']= 'c'+i;//centroid identifier
		delete newCentroids[i]['_id'];//remove mongodb identifier
		delete newCentroids[i]['class'];//remove target class if any
		//Create the group by clause used to compute the new centroids after the first run of the algorithm
		if(i == 0){
			for(var cProp in centroid) {
				if(cProp != 'id' && cProp != 'class') {
					group[cProp] = { $avg : "$value."+cProp};
				}
			}
		}
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
		//Compute the new centroids as average of the document in each cluster
		newCentroids = [];
		var i = 0;
		db[tmpOutCollectionName].aggregate([ { $group : group} ]).forEach( function(c) {
			newCentroids[i] = c;
			newCentroids[i]['id']= c['_id'];
			delete newCentroids[i]['_id'];
			i++;
		});
	} while ( !sameCentroids(currentCentroids, newCentroids) );
	
	//Print the final result
	print("=======KMeans clustering result for k = " + k + "=======");
	print("Centroids");
	for (var i = 0; i < newCentroids.length; i++) {
		var displayCentroid = newCentroids[i]['id']+": ";
		for(var cProp in newCentroids[i]) {
			if(cProp != 'id')
				displayCentroid += cProp + " " + newCentroids[i][cProp] + " ";
		}
		print(displayCentroid);
	}
	/* Uncomment this to which cluster each document has been assigned
	print("Clusters");
	db[tmpOutCollectionName].find().forEach( function(d) {
		var doc = "document: " + d._id + " ";
		if(d.value['class'])
			doc+= "with class "+d.value['class'] + " ";
		doc += "assigned to cluster " + d.value.cluster;
		print(doc);
	});
	*/
	print("Clustered documents");
	var numDoc =  db[inputCollectionName].count();
	db[tmpOutCollectionName].aggregate([ { $group : { _id : "$value.cluster", count : { $sum : 1}, perc : { $sum : 1/numDoc}}} ]).forEach( function(result) {
		print(result._id + ": " + result.count + " (" + result.perc*100 + "%)");
	});
	print("======= Done =======");
	
}

