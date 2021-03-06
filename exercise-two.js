'use strict';

var Promise = require('bluebird'),
    async = require('async'),
    exerciseUtils = require('./utils');

var readFile = exerciseUtils.readFile,
    promisifiedReadFile = exerciseUtils.promisifiedReadFile,
    green = exerciseUtils.green,
    red = exerciseUtils.red;

var args = process.argv.slice(2).map(function(st){ return st.toUpperCase(); });

module.exports = {
  problemA: problemA,
  problemB: problemB,
  problemC: problemC,
  problemD: problemD,
  problemE: problemE
};

// runs every problem given as command-line argument to process
args.forEach(function(arg){
  var problem = module.exports['problem' + arg];
  if (problem) problem();
});

function problemA () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * A. log poem two stanza one and stanza two, in any order
   *    but log 'done' when both are done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  // // callback version
  // async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- A. callback version --');
  //       green(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- A. callback version done --');
  //   }
  // );

  // promise version
  // ???
  var p1 = promisifiedReadFile('poem-two/stanza-01.txt');
  var p2 = promisifiedReadFile('poem-two/stanza-02.txt');

  Promise.all([p1, p2]).then(function(results) {

    for (var i = 0; i < results.length; i++) {
      green(results[i]);
    }
    console.log('done');
  });
}

function problemB () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * B. log all the stanzas in poem two, in any order
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in parallel (simultaneously)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // callback version
  // async.each(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- B. callback version --');
  //       green(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- B. callback version done --');
  //   }
  // );

  // promise version
  // ???

  var promisesArray = [];

  for (var i = 0; i < filenames.length; i++) {
    promisesArray.push(promisifiedReadFile(filenames[i]));
  };

  Promise.all(promisesArray).then(function(results) {

    for (var i = 0; i < results.length; i++) {
      green(results[i]);
    }
    console.log('done');
  });
}


function problemC () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * C. read & log all the stanzas in poem two, *in order*
   *    and log 'done' when they're all done
   *    (ignore errors)
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });

  // // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- C. callback version --');
  //       green(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     console.log('-- C. callback version done --');
  //   }
  // );

  // promise version
  // ???

  var promisesArray = [];

  for (var i = 0; i < filenames.length; i++) {
    promisesArray.push(promisifiedReadFile(filenames[i]));
  };

  Promise.each(promisesArray, function(result) {
      green(result);
  }).then(function(result){
     console.log('done');
  })


  // Promise.reduce(promisesArray, (function(accumulator, next) {
  //     return accumulator += '\n' + next;
  //   }), "").then(function(accumulator){
  //     green(accumulator);
  //     console.log('done');
  //   });

  }

function problemD () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * D. log all the stanzas in poem two, *in order*
   *    making sure to fail for any error and log it out
   *    and log 'done' when they're all done
   *    note: reads are occurring in series (only when previous finishes)
   *
   */

  var filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return 'poem-two/' + 'stanza-0' + n + '.txt';
  });
  var randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = 'wrong-file-name-' + (randIdx + 1) + '.txt';

  // // callback version
  // async.eachSeries(filenames,
  //   function (filename, eachDone) {
  //     readFile(filename, function (err, stanza) {
  //       console.log('-- D. callback version --');
  //       if (err) return eachDone(err);
  //       green(stanza);
  //       eachDone();
  //     });
  //   },
  //   function (err) {
  //     if (err) red(err);
  //     console.log('-- D. callback version done --');
  //   }
  // );

  // promise version
  // ???
    var promisesArray = [];

  for (var i = 0; i < filenames.length; i++) {
    promisesArray.push(promisifiedReadFile(filenames[i]));
  };

  Promise.each(promisesArray, function(result, err) {
      green(result);
  }).then(function(result){
     console.log('done');
  }).catch(function(err){
    red(err);
    console.log('done');
  })

}

function problemE () {
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * *
   *
   * E. make a promisifed version of fs.writeFile
   *
   */

  var fs = require('fs');
  function promisifiedWriteFile (filename, str) {
    return new Promise(function (resolve, reject) {
      fs.writeFile(filename, str, function(err, str){
        if (err) reject(err);
        else resolve(str);
      })
    })
  }
}

