import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.botNumberCode = '' //Ejemplo: +56983073328
global.confirmCode = ''

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
  ['56983073328', 'KILLBOT', true],
  ['56983073328', 'KILLBOT', true],
  ['56983073328', 'KILLBOT', true],
  ['56983073328'],
  ['56983073328'],
  ['56983073328'],
  ['56983073328'],
]

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.prems = []
global.APIs = {
  fgmods: 'https://api.fgmods.xyz'
}
global.APIKeys = {
  'https://api.fgmods.xyz': 'm2XBbNvz'
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

//cambiar a true si el bot detecta sus propios comandos.
global.isBaileysFail = false
global.libreria = 'Baileys'
global.baileys = '@whiskeysockets/baileys'
global.vs = '2.0.7'
global.languaje = 'Español'
global.nameqr = 'sisked-x'
global.namebot = '@𝖎𝖓𝖊𝖋𝖋𝖆𝖇𝖑𝖊.𝖒𝖛𝖗𝖈𝖔'
global.sessions = 'KILLBOTSession'
global.jadi = 'KILLBOTJadiBot'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = 'KɪʟʟᴢN'
global.botname = '@𝖎𝖓𝖊𝖋𝖋𝖆𝖇𝖑𝖊.𝖒𝖛𝖗𝖈𝖔'
global.wm = '𝘞𝘩𝘢𝘵𝘴𝘈𝘱𝘱 𝘉𝘰𝘵'
global.author = '@𝖎𝖓𝖊𝖋𝖋𝖆𝖇𝖑𝖊.𝖒𝖛𝖗𝖈𝖔'
global.dev = 'KɪʟʟᴢN'
global.textbot = '𝘞𝘩𝘢𝘵𝘴𝘈𝘱𝘱 KILLBOT'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.catalogo = fs.readFileSync('./src/img/catalogo.jpg')
global.killurl = fs.readFileSync('./src/img/killurl.jpg')
global.avatar = fs.readFileSync('./src/img/avatar_contact.png')

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.grupo = 'https://chat.whatsapp.com/HqhAoXS8TCcJIn0KrbJZKz'
global.channel = 'https://whatsapp.com/channel/0029Vb4TKBCD38CNEkfHdj1z'
global.channel2 = 'https://whatsapp.com/channel/0029Vb4TKBCD38CNEkfHdj1z'
global.md = 'https://wa.me/qr/PAOHAKCEHGUXN1 '
global.ig = 'https://www.instagram.com/ineffable.mvrco'
global.tiktok = 'https://www.tiktok.com/@ineffable.mvrco'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.estilo = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "56983073328-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount: -999999, status: 1, surface: 1, message: 'Ai Otho - MD', orderTitle: 'Bang', thumbnail: catalogo, sellerJid: '0@s.whatsapp.net' } } }

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.esti = { key: { participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "56983073328-1613049930@g.us" } : {}) }, message: { "videoMessage": { "title": dev, "h": `Hmm`, 'seconds': '99999', 'gifPlayback': 'true', 'caption': `Ai Otho - MD`, 'jpegThumbnail': catalogo } } }

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.multiplier = 69
global.maxwarn = '3'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
