## mongoose-query-paginate-q

[Mongoose](https://github.com/LearnBoost/mongoose) Query paginate.

## Installation

    $ npm install mongoose-query-paginate-q

## Example

    require('mongoose-query-paginate');
    var options = {
      perPage: 10,
      delta  : 3,
      page   : req.query.p
    };
    var query = MyModel.find({deleted: false}).sort('name', 1);
    query.paginateQ(options)
    .fail(function(err){
        // handle error
    })
    .then(function(res) {
      console.log(res); // => res = {
        //  options: options,               // paginate options
        //  results: [Document, ...],       // mongoose results
        //  current: 5,                     // current page number
        //  last: 12,                       // last page number
        //  prev: 4,                        // prev number or null
        //  next: 6,                        // next number or null
        //  pages: [ 2, 3, 4, 5, 6, 7, 8 ], // page numbers
        //  count: 125                      // document count
      //};
    });

## License

The MIT License

## Note

This code is for 99.9% based on what lowol wrote in the [mongoose-query-paginate](https://github.com/lowol/mongoose-query-paginate) library.
