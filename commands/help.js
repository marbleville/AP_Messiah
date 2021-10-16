const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('help')
	.setDescription('Sends help documentation.')
	
module.exports = { data }
