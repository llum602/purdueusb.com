suite("lunr.Builder",function(){suite("#add",function(){setup(function(){this.builder=new lunr.Builder}),test("field contains terms that clash with object prototype",function(){this.builder.field("title"),this.builder.add({id:"id",title:"constructor"}),assert.deepProperty(this.builder.invertedIndex,"constructor.title.id"),assert.deepEqual(this.builder.invertedIndex.constructor.title.id,{}),assert.equal(this.builder.fieldTermFrequencies["title/id"].constructor,1)}),test("field name clashes with object prototype",function(){this.builder.field("constructor"),this.builder.add({id:"id",constructor:"constructor"}),assert.deepProperty(this.builder.invertedIndex,"constructor.constructor.id"),assert.deepEqual(this.builder.invertedIndex.constructor.constructor.id,{})}),test("document ref clashes with object prototype",function(){this.builder.field("title"),this.builder.add({id:"constructor",title:"word"}),assert.deepProperty(this.builder.invertedIndex,"word.title.constructor"),assert.deepEqual(this.builder.invertedIndex.word.title.constructor,{})}),test("token metadata clashes with object prototype",function(){var e=function(e){return e.metadata.constructor="foo",e};lunr.Pipeline.registerFunction(e,"test"),this.builder.pipeline.add(e),delete lunr.Pipeline.registeredFunctions.test,this.builder.metadataWhitelist.push("constructor"),this.builder.field("title"),this.builder.add({id:"id",title:"word"}),assert.deepProperty(this.builder.invertedIndex,"word.title.id.constructor"),assert.deepEqual(this.builder.invertedIndex.word.title.id.constructor,["foo"])}),test("extracting nested properties from a document",function(){var e=function(e){return e.person.name};this.builder.field("name",{extractor:e}),this.builder.add({id:"id",person:{name:"bob"}}),assert.deepProperty(this.builder.invertedIndex,"bob.name.id")})}),suite("#field",function(){test("defining fields to index",function(){var e=new lunr.Builder;e.field("foo"),assert.property(e._fields,"foo")}),test("field with illegal characters",function(){var e=new lunr.Builder;assert.throws(function(){e.field("foo/bar")})})}),suite("#ref",function(){test("default reference",function(){var e=new lunr.Builder;assert.equal("id",e._ref)}),test("defining a reference field",function(){var e=new lunr.Builder;e.ref("foo"),assert.equal("foo",e._ref)})}),suite("#b",function(){test("default value",function(){var e=new lunr.Builder;assert.equal(.75,e._b)}),test("values less than zero",function(){var e=new lunr.Builder;e.b(-1),assert.equal(0,e._b)}),test("values higher than one",function(){var e=new lunr.Builder;e.b(1.5),assert.equal(1,e._b)}),test("value within range",function(){var e=new lunr.Builder;e.b(.5),assert.equal(.5,e._b)})}),suite("#k1",function(){test("default value",function(){var e=new lunr.Builder;assert.equal(1.2,e._k1)}),test("values less than zero",function(){var e=new lunr.Builder;e.k1(1.6),assert.equal(1.6,e._k1)})}),suite("#use",function(){setup(function(){this.builder=new lunr.Builder}),test("calls plugin function",function(){var e=!1,t=function(){e=!0};this.builder.use(t),assert.isTrue(e)}),test("sets context to the builder instance",function(){var e=null,t=function(){e=this};this.builder.use(t),assert.equal(e,this.builder)}),test("passes builder as first argument",function(){var e=null,t=function(t){e=t};this.builder.use(t),assert.equal(e,this.builder)}),test("forwards arguments to the plugin",function(){var e=null,t=function(){e=[].slice.call(arguments)};this.builder.use(t,1,2,3),assert.deepEqual(e,[this.builder,1,2,3])})}),suite("#build",function(){setup(function(){var e=new lunr.Builder,t={id:"id",title:"test",body:"missing"};e.ref("id"),e.field("title"),e.add(t),e.build(),this.builder=e}),test("adds tokens to invertedIndex",function(){assert.deepProperty(this.builder.invertedIndex,"test.title.id")}),test("builds a vector space of the document fields",function(){assert.property(this.builder.fieldVectors,"title/id"),assert.instanceOf(this.builder.fieldVectors["title/id"],lunr.Vector)}),test("skips fields not defined for indexing",function(){assert.notProperty(this.builder.invertedIndex,"missing")}),test("builds a token set for the corpus",function(){var e=lunr.TokenSet.fromString("test");assert.include(this.builder.tokenSet.intersect(e).toArray(),"test")}),test("calculates document count",function(){assert.equal(1,this.builder.documentCount)}),test("calculates average field length",function(){assert.equal(1,this.builder.averageFieldLength.title)}),test("index returned",function(){var e=new lunr.Builder,t={id:"id",title:"test",body:"missing"};e.ref("id"),e.field("title"),e.add(t),assert.instanceOf(e.build(),lunr.Index)})})});