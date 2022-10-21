var srcUrl;
var context;
var image;
var canvas;
var boundings;
var newwidth;
var newheight;

var orgImage;
var undoStack = [];
var redoStack = [];


function updateProgress(val) {
  var elem = document.getElementById("myBar");
  var progressDiv = document.getElementById("progressDiv");
  progressDiv.style.display = "block";
  if (val >= 100) {
    progressDiv.style.display = "none";
  } else {
    elem.style.width = val + "%";
  }

}

function createGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000);
  }
  return s4() + ''+ s4() + '' + s4() + '' + s4() + '' +
    s4() ;
}
}
function fillAlpha(ctx, bgColor) {  // bgColor is a valid CSS color ctx is 2d context
  // save state
  ctx.save();
  // make sure defaults are set
  ctx.globalAlpha = 1;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.filter = "none";

  // fill transparent pixels with bgColor
  ctx.globalCompositeOperation = "destination-over";
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // cleanup
  ctx.restore();
}

function setCanvasUrl(url) {
  alert("url 001");

  /*
  srcUrl = url;
  image = new Image();

  image.src = srcUrl;
  image.onload = function () {
    var owidth = image.width;
    var oheight = image.height;
    var dim = 1;

    console.log(image.width + ", " + image.height);
    if (owidth > 700) {
      dim = 700 / owidth;
    }
    nwidth = owidth * dim;
    nheight = oheight * dim;
    canvas.width = nwidth;
    canvas.height = nheight;

    fillAlpha(context, 'white');
    context.drawImage(image, 0, 0, nwidth, nheight);
    newheight = nheight;
    newwidth = nwidth;
    orgImage = image;
    undoStack.push(orgImage)
  };
  */
 
}

