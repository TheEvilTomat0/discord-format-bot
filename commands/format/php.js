const { SlashCommandBuilder, codeBlock } = require('discord.js');
const { exec } = require('child_process');
const prettier = require('prettier/standalone');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('php')
		.setDescription('Replies formatted PHP code')
        .addStringOption(option => 
            option.setName('code')
            .setDescription('The PHP code to format')
            .setRequired(true)),
	async execute(interaction) {

        // Get the code from the interaction
        let code = interaction.options.getString('code');
        code = code.replace(/<\?php/, '<?php\n');
        code = code.replace(/\?>/, '\n?>');
        
        // Import the PHP plugin
        const pluginPhp = await import('@prettier/plugin-php');

        // Format code using prettier with php plugin
        const formattedCode = await formatCode(code, pluginPhp);

        // Wrap the formatted code in a code block
        const finalFormattedCode = codeBlock('php', formattedCode);

        // Reply with the formatted code
        await interaction.reply(finalFormattedCode);
	},
};

async function formatCode(code, pluginPhp) {
    const formattedCode = await prettier.format(code, {
        plugins: [pluginPhp],
        parser: "php",
    });
    return formattedCode;
}