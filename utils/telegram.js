const db = require('../config/db');

/**
 * Gửi tin nhắn thông báo tự động sang Telegram Bot
 * @param {string} message Nội dung tin nhắn
 */
async function sendTelegramAlert(message) {
  try {
    // Truy vấn Token và các Chat ID từ bảng settings
    const [rows] = await db.query(
      "SELECT `key`, `value` FROM settings WHERE `key` IN ('telegram_bot_token', 'telegram_chat_id_private', 'telegram_chat_id_group')"
    );
    
    let botToken = '';
    let chatIds = [];
    
    rows.forEach(row => {
      if (row.key === 'telegram_bot_token') botToken = row.value.trim();
      if (row.key === 'telegram_chat_id_private' && row.value.trim()) chatIds.push(row.value.trim());
      if (row.key === 'telegram_chat_id_group' && row.value.trim()) chatIds.push(row.value.trim());
    });
    
    // Nếu chưa cấu hình bot token hoặc không có chat ID nào thì bỏ qua
    if (!botToken || chatIds.length === 0) {
      console.log('Telegram Bot hoặc Chat ID chưa được cấu hình. Bỏ qua gửi thông báo.');
      return;
    }
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Gửi tin nhắn tới từng Chat ID đã cấu hình
    for (const chatId of chatIds) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
          })
        });
        
        const data = await response.json();
        if (!response.ok) {
          console.error(`Gửi tin nhắn Telegram thất bại cho ID ${chatId}:`, data);
        } else {
          console.log(`Gửi thông báo Telegram thành công cho ID ${chatId}!`);
        }
      } catch (err) {
        console.error(`Lỗi khi gọi Telegram API cho ID ${chatId}:`, err);
      }
    }
  } catch (error) {
    console.error('Lỗi khi xử lý thông báo Telegram:', error);
  }
}

module.exports = { sendTelegramAlert };
