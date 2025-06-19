let handler = async (m, { conn, usedPrefix, isOwner }) => {
    m.react('👤')
    let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:BʏKɪʟʟᴢN 🦥;;\nFN:BʏKɪʟʟᴢN 🦥\nORG:BʏKɪʟʟᴢN 🦥\nTITLE:\nitem1.TEL;waid=56983073328:56983073328\nitem1.X-ABLabel:BʏKɪʟʟᴢN 🦥\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:BʏKɪʟʟᴢN 🦥\nEND:VCARD`
    await conn.sendMessage(m.chat, { contacts: { displayName: '@ineffable.mvrco⁩', contacts: [{ vcard }] } }, { quoted: m })
}
handler.help = ['staff']
handler.tags = ['main']
handler.command = ['owner', 'dueño', 'creador']

export default handler
