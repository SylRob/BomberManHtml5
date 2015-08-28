function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}

function isTouchable(){
    return !!('ontouchstart' in window);
}

function transformHexa( hex ){
    return hex.replace("#", "0x");
}
