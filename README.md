# node-couch

> CouchDb library for Node.Js

## Installation
```shell
npm install node-couch --save
```

## NPM package
* https://npmjs.com/package/node-couch

## Api
All methods return the current namespace and each namespace has a `.parent()` function so function calls can be chained. Additionally, all callback functions are bound to the current namespace, so `this` inside the callbacl will refer to the namespace in the client for the function that was called meaning that you can in an easy way continue to perform further operations once one operation has finished.

### Setup
```js
var nodeCouch = require('node-couch'),
        _couchDb = new nodeCouch.Client().initialize({
            credentials: {
                userName: 'userName',
                password: 'password'
            },
            database: 'node-couch',
            url: {
                hostName: 'localhost',
                port: 5984
            }
        });
```

### Methods

#### Client level

##### .initialize(configuration)
Initialize the client.

_**Parameters:**_
* configuration - Object.
  * credentials - Object. Optional.
    * userName - String. User name to log in with.
    * password - String. Password to log in with.
  * database - String. Database name. Optional.
  * url - Object.
    * hostName - String. Ip/domain name to connect to.
    * port - Number. Port to connect to.

```js
_couchDb.initialize(configuration);
```

##### .configure(configuration)
Get or set the client configuration.

_**Parameters:**_
* configuration - Object. Same as the configuration object in the `.initialize()` function above. Optional.

```js
_couchDb.configure(configuration);
```

##### .credentials(credentials)
Get or set the client credentials configuration.

_**Parameters:**_
* configuration - Object. Same as the credentials part of the configuration object in the `.initialize()` function above. Optional.

```js
_couchDb.credentials(credentials);
```

--------------------------------------------------------------------------------

#### Database level

##### .Database.create(callback)
Creates a database (using the database that is currently configured in the client).

_**Parameters:**_
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Database.create(function (error, response) {});
```

##### .Database.delete(callback)
Deletes a database (using the database that is currently configured in the client).

_**Parameters:**_
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Database.delete(function (error, response) {});
```

##### .Database.exists(callback)
Checks if a database exists (using the database that is currently configured in the client).

_**Parameters:**_
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Database.exists(function (error, response) {});
```

##### .Database.get(callback)
Gets information about a database (using the database that is currently configured in the client).

_**Parameters:**_
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Database.get(function (error, response) {});
```

