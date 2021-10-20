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
			.setName('date')
			.setDescription('Which date this reminder is for. (MM/DD or MM/DD/YY)')
			.setRequired(true)
	)
	.addStringOption(time =>
		time 
			.setName('time')
			.setDescription('Optional time for this reminder; defult is 8:00 am. (HH:MM am/pm)')	
	)
	
module.exports = { data }
