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
mongo yourdatabase --eval "var inputCollectionName = \"yourcollection\", target = \"yourtargetclass\"" datamining/classification/oner.js
