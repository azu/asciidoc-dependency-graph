/**
 * Created by azu on 2014/05/30.
 * LICENSE : MIT
 */
"use strict";

var _ = require("lodash");
var pather = require("path");
var assert = require("power-assert");
var AsciidocDependency = require("../lib/asciidoc-dependency");
var shouldFulfilled = require("promise-test-helper").shouldFulfilled;
var shouldRejected = require("promise-test-helper").shouldRejected;
describe("AsciidocDependency", function () {
    var adocDependency = new AsciidocDependency({
        "cwd": __dirname,
        "pattern": "fixtures/*.adoc"
    });
    describe("#fileListPromise", function () {
        it("should return fileList promise", function () {
            var promises = adocDependency._fileListPromise();
            return promises.then(function (fileList) {
                assert(fileList.length === 2);
            });
        });
    });
    describe("#pickUpIDs", function () {
        context("when has not id", function () {
            var doc = "test document";
            it("should return empty array", function () {
                var results = adocDependency.pickUpIDs(doc);
                assert(results.length === 0);
            });
        });
        context("when has [[id]]", function () {
            var ids = ["id", "test"];
            var doc = "[[id]]\ntest\n[[test]] document";
            it("should return array of ids", function () {
                var results = adocDependency.pickUpIDs(doc);
                assert(results.length === 2);
                assert(results[0] === ids[0]);
                assert(results[1] === ids[1]);
            });
        });
    });
    describe("#pickUpLinks", function () {
        context("when has not link", function () {
            var doc = "test document";
            it("should return empty array", function () {
                var results = adocDependency.pickUpLinks(doc);
                assert(results.length === 0);
            });
        });
        context("when has <<id>>", function () {
            var ids = ["id"];
            var doc = "<<id>>";
            it("should return array of ids", function () {
                var results = adocDependency.pickUpLinks(doc);
                assert(results.length === ids.length);
                assert(results[0] === ids[0]);
            });
        });
        context("when has <<id,text>>", function () {
            var ids = ["id"];
            var doc = "<< id , text>>";
            it("should return array of ids", function () {
                var results = adocDependency.pickUpLinks(doc);
                assert(results.length === ids.length);
                assert(results[0] === ids[0]);
            });
        });
        context("when has a number of <<id>>", function () {
            var ids = ["id", "日本語"];
            var doc = "<< id , text>> test is <<日本語, nihongo>>";
            it("should return array of ids", function () {
                var results = adocDependency.pickUpLinks(doc);
                assert(results.length === ids.length);
                assert(results[0] === ids[0]);
                assert(results[1] === ids[1]);
            });
        });
    });
    describe("#parse", function () {
        it("should return object", function () {
            return shouldFulfilled(adocDependency.parse()).then(function (result) {
                assert(Array.isArray(result));
                assert(result.length === 2);
            });
        });
        it("object has fileName as key", function () {
            return shouldFulfilled(adocDependency.parse()).then(function (object) {
                var fileNameList = _.pluck(object, "filePath").map(function (filePath) {
                    return pather.basename(filePath);
                });
                assert(_.contains(fileNameList, "x.adoc"));
                assert(_.contains(fileNameList, "y.adoc"));
            });
        });
        context("About x.adoc", function () {
            var yObject;
            before(function (done) {
                return adocDependency.parse().then(function (array) {
                    yObject = _.find(array, function (object) {
                        return pather.basename(object.filePath) === "y.adoc";
                    });
                    done();
                });
            });
            it("object has 'ids' and 'referenceIds'", function () {
                assert(Array.isArray(yObject.ids));
                assert(Array.isArray(yObject.referenceIds));
            });
            it("ids are [[y-doc]] and [[embed-y-code]]", function () {
                assert(_.contains(yObject.ids, "y-doc"));
                assert(_.contains(yObject.ids, "embed-y-code"));
            });
            it("reference ids are [[x-doc]]", function () {
                assert(_.contains(yObject.referenceIds, "x-doc"));
                assert(_.contains(yObject.referenceIds, "test.js"));

            });
        });
    });
});