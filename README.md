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
###Classification
####OneR
The oner.js classification algorithm takes as input two parameters:
* inputCollectionName - the collection used as training dataset
* target - the target attribute of the collection

Usage:
```sh
mongo yourdatabase --eval "var inputCollectionName = \"yourcollection\", target = \"yourtargetclass\"" datamining/classification/oner.js
```

Reference:
* [Holte, R. C. (1993)] 'Very simple classification rules perform well on most commonly used datasets', Machine Learning, 11, pp 63-91
* [OneR pseudocode] - visual description of the algorithm


[Holte, R. C. (1993)]:http://webdocs.cs.ualberta.ca/~holte/Publications/simple_rules.pdf
[OneR pseudocode]:http://www.saedsayad.com/oner.htm


