# node-couch

> CouchDb library for Node.Js

## Installation
```shell
npm install node-couch --save
```

## NPM package
* https://npmjs.com/package/node-couch

## Api
All methods return the current instance so function calls can be chained.

### Setup
```js
var nodeCouch = require('node-couch'),
        _couchDb = new nodeCouch.Client().initialize({
            credentials: {
                userName: 'userName',
                password: 'password'
            },
            url: {
                hostName: 'localhost',
                port: 5984,
                path: '/node-couch/'
            }
        });
```

### Methods

#### Initialize
* configuration - Object.
  * credentials - Object.
    * userName - String. User name to log in with.
    * password - String. Password to log in with.
  * url - Object.
    * hostName - String. Ip/domain name to connect to.
    * path - String. Path to database, including a slash (/) before and after database name. Example: '/some-database/'
    * port - Number. Port to connect to.

```js
_couchDb.initialize(configuration);
```

#### Get document
* documentId - String. Id of document to get.
* onSuccess - Function. Will get a document as argument.
* onError - Function. Will get an error message as argument.

```js
_couchDb.get(documentId, onSuccess, onError);
```

#### Create document
* data - Object. Data of document to create.
* onSuccess - Function. Will get a status object as argument.
* onError - Function. Will get an error message as argument.

```js
_couchDb.post(data, onSuccess, onError);
```

#### Update document
Here the document/data is expected to have the CouchDb internal properties _id & _rev. This can be be achieved by first fetching the document using `_couchDb.get()`, making the updates to that document and then passing it to this function.

* document - Object. Document to update.
* onSuccess - Function. Will get a document as argument.
* onError - Function. Will get an error message as argument.

```js
_couchDb.put(document, onSuccess, onError);
```

#### Delete document
Here the documentInfo is expected to have the CouchDb internal properties _id & _rev. This can be be achieved by first fetching the document using `_couchDb.get()`, making the updates to that document and then passing it to this function.

* documentInfo - Object.
  * _id - String. CouchDb document id.
  * _rev - String. CouchDb document revision.
* onSuccess - Function. Will get a status object as argument.
* onError - Function. Will get an error message as argument.

```js
_couchDb.delete(documentInfo, onSuccess, onError);
```

#### Query view
Will get each document in a view (unless limits/paging are used in the query).

* designDocument - The name of the design document.
* view - The name of the view.
* query - Query to pass along to the view.
* onSuccess - Function. Will get an array of documents as argument.
* onError - Function. Will get an error message as argument.

```js
_couchDb.queryView(designDocument, view, query, onSuccess, onError);
```

#### Transform view
Will transform each document in a view (unless limits/paging are used).

* options - Object.
  * designDocument - The name of the design document. Defaults to null which means no design document will be used.
  * key - CouchDb key parameter. Used for filtering the view.
  * limit - Number of items per page. Defaults to 100.
  * pages - Number of pages to transform. Defaults to null which means all.
  * view - The name of the view. Defaults to '_all_docs' which means all documents in the database will be used.
* action - Object. The action object must have a property called 'apply' that is of type Function.
  * apply - Function to apply to each document. If the function returns the (case senstitive) string `Delete` then the document will be deleted.
* onSuccess - Function. Will get an object with below properties as argument.
  * data - Array of documents.
  * processedDocuments - Number of processed documents.
  * processedPages - Number of processed pages.
* onError - Function. Will get an error message as argument.

```js
_couchDb.transformer(options, action, onSuccess, onError);
```

#### Traverse view
Will traverse each document in a view (unless limits/paging are used), optionally applying an action to each of them.

* options - Object.
  * action - Object. The action object must have a property called 'apply' that is of type Function.
    * apply - Function to apply to each document. If the function returns the (case senstitive) string `Delete` then the document will be deleted.
  * designDocument - The name of the design document. Defaults to null which means no design document will be used.
  * key - CouchDb key parameter. Used for filtering the view.
  * limit - Number of items per page. Defaults to 100.
  * pages - Number of pages to transform. Defaults to null which means all.
  * view - The name of the view. Defaults to '_all_docs' which means all documents in the database will be used.
* onSuccess - Function. Will get an object with below properties as argument.
  * data - Array of documents.
  * processedDocuments - Number of processed documents.
  * processedPages - Number of processed pages.
