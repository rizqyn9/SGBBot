const { create, Client } = require('@open-wa/wa-automate')
const figlet = require('figlet')
const options = require('./utils/options')
const { color, messageLog } = require('./utils')
const HandleMsg = require('./HandleMsg')

const start = (RClient = new Client()) => {
    console.log(color('[DEV]'), color('RClientZ', 'yellow'))
    console.log(color('[~>>]'), color('BOT Started!', 'green'))

    // Mempertahankan sesi agar tetap nyala
    RClient.onStateChanged((state) => {
        console.log(color('[~>>]', 'red'), state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') RClient.forceRefocus()
    })

    // ketika bot diinvite ke dalam group
    RClient.onAddedToGroup(async (chat) => {
	const groups = await RClient.getAllGroups()
	// kondisi ketika batas group bot telah tercapai,ubah di file settings/setting.json
	if (groups.length > groupLimit) {
	await RClient.sendText(chat.id, `Sorry, the group on this bot is full\nMax Group is: ${groupLimit}`).then(() => {
	      RClient.leaveGroup(chat.id)
	      RClient.deleteChat(chat.id)
	  }) 
	} else {
	// kondisi ketika batas member group belum tercapai, ubah di file settings/setting.json
	    if (chat.groupMetadata.participants.length < memberLimit) {
	    await RClient.sendText(chat.id, `Sorry, BOT comes out if the group members do not exceed ${memberLimit} people`).then(() => {
	      RClient.leaveGroup(chat.id)
	      RClient.deleteChat(chat.id)
	    })
	    } else {
        await RClient.simulateTyping(chat.id, true).then(async () => {
          await RClient.sendText(chat.id, `Hai minna~, Im RClient BOT. To find out the commands on this bot type ${prefix}menu`)
        })
	    }
	}
    })

    // ketika seseorang masuk/keluar dari group
    RClient.onGlobalParicipantsChanged(async (event) => {
        const host = await RClient.getHostNumber() + '@c.us'
        // kondisi ketika seseorang diinvite/join group lewat link
        if (event.action === 'add' && event.who !== host) {
            await RClient.sendTextWithMentions(event.chat, `Hello, Welcome to the group @${event.who.replace('@c.us', '')} \n\nHave fun with us✨`)
        }
        // kondisi ketika seseorang dikick/keluar dari group
        if (event.action === 'remove' && event.who !== host) {
            await RClient.sendTextWithMentions(event.chat, `Good bye @${event.who.replace('@c.us', '')}, We'll miss you✨`)
        }
    })

    RClient.onIncomingCall(async (callData) => {
        // ketika seseorang menelpon nomor bot akan mengirim pesan
        await RClient.sendText(callData.peerJid, 'Maaf sedang tidak bisa menerima panggilan.\n\n-bot')
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
                    console.log('[RClient]', color(`Loaded Message Reach ${msg}, cuting message cache...`, 'yellow'))
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
