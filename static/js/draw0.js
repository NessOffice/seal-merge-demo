//set canvas
const canvasContainer0 = document.getElementById('canvasContainer0');
const canvas0 = document.getElementById('canvas0');
const ctx0 = canvas0.getContext('2d');

canvas0.width = 1024;
canvas0.height = 1024;
// canvas.setAttribute("hidden",true);

//model to polygon
function modelToPolygon0(model,unicode,x1,y1,x2,y2) {
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
    console.log(map);

    var obj = {};
    for(let i=0; i <= Object.getOwnPropertyNames(map).length; i++){
        obj['arr'+i] = [];
    }
    
    let a = (512 / (x2 - x1));
    let b = (512 / (y2 - y1));
    for (let i = 0; i < modelCon.length; i++) {
        // [x,y] 
        let x = []; 
        x[0] = modelRef[i][0]/a + x1 + 1.3*modelOff[i][0];
        x[1] = modelRef[i][1]/b + y1 + 1.3*modelOff[i][1];
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
function polygonToCanvas0(polygon) {
    ctx0.beginPath();
    ctx0.fillStyle="#000";
    for (let i = 0; i < polygon.length; i++) {
        ctx0.moveTo(polygon[i][0][0],polygon[i][0][1]);
        for (var j = 1;j < polygon[i].length;j++) {
 	        ctx0.lineTo(polygon[i][j][0],polygon[i][j][1]);
        }
        // ctx0.closePath();
    }
    // ctx0.closePath();
    ctx0.fill();
}

function draw0(polygon) {
    //clearCanvas
    ctx0.clearRect(0,0,canvas0.width,canvas0.height);
    //draw
    ctx0.fillStyle="#fff";
    ctx0.fillRect(0,0,canvas0.width,canvas0.height);
    polygonToCanvas0(polygon);              
    return saveAsPNG(canvas0);
}

// 从 canvas 提取图片 image
// function canvasToImage(canvas) {
//     var image = new Image();
//     // canvas.toDataURL  return Base64_URL   PNG
//     image.src = canvas.toDataURL('image/png');
//     // document.getElementById('canvasImage').src=image.src;
     
// }     

function saveAsPNG0(canvas) {
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


