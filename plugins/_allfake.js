import pkg from '@whiskeysockets/baileys'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
const { proto } = pkg

const handler = m => m

handler.all = async function (m, { conn }) {
  const who = m.messageStubParameters?.[0] + '@s.whatsapp.net'
  const user = global.db.data.users[who] || {}
  const pushname = m.pushName || 'Sin nombre'

  global.getBuffer = async function (url, options = {}) {
    try {
      const res = await axios.get(url, {
        headers: {
          'DNT': 1,
          'User-Agent': 'GoogleBot',
          'Upgrade-Insecure-Request': 1
        },
        responseType: 'arraybuffer',
        ...options
      })
      return res.data
    } catch (e) {
      console.error(`Error : ${e}`)
    }
  }

  // Datos básicos
  global.creador = 'Wa.me/56983073328'
  global.asistencia = 'https://wa.me/qr/PAOHAKCEHGUXN1'
  global.namechannel = 'KILLBOT'

  global.rwait = '🕒'
  global.done = '✅'
  global.error = '✖️'

  const emojis = ['🍁', '⭐', '✨️', '😴']
  global.emojis = emojis[Math.floor(Math.random() * emojis.length)]

  global.wait = '🚀 Cargando...'

  // Redes sociales aleatorias
  const redes = [
    'https://whatsapp.com/channel/0029Vb4TKBCD38CNEkfHdj1z',
    'https://www.tiktok.com/@ineffable.mvrco',
    'https://www.instagram.com/ineffable.mvrco',
  ]
  global.redes = redes[Math.floor(Math.random() * redes.length)]

  // Imagen aleatoria
  const db = './src/database/db.json'
  const dbData = JSON.parse(fs.readFileSync(db))
  const imgLinks = dbData.links?.imagen || []
  const randomImg = imgLinks[Math.floor(Math.random() * imgLinks.length)]
  const response = await fetch(randomImg)
  global.icons = await response.buffer()

  global.fkontak = {
    key: {
      participant: '0@s.whatsapp.net',
      ...(m.chat ? { remoteJid: '6285600793871-1614953337@g.us' } : {})
    },
    message: {
      contactMessage: {
        displayName: pushname,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${pushname},;;;\nFN:${pushname}\nTEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nEND:VCARD`,
        jpegThumbnail: null
      }
    }
  }

  global.fake = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363393959332331@newsletter',
        newsletterName: global.namechannel,
        serverMessageId: -1
      }
    },
    quoted: m
  }

  const iconos = [
    'https://cdn.russellxz.click/d145c3ba.png'
  ]
  global.icono = iconos[Math.floor(Math.random() * iconos.length)]

  global.rcanal = {
    contextInfo: {
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363393959332331@newsletter',
        serverMessageId: 100,
        newsletterName: global.namechannel
      },
      externalAdReply: {
        showAdAttribution: true,
        title: global.botname || 'Mvrco Bot',
        body: global.dev || 'Mvrco Dev',
        thumbnailUrl: global.icono,
        sourceUrl: global.redes,
        mediaType: 1,
        renderLargerThumbnail: false
      }
    }
  }
}

export default handler
