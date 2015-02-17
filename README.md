#graphics-setup

`Graphics-setup` is a [yeoman](http://yeoman.io/) generator that will help folks at Urban quickly build out projects by:
- Building out file and folder structures
- Creating html, css, and js templates
- Creating a new git repo for the project, and making the initial commit
- Migrating the project to our staging server, and setting up a [git hook](http://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to pull to staging after every push to master

##Initial installation

1. This generator is written using node.js, so to run it you'll need to install node.

 You can find an [installer for node here](http://nodejs.org/download/), as well as for npm ("node package manager" which is used to install node tools such as yeoman).

2. Setting up node tools requires various packages. Some packages should be installed *globally*, meaning you can run them anywhere (either anywhere on the command line or from inside any program). Other packages should be installed *locally*, meaning they can only be used by a certain program, or inside a certain folder. To get graphics-setup running, you should install a few packages globally, by running the following commands:

 **[yeoman](http://yeoman.io/) (handles the major work of the generator):**
 ```
 npm install -g yo
 ```

 **[grunt](http://gruntjs.com/) (runs certain tasks, e.g. API calls):**
 ```
 npm install -g grunt-cli
 ```

 **[jshint](http://jshint.com/) (a handy tool for bug-checking javascript):**
 ```
 npm install jshint -g
 ```

 **[http-server](https://www.npmjs.com/package/http-server) (Not stricly required, but a super helpful way to view a project on [localhost](http://en.wikipedia.org/wiki/Localhost), pulling in js, css, etc. files)
 ```
 npm install http-server -g
 ```

 3. Add an ssh key to your github account. You can find [full instructions here](https://help.github.com/articles/generating-ssh-keys/).





