import dotenv from 'dotenv';
import { WebhookClient, EmbedBuilder, AttachmentBuilder } from 'discord.js';

dotenv.config();

const webhookClient = new WebhookClient({
  url: process.env.DISCORD_WEBHOOK_URL,
});

export default async () => {
  const calendarAttachment = new AttachmentBuilder('./generated/table.png');
  const icsAttachment = new AttachmentBuilder('./generated/event.ics');

  const message = new EmbedBuilder();
  message.setTitle('📅 Nouvel EDT disponible');
  message.setDescription('Un nouvel emploi du temps est disponible');
  message.setDescription('Vous pouvez l\'importer dans votre calendrier en cliquant sur le bouton fichier ICS ci-dessus\n\n*Certains cours peuvent etre en trop ou manquant. Prenez garde au cours éléctifs et cours qui divergent en fonction de votre groupe*');
  message.setThumbnail('https://myges.fr/public/images/icons/logo_myges_126x40.png');
  message.setColor('#0099ff');

  try {
    await webhookClient.send({
      embeds: [message],
      files: [calendarAttachment, icsAttachment],
    });
    console.info('📨 Discord message sent');
  } catch (error) {
    console.error('❌ Something went wrong when sending the Discord message');
    console.info(error);
  }
};
