let handler = async (m, { conn, usedPrefix, isOwner }) => {
    m.react('👤')
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:JaxxBOT;;\nFN:JaxxBOT\nORG:JaxxBOT\nTITLE:\nitem1.TEL;waid=56956654814:56956654814\nitem1.X-ABLabel:JaxxBOT\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:JaxxBOT\nEND:VCARD`
    await conn.sendMessage(m.chat, { contacts: { displayName: '@ineffable.mvrco⁩', contacts: [{ vcard }] } }, { quoted: m })
}
handler.help = ['staff']
handler.tags = ['main']
handler.command = ['owner', 'dueño', 'creador']

export default handler
