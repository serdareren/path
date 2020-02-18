var gCanvas;
var gCtx;
var gImage;
var gBackCanvas;
var gBackCtx;
var demoCanvas;
var demoCtx;
var gBezierPath;
var gState;
var gBackgroundImg;
var WIDTH;
var HEIGHT;
var canvasScale = 1;
var SCALE_FACTOR = 1.2;
var MoveStartPosition;
var MoveStartOffset;
var grid;
var grid2 = new Mesh1PatternGrid(60);
var grid3 = new Mesh2PatternGrid();
var grid4 = new SquarePatternGrid(20);
var grid5 = new LinePatternGrid();
var autoRotate = true;
var stopAnim = 0;
var Mode = {
  kAdding: {value: 0, name: "Adding"},
  kSelecting: {value: 1, name: "Selecting"},
  kDragging: {value: 2, name: "Dragging"},
  kRemoving: {value: 3, name: "Removing"},
  kMoving: {value: 4, name: "Moving"},
  kDragMove: {value: 5, name: "DragMove"},
  kZoom: {value: 6, name: "Zoom"},
  kZoom4x: {value: 7, name: "Zoom4x"}
};

window.onload = function () {

  demoCanvas = document.getElementById('canvas1');
  demoCtx = demoCanvas.getContext('2d');
  gImage = document.getElementById('image_container');
  gCanvas = document.getElementById('paintme');
  gCtx = gCanvas.getContext('2d');
  HEIGHT = gCanvas.height;
  WIDTH = gCanvas.width;
  gBackCanvas = document.createElement('canvas');
  gBackCanvas.height = HEIGHT;
  gBackCanvas.width = WIDTH;
  gBackCtx = gBackCanvas.getContext('2d');
  document.getElementById('element').src = "arw.png";

  $(document).mouseup(function (e)
  {
    var container = $("#funcCol");
    if (!container.is(e.target)
            && container.has(e.target).length === 0)
    {
      container.hide();
      $("#funcClose").hide();
      $("#funcsD").show();
    }
  });

  $('#lockControl').toggleClass("active");
  ControlPoint.prototype.syncNeighbor = !ControlPoint.prototype.syncNeighbor;

  $('body').on('contextmenu', '#paintme', function (e) {
    return false;
  });

  $('#addMode').addClass("active");
  gState = Mode.kAdding;

  gCanvas.addEventListener("mousedown", handleDown, false);
  gCanvas.addEventListener("touchstart", handleDown, false);
  gCanvas.addEventListener("mouseup", handleUp, false);
  gCanvas.addEventListener("touchend", handleUp, false);

  $('#selectMode').click(function () {
    $('#removeMode').removeClass("active");
    $('#addMode').removeClass("active");
    $('#moveq').removeClass("activeMove");
    document.getElementById('paintme').style.cursor = "move";
    $('#selectMode').addClass("active");

    gState = Mode.kSelecting;
  });
  $('#addMode').on("click", function () {
    $('#removeMode').removeClass("active");
    $('#selectMode').removeClass("active");
    $('#moveq').removeClass("activeMove");
    document.getElementById('paintme').style.cursor = "crosshair";
    $('#addMode').addClass("active");
    gState = Mode.kAdding;
  });

  $("#removeMode").on("click", function () {
    $('#addMode').removeClass("active");
    $('#selectMode').removeClass("active");
    $('#moveq').removeClass("activeMove");
    document.getElementById('paintme').style.cursor = "pointer";
    $('#removeMode').addClass("active");
    gState = Mode.kRemoving;
  });

  $("#lockControl").on("click", function () {
    $('#lockControl').toggleClass("active");
    ControlPoint.prototype.syncNeighbor = !ControlPoint.prototype.syncNeighbor;
  });

  $("#clear").on('click', function () {
    var doDelete = confirm('Temizlemek istediğine emin misin?');
    if (doDelete) {
      gBezierPath = null;
      gBackCtx.clearRect(0, 0, WIDTH, HEIGHT);
      gCtx.clearRect(0, 0, WIDTH, HEIGHT);
      var codeBox = document.getElementById('putJS');
      codeBox.innerHTML = " ";
    }
  });
  $("#idk").on('click', function () {
    $("#layout2").hide();
    $("#layout").show();
    $("#layoutClose").hide();
    $("#LineColors").hide();
    $("#LineCloseButton").hide();
    $("#LineColorOpenButton").show();
  });
  $("#layout").on('click', function () {
    $("#idk2").hide();
    $("#idk").show();
    $("#idkClose").hide();
    $("#LineColors").hide();
    $("#LineCloseButton").hide();
    $("#LineColorOpenButton").show();
  });
  $("#LineColorOpenButton").on('click', function () {
    $("#layout2").hide();
    $("#layout").show();
    $("#layoutClose").hide();
    $("#idkClose").hide();
    $("#idk2").hide();
    $("#idk").show();
  });
  $("#moveq").on('click', function () {
    gState = Mode.kMoving;
    $('#moveq').addClass("activeMove");
    document.getElementById('paintme').style.cursor = "move";
    $('#removeMode').removeClass("active");
    $('#addMode').removeClass("active");
    $('#selectMode').removeClass("active");
  });
  $("#fill").on('click', function () {
    zoomOut();
    gState = Mode.kAdding;
    document.getElementById('paintme').style.cursor = "crosshair";
    $('#zoom_in').removeClass("active");
    $('#zoom_4x').removeClass("active");
    asda();
  });
  $("#zoom_in").on('click', function () {
    gState = Mode.kZoom;
    document.getElementById('paintme').style.cursor = "zoom-in";
    $('#removeMode').removeClass("active");
    $('#addMode').removeClass("active");
    $('#selectMode').removeClass("active");
    $('#zoom_4x').removeClass("active");
    $('#zoom_in').addClass("active");
  });
  $("#zoom_4x").on('click', function () {
    gState = Mode.kZoom4x;
    document.getElementById('paintme').style.cursor = "zoom-in";
    $('#removeMode').removeClass("active");
    $('#addMode').removeClass("active");
    $('#selectMode').removeClass("active");
    $('#zoom_in').removeClass("active");
    $('#zoom_4x').addClass("active");
  });

  $("#qwea").on('change', function (ev) {
    var f = ev.target.files[0];
    var fr = new FileReader();
    fr.onload = function (ev2) {
      $("#arrow1").css('background', ev2.target.result);
    };
    fr.readAsDataURL(f);
  });
  $("#x1").on('click', function () {
    layo(1);
    grid.detach();
    grid = null;
  });
  $("#x2").on('click', function () {
    layo(2);
    if (grid) {
      grid.detach();
    }
    grid = grid2;
    grid.attachTo($("#paintme"));
  });
  $("#x3").on('click', function () {
    layo(3);
    if (grid) {
      grid.detach();
    }
    grid = grid3;
    grid.attachTo($("#paintme"));
  });
  $("#x4").on('click', function () {
    layo(4);
    if (grid) {
      grid.detach();
    }
    grid = grid4;
    grid.attachTo($("#paintme"));
  });
  $("#x5").on('click', function () {
    layo(5);
    if (grid) {
      grid.detach();
    }
    grid = grid5;
    grid.attachTo($("#paintme"));
  });
  function layo(e) {
    var pos;
    if (e === 1) {
      pos = '-268px -47px';
    }
    if (e === 2) {
      pos = '-580px -47px';
    }
    if (e === 3) {
      pos = '-224px -47px';
    }
    if (e === 4) {
      pos = '-314px -47px';
    }
    if (e === 5) {
      pos = '-359px -47px';
    }
    zoomOut();
    gState = Mode.kAdding;
    document.getElementById('paintme').style.cursor = "crosshair";
    $('#zoom_in').removeClass("active");
    $('#zoom_4x').removeClass("active");
    $("#layout").css('background-position', pos);
    $("#layoutClose").css('background-position', pos);
    $("#layoutClose").hide();
    $("#layout2").hide();
    $("#layout").show();
  }
  $("#1").on('click', function () {
    ColorS(1);
  });
  $("#2").on('click', function () {
    ColorS(2);
  });
  $("#3").on('click', function () {
    ColorS(3);
  });
  $("#4").on('click', function () {
    ColorS(4);
  });
  $("#5").on('click', function () {
    ColorS(5);
  });

  function ColorS(e) {
    var pos;
    if (e === 1) {
      pos = '2px -140px';
    }
    if (e === 2) {
      pos = '-43px -140px';
    }
    if (e === 3) {
      pos = '-88px -140px';
    }
    if (e === 4) {
      pos = '-134px -140px';
    }
    if (e === 5) {
      pos = '-180px -140px';
    }
    $("#LineColorOpenButton").css('background-position', pos);
    $("#LineCloseButton").css('background-position', pos);
    $("#LineCloseButton").hide();
    $("#LineColors").hide();
    $("#LineColorOpenButton").show();
  }
  $("#01").on('click', function () {
    changeOpac(1);
  });
  $("#02").on('click', function () {
    changeOpac(2);
  });
  $("#04").on('click', function () {
    changeOpac(4);
  });
  $("#05").on('click', function () {
    changeOpac(5);
  });
  $("#06").on('click', function () {
    changeOpac(6);
  });
  $("#08").on('click', function () {
    changeOpac(8);
  });
  $("#11").on('click', function () {
    changeOpac(11);
  });

  function changeOpac(e) {
    var opaci;
    var posi;
    if (e === 1) {
      opaci = '0.1';
      posi = '3px -92px';
    }
    if (e === 2) {
      opaci = '0.2';
      posi = '-443px -92px';
    }
    if (e === 4) {
      opaci = '0.4';
      posi = '-87px -92px';
    }
    if (e === 5) {
      opaci = '0.5';
      posi = '-132px -92px';
    }
    if (e === 6) {
      opaci = '0.6';
      posi = '-177px -92px';
    }
    if (e === 8) {
      opaci = '0.8';
      posi = '-222px -92px';
    }
    if (e === 11) {
      opaci = '1';
      posi = '-267px -92px';
    }
    document.getElementById('output').style.opacity = opaci;
    $("#idk").css('background-position', posi);
    $("#idkClose").css('background-position', posi);
    $("#idkClose").hide();
    $("#idk2").hide();
    $("#idk").show();
  }

  $("#preview1").on('click', function () {
    demo1(1, 0);
  });
  $("#pause1").on('click', function () {
    demo(1, 1);
  });
  $("#preview2").on('click', function () {
    demo1(2, 0);
  });
  $("#pause2").on('click', function () {
    demo(2, 1);
  });
  $("#preview3").on('click', function () {
    demo1(3, 0);
  });
  $("#pause3").on('click', function () {
    demo(3, 1);
  });
  $("#rotateLock").on('click', function () {
    autoRotate = false;
    $("#rotateUnlock").show();
    $("#rotateLock").hide();
  });
  $("#rotateUnlock").on('click', function () {
    autoRotate = true;
    $("#rotateUnlock").hide();
    $("#rotateLock").show();
  });

  function demo1(e, q) {
    if (document.getElementById('putJS').innerHTML != 0) {
      $('#removeMode').removeClass("active");
      $('#addMode').removeClass("active");
      $('#selectMode').removeClass("active");
      $('#zoom_in').removeClass("active");
      $('#zoom_4x').removeClass("active");
      $("#canvas1").show();
      $("#paintme").hide();
      $("#arrow1").show();
      $("#preview" + e).hide();
      $("#pause" + e).show();
      demoCtx.clearRect(0, 0, WIDTH, HEIGHT);
      zoomOut();
      gState = Mode.kAdding;
      demo(e, q);
    } else {
      alert("Add some path!");
    }
  }

  function demo(e, q) {
    var slider = $('#speed');
    var speed = slider.html();
    var path_js = "[" + document.getElementById('putJS').innerHTML + "]";
    path_js = JSON.parse(path_js);
    var svg_p1 = path_js[0].x;
    var svg_p2 = path_js[0].y;
    var svg_s = [];
    for (var i = 1; i < path_js.length; i++) {

      var svg_jsX = path_js[i].x;
      var svg_jsY = path_js[i].y;
      var svg_jsCt1X = path_js[i].ctrl1x;
      var svg_jsCt1Y = path_js[i].ctrl1y;
      var svg_jsCt2X = path_js[i].ctrl2x;
      var svg_jsCt2Y = path_js[i].ctrl2y;

      svg_s.push("C" + svg_jsCt1X + "," + svg_jsCt1Y + "," + svg_jsCt2X + "," + svg_jsCt2Y + "," + svg_jsX + "," + svg_jsY);
    }
    var aaa = "M" + svg_p1 + "," + svg_p2 + svg_s.join();
    var path = new Path2D(aaa);
    var LColor = $('#linecol').html();
    demoCtx.fillStyle = LColor;
    demoCtx.lineWidth = 2;
    demoCtx.strokeStyle = LColor;
    demoCtx.stroke(path);

    var data = Snap.path.toCubic(aaa);
    dataLength = data.length,
            points = [],
            pointsString = data.toString();

    for (var i = 0; i < dataLength; i++) {
      var seg = data[i];
      if (seg[0] === "M") {
        var point = {};
        point.x = seg[1];
        point.y = seg[2];
        points.push(point);
      } else {
        for (var j = 1; j < 6; j += 2) {
          var point = {};
          point.x = seg[j];
          point.y = seg[j + 1];
          points.push(point);
        }
      }
    }
    if (points.length > 1) {
      TweenLite.set($("#arrow1"), {x: points[0].x, y: points[0].y, xPercent: -50, yPercent: -50});
      var tween = TweenMax.to($("#arrow1"), 20, {bezier: {type: "cubic", values: points, autoRotate: autoRotate}, ease: Power0.easeNone, onComplete: function () {
          $("#canvas1").hide();
          $("#arrow1").hide();
          $("#paintme").show();
          $('#addMode').addClass("active");
          $("#pause" + e).hide();
          $("#preview" + e).show();
          gState = Mode.kAdding;
          TweenLite.set($("#arrow1"), {css: {transform: "translate(0) matrix(0) "}});
          asda();
          slider.onchange = null;
        }});
      tween.timeScale(speed);

      slider.onchange = function () {
        tween.timeScale(this.value);
      };
      var tween1 = "TweenLite.set(elem, {x: points[0].x, y: points[0].y, xPercent: -50, yPercent: -50});";
      var tween2 = 'var tween = TweenMax.to(elem, 20, {bezier: {type: "cubic", values: points, autoRotate: ' + autoRotate + '}, force3D: true, ease: Power0.easeNone});';
      for (var i = 0; i < points.length; i++) {
        document.getElementById("functionText").value = "function PathAnimation(elem){" + "\n\n" + "var points=" + JSON.stringify(points) + ";" + "\n\n" + tween1 + "\n" + tween2 + "}";
      }
      document.getElementById('canvas1').style.cursor = "auto";
      document.getElementById('paintme').style.cursor = "auto";
    } else {
      $("#canvas1").hide();
      $("#arrow1").hide();
      $("#paintme").show();
      $('#addMode').addClass("active");
      asda();
      alert("Add more...");
    }
    if (q === 1) {
      tween.kill();
      $("#canvas1").hide();
      $("#arrow1").hide();
      $("#pause" + e).hide();
      $("#paintme").show();
      $("#preview" + e).show();
      $('#addMode').addClass("active");
      gState = Mode.kAdding;
      document.getElementById('paintme').style.cursor = 'crosshair';
      TweenLite.set($("#arrow1"), {css: {transform: "translate(0) matrix(0) "}});
    }
  }

  function asda() {
    if (gState === Mode.kAdding) {
      document.getElementById('paintme').style.cursor = "crosshair";
      $("#addMode").addClass("active");
      $("#selectMode").removeClass("active");
    }
    if (gState === Mode.kSelecting) {
      document.getElementById('paintme').style.cursor = "move";
      $("#addMode").removeClass("active");
      $("#selectMode").addClass("active");
    }
  }

  var input = document.getElementsByTagName('input')[0];

  input.onclick = function () {
    this.value = null;
  };

  input.onchange = function () {
    resizeImage();
  };

  function resizeImage() {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var img = new Image();
        document.getElementById('output').src = event.target.result;
        img.src = event.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  var input1 = document.getElementsByTagName('input')[1];

  input1.onclick = function () {
    this.value = null;
  };

  input1.onchange = function () {
    resizeImage1();
  };

  function resizeImage1() {
    if (input1.files && input1.files[0]) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var img = new Image();
        document.getElementById('element').src = event.target.result;
        img.src = event.target.result;
      };
      reader.readAsDataURL(input1.files[0]);
    }
  }
};

