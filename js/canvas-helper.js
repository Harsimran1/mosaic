
var CanvasHelper = (function(){
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
  }

  function rgbToHex(rgb) {
    return componentToHex(rgb[0]) + componentToHex(rgb[1]) +
      componentToHex(rgb[2]);
  }

   function getOffScreenContext(width, height) {
    var canvas = document.createElement('canvas');
    canvas.width  = width;
    canvas.height = height;
    return canvas.getContext('2d');
  }

   function getImageContextForDimensions(image,width,height){
    var context = this.getOffScreenContext(width,height);
    context.drawImage(image, 0, 0, width, height);
    return context;
  }

  function renderSVGTile(ctx, tile,callback) {
    var img = new Image();
    var url = createSVGUrl(tile.svg);
    img.onload = function() {
      try {
        ctx.drawImage(img, tile.x, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        callback();
      } catch(e) {
        throw new Error('Could not render image' + e);
      }
    };
    img.src = url;
  }


  function createSVGUrl(svg) {
    var svgBlob = new Blob([svg], {type: 'image/svg+xml;charset=utf-8'});
    var DOMURL = window.URL || window.webkitURL;
    return DOMURL.createObjectURL(svgBlob);
  }

  function renderRowTilesOnContext(ctx, tiles) {
    var context = getOffScreenContext(tiles.length * TILE_WIDTH, TILE_HEIGHT);

    tiles.forEach(function(tile, index) {
      renderSVGTile(context, tile ,function() {

        if (tiles.length === index + 1) {
          ctx.drawImage(context.canvas, 0, tiles[0].y);
          ctx.imageSmoothingEnabled = false;
          ctx.mozImageSmoothingEnabled = false;
        }
      });
    });
    }

  return {

    rgbToHex: rgbToHex,
    renderRowTilesOnContext: renderRowTilesOnContext,
    getImageContextForDimensions: getImageContextForDimensions,
    getOffScreenContext: getOffScreenContext

  }

})()
