const { 
    Client, 
    GatewayIntentBits, 
    REST, 
    Routes, 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    MessageFlags 
} = require('discord.js');

const TOKEN = process.env.BOT_TOKEN || 'BOT_TOKEN';
const CLIENT_ID = process.env.CLIENT_ID || 'CLIENT_ID';

const commands = [
    new SlashCommandBuilder()
        .setName('cat')
        .setDescription('Holt ein zufälliges Catgirl-Bild')
        .addBooleanOption(option => 
            option.setName('hidden')
                  .setDescription('Soll das Bild nur für dich sichtbar sein?')
                  .setRequired(false)
        ),
    new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Holt ein zufälliges Anime-Bild')
        .addStringOption(option =>
            option.setName('tag')
                  .setDescription('Wähle eine Kategorie aus')
                  .setRequired(false)
                  .addChoices(
                      { name: '🌸 Waifu', value: 'waifu' },
                      { name: '🐾 Neko', value: 'neko' },
                      { name: '🦊 Fox Girl', value: 'fox_girl' }
                  )
        )
        .addBooleanOption(option => 
            option.setName('hidden')
                  .setDescription('Soll das Bild nur für dich sichtbar sein?')
                  .setRequired(false)
        )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Function für Catgirl (Nekosia API)
async function createCatPayload() {
    const response = await fetch('https://api.nekosia.cat/api/v1/images/catgirl');
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

    const json = await response.json();
    const imageUrl = json?.image?.original?.url;

    if (!imageUrl) return null;

    const embed = new EmbedBuilder()
        .setTitle('🐱 Hier ist dein Catgirl-Bild!')
        .setImage(imageUrl)
        .setColor(0x9b59b6);

    const button = new ButtonBuilder()
        .setCustomId('reload_cat')
        .setLabel('🔄 Neues Bild')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    return { embeds: [embed], components: [row] };
}

// Function für Waifu (Nekos.life API)
async function createWaifuPayload(tag = 'waifu') {
    let endpoint = 'waifu';
    if (tag === 'neko') endpoint = 'neko';
    if (tag === 'fox_girl') endpoint = 'fox_girl';

    const response = await fetch(`https://nekos.life/api/v2/img/${endpoint}`);
    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

    const json = await response.json();
    const imageUrl = json?.url;

    if (!imageUrl) return null;

    const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);

    const embed = new EmbedBuilder()
        .setTitle(`✨ Hier ist dein ${formattedTag}-Bild!`)
        .setImage(imageUrl)
        .setColor(0xff75a0);

    const button = new ButtonBuilder()
        .setCustomId(`reload_waifu_${tag}`)
        .setLabel('🔄 Neues Bild')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    return { embeds: [embed], components: [row] };
}

client.once('ready', async () => {
    console.log(`Eingeloggt als ${client.user.tag}!`);

    try {
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        console.log('Slash-Commands erfolgreich registriert!');
    } catch (error) {
        console.error('Fehler beim Registrieren:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        const isHidden = interaction.options.getBoolean('hidden') || false;
        const replyOptions = isHidden ? { flags: MessageFlags.Ephemeral } : {};

        if (interaction.commandName === 'cat') {
            await interaction.deferReply(replyOptions);
            try {
                const payload = await createCatPayload();
                if (!payload) return interaction.editReply({ content: 'Kein Bild gefunden.' });
                await interaction.editReply(payload);
            } catch (err) {
                console.error('Cat Error:', err.message);
                await interaction.editReply({ content: 'Fehler beim Laden des Catgirl-Bildes.' });
            }
        }

        if (interaction.commandName === 'waifu') {
            const selectedTag = interaction.options.getString('tag') || 'waifu';

            await interaction.deferReply(replyOptions);
            try {
                const payload = await createWaifuPayload(selectedTag);
                if (!payload) return interaction.editReply({ content: 'Kein Bild gefunden.' });
                await interaction.editReply(payload);
            } catch (err) {
                console.error('Waifu API Error:', err.message);
                await interaction.editReply({ content: 'Fehler beim Laden des Bildes.' });
            }
        }
    }

    if (interaction.isButton()) {
        if (interaction.customId === 'reload_cat') {
            await interaction.deferUpdate();
            try {
                const payload = await createCatPayload();
                if (payload) await interaction.editReply(payload);
            } catch (err) {
                console.error('Cat Reload Error:', err.message);
            }
        }

        if (interaction.customId.startsWith('reload_waifu_')) {
            const tag = interaction.customId.replace('reload_waifu_', '');
            await interaction.deferUpdate();
            try {
                const payload = await createWaifuPayload(tag);
                if (payload) await interaction.editReply(payload);
            } catch (err) {
                console.error('Waifu Reload Error:', err.message);
            }
        }
    }
});

client.login(TOKEN);