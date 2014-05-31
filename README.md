# asciidoc-dependency-graph [![Build Status](https://travis-ci.org/azu/asciidoc-dependency-graph.svg)](https://travis-ci.org/azu/asciidoc-dependency-graph)

Generate dependency-graph JSON tree from [AsciiDoc](http://www.methods.co.nz/asciidoc/ "AsciiDoc").

## Installation

``` sh
npm install asciidoc-dependency-graph
```

## Usage

``` js
var adocDependency = new AsciidocDependency({
    "cwd": __dirname,
    "pattern": "fixtures/*.adoc"
});
adocDependency.parse().then(function (array) {
    console.log(array);
}).catch(console.error.bind(console));
// or
adocDependency.parse(function(error,array){
    console.log(array);
});
/*
[
{ filePath: '/Users/azu/Dropbox/workspace/JavaScript/library/asciidoc-dependency-graph/test/fixtures/x.adoc',
    ids: [ 'x-doc' ],
    referenceIds: [] },
{ filePath: '/Users/azu/Dropbox/workspace/JavaScript/library/asciidoc-dependency-graph/test/fixtures/y.adoc',
    ids: [ 'y-doc', 'embed-y-code' ],
    referenceIds: [ 'x-doc' ] }
]
*/
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT