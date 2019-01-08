# Slack Ping

Send a text ping notification to Slack.

Example:

    const {notifySlack} = require('slack-ping);
    
    const text = 'Ping';
    const token = process.env.SECRET_SLACK_BOT_TOKEN;
    
    notifySlack({text, token}, err => {
      if (!!err) {
        return console.log(err);
      }
      
      return;
    });

