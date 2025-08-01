import { smsg } from './lib/simple.js'
import { format } from 'util'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
import { unwatchFile, watchFile } from 'fs'
import chalk from 'chalk'
import fetch from 'node-fetch'

const { proto } = (await import('@whiskeysockets/baileys')).default
const isNumber = x => typeof x === 'number' && !isNaN(x)
const delay = ms => isNumber(ms) && new Promise(resolve => setTimeout(function () {
  clearTimeout(this)
  resolve()
}, ms))

export async function handler(chatUpdate) {
  this.msgqueque = this.msgqueque || []
  if (!chatUpdate)
    return
  this.pushMessage(chatUpdate.messages).catch(console.error)
  let m = chatUpdate.messages[chatUpdate.messages.length - 1]
  if (!m)
    return;
  if (global.db.data == null)
    await global.loadDatabase()
  try {
    m = smsg(this, m) || m
    if (!m)
      return
    m.exp = 0
    m.limit = 0
    m.comida = 0
    try {
      let user = global.db.data.users[m.sender]
      if (typeof user !== 'object')

        global.db.data.users[m.sender] = {}
      if (user) {
        if (!isNumber(user.exp))
          user.exp = 0
        if (!isNumber(user.limit))
          user.limit = 5
        if (!isNumber(user.comida))
          user.comida = 8
        if (!('muto' in user))
          user.muto = false
        if (!('registered' in user))
          user.registered = false
        if (!user.registered) {
          if (!('name' in user))
            user.name = m.name
          if (!isNumber(user.age))
            user.age = -1
        }
        if (!isNumber(user.afk))
          user.afk = -1
        if (!('afkReason' in user))
          user.afkReason = ''
        if (!('banned' in user))
          user.banned = false
        if (!isNumber(user.level))
          user.level = 0
        if (!isNumber(user.mascotaNivel))
          user.mascotaNivel = 0
        if (!isNumber(user.vida))
          user.vida = 100
        if (!('mascota' in user))
          user.mascota = false
        if (!('empleado' in user))
          user.empleado = false
      } else
        global.db.data.users[m.sender] = {
          exp: 0,
          limit: 5,
          comida: 8,
          muto: false,
          registered: false,
          name: m.name,
          age: -1,
          afk: -1,
          afkReason: '',
          banned: false,
          level: 0,
          mascotaNivel: 0,
          vida: 100,
          mascota: false,
          empleado: false,
        }
      let chat = global.db.data.chats[m.chat]
      if (typeof chat !== 'object')
        global.db.data.chats[m.chat] = {}
      if (chat) {
        if (!('isBanned' in chat))
          chat.isBanned = false
        if (!('bienvenida' in chat))
          chat.bienvenida = true
        if (!('sWelcome' in chat))
          chat.sWelcome = true
        if (!('sBye' in chat))
          chat.sBye = true
        if (!('modoadmin' in chat))
          chat.modoadmin = true
        if (!('onlyGod' in chat))
          chat.onlyGod = false
        if (!('isDios' in chat))
          chat.isDios = false
        if (!('isGod' in chat))
          chat.isGod = false
        if (!('onlyLatinos' in chat))
          chat.onlyLatinos = true
        if (!('detect' in chat))
          chat.detect = true
        if (!('audios' in chat))
          chat.audios = false
        if (!('antiLink' in chat))
          chat.antiLink = false
        if (!('delete' in chat))
          chat.delete = false
        if (!('nsfw' in chat))
          chat.nsfw = false
        if (!isNumber(chat.expired))
          chat.expired = 0
      } else
        global.db.data.chats[m.chat] = {
          isBanned: false,
          bienvenida: true,
          sWelcome: true,
          sBye: true,
          modoadmin: true,
          onlyGod: false,
          isDios: true,
          isGod: true,
          onlyLatinos: false,
          detect: true,
          audios: false,
          antiLink: true,
          delete: false,
          nsfw: false,
          expired: 0,
        }
      var settings = global.db.data.settings[this.user.jid]
      if (typeof settings !== 'object') global.db.data.settings[this.user.jid] = {}
      if (settings) {
        if (!('self' in settings)) settings.self = false
        if (!('antiPrivate' in settings)) settings.antiPrivate = false
        if (!('autoRead' in settings)) settings.autoRead = false
        if (!('autoread' in settings)) settings.autoread = false
        if (!('antiSpam' in settings)) settings.antiSpam = false
      } else global.db.data.settings[this.user.jid] = {
        self: false,
        antiPrivate: false,
        autoRead: true,
        autoread: false,
        antiSpam: true,
        status: 0
      }
    } catch (e) {
      console.error(e)
    }
    if (opts['nyimak']) return
    if (!m.fromMe && opts['self']) return
    if (opts['swonly'] && m.chat !== 'status@broadcast') return
    if (typeof m.text !== 'string')
      m.text = ''

    let _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

    const isROwner = [conn.decodeJid(global.conn.user.id),
    ...global.owner.map(([number, tipo]) => number.replace(/[^0-9]/g, '') + (tipo === 'jid' ? '@s.whatsapp.net' : '@lid'))
    ].includes(m.sender);
    const isOwner = isROwner || m.fromMe

    if (opts['queque'] && m.text && !(isMods || isPrems)) {
      let queque = this.msgqueque, time = 1000 * 5
      const previousID = queque[queque.length - 1]
      queque.push(m.id || m.key.id)
      setInterval(async function () {
        if (queque.indexOf(previousID) === -1) clearInterval(this)
        await delay(time)
      }, time)
    }

    //if (m.isBaileys) return 
    if (m.isBaileys || isBaileysFail && m?.sender === this?.this?.user?.jid) {
      return
    }
    m.exp += Math.ceil(Math.random() * 10)

    let usedPrefix

    let groupMetadata = {};
    if (m.isGroup) {
      groupMetadata = conn.chats[m.chat]?.metadata;
      if (!groupMetadata || Object.keys(groupMetadata).length === 0) {
        try {
          groupMetadata = await conn.groupMetadata(m.chat);
          if (!conn.chats[m.chat]) conn.chats[m.chat] = {};
          conn.chats[m.chat].metadata = groupMetadata;
        } catch (e) {
          groupMetadata = {};
        }
      }
    }
    const participants = m.isGroup
      ? (await conn.groupMetadata(m.chat).catch(() => ({})))?.participants || []
      : [];
    const user = (m.isGroup ? participants.find(u => conn.decodeJid(u.id) === m.sender) : {}) || {}
    const bot = m.isGroup
      ? participants.find(u => {
        const id = conn.decodeJid(u.id);
        const botIds = [
          conn.decodeJid(global.conn.user?.jid || ''),
          conn.decodeJid(global.conn.user?.lid || '')
        ];
        return botIds.includes(id);
      }) || {}
      : {};
    const isRAdmin = user?.admin == 'superadmin' || false
    const isAdmin = isRAdmin || user?.admin == 'admin' || false
    const isBotAdmin = ['admin', 'superadmin'].includes(bot?.admin);


    const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
    for (let name in global.plugins) {
      let plugin = global.plugins[name]
      if (!plugin)
        continue
      if (plugin.disabled)
        continue
      const __filename = join(___dirname, name)
      if (typeof plugin.all === 'function') {
        try {
          await plugin.all.call(this, m, {
            chatUpdate,
            __dirname: ___dirname,
            __filename
          })
        } catch (e) {
          console.error(e)
        }
      }
      if (!opts['restrict'])
        if (plugin.tags && plugin.tags.includes('admin')) {
          continue
        }
      const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
      let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
      let match = (_prefix instanceof RegExp ?
        [[_prefix.exec(m.text), _prefix]] :
        Array.isArray(_prefix) ?
          _prefix.map(p => {
            let re = p instanceof RegExp ?
              p :
              new RegExp(str2Regex(p))
            return [re.exec(m.text), re]
          }) :
          typeof _prefix === 'string' ?
            [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
            [[[], new RegExp]]
      ).find(p => p[1])
      if (typeof plugin.before === 'function') {
        if (await plugin.before.call(this, m, {
          match,
          conn: this,
          participants,
          groupMetadata,
          user,
          bot,
          isROwner,
          isOwner,
          isRAdmin,
          isAdmin,
          isBotAdmin,
          chatUpdate,
          __dirname: ___dirname,
          __filename
        }))
          continue
      }
      if (typeof plugin !== 'function')
        continue
      if ((usedPrefix = (match[0] || '')[0])) {
        let noPrefix = m.text.replace(usedPrefix, '')
        let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
        args = args || []
        let _args = noPrefix.trim().split` `.slice(1)
        let text = _args.join` `
        command = (command || '').toLowerCase()
        let fail = plugin.fail || global.dfail
        let isAccept = plugin.command instanceof RegExp ?
          plugin.command.test(command) :
          Array.isArray(plugin.command) ?
            plugin.command.some(cmd => cmd instanceof RegExp ?
              cmd.test(command) :
              cmd === command) :
            typeof plugin.command === 'string' ?
              plugin.command === command :
              false

        if (!isAccept) {
          continue
        }
        m.plugin = name
        if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
          let chat = global.db.data.chats[m.chat]
          let user = global.db.data.users[m.sender]
          if (!['owner-unbanchat.js'].includes(name) && chat && chat.isBanned && !isROwner) return // Except this
          if (name != 'owner-unbanchat.js' && name != 'owner-exec.js' && name != 'owner-exec2.js' && name != 'tool-delete.js' && chat?.isBanned && !isROwner) return
          if (m.text && user.banned && !isROwner) {
            if (user.antispam > 2) return
            m.reply(`🚫 Está baneado(a), no puede usar los comandos de este bot!\n\n${user.bannedReason ? `\n💌 *Motivo:* 
${user.bannedReason}` : '💌 *Motivo:* Sin Especificar'}\n\n⚠️ *Si este bot es cuenta oficial y tiene evidencia que respalde que este mensaje es un error, puede exponer su caso en:*\n\n🤍 ${asistencia}`)
            user.antispam++
            return
          }

          //Antispam 2                
          if (user.antispam2 && isROwner) return
          let time = global.db.data.users[m.sender].spam + 3000
          if (new Date - global.db.data.users[m.sender].spam < 3000) return console.log(`[ SPAM ]`)
          global.db.data.users[m.sender].spam = new Date * 1
        }
        if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
          let chat = global.db.data.chats[m.chat]
          let user = global.db.data.users[m.sender]
          let setting = global.db.data.settings[this.user.jid]
          if (name != 'group-unbanchat.js' && chat?.isBanned)
            return
          if (name != 'owner-unbanuser.js' && user?.banned)
            return
          if (name != 'owner-unbanbot.js' && setting?.banned)
            return
        }
        let hl = _prefix
        let adminMode = global.db.data.chats[m.chat].modoadmin;
        let onlyGod = global.db.data.chats[m.chat].onlyGod;
        let chatData = global.db.data.chats[m.chat] || {};
        let isDios = chatData.dioses?.[m.sender];
        let isGod = chatData.gods?.[m.sender];

        if (onlyGod && m.isGroup && !isOwner && !isROwner && !isGod && !isDios) return;
        if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin) return;
        if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
          fail('owner', m, this)
          continue
        }
        if (plugin.rowner && !isROwner) {
          fail('rowner', m, this)
          continue
        }
        if (plugin.owner && !isOwner) {
          fail('owner', m, this)
          continue
        }
        if (plugin.mods && !isMods) {
          fail('mods', m, this)
          continue
        }
        if (plugin.group && !m.isGroup) {
          fail('group', m, this)
          continue
        } else if (plugin.botAdmin && !isBotAdmin) {
          fail('botAdmin', m, this)
          continue
        } else if (plugin.admin && !isAdmin) {
          fail('admin', m, this)
          continue
        }
        if (plugin.private && m.isGroup) {
          fail('private', m, this)
          continue
        }
        if (plugin.register == true && _user.registered == false) {
          fail('unreg', m, this)
          continue
        }
        m.isCommand = true
        let xp = 'exp' in plugin ? parseInt(plugin.exp) : 17
        if (xp > 200)
          m.reply('chirrido -_-')
        else
          m.exp += xp
        let extra = {
          match,
          usedPrefix,
          noPrefix,
          _args,
          args,
          command,
          text,
          conn: this,
          participants,
          groupMetadata,
          user,
          bot,
          isROwner,
          isOwner,
          isRAdmin,
          isAdmin,
          isBotAdmin,
          chatUpdate,
          __dirname: ___dirname,
          __filename
        }
        try {
          await plugin.call(this, m, extra)
          m.limit = m.limit || plugin.limit || false
        } catch (e) {
          m.error = e
          console.error(e)
          if (e) {
            let text = format(e)
            for (let key of Object.values(global.APIKeys))
              text = text.replace(new RegExp(key, 'g'), 'Administrador')
            m.reply(text)
          }
        } finally {
          if (typeof plugin.after === 'function') {
            try {
              await plugin.after.call(this, m, extra)
            } catch (e) {
              console.error(e)
            }
          }
          if (m.limit)
            conn.reply(m.chat, `Utilizaste *${+m.limit}* 🍬`, m, fake)
        }
        break
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    if (opts['queque'] && m.text) {
      const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
      if (quequeIndex !== -1)
        this.msgqueque.splice(quequeIndex, 1)
    }
    let user, stats = global.db.data.stats
    if (m) {
      let utente = global.db.data.users[m.sender]
      if (utente.muto == true) {
        let bang = m.key.id
        let cancellazzione = m.key.participant
        await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: cancellazzione } })
      }
      if (m.sender && (user = global.db.data.users[m.sender])) {
        user.exp += m.exp
        user.limit -= m.limit * 1
      }

      let stat
      if (m.plugin) {
        let now = +new Date
        if (m.plugin in stats) {
          stat = stats[m.plugin]
          if (!isNumber(stat.total))
            stat.total = 1
          if (!isNumber(stat.success))
            stat.success = m.error != null ? 0 : 1
          if (!isNumber(stat.last))
            stat.last = now
          if (!isNumber(stat.lastSuccess))
            stat.lastSuccess = m.error != null ? 0 : now
        } else
          stat = stats[m.plugin] = {
            total: 1,
            success: m.error != null ? 0 : 1,
            last: now,
            lastSuccess: m.error != null ? 0 : now
          }
        stat.total += 1
        stat.last = now
        if (m.error == null) {
          stat.success += 1
          stat.lastSuccess = now
        }
      }
    }

    try {
      if (!opts['noprint']) await (await import(`./lib/print.js`)).default(m, this)
    } catch (e) {
      console.log(m, m.quoted, e)
    }
    if (m.isGroup) await this.readMessages([m.key])
    // if (settingsREAD.autoread2 == 'true') await this.readMessages([m.key])    
    // await conn.sendPresenceUpdate('composing', m.chat)
    // this.sendPresenceUpdate('recording', m.chat)

    if (db.data.chats[m.chat].reaction && m.text.match(/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify|ai|otho|a|s)/gi)) {
      let emot = pickRandom(["🍟", "😃", "😄", "😁", "😆", "🍓", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "🌺", "🌸", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🌟", "🤓", "😎", "🥸", "🤩", "🥳", "😏", "💫", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🫣", "🤭", "🤖", "🍭", "🤫", "🫠", "🤥", "😶", "📇", "😐", "💧", "😑", "🫨", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😮‍💨", "😵", "😵‍💫", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👺", "🧿", "🌩", "👻", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🫶", "👍", "✌️", "🙏", "🫵", "🤏", "🤌", "☝️", "🖕", "🙏", "🫵", "🫂", "🐱", "🤹‍♀️", "🤹‍♂️", "🗿", "✨", "⚡", "🔥", "🌈", "🩷", "❤️", "🧡", "💛", "💚", "🩵", "💙", "💜", "🖤", "🩶", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "🚩", "👊", "⚡️", "💋", "🫰", "💅", "👑", "🐣", "🐤", "🐈"])
      if (!m.fromMe) return this.sendMessage(m.chat, { react: { text: emot, key: m.key } })
    }
    function pickRandom(list) { return list[Math.floor(Math.random() * list.length)] }
  }
}

