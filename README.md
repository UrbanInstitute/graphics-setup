#graphics-setup

`Graphics-setup` is a [yeoman](http://yeoman.io/) generator that will help folks at Urban quickly build out projects by:
- Building out file and folder structures
- Creating html, css, and js templates
- Creating a new git repo for the project, and making the initial commit
- Migrating the project to our staging server, and setting up a [git hook](http://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to pull to staging after every push to master

##Initial installation, one time only

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

 **[http-server](https://www.npmjs.com/package/http-server) (Not stricly required, but a super helpful way to view a project on [localhost](http://en.wikipedia.org/wiki/Localhost), pulling in js, css, etc. files)**
 ```
 npm install http-server -g
 ```

3. Add an ssh key to your github account. You can find [full instructions here](https://help.github.com/articles/generating-ssh-keys/).

4. Clone this repo by running:
 ```
 git clone git@github.com:UrbanInstitute/graphics-setup.git
 ```

5. Next you need to install the *local* node packages, that are just used by graphics-setup. To do this, assuming you've just done step 4, you need to move into the `generator-urban` folder then install local packages. To do this, run:
 ```
 cd graphics-setup/generator-urban/
 npm install && npm link
 ```
 Now, from anywhere on the command line, you should be able to run `yo urban` to generate a generator (I know, confusing) that will build out apps for you.

6. Still inside the `generator-urban` folder, run
 ```
 yo urban
 ```
 On the command line, you'll be walked through a variety of prompts that will ask for things like your github credentials, server details, etc. I (Ben C) or someone else will probably be sitting next to you when you run this command, to make sure you have the right info.

7. Once the generator is done running, there should be a new folder inside the `generator-urban` folder called `generator-apps`. Run:
 ```
 cd generator-apps
 npm link
 ```
 and now you should be able to run `yo apps` from anywhere to create a new Urban app! Yay! Note that `yo urban` is run **ONE time** as part of the installation process and `yo apps` will be run **MANY times**, each time you create a new project.

##Updating the generator
Over time, we'll make changes and updates to graphics-setup, which will mean you'll need to update it yourself. To do so, the process is a bit simpler, just make sure you're in the `graphics-setup` folder then:
1. Run `git pull` to pull down any new changes.

2. Run
 ```
 cd generator-urban/
 npm install
 ```
 to install any new node packages

3. Run
 ```
 yo urban
 ```
 To go through the generator generator again, entering github credentials, server details, etc.

Now you're all updated!

##Making a new app

From anywhere on the command line (doesn't matter what folder you're in), just run:
```
yo apps
```
And yeoman will walk you through making a new project.





