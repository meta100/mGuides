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

if ($ && $.ui) {

  (function () {
  
    if ($.ui.draggable) {

      if ($.ui.draggable.defaults) {

        $.extend($.ui.draggable.defaults, {
          guide : true,
          guidecolor : ['blue', 'red', 'green', 'yellow'],
          guidestyle : 'dashed',
          guideinner : false,
          guidecenter : true,
          guidepadding : 0
        });
      } else {

        $.extend($.ui.draggable.prototype.options, {
          guide : true,
          guidecolor : ['blue', 'red', 'green', 'yellow'],
          guidestyle : 'dashed',
          guideinner : false,
          guidecenter : true,
          guidepadding : 0
        });
      }
    
      $.ui.plugin.add("draggable", "guides", {
      	start: function(event, ui) {
    
      		var i = $(this).data("draggable"), o = i.options;
      		i.guideElements = [];
    
      		$(o.guides.constructor != String ? (o.guides.items || ':data(draggable)') : o.guides).each(function() {
    
       			var $t = $(this), $o = $t.offset(), $p = $t.position();
    
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
    
        		$(o.guideinner).each(function() {
      
        			var $t = $(this), $o = $t.offset(), $p = $t.position();
      
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
    
      		var i = $(this).data("draggable"),
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
          		  td = i.guideElements[n].top - i.guideElements[n].position_top,
          		  ld = i.guideElements[n].left - i.guideElements[n].position_left,
                drawGuides = [];
    
       			if (cg && cv - d < x1 && cv + d > x1) {  //Center Vert SNAP ;)
    
      				ui.position.left = i._convertPositionTo("relative", {left: cv}).left - im.left;
    
              drawGuides[1] = true;
            }
    
       			if (cg && ch - d < y1 && ch + d > y1) {  //Center Horz SNAP ;)
    
      				ui.position.top = i._convertPositionTo("relative", {top: ch}).top - im.top;
    
              drawGuides[2] = true;
            }
    
       			if (t - d < y1 && t + d > y1) { //Top SNAP ;)
    
      				ui.position.top = i._convertPositionTo("relative", {top: t}).top - im.top;
    
              drawGuides[3] = true;
            } else if (t - d < y2 && t + d > y2) {
    
              ui.position.top = i._convertPositionTo("relative", {top: t - ih.height}).top - im.top;
    
              drawGuides[3] = true;
            } else if (p > 0 && !ip && tp - d < y2 && tp + d > y2) {
    
              ui.position.top = i._convertPositionTo("relative", {top: tp - ih.height}).top - im.top;
    
              drawGuides[4] = true;
            } else if (p > 0 && ip && ti - d < y1 && ti + d > y1) {
    
              ui.position.top = i._convertPositionTo("relative", {top: ti}).top - im.top;
    
              drawGuides[5] = true;
            }
    
            if (l - d < x1 && l + d > x1) { //Left SNAP ;)
    
      				ui.position.left = i._convertPositionTo("relative", {left: l}).left - im.left;
    
              drawGuides[6] = true;
            } else if (l - d < x2 && l + d > x2) {
    
              ui.position.left = i._convertPositionTo("relative", {left: l - ih.width}).left - im.left;
    
              drawGuides[6] = true;
            } else if (p > 0 && !ip && lp - d < x2 && lp + d > x2) {
    
              ui.position.left = i._convertPositionTo("relative", {left: lp - ih.width}).left - im.left;
    
              drawGuides[7] = true;
            } else if (p > 0 && ip && li - d < x1 && li + d > x1) {
    
              ui.position.left = i._convertPositionTo("relative", {left: li}).left - im.left;
    
              drawGuides[8] = true;
            }
    
            if (b - d < y1 && b + d > y1) { //Bottom SNAP ;)
    
              ui.position.top = i._convertPositionTo("relative", {top: b}).top - im.top;
    
              drawGuides[9] = true;
            } else if (b - d < y2 && b + d > y2) {
    
              ui.position.top = i._convertPositionTo("relative", {top: b - ih.height}).top - im.top;
    
              drawGuides[9] = true;
            } else if (p > 0 && !ip && bp - d < y1 && bp + d > y1) {
    
              ui.position.top = i._convertPositionTo("relative", {top: bp}).top - im.top;
    
              drawGuides[10] = true;
            } else if (p > 0 && ip && bi - d < y2 && bi + d > y2) {
    
              ui.position.top = i._convertPositionTo("relative", {top: bi + 1 - ih.height}).top - im.top;
    
              drawGuides[11] = true;
            }
    
            if (r - d < x1 && r + d > x1) { //Right SNAP ;)
    
              ui.position.left = i._convertPositionTo("relative", {left: r}).left - im.left;
    
              drawGuides[12] = true;
            } else if (r - d < x2 && r + d > x2) {
    
              ui.position.left = i._convertPositionTo("relative", {left: r - ih.width}).left - im.left;
    
              drawGuides[12] = true;
            } else if (p > 0 && !ip && rp - d < x1 && rp + d > x1) {
    
              ui.position.left = i._convertPositionTo("relative", {left: rp}).left - im.left;
    
              drawGuides[13] = true;
            } else if (p > 0 && ip && ri - d < x2 && ri + d > x2) {
    
              ui.position.left = i._convertPositionTo("relative", {left: ri + 1 - ih.width}).left - im.left;
    
              drawGuides[14] = true;
            }
    
            if (g) {
    
              var ct = $(this).position().top,
                  cb = $(this).position().top + ih.height
                  cl = $(this).position().left,
                  cr = $(this).position().left + ih.width;
    
              if (drawGuides[1]) drawGuide(t - td, cb, ct, b - td, xc, c3, 1, s, 1);
              if (drawGuides[2]) drawGuide(l, cl + ld, cr + ld, r, yc - td, c3, 0, s, 2);
              if (drawGuides[3]) drawGuide(l, cl + ld, cr + ld, r, (i.guideElements[n].inner)?t - td:t - td + 1, c1, 0, s, 3);
              if (drawGuides[4]) drawGuide(l, cl + ld, cr + ld, r, tp - td + 1, c2, 0, s, 4);
              if (drawGuides[5]) drawGuide(l, cl + ld, cr + ld, r, ti - td, c4, 0, s, 5);
              if (drawGuides[6]) drawGuide(t - td, cb, ct, b - td, l, c1, 1, s, 6);
              if (drawGuides[7]) drawGuide(t - td, cb, ct, b - td, lp, c2, 1, s, 7);
              if (drawGuides[8]) drawGuide(t - td, cb, ct, b - td, li + 1, c4, 1, s, 8);
              if (drawGuides[9]) drawGuide(l, cl + ld, cr + ld, r, (i.guideElements[n].inner)?b - td - 1:b - td, c1, 0, s, 9);
              if (drawGuides[10]) drawGuide(l, cl + ld, cr + ld, r, bp - td, c2, 0, s, 10);
              if (drawGuides[11]) drawGuide(l, cl + ld, cr + ld, r, bi - td, c4, 0, s, 11);
              if (drawGuides[12]) drawGuide(t - td, cb, ct, b - td, r - 1, c1, 1, s, 12);
              if (drawGuides[13]) drawGuide(t - td, cb, ct, b - td, rp -  1, c2, 1, s, 13);
              if (drawGuides[14]) drawGuide(t - td, cb, ct, b - td, ri, c4, 1, s, 14);
            }
      		}
      	}
      });
    }
  
    if ($.ui.resizable) {

      if ($.ui.draggable.defaults) {

        $.extend($.ui.resizable.defaults, {
          guide : true,
          guidecolor : ['blue', 'red', 'green', 'yellow'],
          guidestyle : ['dashed'],
          guideinner : false,
          guidecenter : true,
          guidepadding : 0,
      		snapTolerance: 20
        });
      } else {

        $.extend($.ui.resizable.prototype.options, {
          guide : true,
          guidecolor : ['blue', 'red', 'green', 'yellow'],
          guidestyle : ['dashed'],
          guideinner : false,
          guidecenter : true,
          guidepadding : 0,
      		snapTolerance: 20
        });
      }
    
      $.ui.plugin.add("resizable", "guides", {
      	start: function(event, ui) {
    
      		var i = $(this).data("resizable"), o = i.options;
      		i.guideElements = [];
    
      		$(o.guides.constructor != String ? (o.guides.items || ':data(resizable)') : o.guides).each(function() {
    
      			var $t = $(this), $o = $t.offset(), $p = $t.position();
    
      			if (this != i.element[0]) i.guideElements.push({
    
      				item: this,
      				width: $t.outerWidth(),
      				height: $t.outerHeight(),
      				offset_top: $o.top,
      				offset_left: $o.left,
      				top: $p.top,
      				left: $p.left,
      				inner: false
      			});
      		});
    
          if (o.guideinner) {
    
        		$(o.guideinner).each(function() {
      
        			var $t = $(this), $o = $t.offset(), $p = $t.position();
      
        			i.guideElements.push({
      
        				item: this,
        				width: $t.outerWidth() - 1,
        				height: $t.outerHeight() - 1,
        				offset_top: $o.top,
        				offset_left: $o.left,
        				top: $p.top,
        				left: $p.left,
        				inner: true
        			});
        		});
      		}
      	},
    
      	resize: function(event, ui) {
    
      		var i = $(this).data("resizable"),
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
        		  x1 = i.position.left,
        		  x2 = x1 + i.size.width + wd,
        		  y1 = i.position.top,
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
          		  td = i.guideElements[n].offset_top - i.guideElements[n].top,
          		  ld = i.guideElements[n].offset_left - i.guideElements[n].left;
    
            if (a.indexOf('n') > -1) {
    
         			if (t - d < y1 && t + d > y1) { //Top SNAP ;)
      
                i.size.height = ((i.originalSize.height + i.originalPosition.top) - t);
                i.position.top = (i.guideElements[n].inner)?t - 1:t;
      
                if (g) drawGuide(l + ld, x1 + ld, x2 + ld, r + ld, (i.guideElements[n].inner)?t:t + 1, c1, 0, s, 3);
              } else if (p > 0 && ip && ti - d < y1 && ti + d > y1) {
      
                i.size.height = ((i.originalSize.height + i.originalPosition.top) - ti);
                i.position.top = ti;
      
                if (g) drawGuide(l + ld, x1 + ld, x2 + ld, r + ld, ti + 1, c4, 0, s, 4);
              }
    
              if (b - d < y1 && b + d > y1) { //Bottom SNAP ;)
      
                i.size.height = ((i.originalSize.height + i.originalPosition.top) - b);
                i.position.top = b;
      
                if (g) drawGuide(l + ld, x1 + ld, x2 + ld, r + ld, (i.guideElements[n].inner)?b - 1:b, c1, 0, s, 11);
              } else if (p > 0 && !ip && bp - d < y1 && bp + d > y1) {
      
                i.size.height = ((i.originalSize.height + i.originalPosition.top) - bp);
                i.position.top = bp;
      
                if (g) drawGuide(l + ld, x1 + ld, x2 + ld, r + ld, bp, c2, 0, s, 12);
              }
            }
      
            if (a.indexOf('w') > -1) {
    
              if (l - d < x1 && l + d > x1) { //Left SNAP ;)
      
                i.size.width = ((i.originalSize.width + i.originalPosition.left) - l);
                i.position.left = (i.guideElements[n].inner)?l - 1:l;
      
                if (g) drawGuide(t, y2, y1, b, l + ld, c1, 1, s, 7);
              } else if (p > 0 && ip && li - d < x1 && li + d > x1) {
    
                i.size.width = ((i.originalSize.width + i.originalPosition.left) - li);
                i.position.left = li;
      
                if (g) drawGuide(t, y2, y1, b, li + ld + 1, c4, 1, s, 8);
              }
    
              if (r - d < x1 && r + d > x1) { //Right SNAP ;)
      
                i.size.width = ((i.originalSize.width + i.originalPosition.left) - r);
                i.position.left = r;
      
                if (g) drawGuide(t, y2, y1, b, r - 1 + ld, c1, 1, s, 15);
              } else if (p > 0 && !ip && rp - d < x1 && rp + d > x1) {
      
                i.size.width = ((i.originalSize.width + i.originalPosition.left) - rp);
                i.position.left = rp;
      
                if (g) drawGuide(t, y2, y1, b, rp - 1 + ld, c2, 1, s, 16);
              }
            }
      
            if (a.indexOf('s') > -1) {
    
              if (t - d < y2 && t + d > y2) { //Top SNAP ;)
      
                i.size.height = (t - y1) - hd;
      
                if (g) drawGuide(l + ld, x1 + ld, x2 + ld, r + ld, t + 1, c1, 0, s, 5);
              } else if (p > 0 && !ip && tp - d < y2 && tp + d > y2) {
      
                i.size.height = (tp - y1) - hd;
      
                if (g) drawGuide(l + ld, x1 + ld, x2 + ld, r + ld, tp + 1, c2, 0, s, 6);
              }
    
              if (b - d < y2 && b + d > y2) { //Bottom SNAP ;)
    
                i.size.height = (b - y1) - hd;
      
                if (g) drawGuide(l + ld, x1 + ld, x2 + ld, r + ld, b, c1, 0, s, 13);
              } else if (p > 0 && ip && bi - d < y2 && bi + d > y2) {
      
                i.size.height = (bi + 1 - y1) - hd;
      
                if (g) drawGuide(l + ld, x1 + ld, x2 + ld, r + ld, bi + 1, c4, 0, s, 14);
              }
            }
      
            if (a.indexOf('e') > -1) {
    
              if (l - d < x2 && l + d > x2) { //Left SNAP ;)
      
                i.size.width = (l - x1) - wd;
      
                if (g) drawGuide(t, y2, y1, b, l + ld, c1, 1, s, 9);
              } else if (p > 0 && !ip && lp - d < x2 && lp + d > x2) {
      
                i.size.width = (lp - x1) - wd;
      
                if (g) drawGuide(t, y2, y1, b, lp + ld, c2, 1, s, 10);
              }
    
              if (r - d < x2 && r + d > x2) { //Right SNAP ;)
      
                i.size.width = (r - x1) - wd;
      
                if (g) drawGuide(t, y2, y1, b, (i.guideElements[n].inner)?r + ld:r + ld - 1, c1, 1, s, 17);
              } else if (p > 0 && ip && ri - d < x2 && ri + d > x2) {
      
                i.size.width = (ri + 1 - x1) - wd;
      
                if (g) drawGuide(t, y2, y1, b, ri + 1 + ld, c4, 1, s, 18);
              }
            }
      		}
      	}
      });
    }
    
    var drawGuide = function (n1, n2, n3, n4, n5, c, b, s, i) {
  
      if ($("#snapGuide_" + i).length < 1) $("body").prepend('<div id="snapGuide_' + i +'"></div>');
  
    	if (b == 0) var l = Math.min(n1, n2, n3, n4), w = (Math.max(n1, n2, n3, n4) - l), h = 1, t = n5, d = 'border-top';
    	else var t = Math.min(n1, n2, n3, n4), h = (Math.max(n1, n2, n3, n4) - t), w = 1, l = n5, d = 'border-left';
  
    	$("#snapGuide_" + i).css(d, '1px ' + s +' ' + c).css({
    	  'height' : h + 'px',
    	  'z-index' : '999999',
    	  'position' : 'absolute',
    	  'display' : 'block',
    	  'top' : t + 'px',
    	  'left' : l + 'px',
    	  'width' : w + 'px'
    	}).fadeOut(1500, function () {
  
        $("#snapGuide_" + i).css('border', '0');
    	});
    };
  })();
}