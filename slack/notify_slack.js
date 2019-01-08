const asyncAuto = require('async/auto');

const getSlackClient = require('./get_slack_client');

/** Notify Slack of something

  {
    text: <Notify Slack Text Message String>
    token: <Slack Bot Authentication Token String>
  }
*/
module.exports = ({text}, cbk) => {
  return asyncAuto({
    // Check arguments
    validate: cbk => {
      if (!text) {
        return cbk([400, 'ExpectedTextMessageStringToNotifySlack']);
      }

      if (!token) {
        return cbk([400, 'ExpectedSlackTokenForSlackNotification']);
      }

      return cbk();
    },

    // Get connection to Slack
    getSlackClient: cbk => getSlackClient({token}, cbk),

    // Send Slack message
    postMessage: ['getSlackClient', async ({getSlackClient}) => {
      const {channel} = getSlackClient;
      const {web} = getSlackClient;

      await web.chat.postMessage({channel, text, as_user: true});
    }],
  },
  err => {
    if (!!err) {
      return cbk(err);
    }

    return cbk();
  });
};

