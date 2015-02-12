'use strict';
var path = require('path');
var url = require('url');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var npmName = require('npm-name');
var superb = require('superb');
var _ = require('lodash');
var _s = require('underscore.string');
// var async = require('async');

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
    this.appname = "apps-generator"
    this.generatorName = "apps"
    this.pkg = require('../package.json');
    this.currentYear = (new Date()).getFullYear();
  },

  prompting: {
    askFor: function () {
      var done = this.async();

      this.log(yosay('Create your own ' + chalk.red('Yeoman') + ' generator with superpowers!'));


      var prompts = [
        {
          name: 'urbanUser',
          message: 'Please enter your Urban username (first letter + last name, not the shortened version)',
          default: 'someuser'
        },
        {
          name: 'githubUser',
          message: 'Please enter your GitHub username:',
          default: 'someuser'
        },
        {
          name: 'githubPassword',
          message: 'Please enter your GitHub password:',
          default: 'somepassword'
        }
      ];


      this.prompt(prompts, function (props) {
        this.githubUser = props.githubUser;
        this.githubPassword = props.githubPassword;
        this.spawnCommand('grunt',['--githubUser='+this.githubUser,'--githubPassword='+this.githubPassword,'http:create_token']);
        done();
      }.bind(this));
    },

  //   askForGeneratorName: function () {
  //     var done = this.async();
  //     var generatorName = extractGeneratorName(this.appname);

  //     var prompts = [{
  //       name: 'generatorName',
  //       message: 'What\'s the base name of your generator?',
  //       default: generatorName
  //     }, {
  //       type: 'confirm',
  //       name: 'askNameAgain',
  //       message: 'The name above already exists on npm, choose another?',
  //       default: true,
  //       when: function (answers) {
  //         var done = this.async();
  //         var name = 'generator-' + answers.generatorName;
  //         npmName(name, function (err, available) {
  //           if (!available) {
  //             done(true);
  //           }

  //           done(false);
  //         });
  //       }
  //     }];

  //     this.prompt(prompts, function (props) {
  //       if (props.askNameAgain) {
  //         return this.prompting.askForGeneratorName.call(this);
  //       }

  //       this.generatorName = props.generatorName;
  //       this.appname = 'generator-' + this.generatorName;

  //       done();
  //     }.bind(this));
  //   }
  },

  configuring: {
    enforceFolderName: function () {
      if (this.appname !== _.last(this.destinationRoot().split(path.sep))) {
        this.destinationRoot(this.appname);
      }
      // this.destinationRoot('/Users/bchartof/projects'+this.appname)
      this.config.save();
    },

    userInfo: function () {
      var done = this.async();

      githubUserInfo(this.githubUser, function (res) {
        /*jshint camelcase:false */
        this.realname = res.name;
        this.email = res.email;
        this.githubUrl = res.html_url;
        this.spawnCommand('grunt',['--githubUser='+this.githubUser,'--githubPassword='+this.githubPassword,'http:get_tokens']);
        done();
      }.bind(this), this.log);
    }
  },

  writing: {
    projectfiles: function () {
      this.template('_package.json', 'package.json');
      this.template('editorconfig', '.editorconfig');
      this.template('jshintrc', '.jshintrc');
      this.template('_travis.yml', '.travis.yml');
      this.template('README.md');
    },

    gitfiles: function () {
      this.spawnCommand('git',['init']);
      // this.spawnCommand('grunt',['http:get_tokens','--githubUser='+this.githubUser,'--githubPassword='+this.githubPassword]);
      // this.githubToken = "fake_token"
      // this.template('_config.js','config.js')
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
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      callback: function () {
        // gen.spawnCommand('grunt',['--githubUser='+gen.githubUser,'--githubPassword='+gen.githubPassword,'http:create_token']);
        // // done();
        // gen.spawnCommand('grunt',['--githubUser='+gen.githubUser,'--githubPassword='+gen.githubPassword,'http:get_tokens']);

        // // async.series([
        // //   function(callback){
        // //     gen.spawnCommand('grunt',['--githubUser='+gen.githubUser,'--githubPassword='+gen.githubPassword,'http:create_token']);
        // //     callback(null, null);
        // //   },
        // //   function(callback){
        // //     gen.spawnCommand('grunt',['--githubUser='+gen.githubUser,'--githubPassword='+gen.githubPassword,'http:get_tokens']);
        // //     callback(null, null);
        // //   }
        // // ]);

        
       
        this.githubToken = "fake_token"
        this.template('_config.js','config.js')
      }.bind(this),
      bower: false
    });
  }
});
