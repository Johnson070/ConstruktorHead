// get references to the canvas and its context
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var $canvas = $("#canvas");

// get the canvas position on the page
// used to get mouse position
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;
var scrollX = $canvas.scrollLeft();
var scrollY_M = $canvas.scrollTop();

// save info about each circle in an object
var circles = [];
var selectedCircle = -1;

// the html radio buttons indicating what action to do upon mousedown
var $create = $("#rCreate")[0];
var $select = $("#rSelect")[0];
var $move = $("#rMove")[0];
var $delete = $("#rDelete")[0];

var mouse_down = false;

function start_canvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.setLineDash([0]);
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width / 2.5, 0, 2*Math.PI);
    ctx.stroke();
    ctx.closePath();

    ctx.setLineDash([5]);

    ctx.beginPath();
    ctx.moveTo(canvas.width/2-canvas.width/2.5, canvas.height/2);
    ctx.lineTo(canvas.width/2+canvas.width/2.5, canvas.height/2);

    ctx.moveTo(canvas.width/2, canvas.height/2-canvas.height/2.5);
    ctx.lineTo(canvas.width/2, canvas.height/2+canvas.height/2.5);
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([0]);
}
start_canvas();
function drawAll() {
    start_canvas();

    ctx.lineWidth = 2;
    $("table tbody").empty();


    for (var i = 0; i < circles.length; i++) {
        var c = circles[i];
        $("table tbody").append(
          "<tr class='row_table'>" +
          "<td>" + i + "</td>" +
          "<td>" + "<input onchange='save_table();' class='data_table' type=\"color\" size='4' value='" + c.color + "'>" + "</td>" +
          "<td>" + "<input onchange='save_table();' class='data_table' type='number' value='" + c.radius + "'>" + "</td>" +
          "<td>" + "<input onchange='save_table();' class='data_table' type='number' value='" + c.length_text + "'>" + "</td>" +
          "<td>" + "<input onchange='save_table();' class='data_table' type='text' value='" + c.text + "'>" + "</td>" +
          "</tr>"
        )
        ctx.beginPath();
        ctx.arc(c.cx, c.cy, c.radius, 0, Math.PI * 2);


        ctx.closePath();
        ctx.strokeStyle = c.color;
        ctx.stroke();
        // if this is the selected circle, highlight it
        if (selectedCircle == i) {
            ctx.strokeStyle = "red";
            ctx.stroke();
        }
        draw_sign(c.cx, c.cy, c.length_text, c.text);
    }
}


function draw_sign(cx, cy, line_length, text) {
    cx = parseInt(cx, 10);
    cy = parseInt(cy, 10);
    line_length = parseInt(line_length, 10);
    line_x = cx+Math.sin(3.14159265358979 / 4 * (cx >= canvas.width / 2 ? 1 : -1))*line_length
    line_y = cy+Math.cos(3.14159265358979 / (cy >= canvas.height / 2 ? 4 : 1))*line_length

    ctx.setLineDash([2]);
    ctx.moveTo(cx, cy);
    ctx.lineTo(line_x, line_y);
    ctx.lineTo(line_x+(50 * (cx >= canvas.width / 2 ? 1 : -1)), line_y);
    ctx.stroke();
    ctx.setLineDash([0]);
    ctx.font = "16px Arial";
    ctx.fillText(text, line_x+5-(cx >= canvas.width / 2 ? 0 : 12*text.length), line_y-3);
}

function handleMouseDown(e) {
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    if ($create.checked) {
        // create a new circle a the mouse position and select it
        circles.push({
            cx: mouseX,
            cy: mouseY + scrollY_M,
            radius: 10,
            color: '#000000',
            length_text: 50,
            text: 'sign'
        });
        selectedCircle = circles.length - 1;
    }
    if ($select.checked) {
        // unselect any selected circle
        selectedCircle = -1;
        // iterate circles[] and select a circle under the mouse
        for (var i = 0; i < circles.length; i++) {
            var c = circles[i];
            var dx = mouseX - c.cx;
            var dy = mouseY - c.cy;
            var rr = c.radius * c.radius;
            if (dx * dx + dy * dy < rr) {
                selectedCircle = i;
            }
        }
    }
    if ($delete.checked && selectedCircle >= 0) {
        select_circle(e);
        circles.splice(selectedCircle,1);
        selectedCircle = -1
    }

    // redraw all circles
    drawAll();
}

function select_circle(e) {
  if (selectedCircle == -1) {
      // iterate circles[] and select a circle under the mouse
      for (var i = 0; i < circles.length; i++) {
          var c = circles[i];
          var dx = mouseX - c.cx;
          var dy = mouseY - c.cy;
          var rr = c.radius * c.radius;
          if (dx * dx + dy * dy < rr) {
              selectedCircle = i;
          }
      }
    }
}

function handleMoveCircle(e) {
  if (mouse_down) {
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);
    select_circle(e);

    if (selectedCircle >= 0) {
      // move the selected circle to the mouse position
      var c = circles[selectedCircle];
      c.cx = mouseX;
      c.cy = mouseY;
    }

    drawAll();
  }
}

window.addEventListener('scroll', function() {
    scrollY_M = scrollY;
});

function save_table(){
    var cells = $("tr td")

    for (var i = 0; i < cells.length; i+=5) {
      var index = Math.floor(i / 5)
      circles[index].color = cells[i+1].getElementsByClassName('data_table')[0].value;
      circles[index].radius = cells[i+2].getElementsByClassName('data_table')[0].value;
      circles[index].length_text = cells[i+3].getElementsByClassName('data_table')[0].value;
      circles[index].text = cells[i+4].getElementsByClassName('data_table')[0].value;
    }

    drawAll();
}

// handle mousedown events
$("#canvas").mousedown(function (e) {
    handleMouseDown(e);
    mouse_down = true;
});

$("#canvas").mousemove(function (e) {
    handleMoveCircle(e);
});

$("#canvas").mouseup(function (e) {
    mouse_down = false;
});

