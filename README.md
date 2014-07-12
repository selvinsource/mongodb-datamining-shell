##MongoDB Data Mining Shell

MongoDB shell implementation of the data mining algorithms.

##Installation

```sh
git clone https://github.com/selvinsource/mongodb-datamining-shell.git
cd mongodb-datamining-shell
mongoimport --db mongodbdm --collection weatherData --type csv --headerline --file dataset/weatherData.csv
mongo mongodbdm --eval "var inputCollectionName = \"weatherData\", target = \"play\"" datamining/classification/oner.js
mongoimport --db mongodbdm --collection iris --type csv --headerline --file dataset/iris.csv
mongo mongodbdm --eval "var inputCollectionName = \"iris\", k = 3" datamining/clustering/kmeans.js
```

##Documentation

Data mining or also called knowledge discovery is a set of activities aiming at analyzing large databases and extracting extra information meaningful for decision making or problem solving.

###Classification

Classification is one of the most common knowledge discovery task that consists in creating a model that predicts a target class based on explanatory variables.

####OneR
OneR is a simple yet accurate classification algorithm that produces a one level decision tree.  
For a visual description of the algorithm see [OneR pseudocode].  
Its oner.js MongoDB implementation takes as input two parameters:
* inputCollectionName - the collection used as training dataset
* target - the target class of the collection

Usage:
```sh
mongo yourdatabase --eval "var inputCollectionName = \"yourcollection\", target = \"yourtargetclass\"" datamining/classification/oner.js
```

Example of a collection and its target class play: [weather data].

Limitation: 
* the target class must be a categorical variable with values Yes and No
* the explanatory variables must be categorical variables, numerical variables should be discretized in a small number of distinct ranges before running the algorithm

###Clustering

Clustering is the task of identifying and segmenting the instances into a finite number (k) of categories (clusters) which are not predefined (unlike classification).

####K-Means

K-Means is the classic clustering technique that partitions the instances into k clusters whereas k is predefined.  
For an high level description of the algorithm see [K-Means pseudocode].  
Its kmeans.js MongoDB implementation takes as input two parameters:
* inputCollectionName - the collection used as training dataset
* k - the number of predefined clusters

Usage:
```sh
mongo mongodbdm --eval "var inputCollectionName = \"yourcollection\", k = numberofclusters" datamining/clustering/kmeans.js
```

Example of a collection: [iris data].

Limitation: 
* the variables must be all numerical

Note:
* If a field in the collection is called "class", this is excluded from the computation, instead it will be printed in the result with the assigned cluster

###References
* [Bache, K. & Lichman, M. (2013)] UCI Machine Learning Repository [http://archive.ics.uci.edu/ml]. Irvine, CA: University of California, School of Information and Computer Science
* [Hartigan, J. A. (1975)] Clustering Algorithms, Probability & Mathematical Statistics, John Wiley & Sons Inc.
* [Holte, R. C. (1993)] Very simple classification rules perform well on most commonly used datasets, Machine Learning, 11, pp 63-91
* [Selvaggio, V. (2011)] Customer Churn prediction for an Automotive Dealership using computational Data Mining, MSc dissertation, City University London


[Holte, R. C. (1993)]:http://webdocs.cs.ualberta.ca/~holte/Publications/simple_rules.pdf
[OneR pseudocode]:http://www.saedsayad.com/oner.htm
[K-Means pseudocode]:http://www.saedsayad.com/clustering_kmeans.htm
[Selvaggio, V. (2011)]:https://github.com/selvinsource/customer-churn-prediction/blob/master/projectreport.pdf?raw=true
[weather data]:https://github.com/selvinsource/mongodb-datamining-shell/blob/master/dataset/weatherData.csv
[iris data]:https://github.com/selvinsource/mongodb-datamining-shell/blob/master/dataset/iris.csv
