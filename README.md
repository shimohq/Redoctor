# Redoctor
Redis doctor for understanding how the memory is used in your Redis server

## Install

```
$ npm instal -g redoctor
```

## Usage

```
$ redoctor --help
  Usage: index [options]


  Options:

    -V, --version              output the version number
    -p, --port [port]          redis port
    -h, --host [host]          redis host
    -a, --auth [auth]          redis password
    --scan-pattern [pattern]   filter keys by pattern
    --strip-pattern [pattern]  strip key name by pattern
    -t, --task [task]          task [memory]
    --aliyun                   Aliyun redis cluster compatible mode
    -h, --help                 output usage information
```