var scales = 1;
var scalesMin = 1;
var scalesMax = 4;
var offsetLeft = 0;
var offsetTop = 0;

var imageMove = function (pos) {
  scales = Math.min(Math.max(scales, scalesMin), scalesMax);

  var offsetLeftM = (scales * WIDTH) - WIDTH;
  var offsetTopM = (scales * HEIGHT) - HEIGHT;

  offsetLeft = (WIDTH / 2) - (pos.x() * scales);
  offsetTop = (HEIGHT / 2) - (pos.y() * scales);

  offsetLeft = Math.min(Math.max(offsetLeft, -offsetLeftM), 0);
  offsetTop = Math.min(Math.max(offsetTop, -offsetTopM), 0);

  $(".layer").css({'transform': 'translate(' + offsetLeft + 'px, ' + offsetTop + 'px) scale(' + scales + ')'});
  document.getElementById('output').style.transform = "translate(" + offsetLeft + "px, " + offsetTop + "px) scale(" + scales + ")";
  render();
};

function zoomIn(pos) {
  scalesMax = 2;
  scales = scales * 2;
  imageMove(pos);
}
function zoomIn4x(pos) {
  scalesMax = 4;
  scales = scales * 4;
  imageMove(pos);
}

function zoomOut() {
  scales = 1;
  scales = Math.min(Math.max(scales, scalesMin), scalesMax);

  var offsetLeftM = (scales * WIDTH) - WIDTH;
  var offsetTopM = (scales * HEIGHT) - HEIGHT;

  offsetLeft = Math.min(Math.max(offsetLeft, -offsetLeftM), 0);
  offsetTop = Math.min(Math.max(offsetTop, -offsetTopM), 0);

  $(".layer").css({
    'transform': 'translate(' + offsetLeft + 'px, ' + offsetTop + 'px) scale(' + scales + ')'
  });
  document.getElementById('output').style.transform = "translate(" + offsetLeft + "px, " + offsetTop + "px) scale(" + scales + ")";
  render();
}

