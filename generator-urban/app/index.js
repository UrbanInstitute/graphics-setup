'use strict';
var fs = require('fs')
var path = require('path');
var url = require('url');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var urbansay = require('urbansay');
var npmName = require('npm-name');
var superb = require('superb');
var _ = require('lodash');
var _s = require('underscore.string');
var execSync = require('exec-sync');

/* jshint -W106 */
var proxy = process.env.http_proxy || process.env.HTTP_PROXY || process.env.https_proxy ||
  process.env.HTTPS_PROXY || null;
/* jshint +W106 */
var githubOptions = {
  version: '3.0.0'
};

if (proxy) {
  var proxyUrl = url.parse(proxy);
  githubOptions.proxy = {
    host: proxyUrl.hostname,
    port: proxyUrl.port
  };
}

var GitHubApi = require('github');
var github = new GitHubApi(githubOptions);


var emptyGithubRes = {
  name: '',
  email: '',
  html_url: ''
};

var githubUserInfo = function (name, cb, log) {
  github.user.getFrom({
    user: name
  }, function (err, res) {
    if (err) {
      log.error('Cannot fetch your github profile. Make sure you\'ve typed it correctly.');
      res = emptyGithubRes;
    }
    cb(JSON.parse(JSON.stringify(res)));
  });
};

var GeneratorGenerator = module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.appname = "generator-apps"
    this.generatorName = "apps"
    this.pkg = require('../package.json');
    this.currentYear = (new Date()).getFullYear();
  },

  prompting: {
    askFor: function () {
      var done = this.async();
      this.log(urbansay('Set up your urban apps generator, built using ' + chalk.red('Yeoman')));


      var prompts = [
        {
          name: 'relativeRoot',
          message: chalk.green.bold('Please type the path to your projects folder,'+
          '\nall new projects will live inside this folder (within their policy center folders).'+
          '\nOn a Mac, if you want to use a folder called "projects" in your home directory (i.e. where the Desktop, Download, Documents, etc folders live)'+
          '\n you\'d type "~/projects" (with no quotation marks)')
        },
        {
          name: 'urbanUser',
          message: chalk.green.bold('\nPlease enter your Urban username (first letter + full last name, not the shortened version)')
        },
        {
          name: 'githubUser',
          message: chalk.green.bold('\nPlease enter your GitHub username')
        },
        {
          name: 'githubPassword',
          type: "password",
          message: chalk.green.bold('\nPlease enter your GitHub password')
        },
        {
          name: 'stagingIP',
          message: chalk.green.bold('\nPlease enter the IP address of your staging server')
        },
        {
          name: 'stagingPort',
          message: chalk.green.bold('\nPlease enter the port which you will ssh to staging over')
        },
        {
          name: 'prodIP',
          message: chalk.green.bold('\nPlease enter the IP address of your production server')
        },
        {
          name: 'prodPort',
          message: chalk.green.bold('\nPlease enter the port which you will ssh to production over')
        },
        {
          name: 'googleAnalyticsID',
          message: chalk.green.bold('\nPlease enter the google analytics ID (or hit enter for the default)'),
          default: "UA-57529944-1"
        }
      ];


      this.prompt(prompts, function (props) {
        this.githubUser = props.githubUser;
        this.githubPassword = props.githubPassword;
        this.urbanUser = props.urbanUser;
        this.stagingIP = props.stagingIP;
        this.stagingPort = props.stagingPort;
        this.prodIP = props.prodIP;
        this.prodPort = props.prodPort;
        this.googleAnalyticsID = props.googleAnalyticsID

        var cleanRoot = execSync('echo \"' + props.relativeRoot + '\" | sed \'s/\\/\\//\\//g\'')
        this.projectPath = execSync('dirname ' + cleanRoot + '/fake_project_dir')
        execSync('rm -rf tmp')
        execSync('mkdir tmp')
        execSync('grunt --githubUser='+this.githubUser+" --githubPassword="+this.githubPassword+" http:create_token")
        execSync('grunt --githubUser='+this.githubUser+" --githubPassword="+this.githubPassword+" http:get_tokens")
        execSync('grunt config')
        this.githubToken = execSync('cat tmp/token.js')
        execSync('rm -rf tmp')
        done();
      }.bind(this));
    },
  },

  configuring: {
    enforceFolderName: function () {
      if (this.appname !== _.last(this.destinationRoot().split(path.sep))) {
        this.destinationRoot(this.appname);
      }
      this.config.save();
    },

    userInfo: function () {
      var done = this.async();

      githubUserInfo(this.githubUser, function (res) {
        /*jshint camelcase:false */
        this.realname = res.name;
        this.email = res.email;
        this.githubUrl = res.html_url;
        done();
      }.bind(this), this.log);
}


  },

  writing: {
    projectfiles: function () {
      this.template('_config.js', 'config.js');
      this.template('_bower.json', 'bower.json');
      this.template('_package.json', 'package.json');
      this.template('editorconfig', '.editorconfig');
      this.template('jshintrc', '.jshintrc');
      this.template('_travis.yml', '.travis.yml');
      this.template('README.md');
    },

    gitfiles: function () {
      this.copy('gitattributes', '.gitattributes');
      this.copy('gitignore', '.gitignore');
    },

    app: function () {
      this.superb = superb();
      this.template('app/index.js');
    },

    templates: function () {
      this.copy('editorconfig', 'app/templates/editorconfig');
      this.copy('jshintrc', 'app/templates/jshintrc');
      this.copy('app/templates/_package.json', 'app/templates/_package.json');
      this.copy('app/templates/_bower.json', 'app/templates/_bower.json');
      this.copy('app/templates/_index.html', 'app/templates/_index.html');
      this.copy('app/templates/css/_main.css', 'app/templates/css/_main.css');
      this.copy('app/templates/js/_main.js', 'app/templates/js/_main.js');

    },

    tests: function () {
      this.template('test-app.js', 'test/test-app.js');
    }
  },

  install: function () {
    var done = this.async();
    var gen = this;
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      callback: function () {
      }.bind(this),
      bower: false
    });
  }
});
