define([], function () {
  var defaultSize = 50;
  return {
    data: {},
    createDataObject: function (name) {
      this.data[name] = {measures: [], lastStart: 0, size: defaultSize, cache: {sum: 0, n: 0}};
    },
    time: function (name) {
      if(this.data[name] === undefined)
        this.createDataObject(name);
      this.data[name].lastStart = new Date().getTime();
    },
    timeEnd: function (name, cache) {
      var time = new Date().getTime() - this.data[name].lastStart;
      if(cache) {
        this.data[name].cache.sum += time;
        this.data[name].cache.n++;
      }
      else {
        this.data[name].measures.push(time);
        this.cut(name);
      }
    },
    cut: function (name) {
      while(this.data[name].measures.length > this.data[name].size)
        this.data[name].measures.shift();
    },
    getAvgTime: function(name) {
      return this.data[name].measures.reduce(function (prev, curr) {
        return prev + curr;
      }) / this.data[name].measures.length;
    },
    getPartOf: function(name, ofName) {
      var t = this.getAvgTime(name);
      var allTime = this.getAvgTime(ofName);
      return (100*t/allTime).toFixed(2)+"%";
    },
    clear: function (name) {
      this.data[name].n = 0;
      this.data[name].time = 0;
    },
    processCache: function (name, canBeEmpty) {
      if(canBeEmpty) {
        if(this.data[name] === undefined)
          return;
      }
      var time = this.data[name].cache.sum;
      this.data[name].measures.push(time);
      this.data[name].cache.sum = 0;
      this.data[name].cache.n = 0;
      this.cut(name);
    },
    setSize: function (name, size) {
      if(this.data[name] === undefined)
        this.createDataObject(name);
      this.data[name].size = size;
    }
  };
});