function getMousePosition(e, ignoreOffset) {
  var x;
  var y;
  var offset = $(gCanvas).offset();
  if (e.pageX != undefined && e.pageY != undefined) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.changedTouches[0].pageX;
    y = e.changedTouches[0].pageY;
  }
  x -= offset.left;
  y -= offset.top;

  if (!ignoreOffset) {
    x -= offsetLeft;
    x /= scales;
    y -= offsetTop;
    y /= scales;
  }
  return new Point(x, y);
}

function snapToGrid(pos) {
  if (!grid) {
    return pos;
  }
  var pos2 = {x: pos.x(), y: pos.y()};
  pos2 = grid.snapPosition(pos2);
  return new Point(pos2.x, pos2.y);
}
function handleDown(e) {
  e.preventDefault();
  var pos = getMousePosition(e);
  switch (gState) {
    case Mode.kAdding:
      handleDownAdd(pos);
      break;
    case Mode.kSelecting:
      handleDownSelect(pos);
      break;
    case Mode.kRemoving:
      handleDownRemove(pos);
      break;
    case Mode.kMoving:
      handleMoveDown(e);
      break;
    case Mode.kZoom:
      zoomIn(pos);
      break;
    case Mode.kZoom4x:
      zoomIn4x(pos);
      break;
  }
}
function handleMoveDown(e)
{
  var pos = getMousePosition(e, true);
  MoveStartPosition = pos;
  MoveStartOffset = {top: offsetTop, left: offsetLeft};
  gState = Mode.kDragMove;
  gCanvas.addEventListener("mousemove", updateMove, false);
  gCanvas.addEventListener("touchmove", updateMove, false);
}

