const Promise = require("bluebird")
const _ = require('lodash')
const golos = require('steem')
var fs = require("fs");
var utf8 = require('utf8');
golos.config.set('websocket','wss://ws.golos.io');
golos.config.set('address_prefix','GLS');
golos.config.set('chain_id','782a3039b478c839e4cb0c941ff4eaeb7df40bdd68bd441afd444b9da763de12');
//----------------Данные робота (обязательно для установки флага)---
var account='XXXXXX'; //<< сюда (вместо X) вписываем аккаунт робота (без собачки '@')
var key='XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; //<< сюда (вместо X) вписываем приватный постинг ключ аккаунта робота
var percent=-100; //<< процент силы флага (значение отрицательное)
//----------------------------------------------
// загружаем словарь лексикона (файл lexicon.txt)
var contents = fs.readFileSync('./lexicon.txt', 'utf8');
var word = contents.match(/[а-яё]+/gi);//преобразуем в массив

// фикс обработки несуществующих блоков
let trig = {
    existBlock:true
}
// получение глобальных динамических данных
const dynamicSnap = new Promise((resolve, reject) => {
    golos.api.getDynamicGlobalProperties((err, res) => {
        if (err) {
        console.log(err)
        }
        else {
            resolve(res)
        }
    })
})
// получение номера последнего блока
const FIRSTBLOCK = n => n.head_block_number
// достаем операции из транзакций
const OPS = (ops) => {
    return _.flatten(ops.transactions.map(tx => tx.operations))
}
// фильтруем операции
const OPSFILTER = (operation) => {
const [type, data] = operation
// если размещён комментарий, то идём дальше
    if (type === 'comment' && data.title==='') {
				Author=data.author;//автор комментария
				Permlink=data.permlink;//пермлинк комментария
				Body=data.body;//тело комментария				
// проверяем валидность тега
function tag() {
	let str ='';
	if(JSON.parse(data.json_metadata).tags!=undefined){	//если тег в посте присутствует	
		str=JSON.parse(data.json_metadata).tags[0];
		if(str=='ru--mat'){// и этот тег "мат"
			return false; //возвращаем false
		}		
	} return true;	//иначе true
}
// ищем слова лексикона в комментарии
function censored(phrase) {
	var $phrase = phrase.match(/[а-яё]+/gi);//разбиваем комментарий в массив
	if($phrase!=null){
	for (let k=0;k<$phrase.length;k++){// просматриваем каждый элемент массива комментария
	
  for (let i=0;i<word.length;i++){//сопоставляем с элементами массива лексикона
if ($phrase[k]==word[i]){// если элементы совпадают,
console.log('Найдено слово: "'+$phrase[k]+'"');//выводим в консоль найденое слово
return true;//возвращаем true
}
else false;//иначе возвращаем false
  }
	}
	}
  
}
// если нашли элемент лексикона в комментарии к посту вне тега 'ru--mat'
		if (censored(Body.toLowerCase())===true && tag()===true){
//ставим флаг		
//golos.broadcast.vote(key, account, Author, Permlink, percent*100, function(err, result) {console.log(err, result); }); //раскомментируйте для установки флага			
console.log('Поставили флаг комментарию: '+Permlink+'\n'+'Автор: '+Author+'\n'+'* * *'); // выводим в консоль пермлинк и автора комментария
	
		}
	}
}
// получение данных каждого блока
const SENDBLOCK = currentblock => {
    golos.api.getBlock(currentblock, (err, result) => {
  		if (err) {
            console.log(err)
        } 
		else if (result === null){
			// если блок не существует активируем триггер 
					trig.existBlock = false
				}
        else {
			// если блок существует и не было ошибки - отправляем блок в функцию фильтра операций
			OPS(result)
			.forEach(OPSFILTER)
			trig.existBlock = true
		}
    })
}
// определяем стартовый блок на начало работы скрипта
// каждые 3 секунды увеличивае номер блока на 1
const NEXTBLOCKS = firstblock => {
    let currentblock = firstblock
    setInterval(() => {
		// увеличиваем только если предыдущий блок был корректно обработан
		if(trig.existBlock){
					currentblock++
				}
		SENDBLOCK(currentblock)
    }, 3000)
}
// запускаем основные функции через обещания (promises)
dynamicSnap
    .then(FIRSTBLOCK)
    .then(NEXTBLOCKS)
    .catch(e => console.log(e));