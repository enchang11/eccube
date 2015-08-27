var connection = null;
var username = "";
var password = "";
var session= null;

var url = "ws://192.168.0.42:8001/jms";

$(function(){
	beginConnection();
	
	$('.close').on('click', function(){
		$('.p_up_box').hide();
	});
});

function onMessageStock(message){
	console.log(JSON.parse( message.getText() ));
	var data = JSON.parse( message.getText() );
	//alert(data);
	
	if(data.stock==5){
		$('.p_up_box').show();
		$('.pop_message').html("残り在庫がわずかです");
		setTimeout(function(){
			$('.p_up_box').hide();
		},5000);
	}
	
	if(data.stock==0){
		$('.p_up_box').show();
		$('.pop_message').html("在庫がありません");
		setTimeout(function(){
			$('.p_up_box').hide();
		},5000);
	}
	
	$('.product_stock_'+data.product_class_id).html(data.stock);
}

function beginConnection(){
	if (connection == null) {
		var connectionFactory = new JmsConnectionFactory(url);
		var connectionFuture = connectionFactory.createConnection(username, password, function () {
			try {
				connection = connectionFuture.getValue();
				connection.setExceptionListener = function(e) {
					alert("Error: "+e.getMessage());
				}
				
				console.log("Connected");
				
				session = connection.createSession(false, Session.AUTO_ACKNOWLEDGE);

				var topic_stock = session.createTopic("/topic/stock");
				var consumer_stock = session.createConsumer(topic_stock);
				consumer_stock.setMessageListener(onMessageStock);
				
				connection.start(function () {
					 /* Started */ 
					 console.log("Started"); 
					 //sendDetails();
				});
			}
			catch (e) {
				alert(e.message);
			}
		});
	}
	else {
		try {
			connection.close(function () {
				console.log("Disconnected.");
			});
		}
		finally {
			connection = null;
		}
	}	
}