function updateMove(e) {
  e.preventDefault();
  var pos = getMousePosition(e, true);
  var dx = pos.x() - MoveStartPosition.x();
  var dy = pos.y() - MoveStartPosition.y();
  offsetLeft = MoveStartOffset.left + dx;
  offsetTop = MoveStartOffset.top + dy;
  imageMove();
}

function handleDownAdd(pos) {
  if (!gBezierPath) {
    pos = snapToGrid(pos);
    gBezierPath = new BezierPath(pos);
  } else {
    if (handleDownSelect(pos))
      return;
    pos = snapToGrid(pos);
    gBezierPath.addPoint(pos);
  }
  render();
}

function handleDownSelect(pos) {
  if (!gBezierPath)
    return false;
  var selected = gBezierPath.selectPoint(pos);
  if (selected) {
    gState = Mode.kDragging;
    $('#moveq').removeClass("activeMove");
    document.getElementById('paintme').style.cursor = "move";
    $('#removeMode').removeClass("active");
    $('#addMode').removeClass("active");
    $('#selectMode').addClass("active");
    gCanvas.addEventListener("mousemove", updateSelected, false);
    gCanvas.addEventListener("touchmove", updateSelected, false);
    return true;
  }
  return false;
}

function handleDownRemove(pos) {
  if (!gBezierPath)
    return;
  var deleted = gBezierPath.deletePoint(pos);
  if (deleted)
    render();
}

