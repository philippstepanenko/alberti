// Переменные
var canvas, ctx;
var step = 0.05;
var iAngle = Math.PI/2;
var nextAngle = iAngle;
var sText = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
var key = 0;

// инициализация
init();

// Движение диска
var isMove;
var isTouch;
var start = {x: 0, y: 0};
var stop = {x: 0, y: 0};


// управление мышью
canvas.onmousedown = startMove;
document.onmouseup = stopMove;

canvas.onmousemove = move;

// сенсорный дисплей
//canvas.touchstart = startMove;
canvas.addEventListener("touchstart",startMoveTouch);
//document.touchend = stopMove;
document.addEventListener("touchend",stopMoveTouch);
//canvas.touchmove = move;
canvas.addEventListener("touchmove", move);

function div(a,b){
	return (a - a % b) / b;
}

function diffPair(a,b){
	return Math.abs(Math.abs(a)-Math.abs(b));
}

function move(e){
  // мышь или тачскрин?
	if(isMove || isTouch){
    
    if(isMove){
      var x = e.pageX;
      var y = e.pageY;
    } else if(isTouch) {
      var x = parseInt(e.touches[0].clientX);
      var y = parseInt(e.touches[0].clientY);
    }
    console.log("x: " + (x-canvas.offsetLeft));
    console.log("y: " + (y-canvas.offsetTop));
		var ta = -(canvas.width/2) + x - canvas.offsetLeft;
		var tb = -(-(canvas.height/2) + y - canvas.offsetTop);
		
		var angle = Math.atan2(ta,tb);

		setKey(angle);
	}

}

function startMove(e) {
  isMove = true;
}

function stopMove(e) {
  isMove = false;
}

function startMoveTouch(e) {
  isTouch = true;
}

function stopMoveTouch(e) {
  isTouch = false;
}

// Очистка canvas
function clear(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawScene() {     
    	// Меняем угол
    	iAngle = nextAngle;
    	drawFrame();
}

// Основная функция вывода сцены
function drawScene2() { 
    if (nextAngle!=iAngle){
    	// Меняем угол
    	if (Math.abs(Math.abs(nextAngle)-Math.abs(iAngle))<=step){
    		iAngle = nextAngle;
    	}
    	else if(nextAngle>iAngle){
    		iAngle+=step;
    	}else{
    		iAngle-=step;
	    }
    	drawFrame();
    }
}

// Рисование нового кадра
function drawFrame(){
  clear();
  // Заполняем фон
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // рисуем диски
	drawDisc(sText, canvas.width / 2, canvas.height / 2, canvas.width/3, 0);
  drawDisc(sText, canvas.width / 2, canvas.height / 2, canvas.width/4, Math.PI / 2 - iAngle);
  drawDisc("", canvas.width / 2, canvas.height / 2, canvas.width/6, 0);
  drawDisc("", canvas.width / 2, canvas.height / 2, canvas.width/24, 0);	
  ctx.fillStyle = 'green';
  ctx.fillText((sText.length+key)%sText.length, canvas.width/2, canvas.height/2);
  //ctx.restore();
}

function drawDisc(s, x, y, radius, iSAngle){
	// вспомогательный коэффициент
	var k = 1.5;
  // Радиан на 1 символ
  var fRadPerLetter = 2*Math.PI / s.length;
  // Сохраняем контекст, переводим и вращаем его
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(iSAngle);
  // диск
  ctx.beginPath();
  ctx.arc(0, 0, radius*k, 0, 2*Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = 'black';
  // Обрабатываем каждый символ строки
  for (var i=0; i<s.length; i++) {
    ctx.save();
    ctx.rotate(i*fRadPerLetter);
    // выводим символы
    if(i == 0) {
      ctx.fillStyle = "red";
    }else{
		  ctx.fillStyle = "black";
    }
    ctx.fillText(s[i], 0, -radius*1.3);
    ctx.restore();
    
    // рисование разделителя секторов
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo( Math.sin(i*fRadPerLetter+fRadPerLetter/2)*radius*k,
      			   -Math.cos(i*fRadPerLetter+fRadPerLetter/2)*radius*k);
    ctx.stroke();
  }
  ctx.restore();
}

function init() {
  // Создаем элемент canvas и объект context
  canvas = document.getElementById('panel');
  ctx = canvas.getContext('2d');
  // Инициализуем строку текста
  var f = canvas.width/sText.length*1.4;
  ctx.font = f+'px Verdana';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawFrame();
  setInterval(drawScene, 40); // Выводим сцену
}

function changeKey(d){
	key += d;
	nextAngle = iAngle - d*(2*Math.PI / sText.length);
}

function setKey(a){
	var t = -(a - a%(2*Math.PI / sText.length))+Math.PI/2;
	key = -(t-Math.PI/2) / (2*Math.PI / sText.length);
	nextAngle = t;
}