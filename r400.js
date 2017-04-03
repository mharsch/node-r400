function encode(msg) {
	var addr = 0x00;
	if (msg.is_response)
		addr|= 0x80;

	if (msg.is_error)
		addr |= 0x40;

	if (msg.need_reply)
		addr |= 0x20;

	if (0 <= msg.indicator_addr < 32)
		addr += msg.indicator_addr

	const ADDR = addr.toString(16).toUpperCase();

	var cmd = 0x00;
	switch (msg.command) {
		case('Read Literal'):
			cmd = 0x05;
		break;
		case('Read Final'):
			cmd = 0x11;
		break;
		case('Write Final'):
			cmd = 0x12;
		break;
		case('Execute'):
			cmd = 0x10;
		break;
		default:
		break;
	}

	var CMD = cmd.toString(16).toUpperCase();
	while (CMD.length < 2)
		CMD = '0' + CMD;


	var reg = 0x0000;
	if (msg.register &&
	    typeof msg.register === 'number' &&
	    0 <= msg.register <= 0xFFFF &&
	    Number.isInteger(msg.register)) {
		reg = msg.register;
	}

	var REG = reg.toString(16).toUpperCase();;
	while (REG.length < 4)
		REG = '0' + REG;
		
	var data = '';
	if (msg.data) {
		data = ':';
		if (typeof msg.data === 'number') {
			data = data + msg.data.toString(16).toUpperCase();
		} else if (typeof msg.data === 'string') {
			data = data + msg.data;
		}
	}

	const DATA = data;

	const MSG = ADDR + CMD + REG + DATA + '\r\n';
	const buf = Buffer.from(MSG, 'ascii');

	return (buf)
}

function decode(buf) {

	// buf should be at least 8 characters plus termination separator(s)
	var ADDR = parseInt(buf.toString('ascii', 0, 2), 16);
	var CMD = parseInt(buf.toString('ascii', 2, 4), 16);
	var REG = parseInt(buf.toString('ascii', 4, 8), 16);
	var DATA = '';
	if (buf.toString('ascii', 8, 9) == ':') {
		DATA = buf.toString('ascii', 9).trim();
		if (DATA.endsWith(';'))
			DATA = DATA.slice(0, DATA.length - 1);
	}

	var msg = {};

	msg.is_response = (ADDR & 0x80) ? true : false;
	msg.is_error = (ADDR & 0x40) ? true : false;
	msg.need_reply  = (ADDR & 0x20) ? true : false;
	msg.indicator_addr = ADDR & 0x1F;

	switch (CMD) {
		case 0x05:
			msg.command = 'Read Literal';
		break;
		case 0x11:
			msg.command = 'Read Final';
		break;
		case 0x12:
			msg.command = 'Write Final';
		break;
		case 0x10:
			msg.command = 'Execute';
		break;
		default:

		break;
	}

	msg.register = REG;

	var error_codes = {
		'C000': "Unknown Error",
		'A000': "Not Implemented Error",
		'9000': "Access Denied",
		'8800': "Data Under Range",
		'8400': "Data Over Range",
		'8200': "Illegal Value",
		'8100': "Illegal Operation",
		'8040': "Bad parameter",
		'8020': "Menu in Use",
		'8010': "Viewer Mode required",
		'8008': "Checksum required"
	}

	if (msg.is_error)
		msg.error = error_codes[DATA];

	msg.data = DATA;

	return (msg)
}

module.exports = {
	encode: encode,
	decode: decode
}