function updateSelected(e) {
  e.preventDefault();
  var pos = getMousePosition(e);
  pos = snapToGrid(pos);
  gBezierPath.updateSelected(pos);
  render();
}

function handleUp(e) {
  e.preventDefault();
  if (gState === Mode.kDragging) {
    gCanvas.removeEventListener("mousemove", updateSelected, false);
    gCanvas.removeEventListener("touchmove", updateSelected, false);
    gBezierPath.clearSelected();
    gState = Mode.kSelecting;
  } else if (gState === Mode.kDragMove) {
    gCanvas.removeEventListener("mousemove", updateMove, false);
    gCanvas.removeEventListener("touchmove", updateMove, false);
    gState = Mode.kMoving;
  }
}

function  render() {
  gBackCtx.clearRect(0, 0, WIDTH, HEIGHT);
  gCtx.clearRect(0, 0, WIDTH, HEIGHT);
  if (gBackgroundImg)
    gBackCtx.drawImage(gBackgroundImg, 0, 0);
  if (gBezierPath) {
    gBezierPath.draw(gBackCtx);
    var codeBox = document.getElementById('putJS');
    codeBox.innerHTML = gBezierPath.toJSString();
  }
  gCtx.save();
  gCtx.translate(offsetLeft, offsetTop);
  gCtx.scale(scales, scales);
  gCtx.drawImage(gBackCanvas, 0, 0);
  gCtx.restore();

}

