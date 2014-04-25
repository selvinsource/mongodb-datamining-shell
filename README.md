mongodb-datamining-shell
========================

MongoDB shell implementation of the simple yet accurate OneR classification algorithm.

Installation
--------------

```sh
git clone https://github.com/selvinsource/mongodb-datamining-shell.git
cd mongodb-datamining-shell
mongoimport --db mongodbdm --collection weatherData --type csv --headerline --file dataset/weatherData.csv
mongo mongodbdm --eval "var inputCollectionName = \"weatherData\", target = \"play\"" datamining/classification/oner.js
```
