'use strict'

var Table = require('easy-table')

var KEY_COUNT_LIMIT = 500

module.exports = function (redis, args) {
  var ret = {}
  var keyCount = 0

  function printRet () {
    var t = new Table()
    var keys = Object.keys(ret)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      t.cell('Key', key)
      t.cell('Count', ret[key].count)
      t.cell('Size', args.aliyun ? 'Unknown' : ret[key].size)
      t.newRow()
    }
    t.sort([(args.aliyun ? 'Count' : 'Size') + '|des'])
    process.stdout.write('\x1B[2J\x1B[0f\u001b[0;0H');
    console.log(t.toString())
  }
  printRet()
  var interval = setInterval(printRet, 1000)

  whileScan(Object.assign({redis: redis}, args), function (keys, sizes) {
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      if (ret[key]) {
        ret[key].count += 1
        ret[key].size += sizes[i]
      } else {
        keyCount += 1
        if (keyCount > KEY_COUNT_LIMIT) {
          throw new Error('Key count exceeds ' + KEY_COUNT_LIMIT)
        }
        ret[key] = {
          count: 1,
          size: sizes[i]
        }
      }
    }
  }).then(function () {
    printRet()
    process.exit(0)
  }).catch(function (err) {
    throw err
  })
}

function whileScan (args, tick) {
  if (!args.cursor) {
    args.cursor = '0'
  }
  return scan(args).then(function (res) {
    tick(res.keys, res.sizes)
    if (!res.finished) {
      return whileScan(args, tick)
    }
  })
}

function scan (args) {
  var params = [args.cursor || '0', 'COUNT', '100']
  if (args.scanPattern) {
    params.push('MATCH', args.scanPattern)
  }

  var command = args.aliyun ? 'iscan' : 'scan'
  if (args.aliyun) {
    params.unshift('0')
  }
  return args.redis.call(command, params).then(function (res) {
    args.cursor = String(res[0])

    var keys = res[1] || []
    var retKeys = []
    var sizes = []
    if (args.stripPattern) {
      var regex = new RegExp(args.stripPattern)
      for (var i = 0; i < keys.length; i++) {
        retKeys[i] = keys[i].replace(regex, '')
      }
    } else {
      retKeys = keys
    }

    return Promise.all(keys.map(function (key, index) {
      return getSize(args, key).then(function (size) {
        sizes[index] = size
      })
    })).then(function () {
      return {
        finished: args.cursor === '0',
        keys: retKeys,
        sizes: sizes
      }
    })
  })
}

function getSize (args, key) {
  if (args.aliyun) {
    return 0
  }

  return args.redis.debug('object', key).then(function (ret) {
    return Number(ret.match(/serializedlength:(\d+)/)[1])
  })
}
