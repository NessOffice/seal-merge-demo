/** DrawBoxPanel
 * A simple implementation of a panel allowing user to manipulate boxes on it
 * This script is written in strict ES5
 * @author Celestial Phineas @ ZJU
 */
'use strict';
(function () {
  /** DrawBoxPanel
   * @class @constructor @throws
   * @param { HTMLDivElement | string } container 
   * @param { { w?: number, h?: number, anchorSize?: number } } config
   */
  function DrawBoxPanel(container, config) {
    var that = this;
    config = config || {};
    if (typeof container === 'string') {
      container = document.getElementById(container);
    }
    if (!(container instanceof HTMLDivElement)) {
      throw Error('DrawBoxPanel() requires a <div/> element.');
    }
    if (!(config instanceof Object)) {
      throw Error('Argument "config" is expecting an object.');
    }
    /** Container element 
     * @type { HTMLDivElement }
     * @event boxdrag     Dispatches when one box is dragged
     * @event boxmouseup  Dispatches when the mouse is up on a box */
    this.container = container;
    this.container.classList.add('drawbox-container');
    // Container mouse behaviors
    this.container.addEventListener('mouseleave', function () {
      var dispatches = false;
      for (var i in that._anchorElements) {
        var pair = that._anchorElements[i];
        if (pair[0].classList.contains('mousedown')
        || pair[1].classList.contains('mousedown')) dispatches = true;
        pair[0].classList.remove('mousedown');
        pair[1].classList.remove('mousedown');
      }
      if (dispatches) container.dispatchEvent(new Event('boxmouseup'));
    });
    this.container.addEventListener('mouseup', function () {
      for (var i in that._anchorElements) {
        var pair = that._anchorElements[i];
        pair[0].classList.remove('mousedown');
        pair[1].classList.remove('mousedown');
      }
      container.dispatchEvent(new Event('boxmouseup'));
    });
    /** Panel width in units @type { number } */
    this.w = config.w || 255;
    /** Panel height in units @type { number } */
    this.h = config.h || 255;
    /** Size of the anchor @type { number } */
    this.anchorSize = config.anchorSize || 10;
    /** A list of anchor points
     * @private @type { [ [[number, number], [number, number]] ] } */
    this._rects = [];
    /** A list of anchor elements
     * @private @type { [ [ HTMLDivElement, HTMLDivElement ] ] } */
    this._anchorElements = [];
    /** A list of box elements
     * @private @type { [ HTMLDivElement ] } */
    this._boxElements = [];
    // These functions require immediate "this" binding
    /** Convert the x coordinate to horizontal offset
     * @param { number } x @returns { number } */
    this.fromX = function(x) {
      var clientWidth = that.container.clientWidth;
      return x * clientWidth / that.w;
    }
    /** Convert the y coordinate to vertical offset
     * @param { number } y @returns { number } */
    this.fromY = function(y) {
      var clientHeight = that.container.clientHeight;
      return y * clientHeight / that.h;
    }
    /** Convert the horizontal offset to x coordinate
     * @param { number } x @returns { number } */
    this.toX = function(hOffset) {
      var clientWidth = that.container.clientWidth;
      return Math.round(hOffset * that.w / clientWidth);
    }
    /** Convert the vertical offset to y coordinate
     * @param { number } y @returns { number } */
    this.toY = function(vOffset) {
      var clientHeight = that.container.clientHeight;
      return Math.round(vOffset * that.h / clientHeight);
    }
  }

  /** Number of boxes. @returns { number }  */
  DrawBoxPanel.prototype.nBoxes = function () {
    return this._rects.length;
  }

  /** Adding a box to manipulate
   * @param { number } x1 @param { number } y1 
   * @param { number } x2 @param { number } y2
   * @returns { void } */
  DrawBoxPanel.prototype.addBox = function (x1, y1, x2, y2) {
    var index = this.nBoxes();
    this._rects.push([ [x1, y1], [x2, y2] ]);
    var anchor1 = document.createElement('div');
    var anchor2 = document.createElement('div');
    var box = document.createElement('div');
    anchor1.classList.add('drawbox-' + index, 'drawbox-anchor1');
    anchor2.classList.add('drawbox-' + index, 'drawbox-anchor2');
    box.classList.add('drawbox-' + index, 'drawbox-box');
    this._initAnchor(anchor1, this._rects[index][0]);
    this._initAnchor(anchor2, this._rects[index][1]);
    this._initBox(box, this._rects[index]);
    this.container.appendChild(box);
    this.container.appendChild(anchor1);
    this.container.appendChild(anchor2);
    this._anchorElements.push([ anchor1, anchor2 ]);
    this._boxElements.push(box);
  }

  /** Update anchor position
   * @private
   * @param { number } index The index of the box.
   * @returns { void } */
  DrawBoxPanel.prototype._updateAnchors = function (index) {
    for (var i in this._anchorElements[index]) {
      var pt = this._rects[index][i];
      var div = this._anchorElements[index][i];
      var top = this.fromY(pt[1]) - this.anchorSize/2;
      var left = this.fromX(pt[0]) - this.anchorSize/2;
      div.style.top = top + 'px';
      div.style.left = left + 'px';
    }
  } 
  /** Update the box element
   * @private
   * @param { number } index The index of the box to update.
   * @returns { void } */
  DrawBoxPanel.prototype._updateBox = function(index) {
    var minX = Math.min(this._rects[index][0][0], this._rects[index][1][0]);
    var maxX = Math.max(this._rects[index][0][0], this._rects[index][1][0]);
    var minY = Math.min(this._rects[index][0][1], this._rects[index][1][1]);
    var maxY = Math.max(this._rects[index][0][1], this._rects[index][1][1]);
    console.log(minX, maxX, minY, maxY);
    var top = this.fromY(minY), left = this.fromX(minX);
    var width = this.fromX(maxX) - left, height = this.fromY(maxY) - top;
    var div = this._boxElements[index];
    div.style.top = top + 'px';     div.style.left = left + 'px';
    div.style.width = width + 'px'; div.style.height = height + 'px';
  }

  /** Set the box coordinate
   * @param { number } boxIndex
   * @param { number } x1 @param { number } y1 
   * @param { number } x2 @param { number } y2
   * @returns { void } */
  DrawBoxPanel.prototype.setBox = function (boxIndex, x1, y1, x2, y2) {
    if ((typeof boxIndex !== 'number') || !(boxIndex in this._anchorElements)) {
      throw Error(boxIndex + ' is not a valid box index.')
    }
    this._rects[boxIndex][0][0] = x1;
    this._rects[boxIndex][0][1] = y1;
    this._rects[boxIndex][1][0] = x2;
    this._rects[boxIndex][1][1] = y2;
    this._updateAnchors(boxIndex);
    this._updateBox(boxIndex);
  }

  /** Removing a box
   * @param { number } boxIndex The index of the box
   * @throws when boxIndex is invalid
   * @returns { void } */
  DrawBoxPanel.prototype.removeBox = function(boxIndex) {
    if ((typeof boxIndex !== 'number') || !(boxIndex in this._anchorElements)) {
      throw Error(boxIndex + ' is not a valid box index to remove.')
    }
    this.container.removeChild(this._anchorElements[boxIndex][0]);
    this.container.removeChild(this._anchorElements[boxIndex][1]);
    this.container.removeChild(this._boxElements[boxIndex]);
    this._rects.splice(boxIndex, 1);
    this._anchorElements.splice(boxIndex, 1);
    this._boxElements.splice(boxIndex, 1);
    for (var i = boxIndex; i < this._anchorElements.length; i++) {
      this._anchorElements[i][0].classList.remove('drawbox-' + (i + 1));
      this._anchorElements[i][0].classList.add('drawbox-' + i);
      this._anchorElements[i][1].classList.remove('drawbox-' + (i + 1));
      this._anchorElements[i][1].classList.add('drawbox-' + i);
      this._boxElements[i].classList.remove('drawbox-' + (i + 1));
      this._boxElements[i].classList.add('drawbox-' + i);
    }
  }

  /** Get box coordinates
   * @param { number } boxIndex The index of the box
   * @throws when boxIndex is invalid
   * @returns { [ [number, number], [number, number] ] } */
  DrawBoxPanel.prototype.getRect = function(boxIndex) {
    if ((typeof boxIndex !== 'number') || !(boxIndex in this._anchorElements)) {
      throw Error(boxIndex + ' is not a valid box index.')
    }
    return JSON.parse(JSON.stringify(this._rects[boxIndex]));
  }
  /** Get box coordinates in min max order (minX, minY, maxX, maxY)
   * @param { number } boxIndex The index of the box
   * @throws when boxIndex is invalid
   * @returns { [ number, number, number, number ] } */
  DrawBoxPanel.prototype.getMinMax = function(boxIndex) {
    if ((typeof boxIndex !== 'number') || !(boxIndex in this._anchorElements)) {
      throw Error(boxIndex + ' is not a valid box index.')
    }
    var box = this._rects[boxIndex];
    var minX = Math.min(box[0][0], box[1][0]);
    var maxX = Math.max(box[0][0], box[1][0]);
    var minY = Math.min(box[0][1], box[1][1]);
    var maxY = Math.max(box[0][1], box[1][1]);
    return [ minX, minY, maxX, maxY ];
  }

  /** Initialize the anchor element
   * @private
   * @param { HTMLDivElement } div The <div/> element of the anchor
   * @param { number } x The initial x coordinate
   * @param { number } y The initial y coordinate 
   * @returns { void } */
  DrawBoxPanel.prototype._initAnchor = function (div, pt) {
    var that = this;
    div.classList.add('drawbox-anchor');
    div.style.position = 'absolute';
    div.style.width = this.anchorSize + 'px';
    div.style.height = this.anchorSize + 'px';
    function updateAnchorPosition() {
      var top = that.fromY(pt[1]) - that.anchorSize/2;
      var left = that.fromX(pt[0]) - that.anchorSize/2;
      div.style.top = top + 'px';
      div.style.left = left + 'px';
    }
    updateAnchorPosition();
    // Mouse behaviours
    div.addEventListener('mousedown', function () {
      div.classList.add('mousedown');
    });
    this.container.addEventListener('mousemove', function (ev) {
      var hOffset = ev.clientX - that.container.getBoundingClientRect().left;
      var vOffset = ev.clientY - that.container.getBoundingClientRect().top;
      if (hOffset > that.container.clientWidth || hOffset < 0
      || vOffset > that.container.clientHeight || vOffset < 0) {
        div.classList.remove('mousedown');
        that.container.dispatchEvent(new Event('boxmouseup'));
      }
      if (div.classList.contains('mousedown')) {
        pt[0] = that.toX(hOffset); pt[1] = that.toY(vOffset);
        updateAnchorPosition();
        that.container.dispatchEvent(new Event('boxdrag'));
      }
    });
    // Behavior when the container is resized
    var resizeObserver = new ResizeObserver(updateAnchorPosition);
    resizeObserver.observe(this.container);
  }

  /** Initialize the box element
   * @private
   * @param { HTMLDivElement } div The box element
   * @param { HTMLDivElement } anchor1 The first anchor
   * @param { HTMLDivElement } anchor2 The second anchor 
   * @param { [ [number, number], [number, number] ] } pair */
  DrawBoxPanel.prototype._initBox = function (div, pair) {
    var that = this;
    div.style.position = 'absolute';
    div.style.pointerEvents = 'none';
    function updateBox() {
      var minX = Math.min(pair[0][0], pair[1][0]);
      var maxX = Math.max(pair[0][0], pair[1][0]);
      var minY = Math.min(pair[0][1], pair[1][1]);
      var maxY = Math.max(pair[0][1], pair[1][1]);
      var top = that.fromY(minY), left = that.fromX(minX);
      var width = that.fromX(maxX) - left, height = that.fromY(maxY) - top;
      div.style.top = top + 'px';     div.style.left = left + 'px';
      div.style.width = width + 'px'; div.style.height = height + 'px';
    }
    this.container.addEventListener('boxdrag', updateBox);
    var resizeObserver = new ResizeObserver(updateBox);
    resizeObserver.observe(this.container); 
  }

  // Export DrawBoxPanel
  try {
    window.DrawBoxPanel = DrawBoxPanel;
  } catch(e) {
    throw Error('DrawBoxPanel works in a browser only');
  }
})();