* onError - Function. Will get an error message as argument.

```js
_couchDb.viewTraverser(options, onSuccess, onError);
```

### Bulk Api

#### Bulk create documents
* records - Array&lt;Object&gt;. Array of data objects to create documents for.
* onSuccess - Function. Will get an array of status objects, an array of successfule status objects and an array of failed status objects as arguments.
* onError - Function. Will get an error message as argument.

```js
_couchDb.bulk.post(records, onSuccess, onError);
```

#### Bulk update documents
Here each document in the array is expected to have the CouchDb internal properties _id & _rev. This can be be achieved by first fetching the document using `_couchDb.get()`, making the updates to that document and then passing it to this function.

* documents - Array&lt;Object&gt;. Array of documents to update.
* onSuccess - Function. Will get an array of status objects, an array of successfule status objects and an array of failed status objects as arguments.
* onError - Function. Will get an error message as argument.

```js
_couchDb.bulk.put(documents, onSuccess, onError);
```

#### Bulk delete documents
Here each document in the array is expected to have the CouchDb internal properties _id & _rev. This can be be achieved by first fetching the document using `_couchDb.get()`, making the updates to that document and then passing it to this function.

* documents - Array&lt;Object&gt;. Array of documents to delete.
* onSuccess - Function. Will get an array of status objects, an array of successfule status objects and an array of failed status objects as arguments.
* onError - Function. Will get an error message as argument.

```js
_couchDb.bulk.delete(documents, onSuccess, onError);
```

### Mappers

#### nodeCouch.Mappers.Response.View
Maps a view response into an array of documents, optionally removing the CouchDb internal properties.

```js
var _viewResponseMapper = new nodeCouch.Mappers.Response.View(),
        _removeInternalProperties = false,
        _documents = _viewResponseMapper.map(viewResponse, _removeInternalProperties);
```

#### nodeCouch.Mappers.Response.Document
Maps a document response into a document object, optionally removing the CouchDb internal properties.

```js
var _documentResponseMapper = new nodeCouch.Mappers.Response.Document(),
        _removeInternalProperties = false,
        _documents = _documentResponseMapper.map(documentResponse, _removeInternalProperties);
```

## Examples

### View Traverser
_Traverse view && return all data_

```js
var nodeCouch = require('node-couch'),
        _couchDb = new nodeCouch.Client().initialize({
            credentials: {
                userName: 'userName',
                password: 'password'
            },
            url: {
                hostName: 'localhost',
                port: 5984,
                path: '/node-couch/'
            }
        });

_couchDb.viewTraverser({
    designDocument: 'SomeType',
    view: 'BySomeId'
}, function (response) {
    var data = new nodeCouch.Mappers.Response.View().map(response.data),
            _documentMapper = new nodeCouch.Mappers.Response.Document();

    for (var d in data) {
        if (!data.hasOwnProperty(d)) continue;

        console.log(_documentMapper.map(data[d]));
    }
}, function (error) {});
```

### Transformer
_Traverse view && apply update to each document_

```js
var nodeCouch = require('node-couch'),
        _couchDb = new nodeCouch.Client().initialize({
            credentials: {
                userName: 'userName',
                password: 'password'
            },
            url: {
                hostName: 'localhost',
                port: 5984,
                path: '/node-couch/'
            }
        });

_couchDb.transformer({
    designDocument: 'SomeType',
    view: 'BySomeId'
}, {
    apply: function (document) {
        if (!document.dummy) {
            document.dummy = 'asdf';
        }
        else {
            delete document['dummy'];
        }

        return document;
    }
}, function (response) {
    console.log(response);
}, function (error) {});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Release History

 * 2016-09-21   v1.0.6   Fixed view response mapper.
 * 2016-08-19   v1.0.5   Fix for weird GitHub Markdown syntax.
 * 2016-08-19   v1.0.4   Fixed typo.
 * 2016-08-19   v1.0.3   Added more docs.
 * 2016-08-19   v1.0.2   Added more docs and removed peerDependencies.
 * 2016-06-13   v1.0.1   Fixed peerDependencies.
 * 2016-05-11   v1.0.0   Initial version.