export async function deleteUpdate(message) {
  try {
    const { fromMe, id, participant } = message
    if (fromMe) return
    let msg = this.serializeM(this.loadMessage(id))
    let chat = global.db.data.chats[msg?.chat] || {}
    if (!chat?.delete) return
    if (!msg) return
    if (!msg?.isGroup) return
    this.copyNForward(msg.chat, msg).catch(e => console.log(e, msg))
  } catch (e) {
    console.error(e)
  }
}

global.dfail = (type, m, conn) => {
  const msg = {
    rowner: `🚩 Comando exclusivo para *JaxxBOT*.`,
    owner: `♌ Este Comando Solo Puede Ser Utilizado Por *JaxxBOT*.`,
    group: `⚠️ Comando exclusivo para *Grupos*.`,
    private: `⚠️ Comando exclusivo para *Chat Privado.*`,
    admin: `⚠️ Comando exclusivo para los *Administradores.*`,
    botAdmin: `⚠️ El Bot Requiere *Admin* para utilizar este *Comando.*`,
    unreg: `🤚🏻 Espera, Para Usar Este Comando Debes Estar *Registrado.*\n\nUtiliza: */reg nombre.edad*\n\n> Ejemplo: /reg JaxxBOT.20`,
    restrict: `⚠️ Esta Característica Está *Deshabilitada.*`
  }[type];
  if (msg) return conn.reply(m.chat, msg, m).then(_ => m.react('✖️'))
}

let file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
  unwatchFile(file)
  console.log(chalk.magenta("Se actualizo 'handler.js'"))
  if (global.reloadHandler) console.log(await global.reloadHandler())
})
