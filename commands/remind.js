const { SlashCommandBuilder } = require('@discordjs/builders');

let days = [
	{ name: '1', value: 1 },
	{ name: '2', value: 2 },
	{ name: '3', value: 3 },
	{ name: '4', value: 4 },
	{ name: '5', value: 5 },
	{ name: '6', value: 6 },
	{ name: '7', value: 7 },
	{ name: '8', value: 8 },
	{ name: '9', value: 9 },
	{ name: '10', value: 10 },
	{ name: '11', value: 11 },
	{ name: '12', value: 12 },
	{ name: '13', value: 13 },
	{ name: '14', value: 14 },
	{ name: '15', value: 15 },
	{ name: '16', value: 16 },
	{ name: '17', value: 17 },
	{ name: '18', value: 18 },
	{ name: '19', value: 19 },
	{ name: '20', value: 20 },
	{ name: '21', value: 21 },
	{ name: '22', value: 22 },
	{ name: '23', value: 23 },
	{ name: '24', value: 24 },
	{ name: '25', value: 25 },
	{ name: '26', value: 26 },
	{ name: '27', value: 27 },
	{ name: '28', value: 28 },
	{ name: '29', value: 29 },
	{ name: '30', value: 30 },
	{ name: '31', value: 31 }
]

const data = new SlashCommandBuilder()
	.setName('help')
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
			.setName('month')
			.setDescription('Which month of the year this reminder is for.')
			.setRequired(true)
			.addChoice('January', 'jan')
			.addChoice('Febuary', 'feb')
			.addChoice('March', 'mar')
			.addChoice('April', 'apr')
			.addChoice('May', 'may')
			.addChoice('June', 'jun')
			.addChoice('July', 'jly')
			.addChoice('August', 'aug')
			.addChoice('September', 'sep')
			.addChoice('October', 'oct')
			.addChoice('November', 'nov')
			.addChoice('December', 'dec')	
	)
	.addIntegerOption(day => 
		day	
			.setName('day')
			.setDescription('Which day of the month this reminder is for.')
			.setRequired(true)
			.addChoices(days)
	)
	.addStringOption(time =>
		time 
			.setName('time')
			.setDescription('Optional time, will only be sent with the main reminder.')	
	)
	
module.exports = { data }
