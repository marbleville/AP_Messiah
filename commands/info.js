const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Sends info about this server.')
	.addSubcommand(subcommand => 
		subcommand
			.setName('server')
			.setDescription('Sends information about this server.')
	)
	.addSubcommand(subcommand1 => 
		subcommand1
			.setName('user')
			.setDescription('Get information about a user in this server.')
			.addUserOption(option => 
				option
					.setName('target')
					.setDescription('The user you wannt information about')
					.setRequired(true)
			)
	)
	
module.exports = { data }
