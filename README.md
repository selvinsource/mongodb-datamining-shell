##MongoDB Data Mining Shell

MongoDB shell implementation of the simple yet accurate OneR classification algorithm.

##Installation

```sh
git clone https://github.com/selvinsource/mongodb-datamining-shell.git
cd mongodb-datamining-shell
mongoimport --db mongodbdm --collection weatherData --type csv --headerline --file dataset/weatherData.csv
mongo mongodbdm --eval "var inputCollectionName = \"weatherData\", target = \"play\"" datamining/classification/oner.js
```

##Documentation

Data mining or also called knowledge discovery is a set of activities aiming at analyzing large databases and extracting extra information meaningful for decision making or problem solving.

###Classification

Classification is one of the most common knowledge discovery task that consists in creating a model that predicts a target class based on categorical variables.

####OneR
OneR is a simple classification algorithm that produces a one level decision tree.  
For a visual description of the algorithm see [OneR pseudocode].  
Its oner.js MongoDB implementation takes as input two parameters:
* inputCollectionName - the collection used as training dataset
* target - the target attribute of the collection

Usage:
```sh
mongo yourdatabase --eval "var inputCollectionName = \"yourcollection\", target = \"yourtargetclass\"" datamining/classification/oner.js
```

Example of a collection and its target class play: [weather data].

###References
* [Holte, R. C. (1993)] Very simple classification rules perform well on most commonly used datasets, Machine Learning, 11, pp 63-91
* [Selvaggio, V. (2011)] Customer Churn prediction for an Automotive Dealership using computational Data Mining, MSc dissertation, City University London


[Holte, R. C. (1993)]:http://webdocs.cs.ualberta.ca/~holte/Publications/simple_rules.pdf
[OneR pseudocode]:http://www.saedsayad.com/oner.htm
[Selvaggio, V. (2011)]:https://github.com/selvinsource/customer-churn-prediction/blob/master/projectreport.pdf?raw=true
[weather data]:https://github.com/selvinsource/mongodb-datamining-shell/blob/master/dataset/weatherData.csv

