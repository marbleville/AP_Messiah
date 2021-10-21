const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('remind')
	.setDescription('Sends help documentation.')
	.addStringOption(c => 
		c
			.setName('class')
			.setDescription('Which class this reminder is for.')
			.setRequired(true)
			.addChoice('All Classes', 'all')
			.addChoice('AP Stats', 'stat')
            .addChoice('AP Calculus', 'calc')
            .addChoice('AP Computer Science A', 'csa')
            .addChoice('AP Computer Science Principles', 'csp')
            .addChoice('AP Physics', 'phys')
            .addChoice('AP Biology', 'bio')
            .addChoice('AP Chemistry', 'chem')
            .addChoice('AP Environmental Science', 'enviro')
            .addChoice('AP Literature', 'lit')
            .addChoice('AP Language', 'lang')
            .addChoice('AP Government', 'gov')
            .addChoice('AP European History', 'euro')
            .addChoice('AP US History', 'apush')
            .addChoice('AP Latin', 'spqr')
            .addChoice('AP Spanish', 'span')
            .addChoice('AP French', 'frank')
            .addChoice('AP Art History', 'arthist')
            .addChoice('AP Music Theory', 'music')	
	)
	.addStringOption(month => 
		month
			.setName('date/time')
			.setDescription('Which date and time this reminder is for (default time 8:00 am). (MM/DD/YYYY HH:MM am/pm)')
			.setRequired(true)
	)
	.addStringOption(time =>
		time 
			.setName('message')
			.setDescription('The message to send wit this reminder.')
			.setRequired(true)	
	)
	
module.exports = { data }