function Point(newX, newY)
{
  var xVal = newX;
  var yVal = newY;

  var RADIUS = 4;
  var SELECT_RADIUS = RADIUS + 8;

  this.x = function () {
    return xVal;
  }

  this.y = function () {
    return yVal;
  }

  this.set = function (x, y) {
    xVal = x;
    yVal = y;
  };
  this.drawSquare = function (ctx) {
    ctx.beginPath();
    ctx.arc(xVal, yVal, RADIUS, 0, Math.PI * 2);
    ctx.lineWitdh = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
  };
  this.drawCircle = function (ctx, cnt) {
    var sol;
    var xVali;
    var yVali;
    if (cnt % 2 === 0) {
      sol = 'blue';
    } else {
      sol = 'red';
    }
    ctx.beginPath();
    ctx.arc(xVal, yVal, RADIUS, 0, Math.PI * 2);
    ctx.lineWitdh = 2;
    ctx.strokeStyle = sol;
    ctx.stroke();


  };

  this.computeSlope = function (pt) {
    return (pt.y() - yVal) / (pt.x() - xVal);
  };

  this.contains = function (pt) {
    var xInRange = pt.x() >= xVal - SELECT_RADIUS && pt.x() <= xVal + SELECT_RADIUS;
    var yInRange = pt.y() >= yVal - SELECT_RADIUS && pt.y() <= yVal + SELECT_RADIUS;
    return xInRange && yInRange;
  };

  this.offsetFrom = function (pt) {
    return {
      xDelta: pt.x() - xVal,
      yDelta: pt.y() - yVal,
    };
  };

  this.translate = function (xDelta, yDelta) {
    xVal += xDelta;
    yVal += yDelta;
  };

}

