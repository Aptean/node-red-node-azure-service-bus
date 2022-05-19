module.exports = function(RED) {
    function AzureServiceBusPostNode(config) {
        RED.nodes.createNode(this,config);
		const { ServiceBusClient } = require("@azure/service-bus");
		var sbClient = new ServiceBusClient(config.connectionString);
		const sender = sbClient.createSender(config.topic);
        var node = this;
        node.on('input', function(msg) {
            const messages = [{
                body: msg.payload,
                applicationProperties: msg.applicationProperties
            }];
			sender.sendMessages(messages).then(() =>
            {
                node.send(msg);
            }).catch(err =>
            {
                console.error(err);
                node.error(err, msg);
            });
        });
    }
    RED.nodes.registerType("azure-service-bus-post",AzureServiceBusPostNode);
}