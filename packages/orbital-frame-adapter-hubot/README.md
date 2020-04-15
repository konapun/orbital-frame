## Introduction
This is an adapter for orbital-frame to use [Hubot](https://hubot.github.com/)
as the underlying interaction mechanism.

**NOTE: THIS ADAPTER HAS ONLY BEEN TESTED WITH SLACK AND MAY HAVE SOME ISSUES WITH OTHER SERVICES**

### Configuration
(none yet)

### Service-Specific Features
#### Slack
Slack uses triple backticks (```) to start and end a formatted block. This
adapter removes these blocks before passing the message to the core framework so
client-side text formatting can be used when issuing commands:
