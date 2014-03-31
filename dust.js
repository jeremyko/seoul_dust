var request = require('request')
var Iconv1  = require('iconv').Iconv
var cheerio = require('cheerio');


//----------------------------------------------------------------------------------------------------------------------
//detailed info
request({uri: 'http://cleanair.seoul.go.kr/air_city.htm?method=measure', encoding: 'binary'},
    function(err, response, body) {
        var strContents = new Buffer(body, 'binary')
        iconv = new Iconv1('euc-kr', 'UTF8')
        strContents = iconv.convert(strContents).toString()
        //console.log(strContents);

        var $ = cheerio.load(strContents);
        console.log( '\n<'+$('.ft_point1', '.graph_h4').text()+'>');

        $('tbody tr','.tbl2').each(function() {
            var strArea=$(this).find("td").eq(0).html().replace(/\s+/, "");

            strArea = strArea.replace(/(\r\n|\n|\r)/gm,"");
            strArea = strArea.replace(/\s+/, "");
            //strArea = padding_right(strArea, ' ', 5);

            if(strArea=="금천구"||strArea=="강남구"||strArea=="양천구") {
                var strVal10 = $(this).find("td").eq(1).html().replace(/\s+/, "");
                strVal10 = strVal10.replace(/(\r\n|\n|\r)/gm, "");
                strVal10 = strVal10.replace(/\s+/, "");

                var strVal2_5 = $(this).find("td").eq(2).html().replace(/\s+/, "");
                strVal2_5 = strVal2_5.replace(/(\r\n|\n|\r)/gm, "");
                strVal2_5 = strVal2_5.replace(/\s+/, "");

                var strStatus = $(this).find("td").eq(7).html().replace(/\s+/, "");
                strStatus = strStatus.replace(/(\r\n|\n|\r)/gm, "");
                strStatus = strStatus.replace(/\s+/, "");

                var strDeterminationFactor = $(this).find("td").eq(8).html().replace(/\s+/, "");
                strDeterminationFactor = strDeterminationFactor.replace(/(\r\n|\n|\r)/gm, "");
                strDeterminationFactor = strDeterminationFactor.replace(/\s+/, "");


                var strVal9 = $(this).find("td").eq(9).html().replace(/\s+/, "");
                strVal9 = strVal9.replace(/(\r\n|\n|\r)/gm, "");
                strVal9 = strVal9.replace(/\s+/, "");
                strVal9 = strVal9.replace("</sub>", "");
                strVal9 = strVal9.replace("<sub>2", "²");

                console.log('-' + strArea + ': PM10=' + strVal10+ ' / PM2.5=' +strVal2_5 + ' / ' + strStatus+ ' / ' + '결정물질:'+strVal9 +' ['+strDeterminationFactor +']');
            }
        })

        //summary info
        request({uri: 'http://cleanair.seoul.go.kr/main.htm', encoding: 'binary'},
            function(err, response, body) {
                var strContents = new Buffer(body, 'binary')
                iconv = new Iconv1('euc-kr', 'UTF8')
                strContents = iconv.convert(strContents).toString()
                //console.log(strContents);
                var $ = cheerio.load(strContents);

                console.log( '\n* 서울 미세먼지 평균 농도 : '+$('.average ', '.w154').text() );

                $('.al_c').each(function() {
                    var strTemper=$(this).find("td").eq(0).html().replace(/\s+/, "");
                    strTemper = strTemper.replace(/(\r\n|\n|\r)/gm,"");
                    strTemper = strTemper.replace(/\s+/, "");
                    strTemper = strTemper.replace("&deg;C", "℃");

                    console.log('* 온도 : ' + strTemper );

                    var strHum=$(this).find("td").eq(1).html().replace(/\s+/, "");
                    strHum = strHum.replace(/(\r\n|\n|\r)/gm,"");
                    strHum = strHum.replace(/\s+/, "");
                    console.log('* 습도 : ' + strHum );

                    var strWinDest=$(this).find("td").eq(2).html().replace(/\s+/, "");
                    strWinDest = strWinDest.replace(/(\r\n|\n|\r)/gm,"");
                    strWinDest = strWinDest.replace(/\s+/, "");
                    console.log('* 풍향 : ' + strWinDest );

                    var strWin=$(this).find("td").eq(3).html().replace(/\s+/, "");
                    strWin = strWin.replace(/(\r\n|\n|\r)/gm,"");
                    strWin = strWin.replace(/\s+/, "");
                    console.log('* 풍속 : ' + strWin );
                })
            })
    })

