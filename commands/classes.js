const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('classes')
	.setDescription('List of currently supported classes.')
	
module.exports = { data }