##### .Database.parent()
Navigates to the parent namespace ([Root level](#client-level)).

```js
_couchDb.Database.parent();
```

##### .Database.select(database)
Selects a new database.

_**Parameters:**_
* database - String. New database.

```js
_couchDb.Database.select('[Database]');
```

--------------------------------------------------------------------------------

#### Design document level

##### .Design.create(designDocument, callback)
Creates a design document. All functions will be serialized to strings.

_**Parameters:**_
* designDocument - Object.
  * _id - String. Can be just an `{id}` or `_design/{id}`, `_design/` will be added if it is not already there.
  * OtherDesignDocumentProperties...
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Design.create({
    _id: '[DesignDocumentId]',
    language: 'javascript',
    views: {}
}, function (error, response) {});
```

##### .Design.delete(designDocumentInfo, callback)
Deletes a design document. All string functions will be deserialized to functions.

_**Parameters:**_
* designDocumentInfo - Object.
  * _id - String. Can be just an `{id}` or `_design/{id}`, `_design/` will be added if it is not already there.
  * _rev - String. Design document revision.
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Design.delete({
    _id: '[DesignDocumentId]',
    _rev: '[DesignDocumentRevision]'
}, function (error, response) {});
```

##### .Design.exists(designDocumentId, callback)
Checks if a design document exists.

_**Parameters:**_
* designDocumentId - String. Can be just an `{id}` or `_design/{id}`, `_design/` will be added if it is not already there.
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Design.exists('[DesignDocumentId]', function (error, response) {});
```

##### .Design.get(designDocumentId, callback)
Gets a design document.

_**Parameters:**_
* designDocumentId - String. Can be just an `{id}` or `_design/{id}`, `_design/` will be added if it is not already there.
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Design.get('[DesignDocumentId]', function (error, response) {});
```

##### .Design.parent()
Navigates to the parent namespace ([Root level](#client-level)).

```js
_couchDb.Design.parent();
```

##### .Design.update(designDocument, callback)
Updates a design document. All functions will be serialized to strings.

_**Parameters:**_
* designDocument - Object.
  * _id - String. Can be just an `{id}` or `_design/{id}`, `_design/` will be added if it is not already there.
  * _rev - String. Design document revision.
  * OtherDesignDocumentProperties...
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Design.update({
    _id: '[DesignDocumentId]',
    _rev: '[DesignDocumentRevision]',
    language: 'javascript',
    views: {}
}, function (error, response) {});
```

--------------------------------------------------------------------------------

#### Document level

##### Bulk document level

###### .Document.Bulk.create(documents, callback)
Bulk creates documents.

_**Parameters:**_
* documents - Array\<Object\>. Array of documents to create.
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response - Object. Populated if successful, otherwise `undefined`.
      * failed - Array\<Object\>;. Array of status objects from CouchDb for documents that failed to create.
      * response - Array\<Object\>. Array of statuses from CouchDb for all documents.
      * successful - Array\<Object\>. Array of status objects from CouchDb for documents that succeeded to create.

```js
_couchDb.Document.Bulk.create(documents, function (error, response) {});
```

###### .Document.Bulk.delete(documents, callback)
Bulk deletes documents. Each document in the array is expected to have the CouchDb internal properties _id & _rev. This can be be achieved by first fetching the document using `.Document.get()` and then passing it to this function.

_**Parameters:**_
* documents - Array\<Object\>. Array of documents to create.
  * _**Document properties:**_
    * _id - String. Document id.
    * _rev - String. Document revision.
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response - Object. Populated if successful, otherwise `undefined`.
      * failed - Array\<Object\>;. Array of status objects from CouchDb for documents that failed to create.
      * response - Array\<Object\>. Array of statuses from CouchDb for all documents.
      * successful - Array\<Object\>. Array of status objects from CouchDb for documents that succeeded to create.

```js
_couchDb.Document.Bulk.create(documents, function (error, response) {});
```

###### .Document.Bulk.parent()
Navigates to the parent namespace ([Document level](#document-level)).

```js
_couchDb.Document.Bulk.parent();
```

###### .Document.Bulk.update(documents, callback)
Bulk updates documents. Each document in the array is expected to have the CouchDb internal properties _id & _rev. This can be be achieved by first fetching the document using `.Document.get()`, making the updates to that document and then passing it to this function.

_**Parameters:**_
* documents - Array\<Object\>. Array of documents to create.
  * _**Document properties:**_
    * _id - String. Document id.
    * _rev - String. Document revision.
    * OtherDocumentProperties...
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response - Object. Populated if successful, otherwise `undefined`.
      * failed - Array\<Object\>. Array of status objects from CouchDb for documents that failed to create.
      * response - Array\<Object\>. Array of statuses from CouchDb for all documents.
      * successful - Array\<Object\>. Array of status objects from CouchDb for documents that succeeded to create.

```js
_couchDb.Document.Bulk.update(documents, function (error, response) {});
```

--------------------------------------------------------------------------------

##### .Document.create(document, callback)
Creates a document.

_**Parameters:**_
* document - Object.
  * _id - String. Optional.
  * OtherDocumentProperties...
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Document.create(document, function (error, response) {});
```

##### .Document.delete(documentInfo, callback)
Deletes a document.

_**Parameters:**_
* documentInfo - Object.
  * _id - String. Document id.
  * _rev - String. document revision.
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Document.delete(documentInfo, function (error, response) {});
```

##### .Document.exists(documentId, callback)
Checks if a document exists.

_**Parameters:**_
* documentId - String. Document id.
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Document.exists(documentId, function (error, response) {});
```

##### .Document.get(documentId, callback)
Gets a document.

_**Parameters:**_
* documentId - String. Document id.
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Document.get(documentId, function (error, response) {});
```

##### .Document.parent()
Navigates to the parent namespace ([Root level](#client-level)).

```js
_couchDb.Document.parent();
```

##### .Document.update(document, callback)
Updates a document.

_**Parameters:**_
* document - Object.
  * _id - String. Document id.
  * _rev - String. Document revision.
  * OtherDocumentProperties...
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Document.update(document, function (error, response) {});
```

--------------------------------------------------------------------------------

#### Server level

##### .Server.databases(callback)
Gets a list of databases.

_**Parameters:**_
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Server.databases(function (error, response) {});
```

##### .Server.get(callback)
Gets information about the server.

_**Parameters:**_
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Server.databases(function (error, response) {});
```

##### \[NotImplemented\] .Server.login(callback)
Logs in to the server. Throws a NotImplemented exception.

_**Parameters:**_
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Server.login(function (error, response) {});
```

##### \[NotImplemented\] .Server.logout(callback)
Logs out of the server. Throws a NotImplemented exception.

_**Parameters:**_
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Server.logout(function (error, response) {});
```

##### .Server.parent()
Navigates to the parent namespace ([Root level](#client-level)).

```js
_couchDb.Server.parent();
```

##### \[NotImplemented\] .Server.session(callback)
Gets session information. Throws a NotImplemented exception.

_**Parameters:**_
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.Server.session(function (error, response) {});
```

--------------------------------------------------------------------------------

#### View level

##### .View.parent()
Navigates to the parent namespace ([Root level](#client-level)).

```js
_couchDb.View.parent();
```

##### .View.query(options, callback)
Queries a view. Will get each document in the view (unless limits/paging are used in the query).

_**Parameters:**_
* options - Object.
  * designDocumentId - String. Can be just an `{id}` or `_design/{id}`, `_design/` will be added if it is not already there.
  * query - String. Query to pass along to the view.
  * view - String. The name of the view.
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response. Passed through from CouchDb if successful, otherwise `undefined`.

```js
_couchDb.View.query({
    designDocument: 'SomeType',
    query: 'key="SomeKey"',
    view: 'BySomeId'
}, function (error, response) {});
```

##### .View.transform(options, action, callback)
Transforms all documents of a view. Will transform each document in a view (unless limits/paging are used).

_**Parameters:**_
* options - Object.
  * designDocumentId - String. Can be just an `{id}` or `_design/{id}`, `_design/` will be added if the option is specified and it is not already there. Defaults to null which means no design document will be used.
  * key - String. CouchDb key parameter. Used for filtering the view.
  * limit - Number. Number of items per page. Defaults to 100.
  * pages - Number. Number of pages. Defaults to null which means all.
  * view - String. The name of the view. Defaults to '_all_docs' which means all documents in the database will be used.
* action - Function. Function to apply to each document. If the function returns the (case senstitive) string `Delete` then the document will be deleted. Otherwise it is expected that the function will return the updated document.
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response - Object. Populated if successful, otherwise `undefined`.
      * response - Array\<Object\>. Array of documents.
      * processedDocuments - Number. Number of processed documents.
      * processedPages - Number. Number of processed pages.

```js
_couchDb.View.transform({}, function (document) {}, function (error, response) {});
```

##### .View.traverse(options, callback)
Traverses a view. Will traverse each document in a view (unless limits/paging are used), optionally applying an action to each of them.

_**Parameters:**_
* options - Object.
  * action - Function. Function to apply to each document. If the function returns the (case senstitive) string `Delete` then the document will be deleted. Otherwise it is expected that the function will return the updated document.
  * designDocumentId - String. Can be just an `{id}` or `_design/{id}`, `_design/` will be added if the option is specified and it is not already there. Defaults to null which means no design document will be used.
  * key - String. CouchDb key parameter. Used for filtering the view.
  * limit - Number. Number of items per page. Defaults to 100.
  * pages - Number. Number of pages. Defaults to null which means all.
  * view - String. The name of the view. Defaults to '_all_docs' which means all documents in the database will be used.
* callback - Function. Optional.
  * _**Callback parameters:**_
    * error - Object. Populated if an error occurred, otherwise `null`.
    * response - Object. Populated if successful, otherwise `undefined`.
      * response - Array\<Object\>. Array of documents.
      * processedDocuments - Number. Number of processed documents.
      * processedPages - Number. Number of processed pages.

```js
_couchDb.View.traverse({}, function (error, response) {});
```

--------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------

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
            database: 'node-couch',
            url: {
                hostName: 'localhost',
                port: 5984
            }
        });

_couchDb.View.traverse({
    designDocument: 'SomeType',
    view: 'BySomeId'
}, function (error, response) {
    if (error) {
        console.log(error);

        return;
    }

    var data = new nodeCouch.Mappers.Response.View().map(response.data),
            _documentMapper = new nodeCouch.Mappers.Response.Document();

    for (var d in data) {
        if (!data.hasOwnProperty(d)) continue;

        console.log(_documentMapper.map(data[d]));
    }
});
```

### View Transformer
_Traverse view && apply update to each document_

```js
var nodeCouch = require('node-couch'),
        _couchDb = new nodeCouch.Client().initialize({
            credentials: {
                userName: 'userName',
                password: 'password'
            },
             database: 'node-couch',
             url: {
                 hostName: 'localhost',
                 port: 5984
             }
        });

_couchDb.transformer({
    designDocument: 'SomeType',
    view: 'BySomeId'
}, function (document) {
    if (!document.dummy) {
        document.dummy = 'asdf';
    }
    else {
        delete document['dummy'];
    }

    return document;
}, function (error, response) {
    if (error) {
        console.log(error);

        return;
    }

    console.log(response);
});
```

--------------------------------------------------------------------------------

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

## Release History

 * 2017-09-13   v2.2.1   Minor bugfix.
 * 2017-09-12   v2.2.0   Deserialize functions when getting design documents.
 * 2017-09-06   v2.1.0   Serialize functions when creating or updating design documents.
 * 2017-09-06   v2.0.0   2.0.0 Rewrite.
 * 2016-09-21   v1.0.6   Fixed view response mapper.
 * 2016-08-19   v1.0.5   Fix for weird GitHub Markdown syntax.
 * 2016-08-19   v1.0.4   Fixed typo.
 * 2016-08-19   v1.0.3   Added more docs.
 * 2016-08-19   v1.0.2   Added more docs and removed peerDependencies.
 * 2016-06-13   v1.0.1   Fixed peerDependencies.
 * 2016-05-11   v1.0.0   Initial version.