var client = require('./es_connection.js'),
    fs = require('fs');
let size = 10;
let jsonResponse = [];

let index = 'samsung_dps_b2c',
    type = 'all',
    body = {
        "query": { "bool": { "must": [{ "match": { "endeca_record_source": "KeywordsQuerySuggestionsUsingDelimitedFile" } }] } }
    };
 
function loop(offset = 0) {
    searchMethod(offset, function (response) {
        if (response.hits.hits.length > 0) {
            // console.log(response.hits.hits);
            response.hits.hits.forEach(function (hit) {
                console.log(hit._id);
                jsonResponse.push(hit);
            })
            loop(offset + 10);
        }
        else {
            fs.writeFile("/tmp/Siddu.json", JSON.stringify(jsonResponse), 'utf8', function (err) {
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
        type: type,
        size: size,
        from: offset,
        body: body
    }, function (error, response, status) {
        if (error) {
            console.log("search error: " + error)
        }
        else {
            console.log("--- Response ---");
            callback(response);
        }
    });
}

loop();