const { SlashCommandBuilder } = require('@discordjs/builders');
const path = require('path');
const fs = require('fs');
const process = require('process');

const data = new SlashCommandBuilder()
	.setName('quizlet')
	.setDescription('Add or view Quizlets for each class.')
	.addSubcommandGroup(group => 
		group
			.setName('get')
			.setDescription('List or get Quizlet sets to study.')
			.addSubcommand(subcommand =>
				subcommand
					.setName('list')
					.setDescription('List available Quizlets for each class.')
					.addStringOption(option => 
						option 
							.setName('classes')
							.setDescription('The class you want to view.')
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
					.setDescription('Get a certain Quizlet to study from a class')
					.addStringOption(option1=> 
						option1
							.setName('classes')
							.setDescription('The class you want to study.')
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
	)
	.addSubcommand(s => 
		s	
			.setName('add')
			.setDescription('Add a Quizlet set to a class.')
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
			.addStringOption(o => 
				o.setName('link')
				.setDescription('The Quizlet link for this set.')
				.setRequired(true)	
			)
	)
		

module.exports = { data }
