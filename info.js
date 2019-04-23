var client = require('./es_connection.js');

client.cluster.health({},function(err,resp,status) {  
  console.log("-- Client Health --",resp);
});
