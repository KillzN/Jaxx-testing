const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
    var sum = member.length;
  } else {
    var sum = 0;
    const total = 0;
    var member = 0;
  }
  const pesan = args.join` `;
  const oi = `𝙀𝙏𝙄𝙌𝙐𝙀𝙏𝘼𝙎:* ${pesan}`;
  let teks = `*>𝚅𝙸𝚅𝙾 𝙴𝚂𝚃𝙰𝚂 𝚅𝙾𝙹𝙰Ĝ𝙾 𝙽𝙴 𝙲𝙴𝙻𝙾*\n\n *${oi}\n\n➥ _*𝘑𝘢𝘹𝘹 𝘉𝘰𝘵:*_\n`;
  for (const mem of participants) {
    teks += `*💜 ⇝* @${mem.id.split('@')[0]}\n`;
  }
  teks += `*└𝓙𝓪𝔁𝔁 𝓑𝓸𝓽 ♡*`;
  conn.sendMessage(m.chat, { text: teks, mentions: participants.map((a) => a.id) });
};
handler.help = ['tagall <mesaje>', 'invocar <mesaje>'];
handler.tags = ['group'];
handler.command = /^(tagall|invocar|marcar|todos|invocación|ta)$/i;
handler.admin = true;
handler.group = true;
export default handler;