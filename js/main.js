/**
 * @fileoverview
 * Demonstrates pixel perfect collision detection utilizing image masks.
 *
 * A 'spear' is moved around with mouse or cursors keys - the text 'COLLISION'
 * appears if the spear pixel collides with the unit.
 *
 * gamejs.mask.fromSurface is used to create two pixel masks
 * that do the actual collision detection.
 *
 */
 var gamejs = require('gamejs');
 var pixelcollision = require('gamejs/pixelcollision');
 var $angles = require('gamejs/math/angles');
 var $v = require('gamejs/math/vectors');

 function main() {

   var bg = gamejs.image.load('../images/TD/nivel1.png'); 
   var display = gamejs.display.getSurface([1352,692]);
   console.log(display.getRect().height);
   var spear = gamejs.image.load('../images/spear.png');
   var unit = gamejs.image.load('../images/TD/torretanormal.png');
   // create image masks from surface
   var mUnit = new pixelcollision.Mask(unit);
   var mSpear = new pixelcollision.Mask(spear);
   var dir = 'r';
   var angle = 0;
   var manangl = 0;
   var unitPosition = [650, 300];
   var spearPosition = [0, 0];

   var font = new gamejs.font.Font('20px monospace');

   var direction = {};
   direction[gamejs.event.K_UP] = [0, -1];
   direction[gamejs.event.K_DOWN] = [0, 1];
   direction[gamejs.event.K_LEFT] = [-1, 0];
   direction[gamejs.event.K_RIGHT] = [1, 0];
   gamejs.event.onKeyUp(function(event) {

   });
   gamejs.event.onKeyDown(function(event) {
      var delta = direction[event.key];
      if (delta) {
         spearPosition = $v.add(spearPosition, delta);
      }
   });

/*   gamejs.event.onMouseMotion(function(event) {
      if (display.rect.collidePoint(event.pos)) {
         var y = event.pos[0]-(unitPosition[0]+mUnit.getSize()[0]/2);
         var x = (unitPosition[1]+mUnit.getSize()[1]/2)-event.pos[1];
         manangl = $angles.degrees(Math.atan(x/y));
         if(y<0){
            manangl+=180;
         }else if(x<0){
            manangl+=360;
         }
         console.log(manangl);
         console.log(x+","+y)
      }
   });
*/
   gamejs.onTick(function() {
      switch(dir){
         case 'r':
         spearPosition = $v.add(spearPosition, [display.getRect().width/50,0]);
         if(spearPosition[0]+mSpear.getSize()[0]>=display.getRect().width){
            spearPosition[0]=display.getRect().width-mSpear.getSize()[0];
            dir = 'd';
            angle = 90;
         }
         break;
         case 'd':
         spearPosition = $v.add(spearPosition, [0,display.getRect().height/50]);
         if(spearPosition[1]+mSpear.getSize()[1]>=display.getRect().height){
            spearPosition[1]=display.getRect().height-mSpear.getSize()[1];
            dir = 'l';
            angle = 180;
         }
         break;
         case 'l':
         spearPosition = $v.add(spearPosition, [-display.getRect().width/50,0]);
         if(spearPosition[0]<=0){
            spearPosition[0]=0;
            dir = 'u';
            angle = 270;
         }
         break;
         case 'u':
         spearPosition = $v.add(spearPosition, [0,-display.getRect().height/50]);
         if(spearPosition[1]<=0){
            spearPosition[1]=0;
            dir = 'r';
            angle = 0;
         }
         break;
      }
      var y = (spearPosition[0]+mSpear.getSize()[0]/2)-(unitPosition[0]+mUnit.getSize()[0]/2);
      var x = (unitPosition[1]+mUnit.getSize()[1]/2)-(spearPosition[1]+mSpear.getSize()[1]/2);
      manangl = $angles.degrees(Math.atan(x/y));
      if(y<0){
         manangl+=180;
      }else if(x<0){
         manangl+=360;
      }
      // draw
      display.clear();
      display.blit(bg, [0,0]);
      gamejs.graphics.line(display, "#ff0000", [unitPosition[0]+mUnit.getSize()[0]/2,unitPosition[1]+mUnit.getSize()[1]/2],
         [spearPosition[0]+mSpear.getSize()[0]/2,spearPosition[1]+mSpear.getSize()[1]/2], 3)
      var sp = new gamejs.graphics.Surface(mSpear.overlapRect(mSpear));
      sp.blit(spear, [0,0]);
      display.blit(sp.rotate(angle), spearPosition);
      var un = new gamejs.graphics.Surface(mUnit.overlapRect(mUnit));
      un.blit(unit,[0,0]);
      display.blit(un.rotate(-manangl), unitPosition);
      // collision
      // the relative offset is automatically calculated by
      // the higher-level gamejs.sprite.collideMask(spriteA, spriteB)
      var relativeOffset = $v.subtract(spearPosition, unitPosition);
      var hasMaskOverlap = mUnit.overlap(mSpear, relativeOffset);
   });
};

gamejs.preload([
   '../images/spear.png',
   '../images/unit.png',
   '../images/TD/nivel1.png',
   '../images/TD/torretanormal.png',
   ]);
gamejs.ready(main);