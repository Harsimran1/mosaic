
importScripts('mosaic.js');
importScripts('http-client.js');
importScripts('canvas-helper.js');

var SVG_URL = '/color/';

function getSvg(data) {
  return HttpClient.Get(SVG_URL + data.hexColor )
    .then(function(svg) { return {svg: svg, x: data.x, y: data.y}; })
    .catch(function(error) {
      // One or more promises were rejected
      console.log(error);
    });
};

function Tile( x, y, imageData) {
  this.x = x * TILE_WIDTH;
  this.y = y * TILE_HEIGHT;
  this.hexColor = CanvasHelper.rgbToHex(imageData);
};



this.onmessage = function(event) {

  var NUM_TILES_X = Math.floor(event.data.NUM_TILES_X);
  var imageData = event.data.imageData;
  var row = event.data.row;
  var col = event.data.col;

  var tile = new Tile(col, row, imageData.subarray(col * 4 +row * NUM_TILES_X * 4, col * 4 +row * NUM_TILES_X * 4 + 3));

  getSvg(tile).then(function(result){
    this.postMessage({
      index: event.data.index,
      result: result
    });
  });

}