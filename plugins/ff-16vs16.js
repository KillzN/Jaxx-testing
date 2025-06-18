let partidasVS16 = {}

let handler = async (m, { conn, args }) => {
  const modalidad = args.join(' ') || ''

  const diferenciasHorarias = {
    MX: 0,
    CO: 1,
    CL: 2,
    AR: 3,
    PE: 1
  }

  const horaBase = new Date()
  const horasPorPais = {}

  for (const [codigoPais, diferencia] of Object.entries(diferenciasHorarias)) {
    const nuevaHora = new Date(horaBase)
    nuevaHora.setHours(nuevaHora.getHours() + diferencia)
    const hours = nuevaHora.getHours().toString().padStart(2, '0')
    const minutes = nuevaHora.getMinutes().toString().padStart(2, '0')
    horasPorPais[codigoPais] = `${hours}:${minutes}`
  }

  let plantilla = `
𝟭𝟲 𝐕𝐄𝐑𝐒𝐔𝐒 𝟭𝟲

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎 •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : ${horasPorPais.MX}
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : ${horasPorPais.CO}
🇨🇱 𝐂𝐇𝐈𝐋𝐄 : ${horasPorPais.CL}
🇦🇷 𝐀𝐑𝐆𝐄𝐍𝐓𝐈𝐍𝐀 : ${horasPorPais.AR}
🇵🇪 𝐏𝐄𝐑𝐔 : ${horasPorPais.PE}

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: ${modalidad}
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 1
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇  

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 2
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇  

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 3
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇  

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 4
    
    👑 ┇  
    🥷🏻 ┇  
    🥷🏻 ┇ 
    🥷🏻 ┇  

    ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ 
    🥷🏻 ┇

❤️ = Participar | 👍 = Suplente
  `.trim()

  let msg = await conn.sendMessage(m.chat, { text: plantilla }, { quoted: m })

  partidasVS16[msg.key.id] = {
    chat: m.chat,
    jugadores: [],
    suplentes: [],
    originalMsg: msg,
    modalidad,
    horasPorPais
  }
}

handler.help = ['16vs16']
handler.tags = ['freefire']
handler.command = /^(vs16|16vs16|masc16)$/i
handler.group = true
handler.admin = true

export default handler

conn.ev.on('messages.upsert', async ({ messages }) => {
  let m = messages[0]
  if (!m?.message?.reactionMessage) return

  let reaction = m.message.reactionMessage
  let key = reaction.key
  let emoji = reaction.text
  let sender = m.key.participant || m.key.remoteJid

  let data = partidasVS16[key.id]
  if (!data) return

  let emojisParticipar = ['❤️', '❤', '♥', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '❤️‍🔥']
  let emojisSuplente = ['👍', '👍🏻', '👍🏼', '👍🏽', '👍🏾', '👍🏿']

  data.jugadores = data.jugadores.filter(u => u !== sender)
  data.suplentes = data.suplentes.filter(u => u !== sender)

  if (emojisParticipar.includes(emoji)) {
    if (data.jugadores.length < 16) {
      data.jugadores.push(sender)
    }
  } else if (emojisSuplente.includes(emoji)) {
    if (data.suplentes.length < 2) {
      data.suplentes.push(sender)
    }
  } else return

  let jugadores = data.jugadores.map(u => `@${u.split('@')[0]}`)
  let suplentes = data.suplentes.map(u => `@${u.split('@')[0]}`)

  let plantilla = `
𝟭𝟲 𝐕𝐄𝐑𝐒𝐔𝐒 𝟭𝟲

⏱ 𝐇𝐎𝐑𝐀𝐑𝐈𝐎 •
🇲🇽 𝐌𝐄𝐗𝐈𝐂𝐎 : ${data.horasPorPais.MX}
🇨🇴 𝐂𝐎𝐋𝐎𝐌𝐁𝐈𝐀 : ${data.horasPorPais.CO}
🇨🇱 𝐂𝐇𝐈𝐋𝐄 : ${data.horasPorPais.CL}
🇦🇷 𝐀𝐑𝐆𝐄𝐍𝐓𝐈𝐍𝐀 : ${data.horasPorPais.AR}
🇵🇪 𝐏𝐄𝐑𝐔 : ${data.horasPorPais.PE}

➥ 𝐌𝐎𝐃𝐀𝐋𝐈𝐃𝐀𝐃: ${data.modalidad}
➥ 𝐉𝐔𝐆𝐀𝐃𝐎𝐑𝐄𝐒:

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 1
    
    👑 ┇ ${jugadores[0] || ''}
    🥷🏻 ┇ ${jugadores[1] || ''}
    🥷🏻 ┇ ${jugadores[2] || ''}
    🥷🏻 ┇ ${jugadores[3] || ''}

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 2
    
    👑 ┇ ${jugadores[4] || ''}
    🥷🏻 ┇ ${jugadores[5] || ''}
    🥷🏻 ┇ ${jugadores[6] || ''}
    🥷🏻 ┇ ${jugadores[7] || ''}

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 3
    
    👑 ┇ ${jugadores[8] || ''}
    🥷🏻 ┇ ${jugadores[9] || ''}
    🥷🏻 ┇ ${jugadores[10] || ''}
    🥷🏻 ┇ ${jugadores[11] || ''}

        𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝐀 4
    
    👑 ┇ ${jugadores[12] || ''}
    🥷🏻 ┇ ${jugadores[13] || ''}
    🥷🏻 ┇ ${jugadores[14] || ''}
    🥷🏻 ┇ ${jugadores[15] || ''}

    ʚ 𝐒𝐔𝐏𝐋𝐄𝐍𝐓𝐄𝐒:
    🥷🏻 ┇ ${suplentes[0] || ''}
    🥷🏻 ┇ ${suplentes[1] || ''}

❤️ = Participar | 👍 = Suplente
  `.trim()

  await conn.sendMessage(data.chat, {
    text: plantilla,
    edit: data.originalMsg.key,
    mentions: [...data.jugadores, ...data.suplentes]
  })
})
