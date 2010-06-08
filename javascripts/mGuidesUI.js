/*
  mGuides
  Version: 1.0.0
  
  Copyright (c) 2010 Meta100 LLC.
  
  Permission is hereby granted, free of charge, to any person
  obtaining a copy of this software and associated documentation
  files (the "Software"), to deal in the Software without
  restriction, including without limitation the rights to use,
  copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following
  conditions:
  
  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.
  
  Except as contained in this notice, the name(s) of the above 
  copyright holders shall not be used in advertising or otherwise 
  to promote the sale, use or other dealings in this Software 
  without prior written authorization.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  OTHER DEALINGS IN THE SOFTWARE.
*/

if (jQuery && jQuery.ui) {

  (function () {
  
    if (jQuery.ui.draggable) {

      if (jQuery.ui.draggable.defaults) {

        jQuery.extend(jQuery.ui.draggable.defaults, {
          guide : true,
          guidecolor : ['blue', 'red', 'green', 'yellow'],
          guidestyle : 'dashed',
          guideinner : false,
          guidecenter : true,
          guidepadding : 0
        });
      } else {

        jQuery.extend(jQuery.ui.draggable.prototype.options, {
          guide : true,
          guidecolor : ['blue', 'red', 'green', 'yellow'],
          guidestyle : 'dashed',
          guideinner : false,
          guidecenter : true,
          guidepadding : 0
        });
      }
    
      jQuery.ui.plugin.add("draggable", "guides", {
      	start: function(event, ui) {
    
      		var i = jQuery(this).data("draggable"), o = i.options;
      		i.guideElements = [];
    
      		jQuery(o.guides.constructor != String ? (o.guides.items || ':data(draggable)') : o.guides).each(function() {
    
       			var $t = jQuery(this), $o = $t.offset(), $p = $t.position();
    
      			if (this != i.element[0]) i.guideElements.push({
    
      				item: this,
      				width: $t.outerWidth(),
      				height: $t.outerHeight(),
      				position_top: $p.top,
      				position_left: $p.left,
      				top: $o.top,
      				left: $o.left,
      				inner: false
      			});
      		});
    
          if (o.guideinner) {
    
        		jQuery(o.guideinner).each(function() {
      
        			var $t = jQuery(this), $o = $t.offset(), $p = $t.position();
      
        			i.guideElements.push({
      
        				item: this,
        				width: $t.outerWidth(),
        				height: $t.outerHeight(),
        				position_top: $p.top,
        				position_left: $p.left,
        				top: $o.top,
        				left: $o.left,
        				inner: true
        			});
        		});
      		}
      	},
    
      	drag: function(event, ui) {
    
      		var i = jQuery(this).data("draggable"),
        		  o = i.options;

          var ih = i.helperProportions,
        		  im = i.margins,
        		  d = o.snapTolerance,
        		  p = o.guidepadding,
        		  g = o.guide,
        		  s = o.guidestyle,
        		  cg = o.guidecenter,
        		  c1 = o.guidecolor[0],
        		  c2 = o.guidecolor[1],
        		  c3 = o.guidecolor[2],
        		  c4 = o.guidecolor[3],
        		  x1 = ui.offset.left,
        		  x2 = x1 + ih.width,
        		  y1 = ui.offset.top,
        		  y2 = y1 + ih.height;
    
      		for (var n = i.guideElements.length - 1; n >= 0; n--){
    
      			var l = i.guideElements[n].left,
        		    r = l + i.guideElements[n].width,
        		    t = i.guideElements[n].top,
        		    b = t + i.guideElements[n].height,
        		    ip = i.guideElements[n].inner,
        		    lp = l - p,
        		    rp = r + p,
        		    tp = t - p,
        		    bp = b + p,
        		    li = l + p,
        		    ri = r - p,
        		    ti = t + p,
        		    bi = b - p,
        		    cv = l + (i.guideElements[n].width - ih.width) / 2,
        		    ch = t + (i.guideElements[n].height - ih.height) / 2,
          		  xc = l + i.guideElements[n].width / 2,
          		  yc = t + i.guideElements[n].height / 2,
          		  td = i.guideElements[n].top,
          		  ld = i.guideElements[n].left,
                drawGuides = [];
    
       			if (cg && cv - d < x1 && cv + d > x1) {  //Center Vert SNAP ;)
    
      				ui.position.left = i._convertPositionTo("relative", {left: cv}).left - im.left;
        		  x1 = xc,
              drawGuides[1] = true;
            }
    
       			if (cg && ch - d < y1 && ch + d > y1) {  //Center Horz SNAP ;)
    
      				ui.position.top = i._convertPositionTo("relative", {top: ch}).top - im.top;
        		  y1 = yc;
              drawGuides[2] = true;
            }
    
       			if (t - d < y1 && t + d > y1) { //Top SNAP ;)
    
      				ui.position.top = i._convertPositionTo("relative", {top: t}).top - im.top;
        		  y1 = t;
              drawGuides[3] = true;
            } else if (t - d < y2 && t + d > y2) {
    
              ui.position.top = i._convertPositionTo("relative", {top: t - ih.height}).top - im.top;
        		  y1 = t - ih.height;
              drawGuides[3] = true;
            } else if (p > 0 && !ip && tp - d < y2 && tp + d > y2) {
    
              ui.position.top = i._convertPositionTo("relative", {top: tp + 2 - ih.height}).top - im.top;
        		  y1 = tp - ih.height;
              drawGuides[4] = true;
            } else if (p > 0 && ip && ti - d < y1 && ti + d > y1) {
    
              ui.position.top = i._convertPositionTo("relative", {top: ti}).top - im.top;
        		  y1 = ti;
              drawGuides[5] = true;
            }
    
            if (l - d < x1 && l + d > x1) { //Left SNAP ;)
    
      				ui.position.left = i._convertPositionTo("relative", {left: l}).left - im.left;
        		  x1 = l,
              drawGuides[6] = true;
            } else if (l - d < x2 && l + d > x2) {
    
              ui.position.left = i._convertPositionTo("relative", {left: l - ih.width}).left - im.left;
        		  x1 = l - ih.width,
              drawGuides[6] = true;
            } else if (p > 0 && !ip && lp - d < x2 && lp + d > x2) {
    
              ui.position.left = i._convertPositionTo("relative", {left: lp + 1 - ih.width}).left - im.left;
        		  x1 = lp - ih.width,
              drawGuides[7] = true;
            } else if (p > 0 && ip && li - d < x1 && li + d > x1) {
    
              ui.position.left = i._convertPositionTo("relative", {left: li}).left - im.left;
        		  x1 = li,
              drawGuides[8] = true;
            }
    
            if (b - d < y1 && b + d > y1) { //Bottom SNAP ;)
    
              ui.position.top = i._convertPositionTo("relative", {top: b}).top - im.top;
        		  y1 = b;
              drawGuides[9] = true;
            } else if (b - d < y2 && b + d > y2) {
    
              ui.position.top = i._convertPositionTo("relative", {top: b - ih.height}).top - im.top;
        		  y1 = b - ih.height;
              drawGuides[9] = true;
            } else if (p > 0 && !ip && bp - d < y1 && bp + d > y1) {
    
              ui.position.top = i._convertPositionTo("relative", {top: bp}).top - im.top;
        		  y1 = bp;
              drawGuides[10] = true;
            } else if (p > 0 && ip && bi - d < y2 && bi + d > y2) {
    
              ui.position.top = i._convertPositionTo("relative", {top: bi + 1 - ih.height}).top - im.top;
        		  y1 = bi - ih.height;
              drawGuides[11] = true;
            }
    
            if (r - d < x1 && r + d > x1) { //Right SNAP ;)
    
              ui.position.left = i._convertPositionTo("relative", {left: r}).left - im.left;
        		  x1 = r,
              drawGuides[12] = true;
            } else if (r - d < x2 && r + d > x2) {
    
              ui.position.left = i._convertPositionTo("relative", {left: r - ih.width}).left - im.left;
        		  x1 = r - ih.width,
              drawGuides[12] = true;
            } else if (p > 0 && !ip && rp - d < x1 && rp + d > x1) {
    
              ui.position.left = i._convertPositionTo("relative", {left: rp}).left - im.left;
        		  x1 = rp,
              drawGuides[13] = true;
            } else if (p > 0 && ip && ri - d < x2 && ri + d > x2) {
    
              ui.position.left = i._convertPositionTo("relative", {left: ri + 1 - ih.width}).left - im.left;
        		  x1 = ri - ih.width,
              drawGuides[14] = true;
            }

            if (g) {

        		  x2 = x1 + ih.width;
        		  y2 = y1 + ih.height;
    
              if (drawGuides[1]) drawGuide(t, y2, y1, b, xc, c3, 1, s, 1);
              if (drawGuides[2]) drawGuide(l, x1, x2, r, yc, c3, 0, s, 2);
              if (drawGuides[3]) drawGuide(l, x1, x2, r, (i.guideElements[n].inner)?t:t + 1, c1, 0, s, 3);
              if (drawGuides[4]) drawGuide(l, x1, x2, r, tp + 1, c2, 0, s, 4);
              if (drawGuides[5]) drawGuide(l, x1, x2, r, ti, c4, 0, s, 5);
              if (drawGuides[6]) drawGuide(t, y2, y1, b, l, c1, 1, s, 6);
              if (drawGuides[7]) drawGuide(t, y2, y1, b, lp, c2, 1, s, 7);
              if (drawGuides[8]) drawGuide(t, y2, y1, b, li + 1, c4, 1, s, 8);
              if (drawGuides[9]) drawGuide(l, x1, x2, r, (i.guideElements[n].inner)?b - 1:b, c1, 0, s, 9);
              if (drawGuides[10]) drawGuide(l, x1, x2, r, bp, c2, 0, s, 10);
              if (drawGuides[11]) drawGuide(l, x1, x2, r, bi, c4, 0, s, 11);
              if (drawGuides[12]) drawGuide(t, y2, y1, b, r - 1, c1, 1, s, 12);
              if (drawGuides[13]) drawGuide(t, y2, y1, b, rp -  1, c2, 1, s, 13);
              if (drawGuides[14]) drawGuide(t, y2, y1, b, ri, c4, 1, s, 14);
            }
      		}
      	}
      });
    }
  
    if (jQuery.ui.resizable) {

      if (jQuery.ui.resizable.defaults) {

        jQuery.extend(jQuery.ui.resizable.defaults, {
          guide : true,
          guidecolor : ['blue', 'red', 'green', 'yellow'],
          guidestyle : ['dashed'],
          guideinner : false,
          guidecenter : true,
          guidepadding : 0,
      		snapTolerance: 20
        });
      } else {

        jQuery.extend(jQuery.ui.resizable.prototype.options, {
          guide : true,
          guidecolor : ['blue', 'red', 'green', 'yellow'],
          guidestyle : ['dashed'],
          guideinner : false,
          guidecenter : true,
          guidepadding : 0,
      		snapTolerance: 20
        });
      }
    
      jQuery.ui.plugin.add("resizable", "guides", {
      	start: function(event, ui) {
    
      		var i = jQuery(this).data("resizable"),
      		    o = i.options,
      		    currOffset = jQuery(this).offset(),
      		    currPos = jQuery(this).position();
      		i.guideElements = [];
          jQuery(this).data("resizable").offsetDiff = {
            top: currOffset.top - currPos.top,
            left: currOffset.left - currPos.left
          };

      		jQuery(o.guides.constructor != String ? (o.guides.items || ':data(resizable)') : o.guides).each(function() {
    
      			var $t = jQuery(this), $o = $t.offset(), $p = $t.position();
    
      			if (this != i.element[0]) i.guideElements.push({
    
      				item: this,
      				width: $t.outerWidth(),
      				height: $t.outerHeight(),
      				position_top: $p.top,
      				position_left: $p.left,
      				top: $o.top,
      				left: $o.left,
      				inner: false
      			});
      		});
    
          if (o.guideinner) {
    
        		jQuery(o.guideinner).each(function() {
      
        			var $t = jQuery(this), $o = $t.offset(), $p = $t.position();
      
        			i.guideElements.push({
      
        				item: this,
        				width: $t.outerWidth() - 1,
        				height: $t.outerHeight() - 1,
        				position_top: $p.top,
        				position_left: $p.left,
        				top: $o.top,
        				left: $o.left,
        				inner: true
        			});
         		});
      		}
      	},
    
      	resize: function(event, ui) {
    
      		var i = jQuery(this).data("resizable"),
        		  o = i.options,
        		  ih = i.helperProportions,
        		  im = i.margins,
        		  p = o.guidepadding,
        		  g = o.guide,
        		  s = o.guidestyle,
        		  d = o.snapTolerance,
        		  cg = o.guidecenter,
        		  c1 = o.guidecolor[0],
        		  c2 = o.guidecolor[1],
        		  c3 = o.guidecolor[2],
        		  c4 = o.guidecolor[3],
              a = i.axis,
        		  wd = i.sizeDiff.width,
        		  hd = i.sizeDiff.height,
        		  td = i.offsetDiff.top,
        		  ld = i.offsetDiff.left,
        		  x1 = i.position.left + i.offsetDiff.left,
        		  x2 = x1 + i.size.width + wd,
        		  y1 = i.position.top + i.offsetDiff.top,
        		  y2 = y1 + i.size.height + hd;
 
      		for (var n = i.guideElements.length - 1; n >= 0; n--){
    
      			var l = i.guideElements[n].left,
        		    r = l + i.guideElements[n].width,
        		    t = i.guideElements[n].top,
        		    b = t + i.guideElements[n].height,
        		    ip = i.guideElements[n].inner,
        		    lp = l - p,
        		    rp = r + p,
        		    tp = t - p,
        		    bp = b + p,
        		    li = l + p,
        		    ri = r - p,
        		    ti = t + p,
        		    bi = b - p,
        		    cv = l + (i.guideElements[n].width - ui.size.width) / 2,
        		    ch = t + (i.guideElements[n].height - ui.size.height) / 2,
          		  xc = l + i.guideElements[n].width / 2,
          		  yc = t + i.guideElements[n].height / 2,
                drawGuides = [];
    
            if (a.indexOf('n') > -1) {
    
         			if (t - d < y1 && t + d > y1) { //Top SNAP ;)
 
                i.size.height = ((i.originalSize.height + i.originalPosition.top + td) - t);
                i.position.top = t - td;

                drawGuides[3] = true;
              } else if (p > 0 && ip && ti - d < y1 && ti + d > y1) {
      
                i.size.height = ((i.originalSize.height + i.originalPosition.top + td) - ti);
                i.position.top = ti - td;
      
                drawGuides[4] = true;
              }
    
              if (b - d < y1 && b + d > y1) { //Bottom SNAP ;)
      
                i.size.height = ((i.originalSize.height + i.originalPosition.top + td) - b);
                i.position.top = b - td;
      
                drawGuides[11] = true;
              } else if (p > 0 && !ip && bp - d < y1 && bp + d > y1) {
      
                i.size.height = ((i.originalSize.height + i.originalPosition.top + td) - bp);
                i.position.top = bp - td;
      
                drawGuides[12] = true;
              }
            }
      
            if (a.indexOf('w') > -1) {
    
              if (l - d < x1 && l + d > x1) { //Left SNAP ;)
      
                i.size.width = ((i.originalSize.width + i.originalPosition.left + ld) - l);
                i.position.left = l - ld;
      
                drawGuides[7] = true;
              } else if (p > 0 && ip && li - d < x1 && li + d > x1) {
    
                i.size.width = ((i.originalSize.width + i.originalPosition.left + ld) - li);
                i.position.left = li - ld;
      
                drawGuides[8] = true;
              }
    
              if (r - d < x1 && r + d > x1) { //Right SNAP ;)
      
                i.size.width = ((i.originalSize.width + i.originalPosition.left + ld) - r);
                i.position.left = r - ld;
      
                drawGuides[15] = true;
              } else if (p > 0 && !ip && rp - d < x1 && rp + d > x1) {
      
                i.size.width = ((i.originalSize.width + i.originalPosition.left + ld) - rp);
                i.position.left = rp - 1 - ld;
      
                drawGuides[16] = true;
              }
            }
      
            if (a.indexOf('s') > -1) {
    
              if (t - d < y2 && t + d > y2) { //Top SNAP ;)
      
                i.size.height = (t - y1) - hd;
      
                drawGuides[5] = true;
              } else if (p > 0 && !ip && tp - d < y2 && tp + d > y2) {
      
                i.size.height = (tp - y1) - hd;
      
                drawGuides[6] = true;
              }
    
              if (b - d < y2 && b + d > y2) { //Bottom SNAP ;)
    
                i.size.height = (b - y1) - hd;
      
                drawGuides[13] = true;
              } else if (p > 0 && ip && bi - d < y2 && bi + d > y2) {
      
                i.size.height = (bi + 1 - y1) - hd;
      
                drawGuides[14] = true;
              }
            }
      
            if (a.indexOf('e') > -1) {
    
              if (l - d < x2 && l + d > x2) { //Left SNAP ;)
      
                i.size.width = (l - x1) - wd;
      
                drawGuides[9] = true;
              } else if (p > 0 && !ip && lp - d < x2 && lp + d > x2) {
      
                i.size.width = (lp + 1 - x1) - wd;
      
                drawGuides[10] = true;
              }
    
              if (r - d < x2 && r + d > x2) { //Right SNAP ;)
      
                i.size.width = (((i.guideElements[n].inner)?r + 1:r) - x1) - wd;
      
                drawGuides[17] = true;
              } else if (p > 0 && ip && ri - d < x2 && ri + d > x2) {
      
                i.size.width = (ri + 1 - x1) - wd;
      
                drawGuides[18] = true;
              }
            }

            if (g) {

        		  x1 = i.position.left + ld,
        		  x2 = x1 + i.size.width + wd,
        		  y1 = i.position.top + td,
        		  y2 = y1 + i.size.height + hd;
    
              if (drawGuides[3]) drawGuide(l, x1, x2, r, (i.guideElements[n].inner)?t:t, c1, 0, s, 3);
              if (drawGuides[4]) drawGuide(l, x1, x2, r, ti, c4, 0, s, 4);
              if (drawGuides[11]) drawGuide(l, x1, x2, r, b - 1, c1, 0, s, 11);
              if (drawGuides[12]) drawGuide(l, x1, x2, r, bp, c2, 0, s, 12);
              if (drawGuides[7]) drawGuide(t, y2, y1, b, l, c1, 1, s, 7);
              if (drawGuides[8]) drawGuide(t, y2, y1, b, li, c4, 1, s, 8);
              if (drawGuides[15]) drawGuide(t, y2, y1, b, r - 1, c1, 1, s, 15);
              if (drawGuides[16]) drawGuide(t, y2, y1, b, rp - 1, c2, 1, s, 16);
              if (drawGuides[5]) drawGuide(l, x1, x2, r, t, c1, 0, s, 5);
              if (drawGuides[6]) drawGuide(l, x1, x2, r, tp - 1, c2, 0, s, 6);
              if (drawGuides[13]) drawGuide(l, x1, x2, r, (i.guideElements[n].inner)?b:b - 1, c1, 0, s, 13);
              if (drawGuides[14]) drawGuide(l, x1, x2, r, bi, c4, 0, s, 14);
              if (drawGuides[9]) drawGuide(t, y2, y1, b, l, c1, 1, s, 9);
              if (drawGuides[10]) drawGuide(t, y2, y1, b, lp, c2, 1, s, 10);
              if (drawGuides[17]) drawGuide(t, y2, y1, b, (i.guideElements[n].inner)?r:r - 1, c1, 1, s, 17);
              if (drawGuides[18]) drawGuide(t, y2, y1, b, ri, c4, 1, s, 18);
            }
      		}
      	}
      });
    }
    
    var drawGuide = function (n1, n2, n3, n4, n5, c, b, s, i) {
  
      if (jQuery("#snapGuide_" + i).length < 1) jQuery("body").append('<div id="snapGuide_' + i +'"></div>');
  
    	if (b == 0) var l = Math.min(n1, n2, n3, n4), w = (Math.max(n1, n2, n3, n4) - l), h = 1, t = n5, d = 'border-top';
    	else var t = Math.min(n1, n2, n3, n4), h = (Math.max(n1, n2, n3, n4) - t), w = 1, l = n5, d = 'border-left';
  
    	jQuery("#snapGuide_" + i).css(d, '1px ' + s +' ' + c).css({
    	  'height' : h + 'px',
    	  'z-index' : '999999',
    	  'position' : 'absolute',
    	  'display' : 'block',
    	  'top' : t + 'px',
    	  'left' : l + 'px',
    	  'width' : w + 'px'
    	}).fadeOut(1500, function () {
  
        jQuery("#snapGuide_" + i).css('border', '0');
    	});
    };
  })();
}