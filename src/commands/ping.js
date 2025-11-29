/**
 * Ping Command - Check bot latency
 */

module.exports = {
  name: 'ping',
  description: 'Check bot latency',
  usage: 'ping',
  aliases: ['latency'],

  async execute(client, message, args, voiceState) {
    const start = Date.now();
    const msg = await message.channel.send('🏓 Pinging...');
    const latency = Date.now() - start;
    const wsLatency = client.ws.ping;

    await msg.edit(`🏓 **Pong!**\n📡 Latency: ${latency}ms\n💓 WebSocket: ${wsLatency}ms`);
  },
};
