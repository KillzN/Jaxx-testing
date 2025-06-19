const credsPorComida = 5; // 10 creds por 1 comida

const handler = async (m, { conn, command, args }) => {
  let count = parseInt(args[0]) || 1; // Número de comidas a comprar (por defecto 1)
  count = Math.max(1, count); // Asegura que el valor mínimo sea 1

  let user = global.db.data.users[m.sender];

  if (!user.limit || user.limit < credsPorComida * count) {
    conn.reply(
      m.chat,
      `😔 Lo siento, necesitas al menos *${credsPorComida * count} Creds 🪙* para comprar *${count} comida 🍖*.`,
      m
    );
    return;
  }

  // Resta los creds y suma comida
  user.limit -= credsPorComida * count;
  user.comida = (user.comida || 0) + count; // Asegura que 'comida' exista y la actualiza

  // Mensaje de confirmación
  conn.reply(
    m.chat,
    `
🛒  Compra Realizada  

*Cantidad Comprada*: +${count} En Comida 🍖
*creds Gastados*: -${credsPorComida * count} 🪙

Gracias Por Su Compra Vuelva Pronto 😇
> @ꜱɪꜱᴋᴇᴅ - ʟᴏᴄᴀʟ - 𝟢𝟨
`,
    m
  );
};

handler.help = ['comprar'];
handler.tags = ['rpg'];
handler.command = ['comprar'];

export default handler;
