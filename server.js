const mqtt = require('mqtt');
const WebSocket = require('ws');

// Configuração do cliente MQTT
const mqttClient = mqtt.connect('mqtt://nearfish.ddns.net', {
    port: 1883,
    username: 'admin',
    password: 'near@andre',
    clientId: 'mqtt_server_' + Math.random().toString(16).substr(2, 8)
});

// Configuração do servidor WebSocket
const wss = new WebSocket.Server({ port: 1890 });

mqttClient.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    mqttClient.subscribe('SmartSilos/Aviario1/NivelSilo1/Matricula', (err) => {
        if (!err) {
            console.log('Inscrito no tópico SmartSilos/Aviario1/NivelSilo1/Matricula');
        } else {
            console.error('Erro ao inscrever no tópico 1:', err);
        }
    });
    mqttClient.subscribe('SmartSilos/Aviario1/NivelSilo2/Matricula', (err) => {
        if (!err) {
            console.log('Inscrito no tópico SmartSilos/Aviario1/NivelSilo2/Matricula');
        } else {
            console.error('Erro ao inscrever no tópico 2:', err);
        }
    });
});

mqttClient.on('message', (topic, message) => {
    const data = message.toString();
    console.log(`Mensagem recebida no tópico ${topic}: ${data}`);
    
    // Envia os dados para todos os clientes WebSocket conectados
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ topic, data }));
        }
    });
});

mqttClient.on('error', (err) => {
    console.error('Erro no MQTT:', err);
});

wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado');
    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado');
    });
});

console.log('Servidor WebSocket rodando na porta 1890');