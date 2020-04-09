# Orbital Frame Jehuty

Jehuty is a reference implementation and ready to use orbital frame running on
[Hubot](http://hubot.github.com). It comes with a number of preinstalled commands
and can be easily extended. [The documentation for Hubot administration is below](#running-jehuty-locally).

### Installed Plugins
  * [error-trap](../orbital-frame-plugin-error-trap/README.md)
  * [did-you-mean]('../orbital-frame-plugin-did-you-mean/README.md)
  * [rc]('../orbital-frame-plugin-rc/README.md)
  * [uptime]('../orbital-frame-plugin-uptime/README.md)

### Installed Commands
  * **alias** Create an alias for a command string
  * **and** Evaluate the AND of two conditions to a boolean
  * **calc** Evaluate a mathematical expression
  * **car** Treat input as a const cell and get the first contents
  * **cdr** Treat input as a const cell and get the rest of the contents after car
  * **choose** Choose one or more values from multiple choices
  * **echo** Write arguments to output
  * **equal** Check two or more arguments for equality
  * **exec** Execute a string as a command
  * **false** Return false
  * **fg** Foreground an interactive job
  * **flatten** Flatten array data to a string
  * **get** Retrieve data at a position from a list
  * **greater-than** Check whether one number is greater than another
  * **head** Return items from the front of input
  * **help** List all available commands and help dialog for an individual command
  * **if** Branch based on a condition
  * **interactive** An example of an interactive command
  * **jobs** List jobs and their statuses
  * **join** Join input by a character
  * **kill** Send a signal to a job
  * **length** Get argument length
  * **less-than** Check whether one number is less than another
  * **list** Convert arguments to a list
  * **no-format** Get the raw output of a command without running it through its formatter
  * **noop** No operation
  * **not** Get the logical inversion of a value
  * **observer** An example of a command which uses observable interactions
  * **or** Evaluate the OR of two conditions to a boolean
  * **promote** Promote a user to a superuser
  * **quote** Surround a string with backticks
  * **range** Generate an inclusive range
  * **repeat** Repeat output
  * **sleep** Wait for a specified amount of time
  * **split** Split input by a character
  * **tail** Return items from the end of input
  * **true** Return true
  * **version** Get the bot's version
  * **whoami** Get the current user
  * **xargs** Distribute list items to a command

### Running Jehuty Locally

You can test your hubot by running the following, however some plugins will not
behave as expected unless the [environment variables](#configuration) they rely
upon have been set.

You can start Jehuty locally by running:

    % bin/hubot

You'll see some start up output and a prompt:

    [Sat Feb 28 2015 12:38:27 GMT+0000 (GMT)] INFO Using default redis on localhost:6379
    jehuty>

Then you can interact with Jehuty by typing `@jehuty <command>`.

    jehuty> @jehuty echo "hello"
    ...

### Configuration

The file `src/index.js` configures the orbital-frame instance with the bot name,
commands to make available, plugins to run, and sets the adapter to Hubot.
Additional commands and plugins can be added by adding them to
`src/commands/index.js` and `src/plugins/index.js`, respectively.

##  Persistence

If you are going to use the `hubot-redis-brain` package (strongly suggested),
you will need to add the Redis to Go addon on Heroku which requires a verified
account or you can create an account at [Redis to Go][redistogo] and manually
set the `REDISTOGO_URL` variable.

    % heroku config:add REDISTOGO_URL="..."

If you don't need any persistence feel free to remove the `hubot-redis-brain`
from `external-scripts.json` and you don't need to worry about redis at all.

[redistogo]: https://redistogo.com/

## Adapters

Adapters are the interface to the service you want your hubot to run on, such
as Campfire or IRC. There are a number of third party adapters that the
community have contributed. Check [Hubot Adapters][hubot-adapters] for the
available ones.

If you would like to run a non-Campfire or shell adapter you will need to add
the adapter package as a dependency to the `package.json` file in the
`dependencies` section.

Once you've added the dependency with `npm install --save` to install it you
can then run hubot with the adapter.

    % bin/hubot -a <adapter>

Where `<adapter>` is the name of your adapter without the `hubot-` prefix.

[hubot-adapters]: https://github.com/github/hubot/blob/master/docs/adapters.md

## Deployment

    % heroku create --stack cedar
    % git push heroku master

If your Heroku account has been verified you can run the following to enable
and add the Redis to Go addon to your app.

    % heroku addons:add redistogo:nano

If you run into any problems, checkout Heroku's [docs][heroku-node-docs].

You'll need to edit the `Procfile` to set the name of your hubot.

More detailed documentation can be found on the [deploying hubot onto
Heroku][deploy-heroku] wiki page.

### Deploying to UNIX or Windows

If you would like to deploy to either a UNIX operating system or Windows.
Please check out the [deploying hubot onto UNIX][deploy-unix] and [deploying
hubot onto Windows][deploy-windows] wiki pages.

[heroku-node-docs]: http://devcenter.heroku.com/articles/node-js
[deploy-heroku]: https://github.com/github/hubot/blob/master/docs/deploying/heroku.md
[deploy-unix]: https://github.com/github/hubot/blob/master/docs/deploying/unix.md
[deploy-windows]: https://github.com/github/hubot/blob/master/docs/deploying/windows.md

## Campfire Variables

If you are using the Campfire adapter you will need to set some environment
variables. If not, refer to your adapter documentation for how to configure it,
links to the adapters can be found on [Hubot Adapters][hubot-adapters].

Create a separate Campfire user for your bot and get their token from the web
UI.

    % heroku config:add HUBOT_CAMPFIRE_TOKEN="..."

Get the numeric IDs of the rooms you want the bot to join, comma delimited. If
you want the bot to connect to `https://mysubdomain.campfirenow.com/room/42`
and `https://mysubdomain.campfirenow.com/room/1024` then you'd add it like
this:

    % heroku config:add HUBOT_CAMPFIRE_ROOMS="42,1024"

Add the subdomain hubot should connect to. If you web URL looks like
`http://mysubdomain.campfirenow.com` then you'd add it like this:

    % heroku config:add HUBOT_CAMPFIRE_ACCOUNT="mysubdomain"

[hubot-adapters]: https://github.com/github/hubot/blob/master/docs/adapters.md

## Restart the bot

You may want to get comfortable with `heroku logs` and `heroku restart` if
you're having issues.
