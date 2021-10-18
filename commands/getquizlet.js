const { SlashCommandBuilder } = require('@discordjs/builders');
const path = require('path');
const fs = require('fs');
const process = require('process');

const data = new SlashCommandBuilder()
	//funky paginnation to get all those up
	.setName('getquizlet')
	.setDescription('Get a saved set of Quizlet flahscards for a class.')
	.addSubcommand(subcommand =>
		subcommand
			.setName('list')
			.setDescription('Quizlets for AP Statistics.')
			.addStringOption(option => 
				option 
					.setName('classes')
					.setDescription('See available Quizlets for each class.')
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
	)
	.addSubcommand(subcommand1 => 
		subcommand1	
			.setName('study')
			.setDescription('Get a certain Quizlet from a class')
			.addStringOption(option1=> 
				option1
					.setName('classes')
					.setDescription('See available Quizlets for each class.')
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
			.addStringOption(option2 => 
				option2
					.setName('name')
					.setDescription('The name of the set you want to study.')
					.setRequired(true)	
			)
		)

module.exports = { data }
