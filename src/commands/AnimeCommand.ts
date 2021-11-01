import { CommandInteraction, MessageActionRow} from 'discord.js';
import { SlashCommand } from '../interactions/SlashCommand';
import { Client as AniList } from 'anilist.js';
import { DeleteButton } from '../interactions/DeleteButton';
import { SelectMenu } from '../interactions/SelectMenu';

const AniClient = new AniList();

export default class AnimeCommand extends SlashCommand {
    constructor() {
        super({
            name: 'anime',
            description: 'get anime information',
            guilds: ['709303950511439893'],
            options: [
                { 
                    name: 'title', 
                    description: 'anime title', 
                    required: true, 
                    type: 'STRING' 
                }
            ]
        });
    }

    async run(command: CommandInteraction) {
        const title = command.options.get('title').value.toString();

        const search = await AniClient.searchMedia({ search: title, sort: ['POPULARITY_DESC'], type: 'ANIME' });
    
        search.Results.length = 25;
    
        const opts = [];
        search.Results.forEach(anime => {
            let title = (anime.info.title.english || anime.info.title.romaji);
            title = title.replace(/season /i, 'S');
            opts.push({ label: title.length >= 22 ? `${title.substring(0, 22)}...` : title, description: `(${anime.info.season} ${anime.info.startDate.year}) ${anime.info.format} - Eps: ${anime.info.nextAiringEpisode ? `${anime.info.nextAiringEpisode.episode - 1}` : anime.info.episodes}`, value: anime.info.id.toString() });
        });
    
        const selectMenu = 
            new SelectMenu(command, { placeholder: 'Choose which anime you want info on.', options: opts }, async interaction => {
                const media = search.Results.filter(anime => anime.info?.id.toString() === interaction.values[0])[0].info;
                if (!media) return await interaction.update({ content: 'Couldn\'t find media.' });
    
                await interaction.update({ 
                    embeds: [
                        {
                            author: { name: `${media.title?.english || media.title?.romaji}`, icon_url: 'https://anilist.co/img/icons/android-chrome-512x512.png', url: media.siteUrl },
                            image: { url: media.bannerImage },
                            thumbnail: { url: media.coverImage.extraLarge },
                            // @ts-ignore I guess a string can't be a color even though you pass in a string???????
                            color: media.coverImage?.color,
                            description: media.description.replace(/<b>|<\/b>/g, '**').replace(/<i>|<\/i>/g, '*').replace(/<br>/g, ''),
                            footer: { text: `(${media.status}) ${media.episodes} Episodes ${media.nextAiringEpisode ? `, Ep ${media.nextAiringEpisode.episode} Airing in ${(media.nextAiringEpisode.timeUntilAiring / 3600).toFixed(2)} hours` : ''}` },
                            fields: [
                                { name: 'Genres', value: media.genres?.map((genre: any) => genre).join(', '), inline: true },
                                { name: 'Tags', value: media.tags?.map((tag: any) => tag.isMediaSpoiler ? `||${tag.name}||` : tag.name).join(', ') }
                            ]
                        }
                    ]
                });
            });

        // @ts-ignore fix djs please
        command.reply({ content: '** **', components: [new MessageActionRow().addComponents(selectMenu), new MessageActionRow().addComponents(new DeleteButton(command))] });
    }
}