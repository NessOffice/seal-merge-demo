//set canvas
const canvasContainer = document.getElementById('canvasContainer');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 1024;
// canvas.setAttribute("hidden",true);

stroke_width = 1.3;

//model to polygon
function modelToPolygon(model,unicode,x1,y1,x2,y2) {
    let modelRef = model[unicode]['onRefs'];
    let modelOff = model[unicode]['onOffsets'];
    let modelCon = model[unicode]['onContourIndices'];
    let polygon = [];
    let contour = [];
    let arrCount = 0;
    let xCount = 0;

    var map = {};
    for (var i=0;i<modelCon.length;i++) {
        if (typeof(map[modelCon[i]])=="undefined") {
            map[modelCon[i]] = 1;
        } else {
            map[modelCon[i]] = map[modelCon[i]] + 1;
        }
    }
    // console.log(map);

    var obj = {};
    for(let i=0; i <= Object.getOwnPropertyNames(map).length; i++){
        obj['arr'+i] = [];
    }
    
    let a = (512 / (x2 - x1));
    let b = (512 / (y2 - y1));
    for (let i = 0; i < modelCon.length; i++) {
        // [x,y] 
        let x = []; 
        x[0] = modelRef[i][0]/a + x1 + stroke_width*modelOff[i][0];
        x[1] = modelRef[i][1]/b + y1 + stroke_width*modelOff[i][1];
        obj['arr'+arrCount][xCount] = x;
        if (modelCon[i]!==modelCon[i+1]) {
            polygon[arrCount] = obj['arr'+arrCount];
            // let contour = [];
            arrCount++;
            xCount = 0;
            // console.log(arrCount);
        }
        else{
            xCount++;
        }
    }
    // console.log(polygon);
    return polygon;
}

//polygon to canvas
function polygonToCanvas(polygon) {
    ctx.beginPath();
    ctx.fillStyle="#000";
    for (let i = 0; i < polygon.length; i++) {
        ctx.moveTo(polygon[i][0][0],polygon[i][0][1]);
        for (var j = 1;j < polygon[i].length;j++) {
 	        ctx.lineTo(polygon[i][j][0],polygon[i][j][1]);
        }
        // ctx.closePath();
    }
    // ctx.closePath();
    ctx.fill();
}

function draw(polygon) {
    //clearCanvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //draw
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for (var i = 0; i < polygon.length; i++) {
        polygonToCanvas(polygon[i]);                                                              
    }
    return saveAsPNG(canvas);
}

// 从 canvas 提取图片 image
// function canvasToImage(canvas) {
//     var image = new Image();
//     // canvas.toDataURL  return Base64_URL   PNG
//     image.src = canvas.toDataURL('image/png');
//     // document.getElementById('canvasImage').src=image.src;
     
// }     

function saveAsPNG(canvas) {
	return canvas.toDataURL("image/png");
}

// function downLoad(url){
// 	var button = document.getElementById("download-button");
// 	button.download = 'seal';// 设置下载的文件名，默认是'下载'
//     button.href = url;
//     // document.body.appendChild(oA);
//     // oA.click();
//     // oA.remove(); // 下载之后把创建的元素删除
// }


