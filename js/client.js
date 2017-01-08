


'use strict';

/** @fileoverview */


(function(window, document, app) {

  app.run = function run() {
    var inputElement = document.getElementById('input');

    inputElement.addEventListener('change', function() {
      handleFileUpload.call(
        this.files[0], function(image) {
          var canvas = document.getElementById("mosaic");
          imageToMosaic(image,canvas);

        });
    }, false);
  };


  function handleFileUpload(callback) {
    var img = new Image();
    img.src = window.URL.createObjectURL(this);
    // img.crossOrigin = 'anonymous';
    img.onload = function() { callback(this); }
  };


  function imageToMosaic(image,canvas) {
    var ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;


    var NUM_TILES_X = Math.floor(image.width / TILE_WIDTH) ;
    var NUM_TILES_Y = Math.floor(image.height / TILE_HEIGHT) ;
    //creating avg rgba color code context for image
    var avgRgbContext = CanvasHelper.getImageContextForDimensions(image,NUM_TILES_X, NUM_TILES_Y);
    var avgImageData = avgRgbContext.getImageData(0, 0, NUM_TILES_X, NUM_TILES_Y).data;

    WorkersManager.launchWorkers();

    processRow(0,NUM_TILES_Y,NUM_TILES_X,avgImageData,ctx);

  };



  //processing and rendering each row synchronously
  function processRow(row,NUM_TILES_Y,NUM_TILES_X,imageData,ctx){
    if(row+1 == NUM_TILES_Y){
      return;
    }
    else{
      var promises = [];
      //processing and getting all tile data for each row asynchronously
      for (var col = 0; col < NUM_TILES_X; col++) {
        promises.push(getTilesDataForCoordinates(imageData,NUM_TILES_X,NUM_TILES_Y,row,col));

      }

      Promise.all(promises).then(function(results){
        CanvasHelper.renderRowTilesOnContext(ctx,results)
        processRow(row+1,NUM_TILES_Y,NUM_TILES_X,imageData,ctx)
      })
    }
  }


  function getTilesDataForCoordinates(imageData, NUM_TILES_X, NUM_TILES_Y,row,col) {
    var data = { imageData: imageData, NUM_TILES_X: NUM_TILES_X, NUM_TILES_Y: NUM_TILES_Y,row:row,col:col }
    return WorkersManager.sendDataToProcess(data);
  }


})(window, document, window.app || (window.app = {}));


