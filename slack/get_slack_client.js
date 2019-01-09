const {WebClient} = require('@slack/client');

const {authEvent} = require('./constants');

const clients = {};

/** Get Slack clients

  {
    token: <Slack Bot Token String>
  }

  @returns via cbk
  {
    channel: <Slack Bot Channel Id String>
    web: <Slack Web API Object>
  }
*/
module.exports = async ({token}, cbk) => {
  if (!token) {
    return cbk([400, 'ExpectedSlackBotToken']);
  }

  if (!!clients[token]) {
    return cbk(null, clients[token]);
  }

  const web = new WebClient(token);

  try {
    const listChannels = await web.channels.list();

    if (!listChannels || !listChannels.channels) {
      return cbk([503, 'UnexpectedResultFromSlackListChannels']);
    }

    const channel = listChannels.channels.find(c => c.is_member);

    if (!channel) {
      return cbk([503, 'SlackBotIsNotAttachedToChannel']);
    }

    if (!channel.id) {
      return cbk([503, 'UnexpectedChannelResponseFormat']);
    }

    clients[token] = {web, channel: channel.id};

    return cbk(null, clients[token]);
  } catch (err) {
    return cbk([503, 'FailedToListChannels', err]);
  }
};

