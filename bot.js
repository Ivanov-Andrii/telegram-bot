require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/markup');
const COUNTRIES = require('./store')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(
`
Привет, ${ctx.message.from.first_name}
Узнай статистику по коронавирусу.
Введи на английском название страны и получи статистику.
Посмотреть весь список стран можно командой /help.
`, Markup.keyboard([
    ['US', 'Ukraine'],
    ['Canada', 'Latvia']
    ]).resize().extra()
    ))

    bot.help((ctx) => ctx.reply(COUNTRIES))

bot.on('text', (async (ctx) => {
    let data = {};
    try {
        data = await api.getReportsByCountries(ctx.message.text);

        const formatData = 
    `   
Страна : ${data[0][0].country}
Случаи : ${data[0][0].cases}
Смертей : ${data[0][0].deaths}
Вылечились : ${data[0][0].recovered}
        `;
        ctx.reply(formatData)        
    } catch {
        console.log("Ошибка");
        ctx.reply("Ошибка, такой страны не существует. Посмотрите /help")
    }

}))
bot.launch()

console.log("Бот запущен")