const { SlashCommandBuilder } = require('@discordjs/builders');
const path = require('path');
const fs = require('fs')

const data = new SlashCommandBuilder()
	//maybe subcommannds with some fuckery to get the surrent saved quzlets will work
	.setName('getquizlet')
	.setDescription('Get a saved set of Quizlet flahscards for a class.')
	.addSubcommand(subcommand =>
		subcommand
			.setName('apstats')
			.setDescription('Quizlets for AP Statistics.')
			.addStringOption(option =>
				option.setName('quizlets')
				.setRequired(true),
				JSON.parse(fs.readFileSync(path.resolve(`../materials/stat.json`), 'utf8')).forEach(f => {
					option.addChoice(f.name);
				})	
			)
	)
	/*
	.addStringOption(option =>
		option.setName('classes')
		.setDescription('The class this set is for.')
		.setRequired(true)
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
	*/
module.exports = { data }
