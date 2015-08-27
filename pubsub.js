
var pg = require ('pg');

//stomp
var Stomp = require('stomp-client');
var destination = '/topic/stock';
var stomp_client = new Stomp('localhost', 61613, null, null);
//==========
stomp_client.connect(function(sessionId,headers) {
	var sendHeaders = {
		contentType: 'application/json'
	  };
	
    stomp_client.subscribe(destination, function(body, headers) {
      console.log('This is the body of a message on the subscribed queue:', JSON.parse( body ),headers);
    });

});

pg.connect("postgres://kdemo_db_user@localhost/kdemo_db", function(err, client) {
    if(err) {
        console.log(err);
    }
	else{
		console.log('success');
	}
	
    client.on('notification', function(msg) {
        if (msg.name === 'notification' && msg.channel === 'table_update') {
            var pl = JSON.parse(msg.payload);
            console.log("*========*");
            Object.keys(pl).forEach(function (key) {
                console.log(key, pl[key]);
            });
			console.log("PL", pl);
            console.log("-========-");
			
			var sample_data = {
				id: 1,
				name: 'Rachelle'
			};
			stomp_client.publish(destination,JSON.stringify( pl ));
        }
    });
    client.query("LISTEN table_update");
});



