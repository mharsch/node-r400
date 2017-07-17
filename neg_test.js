var r400 = require('./r400');

var neg_response = '81110026:FFFF966A\r\n';

var neg_buf = Buffer.from(neg_response, 'ascii');

var neg_obj = r400.decode(neg_buf);

var neg_val = parseInt(neg_obj.data, 16);

if ((neg_val >>> 31) == 1)
	neg_val = -~neg_val;

console.log(neg_val);
