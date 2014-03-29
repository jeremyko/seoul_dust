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
