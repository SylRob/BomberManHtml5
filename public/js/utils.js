function isCanvasSupported(){
  var elem = document.createElement('canvas');
  return !!(elem.getContext && elem.getContext('2d'));
}

function isTouchable(){
    return !!('ontouchstart' in window);
}
