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

// if (process.env.GITHUB_TOKEN) {
//   github.authenticate({
//     type: 'oauth',
//     token: process.env.GITHUB_TOKEN
//   });
// }

// var extractGeneratorName = function (appname) {
//   var slugged = _s.slugify(appname);
//   var match = slugged.match(/^generator-(.+)/);

//   if (match && match.length === 2) {
//     return match[1].toLowerCase();
//   }

//   return slugged;
// };

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

      this.log(urbansay('Set up your urban apps generator, built using' + chalk.red('Yeoman')));


      var prompts = [
        {
          name: 'urbanUser',
          message: chalk.green.bold('Please enter your Urban username (first letter + full last name, not the shortened version)'),
          default: 'someuser'
        },
        {
          name: 'githubUser',
          message: chalk.green.bold('Please enter your GitHub username:'),
          default: 'someuser'
        },
        {
          name: 'githubPassword',
          message: chalk.green.bold('Please enter your GitHub password:'),
          default: 'somepassword'
        }
      ];


      this.prompt(prompts, function (props) {
        this.githubUser = props.githubUser;
        this.githubPassword = props.githubPassword;
        // this.spawnCommand('grunt',['--githubUser='+this.githubUser,'--githubPassword='+this.githubPassword,'http:create_token']);
        execSync('rm -rf tmp')
        execSync('mkdir tmp')
        execSync('grunt --githubUser='+this.githubUser+" --githubPassword="+this.githubPassword+" http:create_token")
        execSync('grunt --githubUser='+this.githubUser+" --githubPassword="+this.githubPassword+" http:get_tokens")
        execSync('grunt config')
        this.githubToken = execSync('cat tmp/token.js')
        execSync('rm -rf tmp')
        console.log(this.githubToken)
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
        // this.spawnCommand('grunt',['--githubUser='+this.githubUser,'--githubPassword='+this.githubPassword,'http:get_tokens']);
        done();
      }.bind(this), this.log);
    // },
}
    // getToken: function(){
    //   var done = this.async();
    //   var tokens = require('../tmp/all_tokens.json')
    //   var urbanObj = tokens.filter(function(item) {
    //     return item.note == "urban graphics";
    //   });
    //   this.log(urbanObj)
    //   done();
    // }


  },

  writing: {
    projectfiles: function () {

      // console.log(c)

      this.template('_package.json', 'package.json');
      this.template('editorconfig', '.editorconfig');
      this.template('jshintrc', '.jshintrc');
      this.template('_travis.yml', '.travis.yml');
      this.template('README.md');
    },

    gitfiles: function () {
      // this.spawnCommand('git',['init']);
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
        // execSync('grunt --githubUser='+gen.githubUser+" --githubPassword="+gen.githubPassword+" http:create_token")
        // execSync('grunt --githubUser='+gen.githubUser+" --githubPassword="+gen.githubPassword+" http:get_tokens")
      }.bind(this),
      bower: false
    });
  }
});
