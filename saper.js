'use strict';

// обычный счётчик флагов
var flagCounter = 0;
// счётчик флагов, которые стоят на мине
var flagCounterTrue = 0;
var mines = 0;
var firstQuick = 0;
var widthQuick;
var heightQuick;


/*
 * Кнопка start, создание поля, генерация мин, заполнение значений
 */
function start() {
	// ширина, указанная юзером
	var width = $('.firstDiv')[0].value;
	// высота, указанная юзером
	var height = $('.secondDiv')[0].value;
	// делаем кнопку start более не нажимабельной, restart наоборот
	($('.start')).attr('disabled', 'disabled');
	($('.restart')).attr('disabled', false);
	if ($(".thirdDiv")[0].value > ($(".firstDiv")[0].value * $(".secondDiv")[0].value ) ) {
			$(".thirdDiv")[0].value = ($(".firstDiv")[0].value * $(".secondDiv")[0].value );
	}
	// добавляем строки (высота) и в каждую строку блоки (ширина)
	for (var j = 0; j < height; j++) {
		var field = $('.field');
		field.append($('<div class="example"></div>'));
		
		for (var i = 0; i < width; i++) {
			field.append($('<button class="button" row = ' + j + ' column = '+ i +' oncontextmenu="contextClick(' + j + ',' + i + '); return false" onclick="smallButton(' + j + ',' + i + ')"></button>'));
		}
	}
	// заполнить минами случайные ячейки
	fillItUp();
	// заполнить ячейки значениями (цифрами)
	fillItUp2();
	document.getElementById('test').innerHTML = mines - flagCounter;
	firstQuick = 1;
}

/*
 * Функция заполнения поля минами
 */
function fillItUp() {
	mines = $('.thirdDiv')[0].value;
	
	// Случайным образом генерируем позицию мины, если позиция уже занята - повторяем генерацию
	for (var q = 0; q < mines ;) {
		var i = getRandom( 0, ($('.firstDiv')[0].value) - 1 );
		var j = getRandom( 0, ($('.secondDiv')[0].value) - 1 );
		
		// Если позиция свободна - проставляем мину, увеличиваем счётчик
		if (($('[row = "' + j + '"][column = "' + i + '"]')).attr('mine') !== 'true') {
			($('[row = "' + j + '"][column = "' + i + '"]')).attr('mine', true);
			q++;
		}
	}
	return mines;
}

/*
 * Взаимодействие пользователя с полем (блоками) с помощью левой кнопки мыши
 */
function smallButton(j,i) {
	
	var a = ($('[row = "' + j + '"][column = "' + i + '"]').attr('value'));
	var b = 'background-image: url("flag.png");';
	
	// при нажатии на ячейку, проверка на присутствие мины
	if ($('[row = "' + j + '"][column = "' + i + '"]').attr('mine') === 'true' ) {
		// если есть - взрыв
		firstQuick === 2 ? blowQuick(j,i) : blow(j, i);
	// если нет - показать число, сколько рядом с ячейкой мин
	} else {
		// если на ячейке стоял флаг - убрать флаг и отнять счётчик флагов
		if ( $('[row = "' + j + '"][column = "' + i + '"]').attr('style') === b ) {
			flagCounter--;
			/* проверка в этом месте нужна. юзер набрал 6 флажков, когда надо было 5
			*  он нажимает на неверный флажок левой кнопкой и вуаля, победа */
			if ( mines == flagCounterTrue && flagCounterTrue == flagCounter ) {
				setTimeout("alert('Поздравляем!')", 250);
			}
		}
		// нажатая кнопка теперь неактивна
		$('[row = "' + j + '"][column = "' + i + '"]').css( 'backgroundImage' , ' url( "' + a + '.png" )' ).attr( 'disabled' , 'disabled' );
		a === '0' ? openIt(j,i) : false ;
	}
	document.getElementById('test').innerHTML = mines - flagCounter;
}

/*
*Функция получения случайного целого числа
*/
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min +1)) + min;
}

/*
 * Расставляем значения по ячейкам (цифры сообщающие о минах рядом)
 */
