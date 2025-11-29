/**
 * Status Command - Set custom status
 */

module.exports = {
  name: 'status',
  description: 'Set a custom activity status',
  usage: 'status <playing|watching|listening|competing> <text>',
  aliases: ['activity', 'setactivity'],

  async execute(client, message, args, voiceState) {
    if (!args[0]) {
      // Clear status
      await client.user.setActivity(null);
      return message.channel.send('✅ Status cleared.');
    }

    const validTypes = ['playing', 'watching', 'listening', 'competing', 'streaming'];
    const type = args[0].toLowerCase();

    let activityType;
    let text;

    if (validTypes.includes(type)) {
      activityType = type.toUpperCase();
      text = args.slice(1).join(' ');
    } else {
      // Default to PLAYING if no type specified
      activityType = 'PLAYING';
      text = args.join(' ');
    }

    if (!text) {
      return message.channel.send('❌ Please provide status text.');
    }

    try {
      await client.user.setActivity(text, { type: activityType });
      await message.channel.send(`✅ Status set to: **${activityType}** ${text}`);
    } catch (error) {
      console.error('Error setting status:', error);
      await message.channel.send(`❌ Failed to set status: ${error.message}`);
    }
  },
};
