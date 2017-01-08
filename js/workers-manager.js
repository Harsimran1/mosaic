var WorkersManager = (function(){
  var _workersPool = [],
    _workersCount = 4,
    _index = 0,
    _handlers = [];

    function launchWorkers() {
    // Launching every worker
    for (var i = 0; i < _workersCount; i++) {
      var worker = new Worker("js/worker.js");
      worker.onmessage = onWorkerMessage;
      // add to pool
      _workersPool.push(worker);
    }
  }

    function onWorkerMessage(e) {
      var handler = _handlers[e.data.index];
      if (e.data.err) {
        handler.reject(e.data.err);
      } else {
        handler.resolve(e.data.result);
      }
    }

    function getWorker() {
      var index = 0;

      function getWorkerFromPool() {
        var worker = _workersPool[index];
        if (index === _workersCount - 1) {
          index = 0;
        } else {
          index++;
        }
        return worker;
      }

      return getWorkerFromPool();


    }

    function sendDataToProcess(data){
      _index++;
      var promise = new Promise(function(resolve,reject){
        _handlers[_index] = {
          resolve: resolve,
          reject: reject
        }
        data.index = _index;
        getWorker().postMessage(data);
      })
      return promise;
    }

    return {
      getWorker: getWorker,
      launchWorkers: launchWorkers,
      sendDataToProcess: sendDataToProcess

    };

})();


