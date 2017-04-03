var r400 = require('./r400.js');
var i;

var command_strings = [
	'20110026\r\n',
	'20050026\r\n',
	'2112A381:Hello There\r\n',
	'2112001A:4D2\r\n',
	'2112A381:Hello There\r\n',
	'21100010\r\n',
	'21120008:0B\r\n',
	'21120008:8E\r\n',
	'21120042:06\r\n',
	'21120043:11\r\n',
	'21110040\r\n',
	'21120041:03\r\n',
	'21100040:1\r\n',
	'21100040:0\r\n'
]

var response_strings = [
	'81110026:00000064\r\n',
	'81050026:  100 kg G\r\n',
	'C112A381:9000\r\n',
	'8112001A:0000\r\n',
	'8112A381:0000\r\n',
	'81100010:0000\r\n',
	'81120008:0000\r\n',
]

var command_objs = [
	{
		need_reply: true,
		command: 'Read Final',
		indicator_addr: 0,
		register: 0x0026
	}
]

function test_decode(str) {
	var buf = Buffer.from(str, 'ascii');
	return (r400.decode(buf));
}

function test_encode(obj) {
	var buf = r400.encode(obj);
	return (buf.toString('ascii'));
}

function test_match(str) {
	var d1 = test_decode(str);
	var e1 = test_encode(d1);
	if (e1 === str) {
		console.log('match');
	} else {
		console.log('mismatch ' + str + ' ' + e1);
	}
}

response_strings.forEach(test_match);
command_strings.forEach(test_match);
