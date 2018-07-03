var PD = {
	PD_NORMAL: 0, //일반 PD
	PD_PRO: 10, //프로 PD
	PD_POWER: 20, //파워 PD
	PD_SUPER: 30, //슈퍼 PD
	PD_STAR: 55 //스타 PD (Category와 동시 적용)
};
module.exports.PD = PD;

var ORIGIN = {
	JAM: 'jam',
	CREAM: 'cream',
	CHOUX: 'choux',
	MARKET: 'market',
	HEART: 'heart',
	WON: 'won'
};
module.exports.ORIGIN = ORIGIN;

var PURSETYPE = {
	JAM_MINUS_TYPE: '10',
	JAM_PLUS_TYPE: '11',
	CREAM_MINUS_TYPE: '20',
	CREAM_PLUS_TYPE: '21',
	CHOUX_MINUS_TYPE: '30',
	CHOUX_PLUS_TYPE: '31'
};
module.exports.PURSETYPE = PURSETYPE;

var PURSETYPE1 = {
	JAM: '1',
	CREAM: '2',
	CHOUX: '3',
	WON: '4'
};
module.exports.PURSETYPE1 = PURSETYPE1;