function fillItUp2() {
	
	for( var i = 0; i < $('.firstDiv')[0].value; i++ ) {
		for (var j = 0; j < $('.secondDiv')[0].value; j++ ) {
			var a = 0;
			if ($('[row = "' + (j-1) + '"][column = "' + (i-1) + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + (j-1) + '"][column = "' + i + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + (j-1) + '"][column = "' + (i+1) + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + j + '"][column = "' + (i-1) + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + j + '"][column = "' + (i+1) + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + (j+1) + '"][column = "' + (i-1) + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + (j+1) + '"][column = "' + i + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + (j+1) + '"][column = "' + (i+1) + '"]').attr('mine') === 'true' ) {
				a++;
			};
			$('[row = "' + j + '"][column = "' + i + '"]').attr('value', a );
		}
	}
}

/*
* Функция управления флажком, поставить и убрать (правая кнопка мыши)
*/
function contextClick(j,i) {
	
	var a = 'background-image: url("flag.png");';
	// если в этой ячейке стоит мина
	if ($('[row = "' + j + '"][column = "' + i + '"]').attr('mine') === 'true') {
		// если уже есть флаг - убрать его
		if ($('[row = "' + j + '"][column = "' + i + '"]').attr('style') === a) {
		$('[row = "' + j + '"][column = "' + i + '"]').attr('style', '');
		// отнять 1 у обоих счётчиков
		flagCounter--;
		flagCounterTrue--;
		// если нет флага - поставить его
		} else {
		$('[row = "' + j + '"][column = "' + i + '"]').css('backgroundImage', 'url("flag.png")');
		// добавить 1 к обоим счётчикам
		flagCounter++;
		flagCounterTrue++;
		}
	}
	// если в этой ячейке нет мины
	if ($('[row = "' + j + '"][column = "' + i + '"]').attr('mine') !== 'true') {
		// если есть флаг - убрать
		if ($('[row = "' + j + '"][column = "' + i + '"]').attr('style') === a) {
		$('[row = "' + j + '"][column = "' + i + '"]').attr('style', '');
		// отнять у счётчика 1
		flagCounter--;
		// если нет флага - поставить
		} else {
		$('[row = "' + j + '"][column = "' + i + '"]').css('backgroundImage', 'url("flag.png")');
		// прибавить к счётчику 1
		flagCounter++;
		}
	}
	
	// если кол-во мин = кол-ву флажков на минах И кол-во флажков на минах = кол-ву всех флажков - победа
	if ( mines == flagCounterTrue && flagCounterTrue == flagCounter ) {
	setTimeout("alert('Поздравляем!')", 150);
	}
	document.getElementById('test').innerHTML = mines - flagCounter;
}

/*
 * Функция, которая срабатывает, если нажата ячейка с миной
 */
function blow(j,i) {
	// взорвавшаяся мина отличается от остальных
	$('[row = "' + j + '"][column = "' + i + '"]').css( 'backgroundImage' , ' url( "death.png" )' );
	// цикл блокирует возможность взаимодействия со всеми ячейками поля
	for( var i = 0; i < $('.firstDiv')[0].value; i++ ) {
		for (var j = 0; j < $('.secondDiv')[0].value; j++ ) {
			$('[row = "' + j + '"][column = "' + i + '"]').attr( 'disabled' , 'disabled' );
			smallButton2(j,i);
		}
	}
}

/*
 * Кнопка перезапускающая игру с новыми параметрами, также обнуляет счётчики
 */
function restart() {
	firstQuick === 1;
	var a = $('.example');
	var b = $('.button');
	b.remove();
	a.remove();
	flagCounter = 0;
	flagCounterTrue = 0;
	start();
}

/*
 * Функция не позволяет вводить выходящие за рамки разумного значения
 * Для высоты и ширины это от 1 до 20 включительно
 * Для мин это от 1 до суммарного количества ячеек
 * Работает для каждого поля ввода
 */