var cnt = 0;
function ControlPoint(angle, magnitude, owner, isFirst) {

  var my = this;

  var _angle = angle;
  var _magnitude = magnitude;

  var _owner = owner;
  var _isFirst = isFirst;

  this.setAngle = function (deg) {
    if (_angle != deg)
      _angle = deg;
  };

  this.origin = function origin() {
    var line = null;
    if (_isFirst)
      line = _owner.prev;
    else
      line = _owner;
    if (line)
      return new Point(line.pt.x(), line.pt.y());
    return null;
  };

  this.asPoint = function () {
    return new Point(my.x(), my.y());
  };

  this.x = function () {
    return  my.origin().x() + my.xDelta();
  }

  this.y = function () {
    return my.origin().y() + my.yDelta();
  }

  this.xDelta = function () {
    return _magnitude * Math.cos(_angle);
  }

  this.yDelta = function () {
    return _magnitude * Math.sin(_angle);
  }

  function computeMagnitudeAngleFromOffset(xDelta, yDelta) {
    _magnitude = Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));
    var tryAngle = Math.atan(yDelta / xDelta);
    if (!isNaN(tryAngle)) {
      _angle = tryAngle;
      if (xDelta < 0)
        _angle += Math.PI
    }
  }

  this.translate = function (xDelta, yDelta) {
    var newLoc = my.asPoint();
    newLoc.translate(xDelta, yDelta);
    var dist = my.origin().offsetFrom(newLoc);
    computeMagnitudeAngleFromOffset(dist.xDelta, dist.yDelta);
    if (my.__proto__.syncNeighbor)
      updateNeighbor();
  };

  function updateNeighbor() {
    var neighbor = null;
    if (_isFirst && _owner.prev)
      neighbor = _owner.prev.ctrlPt2;
    else if (!_isFirst && _owner.next)
      neighbor = _owner.next.ctrlPt1;
    if (neighbor)
      neighbor.setAngle(_angle + Math.PI);
  }

  this.contains = function (pt) {
    return my.asPoint().contains(pt);
  };

  this.offsetFrom = function (pt) {
    return my.asPoint().offsetFrom(pt);
  };

  this.draw = function (ctx) {
    cnt++;
    ctx.save();
    ctx.beginPath();
    var startPt = my.origin();
    var endPt = my.asPoint();
    ctx.moveTo(startPt.x(), startPt.y());
    ctx.lineTo(endPt.x(), endPt.y());
    ctx.stroke();
    endPt.drawCircle(ctx, cnt);
    ctx.restore();
  };

  if (my.__proto__.syncNeighbor)
    updateNeighbor();
}

ControlPoint.prototype.syncNeighbor = true;

