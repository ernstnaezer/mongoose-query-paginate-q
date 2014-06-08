/**
 * test
 */
//var should = require('should');
var assert = require('assert');

var mongoose = require('mongoose');
require('../index');

var Q = require('q');

var conn = mongoose.createConnection('mongodb://localhost/query-test');
//conn.db.dropDatabase();

var CommentSchema = new mongoose.Schema({
  number: Number,
  name: String,
  body: String
});
var Comment = conn.model('Comment', CommentSchema);

describe('paginate', function() {

  before(function(done) {
    return Comment.remove({}, function(err) {
      insert(1, 100, done);
    });

    function insert(i, max, fn) {
      if (i > max) return fn();

      new Comment({
        number: i,
        name: 'name' + i,
        body: 'body' + i
      }).save(function(err) {
        if (err) {
          console.log(err);
          fn(err);
          return;
        }
        insert(++i, max, fn);
      });
    }

  });

  after(function() {
    conn.close();
  });

  it('default pager', function(done) {
    Comment.find().paginateQ({})
    .fail(function(err){
      assert.equal(err, null);
      done(err);
    })
    .then(function(pager) {
      assert.equal(pager.count, 100);
      assert.equal(pager.current, 1);
      assert.equal(pager.last, 10);
      assert.equal(pager.prev, null);
      assert.equal(pager.next, 2);
      assert.equal(pager.pages.join(','), '1,2,3,4,5,6');
      done();
    });
  });

  it('options.page', function(done) {
    Comment.find().paginateQ({page: 2})
    .fail(function(err){
      assert.equal(err, null);
      done(err);
    })
    .then(function(pager) {
      assert.equal(pager.current, 2);
      assert.equal(pager.prev, 1);
      assert.equal(pager.next, 3);
      done();
    });
  });

  it('options.perPage', function(done) {
    Comment.find().paginateQ({perPage: 5})
    .fail(function(err){
      assert.equal(err, null);
      done(err);
    })
    .then(function(pager) {
      assert.equal(pager.results.length, 5);
      done();
    });
  });

  it('options.delta', function(done) {
    Comment.find().paginateQ({delta: 3})
    .fail(function(err){
      assert.equal(err, null);
      done(err);
    })
    .then(function(pager) {
      assert.equal(pager.pages.join(','), '1,2,3,4');
      done();
    });
  });

  it('options.delta & page', function(done) {
    Comment.find().paginateQ({delta: 3, page: 4})
    .fail(function(err){
      assert.equal(err, null);
      done(err);
    })
    .then(function(pager) {
      assert.equal(pager.pages.join(','), '1,2,3,4,5,6,7');
      done();
    });
  });

  it('options.offset', function(done) {
    Comment.find().sort('number').paginateQ({offset: 2})
    .fail(function(err){
      assert.equal(err, null);
      done(err);
    })
    .then(function(pager) {
      assert.equal(pager.results[0].number, 3);
      done();
    });
  });

  it('options.offset & page', function(done) {
    Comment.find().sort('number').paginateQ({offset: 2, page: 2, perPage: 5})
    .fail(function(err){
      assert.equal(err, null);
      done(err);
    })
    .then(function(pager) {
      assert.equal(pager.results[0].number, 8);
      done();
    });
  });

  it('custom query', function(done) {
    var query = Comment.find().where('number').lte(50).sort('-number');
    query.paginateQ({})
    .fail(function(err){
      assert.equal(err, null);
      done(err);
    })
    .then(function(pager) {
      var numbers = pager.results.map(function(v) {
        return v.number;
      });
      assert.equal(numbers.join(','), [50,49,48,47,46,45,44,43,42,41].join(','));
      done();
    });
  });

  it('no data', function(done) {
    var query = Comment.find().where('number').gt(1000);
    query.paginateQ({})
    .fail(function(err){
      assert.equal(err, null);
      done(err);
    })
    .then(function(pager) {
      assert.equal(pager.count, 0);
      assert.equal(pager.prev, null);
      assert.equal(pager.next, null);
      done();
    });
  });

});