function checkIt(a) {
	// для ширины
	if ( a === $(".firstDiv")[0].value) {
		if ($(".firstDiv")[0].value <= 0 ) {
			$(".firstDiv")[0].value = 1;
		}
		if ($(".firstDiv")[0].value > 20 ) {
			$(".firstDiv")[0].value = 20;
		}
	}
	// для высоты
	if ( a === $(".secondDiv")[0].value ) {
		if ($(".secondDiv")[0].value <= 0 ) {
			$(".secondDiv")[0].value = 1;
		}
		if ($(".secondDiv")[0].value > 20 ) {
			$(".secondDiv")[0].value = 20;
		}
	}
	// для количества мин
	if ( a === $(".thirdDiv")[0].value ) {
		if ($(".thirdDiv")[0].value <= 0 ) {
			$(".thirdDiv")[0].value = 1;
		}
		if ($(".thirdDiv")[0].value > ($(".firstDiv")[0].value * $(".secondDiv")[0].value ) ) {
			$(".thirdDiv")[0].value = ($(".firstDiv")[0].value * $(".secondDiv")[0].value );
		}
	}
}

/*
 * функция, которая откроет все значения и все мины, когда юзер подорвётся на мине
 */
function smallButton2(j,i) {
	
	var a = $('[row = "' + j + '"][column = "' + i + '"]');
	var b = ($('[row = "' + j + '"][column = "' + i + '"]').attr('value'));
	var c = 'background-image: url("death.png");';
	var d = 'background-image: url("flag.png");';
	
	// если это место смерти - показать взорвавшуюся мину
	if ($('[row = "' + j + '"][column = "' + i + '"]').attr('style') === c) {
		$('[row = "' + j + '"][column = "' + i + '"]').css( 'backgroundImage' , ' url( "death.png" )' );
	// если тут стоит отмеченная флажком мина - показать разминированную мину
	}	else if ( ( a.attr('style') === d ) && ( a.attr('mine') === 'true' ) ) {
		a.css( 'backgroundImage' , ' url( "enim.png" )' );
	// если тут стоит не отмеченная флажком мина - показать мину
	}	else if ($('[row = "' + j + '"][column = "' + i + '"]').attr('mine') === 'true' ) {
		$('[row = "' + j + '"][column = "' + i + '"]').css( 'backgroundImage' , ' url( "mine.png" )' );
	// если тут не место смерти и не мина - показать значение
	}	else if ($('[row = "' + j + '"][column = "' + i + '"]').attr('style') !== 'background-image: url("' + b + '.png");') {
			$('[row = "' + j + '"][column = "' + i + '"]').css( 'backgroundImage' , 'url( "' + b + 1 + '.png" )' );
	}
}

/*
 * Функция для открытия всех нулевых ячеек, находящихся рядом
 */
function openIt(j,i) {
	
	if ($('[row = "' + (j-1) + '"][column = "' + (i-1) + '"]').attr('value') === '0' ) {
		$('[row = "' + (j-1) + '"][column = "' + (i-1) + '"]').css( 'backgroundImage' , ' url( "0.png" )' ).attr( 'disabled' , 'disabled' );

	} if ($('[row = "' + (j-1) + '"][column = "' + i + '"]').attr('value') === '0' ) {
		$('[row = "' + (j-1) + '"][column = "' + i + '"]').css( 'backgroundImage' , ' url( "0.png" )' ).attr( 'disabled' , 'disabled' );

	} if ($('[row = "' + (j-1) + '"][column = "' + (i+1) + '"]').attr('value') === '0' ) {
		$('[row = "' + (j-1) + '"][column = "' + (i+1) + '"]').css( 'backgroundImage' , ' url( "0.png" )' ).attr( 'disabled' , 'disabled' );

	} if ($('[row = "' + j + '"][column = "' + (i-1) + '"]').attr('value') === '0' ) {
		$('[row = "' + j + '"][column = "' + (i-1) + '"]').css( 'backgroundImage' , ' url( "0.png" )' ).attr( 'disabled' , 'disabled' );

	} if ($('[row = "' + j + '"][column = "' + (i+1) + '"]').attr('value') === '0' ) {
		$('[row = "' + j + '"][column = "' + (i+1) + '"]').css( 'backgroundImage' , ' url( "0.png" )' ).attr( 'disabled' , 'disabled' );

	} if ($('[row = "' + (j+1) + '"][column = "' + (i-1) + '"]').attr('value') === '0' ) {
		$('[row = "' + (j+1) + '"][column = "' + (i-1) + '"]').css( 'backgroundImage' , ' url( "0.png" )' ).attr( 'disabled' , 'disabled' );

	} if ($('[row = "' + (j+1) + '"][column = "' + i + '"]').attr('value') === '0' ) {
		$('[row = "' + (j+1) + '"][column = "' + i + '"]').css( 'backgroundImage' , ' url( "0.png" )' ).attr( 'disabled' , 'disabled' );

	} if ($('[row = "' + (j+1) + '"][column = "' + (i+1) + '"]').attr('value') === '0' ) {
		$('[row = "' + (j+1) + '"][column = "' + (i+1) + '"]').css( 'backgroundImage' , ' url( "0.png" )' ).attr( 'disabled' , 'disabled' );
	
	}
};
 
