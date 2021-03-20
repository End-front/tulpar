'use strict';

window.requestAnimFrame = function(){
  return (
      window.requestAnimationFrame       || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame    || 
      window.oRequestAnimationFrame      || 
      window.msRequestAnimationFrame     || 
      function(callback){
          window.setTimeout(callback, 16.666);
      }
  );
}();

function smoothScrollToCoords(block, setting) {
  if (setting == undefined) {
    setting = null
  }
  if (typeof block == 'string') {
    block = document.querySelector(block);
  }
  
  let curentScroll = pageYOffset,
  distanse = block.getBoundingClientRect().top,
  startDocumentHeight = 0,
  duration = 1000;
  if(setting.listenChange === undefined) {
    setting.listenChange = true;
  } 

  if (setting.margin) {
    distanse = distanse - setting.margin;
  }
  if (setting.duration) {
    duration = setting.duration;
  }

  if (setting.positionBlock == 'top') {

  } else if (setting.positionBlock == 'bottom') {
    distanse = block.getBoundingClientRect().top + block.offsetHeight - document.documentElement.clientHeight ;
    if (setting.margin) {
      distanse = distanse + setting.margin;
    }
  } else if (setting.positionBlock == 'center') {
    distanse = block.getBoundingClientRect().top + block.offsetHeight/2 - document.documentElement.clientHeight/2;
    if (setting.margin) {
      distanse = distanse + setting.margin;
    }
  }

  if (setting.listenChange) {
    startDocumentHeight = fullHeightDocument();
  }

  if (setting.speed) {
    duration = Math.abs(Math.ceil(distanse/setting.speed)) * 100;
  }

  if ('scrollTo' in window) {
    let start = null;
    requestAnimFrame(function animate(time) {
      let differenceScroll = 0;
      if (setting.listenChange) {
        differenceScroll = fullHeightDocument() - startDocumentHeight;
      }

      if (start === null) start = time;

      let timeFraction = (time - start) / duration;

      if (timeFraction > 1) timeFraction = 1;

      let progress = Math.sin((timeFraction * Math.PI) / 2);
      window.scrollTo(0, curentScroll + (distanse + differenceScroll)* progress);
      
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    })
  } else {
    document.documentElement.scrollTop = block.getCoords().top
  }
}

function getCoords(elem) {
  let box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    bottom: box.top + elem.offsetHeight + pageYOffset,
    left: box.left + pageXOffset
  };
}

function fullHeightDocument() {
  return Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
}