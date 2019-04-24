var client = require('./connection.js'),
    fs = require('fs');
let size = 500;
let jsonResponse = [];

let index = 'logstash-*',
    body = {
        "query": {
            "bool": {
                "must": [
                    {
                        "match": {
                            "method": "cancelSubscription"
                        }
                    },
                    {
                        "range": {
                            "@timestamp": {
                                "gte": "2019-03-15T00:00:00.000Z"
                            }
                        }
                    },
                    {
                        "range": {
                            "@timestamp": {
                                "lte": "2019-04-01T00:00:00.000Z"
                            }
                        }
                    }
                ]
            }
        }
    };

function loop(offset = 0) {
    searchMethod(offset, function (response) {
        if (response == "error") {
            fs.writeFile("/Users/ecom-siddarth.cr/Downloads/subs_cancel2.json", JSON.stringify(jsonResponse), 'utf8', function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
            return
        }
        if (response.hits.hits.length > 0) {
            console.log("offset:", offset)
            response.hits.hits.forEach(function (hit) {
                //    console.log(hit._id);
                jsonResponse.push(hit);
            })
            loop(offset + 500);
        }
        else {
            fs.writeFile("/Users/ecom-siddarth.cr/Downloads/subs_cancel2.json", JSON.stringify(jsonResponse), 'utf8', function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
            return
        };
    })
}

function searchMethod(offset, callback) {
    client.search({
        index: index,
        size: size,
        from: offset,
        body: body,
        _source: ["parsedLogMessage"],
    }, function (error, response, status) {
        if (error) {
            console.log("search error: " + error)
            callback("error")
        }
        else {
            console.log("--- Got Response ---");
            callback(response);
        }
    });
}

loop();