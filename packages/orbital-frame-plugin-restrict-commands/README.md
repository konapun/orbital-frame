# @orbital-frame/plugin-restrict-commands
Restrict commands to certain channels/users.

```js
import { restrict, policy, constraint } from '@orbital-frame/plugin-restrict-commands'

const commands = './commands'
const privilegedChannels = [

]
const privilegedUsers = ['1234', '2345', '3456']
const adminPolicy = {
  type: policy.ALLOW,
  constraints: [
    message => // sender, channel, command
  ],
  default: policy.DENY
}

const restrictCommands = restrict([
    {
      ...adminPolicy,
      onFail ({ respond }) => respond('Blacklisted'),
    }
  ],
])
```

## Policies
  * **DENY**
  * **ALLOW**

## Conditions
TODO

### Limiting a command to specific users


### Blacklisting a user wholesale

