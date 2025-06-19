const handler = async (m, { conn, text, participants, isAdmin, isOwner }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  const users = participants.map(u => u.id);
  const watermark = '> @𝖎𝖓𝖊𝖋𝖋𝖆𝖇𝖑𝖊.𝖒𝖛𝖗𝖈𝖔';

  // Validar si el texto está vacío o solo contiene espacios
  const messageContent = (typeof text === 'string' && text.trim().length > 0)
    ? `${text.trim()}\n\n${watermark}`
    : watermark;

  await conn.sendMessage(m.chat, {
    text: messageContent,
    mentions: users
  }, { quoted: m });
};

handler.help = ['hidetag <texto>'];
handler.tags = ['group'];
handler.command = /^(hidetag|notify|notificar|noti|n|hidetah|hidet)$/i;
handler.group = true;
handler.admin = true;

export default handler;
