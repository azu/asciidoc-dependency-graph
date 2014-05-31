"use strict";
var Q = require("q");
var FS = require("q-io/fs");
var pather = require("path");
var minimatch = require("minimatch");

function AsciidocDependency(options) {
    this.options = options;
}

function readFilePromise(filePath) {
    return FS.read(filePath);
}

AsciidocDependency.prototype.parse = function (callback) {
    var that = this;
    return this._fileListPromise().then(function (filePathList) {
        var filePromises = filePathList.map(function (filePath) {
            return readFilePromise(filePath);
        });
        return that._buildObject(filePromises, filePathList);
    }).nodeify(callback);
};

AsciidocDependency.prototype._buildObject = function (filePromises, filePathList) {
    var that = this;
    return Q.all(filePromises).then(function (fileContentList) {
        return fileContentList.map(function (fileContent, index) {
            return {
                filePath: filePathList[index],
                ids: that.pickUpIDs(fileContent),
                referenceIds: that.pickUpLinks(fileContent)
            };
        });
    });
};
AsciidocDependency.prototype._fileListPromise = function fileListPromise() {
    var separator = (this.options.pattern.lastIndexOf('/', 0) === 0) ? '' : '/',
        pattern = this.options.cwd + separator + this.options.pattern;

    return FS.listTree(this.options.cwd, function isAsciiDoc(filePath, stat) {
        if (stat.isDirectory()) {
            return false;
        }
        return minimatch(filePath, pattern);
    });
};
AsciidocDependency.prototype.pickUpLinks = function pickUpLinks(content) {
    var idRegExp = /<<([^>,]*).*?>>/g;
    var results = [];
    var matches;
    while ((matches = idRegExp.exec(content)) !== null) {
        var code = matches[1];
        results.push(code.trim());
    }
    return results;
};
AsciidocDependency.prototype.pickUpIDs = function pickUpIDs(content) {
    var idRegExp = /\[\[(.*?)\]\]/g;
    var results = [];
    var matches;
    while ((matches = idRegExp.exec(content)) !== null) {
        var code = matches[1];
        results.push(code);
    }
    return results;
};

module.exports = AsciidocDependency;