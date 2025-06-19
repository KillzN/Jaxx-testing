let handler = async (m, { conn, command }) => {
  let who = m.fromMe ? conn.user.jid : m.sender
  let user = global.db.data.users[who]

  if (command === 'chetar') {
    user.limit += 10000000 // Añadir 10,000,000 creds
    user.exp += 10000000 // Añadir 10,000,000 XP
    m.reply(`✅ ¡Se te han otorgado 10,000,000 creds y XP!`)
  } else {
  }
}

handler.help = ['chetar'];
handler.tags = ['owner'];
handler.command = ['chetar'];
global.owner = [
  ['56983073328', 'Mvrco', true]
]
export default handler
