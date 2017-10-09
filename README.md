# Redoctor
Redis doctor for understanding how the memory is used in your Redis server

## Install

```sh
$ npm install -g redoctor
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
    -c, --count [count]        scan count per time, default: 100
    -t, --task [task]          task [memory]
    --aliyun                   Aliyun redis cluster compatible mode
    -h, --help                 output usage information
```

## Test

```sh
$ npm test
```

Output:

```
Key  Count  Size
---  -----  ----
n:   434    868
o:   410    820
d:   404    808
p:   404    808
r:   402    804
y:   400    800
b:   399    798
c:   396    792
h:   395    790
f:   394    788
w:   392    784
g:   391    782
u:   387    774
j:   387    774
e:   384    768
s:   381    762
v:   381    762
i:   375    750
t:   372    744
z:   371    742
x:   370    740
q:   369    738
a:   358    716
k:   350    700
l:   347    694
m:   347    694
```