function quickStart(difficult) {
	
	if ( firstQuick === 1 || 2 ) {
	var e = $('.example');
	var f = $('.button');
	e.remove();
	f.remove();
	flagCounter = 0;
	flagCounterTrue = 0;
	}
	
	difficult === '1' ? ( widthQuick = 5, heightQuick = 5, mines = 5 ) : false;
	difficult === '2' ? ( widthQuick = 10, heightQuick = 10, mines = 15) : false;
	difficult === '3' ? ( widthQuick = 20, heightQuick = 20, mines = 80 ) : false;
	
	$('.firstDiv')[0].value = widthQuick;
	$('.secondDiv')[0].value = heightQuick;
	$('.thirdDiv')[0].value = mines;
	
	// делаем кнопку start более не нажимабельной, restart наоборот
	($('.start')).attr('disabled', 'disabled');
	($('.restart')).attr('disabled', false);
	
	// добавляем строки (высота) и в каждую строку блоки (ширина)
	for (var j = 0; j < heightQuick; j++) {
		var field = $('.field');
		field.append($('<div class="example"></div>'));
		
		for (var i = 0; i < widthQuick; i++) {
			field.append($('<button class="button" row = ' + j + ' column = '+ i +' oncontextmenu="contextClick(' + j + ',' + i + '); return false" onclick="smallButton(' + j + ',' + i + ')"></button>'));
		}
	}
					
	// Случайным образом генерируем позицию мины, если позиция уже занята - повторяем генерацию
	for (var q = 0; q < mines ;) {
		var i = getRandom( 0, widthQuick - 1 );
		var j = getRandom( 0, heightQuick - 1 );
		
		// Если позиция свободна - проставляем мину, увеличиваем счётчик
		if (($('[row = "' + j + '"][column = "' + i + '"]')).attr('mine') !== 'true') {
			($('[row = "' + j + '"][column = "' + i + '"]')).attr('mine', true);
			q++;
		}
	}
		
	// заполняем ячейки значениями (цифрами)
	for( var i = 0; i < widthQuick; i++ ) {
		for (var j = 0; j < heightQuick; j++ ) {
			var a = 0;
			if ($('[row = "' + (j-1) + '"][column = "' + (i-1) + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + (j-1) + '"][column = "' + i + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + (j-1) + '"][column = "' + (i+1) + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + j + '"][column = "' + (i-1) + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + j + '"][column = "' + (i+1) + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + (j+1) + '"][column = "' + (i-1) + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + (j+1) + '"][column = "' + i + '"]').attr('mine') === 'true' ) {
				a++;
			} if ($('[row = "' + (j+1) + '"][column = "' + (i+1) + '"]').attr('mine') === 'true' ) {
				a++;
			};
			$('[row = "' + j + '"][column = "' + i + '"]').attr('value', a );
		}
	}

	// запускает счётчик оставшихся мин
	document.getElementById('test').innerHTML = mines - flagCounter;
	
	firstQuick = 2;
	return firstQuick;
	return heightQuick;
	return widthQuick;
}

function blowQuick(j,i) {
	// взорвавшаяся мина отличается от остальных
	$('[row = "' + j + '"][column = "' + i + '"]').css( 'backgroundImage' , ' url( "death.png" )' );
	// цикл блокирует возможность взаимодействия со всеми ячейками поля
	for( var i = 0; i < widthQuick; i++ ) {
		for (var j = 0; j < heightQuick; j++ ) {
			$('[row = "' + j + '"][column = "' + i + '"]').attr( 'disabled' , 'disabled' );
			smallButton2(j,i);
		}
	}
}