function setCanvasUrl_OLD(url) {
  srcUrl = url;
  image = new Image();

  image.src = srcUrl;
  image.onload = function () {
    var owidth = image.width;
    var oheight = image.height;
    var dim = 1;

    console.log(image.width + ", " + image.height);
    if (owidth > 700) {
      dim = 700 / owidth;
    }
    nwidth = owidth * dim;
    nheight = oheight * dim;
    canvas.width = nwidth;
    canvas.height = nheight;

    fillAlpha(context, 'white');
    context.drawImage(image, 0, 0, nwidth, nheight);
    newheight = nheight;
    newwidth = nwidth;
    orgImage = image;
    undoStack.push(orgImage)
  };
}
window.onload = function () {


  // Definitions
  canvas = document.getElementById("paint-canvas");
  blockcanvas = document.getElementById("block-canvas");
  context = canvas.getContext("2d");
  boundings = canvas.getBoundingClientRect();
  var textsize = document.getElementById("textsize");
  var textfont = document.getElementById("textfont");

  var hoveringtext = document.getElementsByClassName("hoveringtext")[0];
  hoveringtext.style.fontFamily = textfont.value;
  hoveringtext.style.fontSize = textsize.value;
  hoveringtext.style.color = selectedColor || 'black';
  var bold = document.getElementById("bold");
  var italic = document.getElementById("italic");
  bold.addEventListener('click', function (event) {
    if (bold.checked == true)
      hoveringtext.style.fontWeight = ("bold")
    else
      hoveringtext.style.fontWeight = ("")

  })
  italic.addEventListener('click', function (event) {
    if (italic.checked == true)
      hoveringtext.style.fontStyle = ("italic")
    else
      hoveringtext.style.fontStyle = ("")

  })
  var hoveringtextarea = document.getElementById("hoveringtextarea");
  var selectedColor = 'black';
  // context.drawImage(srcUrl,0,0);
  // Specifications
  var mouseX = 0;
  var mouseY = 0;
  context.strokeStyle = 'black'; // initial brush color
  context.lineWidth = 1; // initial brush width
  context.lineJoin = 'round';
  context.lineCap = 'round'
  var isDrawing = false;
  var isAddingText = false;

  // Handle Colors
  var colors = document.getElementsByClassName('colors')[0];

  colors.addEventListener('click', function (event) {
    context.strokeStyle = event.target.value || 'black';
    selectedColor = event.target.value || 'black'
    hoveringtext.style.color = selectedColor || 'black';
  });

  // Handle Brushes
  var brushes = document.getElementsByClassName('brushes')[0];
  var brushesize = document.getElementById('brushsize');
  var draggablediv = document.getElementById("draggablediv")
  var draggabledivtext = document.getElementById("draggabledivtext")


  // Make the DIV element draggable:
  dragElement(draggablediv);
  dragElement(draggabledivtext);
  context.lineWidth = brushesize.value;
  setInputFilter(brushesize, function (value) {
    return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
  });
  brushes.addEventListener('click', function (event) {
    if (event.target.id != 'brushsize') {
      context.lineWidth = parseInt(brushesize.value) + parseInt(event.target.value);
      brushesize.value = context.lineWidth;
    }
  });
  brushes.addEventListener('input', function (event) {
    if (event.target.id == 'brushsize') {
      context.lineWidth = parseInt(event.target.value);
      //brushesize.value = context.lineWidth;
    }
  });

  document.getElementById('cu')
  // Mouse Down Event
  function addCanvasListeners() {

    canvas.addEventListener('mousedown', function (event) {
      if (isAddingText == true) {
        if (draggabledivtext.style.display != "block") {
          draggabledivtext.style.left = mouseX
          draggabledivtext.style.top = mouseY
          draggabledivtext.style.display = "block";
        }
        else {
          var prop = ""
          if (bold.checked == true) {
            prop += "bold "
          }
          if (italic.checked == true) {
            prop += "italic "
          }
          context.font = prop + textsize.value + "px " + textfont.value;
          context.fillStyle = selectedColor;
    
          var rect = canvas.getBoundingClientRect();
          var recttext = hoveringtextarea.getBoundingClientRect();
          areaX = recttext.left - rect.left;
          areaY = recttext.top - rect.top + parseInt(textsize.value);
    
    
          // areaX2 = recttext.style.left.split("px")[0]- rect.left;
          //areaY2 = recttext.style.top.split("px")[0]- rect.top;
          console.log("x=" + areaX)
          console.log("y=" + areaY)
          context.fillText(hoveringtextarea.value, areaX + 2, areaY + 2);
          //hoveringtext.style.
          isAddingText = false;
          draggablediv.style.display = "none";
          draggabledivtext.style.display = "none";
          canvas.style.cursor = "crosshair";
          var nimage = new Image();
    
          nimage.src = canvas.toDataURL();
          undoStack.push(nimage);
        }
      }

      else {
        setMouseCoordinates(event);
        isDrawing = true;
        // context.fillRect(mouseX, mouseY); 

        // Start Drawing
        context.beginPath();
        context.moveTo(mouseX, mouseY);
      }
    });


    // Mouse Move Event
    canvas.addEventListener('mousemove', function (event) {
      setMouseCoordinates(event);

      if (isDrawing) {
        context.lineTo(mouseX, mouseY);
        context.stroke();
      }
    });

    // Mouse Up Event
    canvas.addEventListener('mouseup', function (event) {
      setMouseCoordinates(event);
      isDrawing = false;
      var nimage = new Image();

      nimage.src = canvas.toDataURL();
      undoStack.push(nimage);
    });
  }
  addCanvasListeners()
  // Handle Mouse Coordinates
  function setMouseCoordinates(event) {
    var rect = canvas.getBoundingClientRect();

    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
    //console.log("x-"+mouseX+";y-"+mouseY)
  }

  // Handle reset Button
  var resetButton = document.getElementById('reset');

  resetButton.addEventListener('click', function () {
    //context.clearRect(0, 0, newwidth, newheight);
    context.clearRect(0, 0, canvas.width, canvas.height);
    fillAlpha(context, 'white')
    context.drawImage(orgImage, 0, 0, canvas.width, canvas.height);
    //undoStack = []
    //redoStack = []
    undoStack.push(image);
  });

  // Handle help Button
  var redoButton = document.getElementById('help');

  redoButton.addEventListener('click', function () {
    window.open(chrome.runtime.getURL('help.html'));
  });

  // Handle undo and redo Button
  var undoButton = document.getElementById('undo');

  undoButton.addEventListener('click', function () {
    if (undoStack.length > 1) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      fillAlpha(context, 'white')

      redoStack.push(undoStack.pop())
      context.drawImage(undoStack[undoStack.length - 1], 0, 0, canvas.width, canvas.height);
    }
  });
  var redoButton = document.getElementById('redo');

  redoButton.addEventListener('click', function () {
    if (redoStack.length > 0) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      fillAlpha(context, 'white')
      undoStack.push(redoStack.pop())

      context.drawImage(undoStack[undoStack.length - 1], 0, 0, canvas.width, canvas.height);
    }
  });
  // Handle addtext Button
  var addtextButton = document.getElementById('addtext');
  var doneaddtextButton = document.getElementById('doneaddtext');


  doneaddtextButton.addEventListener('click', function (event) {
    if (event.target.id == 'doneaddtext') {
      var prop = ""
      if (bold.checked == true) {
        prop += "bold "
      }
      if (italic.checked == true) {
        prop += "italic "
      }
      context.font = prop + textsize.value + "px " + textfont.value;
      context.fillStyle = selectedColor;

      var rect = canvas.getBoundingClientRect();
      var recttext = hoveringtextarea.getBoundingClientRect();
      areaX = recttext.left - rect.left;
      areaY = recttext.top - rect.top + parseInt(textsize.value);


      // areaX2 = recttext.style.left.split("px")[0]- rect.left;
      //areaY2 = recttext.style.top.split("px")[0]- rect.top;
      console.log("x=" + areaX)
      console.log("y=" + areaY)
      context.fillText(hoveringtextarea.value, areaX + 2, areaY + 2);
      //hoveringtext.style.
      isAddingText = false;
      draggablediv.style.display = "none";
      draggabledivtext.style.display = "none";
      canvas.style.cursor = "crosshair";
      var nimage = new Image();

      nimage.src = canvas.toDataURL();
      undoStack.push(nimage);
    }
  });
  addtextButton.addEventListener('click', function () {
    if (isAddingText == false) {

      isAddingText = true;
      draggablediv.style.display = "block";
      draggabledivtext.style.display = "none";

      canvas.style.cursor = "text";
      //Handle TextADD
      var textprop = document.getElementsByClassName('textprop')[0];
      var textsize = document.getElementById('textsize');
      setInputFilter(textsize, function (value) {
        return /^\d*\.?\d*$/.test(value); // Allow digits and '.' only, using a RegExp
      });
    }
    else {
      isAddingText = false;
      draggablediv.style.display = "none";
      draggabledivtext.style.display = "none";
    }

  });

  //// rotate 
  //var rotatecan = document.getElementById('rotatecan');
  // rotatecan.addEventListener('click', function () {
  //   // var tempCanvas = document.createElement("canvas")
  //   // var tempCtx = tempCanvas.getContext("2d");

  //   // tempCanvas.width = canvas.width;
  //   // tempCanvas.height = canvas.height;
  //   // tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
  //   // canvas.height=tempCanvas.width
  //   // canvas.width=tempCanvas.height
  //   // // Append for debugging purposes, just to show what the canvas did loo k like before the transforms.
  //   // document.body.appendChild(tempCanvas);

  //   // // Now clear the portion to rotate.
  //   // //context.fillStyle = "#000";
  //   // //context.fillRect(0, 0,canvas.width, canvas.height );

  //   // //context.save();
  //   // // Translate (1909/2 is half of the box we drew)
  //   // tempCtx.translate(tempCanvas.width/2, tempCanvas.height/2);
  //   // // Scale
  //   // //context.scale(1, 1);
  //   // // Rotate it
  //   // tempCtx.rotate(90 * Math.PI / 180);
  //   // tempCanvas.drawImage(tempCanvas,0,0, canvas.height, canvas.width);
  //   // // Finally draw the image data from the temp canvas.
  //   // context.drawImage(tempCanvas,0,0, canvas.height, canvas.width);
  //   // context.restore();
  //   //drawRotated(90);
  // });
  function drawRotated(degrees) {

    var tempimage = new Image()
    tempimage.src = canvas.toDataURL()
    if (canvas) {

      blockcanvas.removeChild(canvas);
    }

    canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    //canvas.style.width="20%";

    if (degrees == 90 || degrees == 270) {
      canvas.width = image.height;
      canvas.height = image.width;
    } else {
      canvas.width = image.width;
      canvas.height = image.height;
    }
    canvas.setAttribute("id", "paint-canvas")
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (degrees == 90 || degrees == 270) {
      ctx.translate(image.height / 2, image.width / 2);
    } else {
      ctx.translate(image.width / 2, image.height / 2);
    }
    ctx.rotate(degrees * Math.PI / 180);
    ctx.drawImage(tempimage, -image.width / 2, -image.height / 2);

    document.body.appendChild(canvas);
    //ctx.translate(0,0);
    ctx.restore();
    context = ctx
    addCanvasListeners()
  }
  ///////////////////////////
  textfont.addEventListener('input', function (event) {
    if (event.target.id == 'textfont') {
      hoveringtext.style.fontFamily = textfont.value;

      //brushesize.value = context.lineWidth;
    }
  });
  textsize.addEventListener('input', function (event) {
    if (event.target.id == 'textsize') {
      hoveringtext.style.fontSize = textsize.value;
      //brushesize.value = context.lineWidth;
    }
  });
  // Handle Save Button
  var saveButton = document.getElementById('save');

  saveButton.addEventListener('click', function () {
    var imageName = prompt('Please enter image name');
    var canvasDataURL = canvas.toDataURL();
    var a = document.createElement('a');
    a.href = canvasDataURL;
    a.download = imageName || 'drawing';
    a.click();
  });
  // Handle share Button
  var shareButton = document.getElementById('share');

  shareButton.addEventListener('click', function () {
    chrome.tabs.getSelected(null, function (tab) {

      var dataURL = canvas.toDataURL();
      //$.post("canvasdata.php", { data: dataURL } );


      var ajaxHandler = new XMLHttpRequest();
      ajaxHandler.open("POST", "https://paintforwhatsapp.com/app/uploadhtml.php", true);
      //ajaxHandler.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      //ajaxHandler.send("name=test&data="+dataURL);
      var formData = new FormData();
      var guid = createGuid();
      //formData.append("name", Date.now());
      formData.append("name", guid);
      formData.append("data", dataURL);

      ajaxHandler.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          var percentComplete = (e.loaded / e.total) * 100;
          console.log(percentComplete + '% uploaded');

          updateProgress(percentComplete);
          if (percentComplete === 100) {
            chrome.tabs.getSelected(null, function (tab) {
              var tabUrl = "https://paintforwhatsapp.com/app/upload/" + guid + "/preview.html";
              //*whatsapp html!!!
              var str = "https://web.whatsapp.com/send?text=" + tabUrl + " ";
              //var str =tabUrl;
              //window.close();
              var myWin = window.open(str, "", 'height=800,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
            });
          }
        }
      };

      ajaxHandler.onload = function () {

      };
      ajaxHandler.send(formData);


    });

  });
};



function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    //elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    //e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
// Restricts input for the given textbox to the given inputFilter function.
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
    textbox.addEventListener(event, function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
} 