import { App, MessageEvent } from "@slack/bolt";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

app.message(async ({ message, say, client }) => {
  if (!isThreadMessage(message)) {
    console.log("Not a thread message.");
    return;
  }

  if (message.subtype === "thread_broadcast") {
    console.log("This is broadcast message.");
    return;
  }

  const { permalink } = await client.chat.getPermalink({
    channel: message.channel,
    message_ts: message.ts,
  });

  await say({
    text: "スレッドへの返信をチャネルに共有します。",
    channel: message.channel,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<${permalink}|\u{200B}>`,
        },
      },
    ],
  });
});

(async () => {
  await app.start(3000);
  console.log("⚡️ Bolt app is running!");
})();

function isThreadMessage(
  message: MessageEvent
): message is MessageEvent & { thread_ts: string } {
  return "thread_ts" in message && typeof message.thread_ts === "string";
}
