const toId = (value) => String(value?._id || value || "");

// Older versions saved the same send through both Socket.IO and HTTP.  Treat
// records with identical content, participants, and nearly identical send time
// as one message so existing duplicate history is not shown after login.
export const deduplicateChatMessages = (messages) => {
  const seen = [];

  return messages.filter((message) => {
    const timestamp = new Date(message.timestamp).getTime();
    const duplicate = seen.some((item) =>
      item.message === message.message &&
      item.from === toId(message.from) &&
      item.to === toId(message.to) &&
      Math.abs(item.timestamp - timestamp) < 5000
    );

    if (duplicate) return false;

    seen.push({
      message: message.message,
      from: toId(message.from),
      to: toId(message.to),
      timestamp
    });
    return true;
  });
};
