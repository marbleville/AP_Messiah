const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('unenroll')
	.setDescription('Remove yourself from an AP class.')
    .addStringOption(option =>
		option.setName('classes')
			.setDescription('All of the supported AP classes')
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
            );
	
module.exports = { data }