const fs = require('fs-extra')
const { 
    prefix
} = JSON.parse(fs.readFileSync('./settings/setting.json'))


exports.textTnC = () => {
    return `

`    
}


exports.textMenu = (pushname) => {
    return `
Hi, ${pushname}! 👋️

Ready Price List Diamond Free Fire via ID Only !
#Reseller

20 💎 Rp. 2.850
50 💎 Rp. 6.840
70 💎 Rp. 9.405
100 💎 Rp. 13.680
140 💎 Rp. 18.810
210 💎 Rp. 28.215
355 💎 Rp. 47.025
425 💎 Rp. 56.430
495 💎 Rp. 65.835
720 💎 Rp. 94.050
860 💎 Rp. 112.860
1075 💎 Rp. 141.075
2000 💎 Rp. 141.075
`
}



exports.textAdmin = () => {
    return `
⚠ [ *Admin Group Only* ] ⚠ 
Berikut adalah fitur admin grup yang ada pada bot ini!

-❥ *${prefix}add*
-❥ *${prefix}kick* @tag
-❥ *${prefix}promote* @tag
-❥ *${prefix}demote* @tag
-❥ *${prefix}tagall*
-❥ *${prefix}del*

_-_-_-_-_-_-_-_-_-_-_-_-_-_

⚠ [ *Owner Group Only* ] ⚠
Berikut adalah fitur owner grup yang ada pada bot ini!
-❥ *${prefix}kickall*
*Owner Group adalah pembuat grup.*
`
}

exports.textDonasi = () => {
    return `
Bot ini dibuat dengan Javascript oleh R-Dev

Thanks Reference for ArugaZ
`
}
