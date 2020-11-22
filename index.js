const { create, Client } = require('@open-wa/wa-automate')
const figlet = require('figlet')
const options = require('./utils/options')
const { color, messageLog } = require('./utils')
const HandleMsg = require('./HandleMsg')
const botSetting = require('./bot-settings.json')

const start = (RClient = new Client()) => {
    console.log(color('[DEV]'), color('RDEv', 'yellow'))
    console.log(color('[~>>]'), color('BOT Started!', 'green'))

    // Mempertahankan sesi agar tetap nyala
    RClient.onStateChanged((state) => {
        console.log(color('[~>>]', 'red'), state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') RClient.forceRefocus()
    })

    // ketika bot diinvite ke dalam group
    RClient.onAddedToGroup(async (chat) => {
        await RClient.simulateTyping(chat.id, true).then(async () => {
          await RClient.sendText(chat.id, `${botSetting.group.BotMasukGroup}`)
        }) 
    })

    // ketika seseorang masuk/keluar dari group
    RClient.onGlobalParicipantsChanged(async (event) => {
        const host = await RClient.getHostNumber() + '@c.us'
        // kondisi ketika seseorang diinvite/join group lewat link
        if (event.action === 'add' && event.who !== host) {
            await RClient.sendTextWithMentions(event.chat, `@${event.who.replace('@c.us', '')} ${botSetting.group.MemberBaru}`)
        }
        // kondisi ketika seseorang dikick/keluar dari group
        if (event.action === 'remove' && event.who !== host) {
            await RClient.sendTextWithMentions(event.chat, `@${event.who.replace('@c.us', '')} ${botSetting.group.MemberKeluar}`)
        }
    })

    RClient.onIncomingCall(async (callData) => {
        // ketika seseorang menelpon nomor bot akan mengirim pesan
        await RClient.sendText(callData.peerJid, `${botSetting.settingBot.MenerimaPanggilan}`)
        .then(async () => {
            // bot akan memblock nomor itu
            await RClient.contactBlock(callData.peerJid)
        })
    })

    // ketika seseorang mengirim pesan
    RClient.onMessage(async (message) => {
        RClient.getAmountOfLoadedMessages() // menghapus pesan cache jika sudah 3000 pesan.
            .then((msg) => {
                if (msg >= 3000) {
                    console.log('[BOT]', color(`Loaded Message Reach ${msg}, cuting message cache...`, 'yellow'))
                    RClient.cutMsgCache()
                }
            })
        HandleMsg(RClient, message)    
    
    })
	
    // Message log for analytic
    RClient.onAnyMessage((anal) => { 
        messageLog(anal.fromMe, anal.type)
    })
}

//create session
create(options(true, start))
    .then((RClient) => start(RClient))
    .catch((err) => new Error(err))
