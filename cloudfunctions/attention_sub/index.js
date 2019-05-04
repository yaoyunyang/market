const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  var docid = event.docid
  try {
    return await db.collection('goods').doc(docid).update({
      data: {
        attention_num: _.inc(-1)
      },
    })
  } catch (e) {
    console.log(e)
  }
}