function LineSegment(pt, prev) {

  var my = this;

  this.pt;
  this.ctrlPt1;
  this.ctrlPt2;

  this.next;
  this.prev;

  this.selectedPoint;

  init();

  this.draw = function (ctx) {
    my.pt.drawSquare(ctx);
    if (my.ctrlPt1)
      my.ctrlPt1.draw(ctx);
    if (my.ctrlPt2)
      my.ctrlPt2.draw(ctx);

    if (my.prev)
      drawCurve(ctx, my.prev.pt, my.pt, my.ctrlPt1, my.ctrlPt2);
  }

  this.toJSString = function () {
    if (!my.prev)
      return '{"x":' + Math.round(my.pt.x()) + ',' + '"y":' + Math.round(my.pt.y()) + '}';
    else {
      var ctrlPt1x = 0;
      var ctrlPt1y = 0;
      var ctrlPt2x = 0;
      var ctrlPt2y = 0;
      var x = 0;
      var y = 0;
      var point = {};

      if (my.ctrlPt1) {
        ctrlPt1x = Math.round(my.ctrlPt1.x());
        ctrlPt1y = Math.round(my.ctrlPt1.y());
      }

      if (my.ctrlPt2) {
        ctrlPt2x = Math.round(my.ctrlPt2.x());
        ctrlPt2y = Math.round(my.ctrlPt2.y());
      }
      if (my.pt) {
        x = Math.round(my.pt.x());
        y = Math.round(my.pt.y());
      }

      point.x = x;
      point.y = y;
      point.ctrl1x = ctrlPt1x;
      point.ctrl1y = ctrlPt1y;
      point.ctrl2x = ctrlPt2x;
      point.ctrl2y = ctrlPt2y;

      return JSON.stringify(point);

    }
  }

  this.findInLineSegment = function (pos) {
    if (my.pathPointIntersects(pos)) {
      my.selectedPoint = my.pt;
      return true;
    } else if (my.ctrlPt1 && my.ctrlPt1.contains(pos)) {
      my.selectedPoint = my.ctrlPt1;
      return true;
    } else if (my.ctrlPt2 && my.ctrlPt2.contains(pos)) {
      my.selectedPoint = my.ctrlPt2;
      return true;
    }
    return false;
  }

  this.pathPointIntersects = function (pos) {
    return my.pt && my.pt.contains(pos);
  }

  this.moveTo = function (pos) {
    var dist = my.selectedPoint.offsetFrom(pos);
    my.selectedPoint.translate(dist.xDelta, dist.yDelta);
  };

  function drawCurve(ctx, startPt, endPt, ctrlPt1, ctrlPt2) {
    var LColor = $('#linecol').html();
    ctx.save();
//    ctx.fillStyle = LColor;
    ctx.strokeStyle = LColor;
    ctx.beginPath();
    ctx.moveTo(startPt.x(), startPt.y());
    ctx.lineWidth = 2;
    ctx.bezierCurveTo(ctrlPt1.x(), ctrlPt1.y(), ctrlPt2.x(), ctrlPt2.y(), endPt.x(), endPt.y());
    ctx.stroke();
    ctx.restore();
  }

  function init() {
    my.pt = pt;
    my.prev = prev;

    if (my.prev) {

      var slope = my.pt.computeSlope(my.prev.pt);
      var angle = Math.atan(slope);

      if (my.prev.pt.x() > my.pt.x())
        angle *= -1;

      my.ctrlPt1 = new ControlPoint(angle + Math.PI, 15, my, true);
      my.ctrlPt2 = new ControlPoint(angle, 15, my, false);
    }
  }
  ;
}

function BezierPath(startPoint)
{
  var my = this;
  this.head = null;
  this.tail = null;
  var selectedSegment;

  this.addPoint = function (pt) {
    var newPt = new LineSegment(pt, my.tail);
    if (my.tail == null) {
      my.tail = newPt;
      my.head = newPt;
    } else {
      my.tail.next = newPt;
      my.tail = my.tail.next;
    }
    return newPt;

  };

  init();

  this.draw = function (ctx) {
    if (my.head == null)
      return;

    var current = my.head;
    while (current != null) {
      current.draw(ctx);
      current = current.next;
    }
  };

  this.selectPoint = function (pos) {
    var current = my.head;
    while (current != null) {
      if (current.findInLineSegment(pos)) {
        selectedSegment = current;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  this.deletePoint = function (pos) {
    var current = my.head;
    while (current != null) {
      if (current.pathPointIntersects(pos)) {
        var toDelete = current;
        var leftNeighbor = current.prev;
        var rightNeighbor = current.next;

        if (leftNeighbor && rightNeighbor) {
          leftNeighbor.next = rightNeighbor;
          rightNeighbor.prev = leftNeighbor
        } else if (!leftNeighbor) {
          my.head = rightNeighbor;
          if (my.head) {
            rightNeighbor.ctrlPt1 = null;
            rightNeighbor.ctrlPt2 = null;
            my.head.prev = null;
          } else
            my.tail = null;
        } else if (!rightNeighbor) {
          my.tail = leftNeighbor;
          if (my.tail)
            my.tail.next = null;
          else
            my.head = null;
        }
        return true;
      }
      current = current.next;
    }
    return false;
  }
  this.clearSelected = function () {
    selectedSegment = null;
  }

  this.updateSelected = function (pos) {
    selectedSegment.moveTo(pos);
  }

  this.toJSString = function () {
    var myString =
            [];

    var current = my.head;
    while (current != null) {
      myString.push(current.toJSString());
      current = current.next;
    }

    return myString.join(',' + '\n');
  }

  function init() {
    my.addPoint(startPoint);
  }
  ;
}

