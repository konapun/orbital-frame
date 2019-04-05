# Contributing
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

## Developing
**Note:** These steps have only been tested on node versions >=10. You can check your node version with `node -v`.

Make sure that Yarn is installed with version >= `1.9.0`.
Installation instructions can be found here: https://yarnpkg.com/en/docs/install.

### Setup

Install/bootstrap the project:
```sh
$ git clone https://github.com/konapun/orbital-frame.git
$ cd orbital-frame
$ yarn install
$ yarn init
```

### Making Changes
Orbital-frame is built with babel. To watch for changes and transpile on change:
```sh
$ yarn watch
```

You can use Jehuty as a test bed, which is bundled with this repo. See documentation for Jehuty [here](./packages/orbital-frame-jehuty/README.md).

### Testing
Orbital-frame uses Jest for testing. Read more about Jest here https://jestjs.io/docs/en/getting-started.html.

You can run tests using:
```sh
$ yarn test
```

Or to run tests in watch mode:
```sh
$ yarn test:watch
```

## Pull Request Process
1. Ensure all tests are passing and additional tests are added for bug fixes or new feature additions.
2. Update the relevant portions of the README(s) have been updated with details of changes to the API.
3. Increase the version numbers in the relevant `package.json`(s) to the new version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
4. Squash your changes to a single commitl
5. Create a pull request with details of the changes in the description.
