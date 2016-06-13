# node-couch

> CouchDb library for Node.Js

## Installation
```shell
npm install node-couch --save
```

## Api
_ToDoc_

### Examples

#### View Traverser
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

#### Transformer
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

 * 2016-06-13   v1.0.1   Fixed peerDependencies.
 * 2016-05-11   v1.0.0   Initial version.
