var request = require('request')
var Iconv1  = require('iconv').Iconv
var cheerio = require('cheerio');

request({uri: 'http://cleanair.seoul.go.kr/air_city.htm?method=measure', encoding: 'binary'},
    function(err, response, body) {
        var strContents = new Buffer(body, 'binary')
        iconv = new Iconv1('euc-kr', 'UTF8')
        strContents = iconv.convert(strContents).toString()
        //console.log(strContents);

        var $ = cheerio.load(strContents);
        console.log( '<'+$('.ft_point1', '.graph_h4').text()+'>');

        $('tbody tr','.tbl2').each(function() {
            var strArea=$(this).find("td").eq(0).html().replace(/\s+/, "");
            strArea = strArea.replace(/(\r\n|\n|\r)/gm,"");
            strArea = strArea.replace(/\s+/, "");
            var strVal=$(this).find("td").eq(1).html().replace(/\s+/, "");
            strVal = strVal.replace(/(\r\n|\n|\r)/gm,"");
            console.log( '-' + strArea+': '+strVal );
        })

    })
/////////////
/*
var spawn = require('child_process').spawn;
var Iconv = require('iconv').Iconv;
var cheerio = require('cheerio');

// http://cleanair.seoul.go.kr/main.htm
var url = 'http://cleanair.seoul.go.kr/air_city.htm?method=measure'; // euc-kr 문서
var curl = spawn('curl', [url]);

var body = '';
var str_err = null;

curl.stdout.setEncoding('binary'); // euc-kr 문서는 binary 로 출력해야됨

curl.stdout.on('data', function(chunk){
    body += chunk;
});

curl.stderr.on('data', function(err) {
    if (str_err === null) {
        str_err = '';
    }

    str_err += err;
});

curl.on('close', function(code){

    if (code != 0) {
        console.log('Failed: ' + code);
        console.log(err);
    }else{
        var escape_text = escape(body);
        var toUTF8 = new Iconv('euc-kr', 'utf8//TRANSLIT//IGNORE');

        var toHex = function(n) {
            return parseInt('0x' + n);
        };

        var str = escape_text.replace(/(%([^%]{2}))+/gim, function(chars) {
            var b;
            b = new Buffer(chars.split('%').slice(1).map(toHex));
            var utf8_str = toUTF8.convert(b).toString();
            return utf8_str;
        });

        //console.log(str);
        var $ = cheerio.load(str);
        console.log( '<'+$('.ft_point1', '.graph_h4').text()+'>');

        $('tbody tr','.tbl2').each(function() {
            var strArea=$(this).find("td").eq(0).html().replace(/\s+/, "");
            strArea = strArea.replace(/(\r\n|\n|\r)/gm,"");
            strArea = strArea.replace(/\s+/, "");
            var strVal=$(this).find("td").eq(1).html().replace(/\s+/, "");
            strVal = strVal.replace(/(\r\n|\n|\r)/gm,"");
            console.log( '-' + strArea+': '+strVal );
        })
    }
});
*/