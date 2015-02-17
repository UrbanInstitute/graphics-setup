'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var urbansay = require('urbansay');
var config = require('../config.js')
var fs = require('fs')
var execSync = require('exec-sync');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    this.log(urbansay(
      'Welcome the the UI app builder. Please follow the prompts to build a new app.'+chalk.red.bold(' Please note: '+'there\'s no need to create any project folders on your own, the generator will create them all for you!') 
    ));

    var prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: chalk.green.bold('What is the name of this project')+chalk.red.bold(' (no spaces or periods please)')+chalk.green.bold('?\n This name will be used as the github repo name, as well as the folder name on staging and production servers')
      },
      {
        type: 'input',
        name: 'appTitle',
        message: chalk.green.bold('\nWhat is a short, descriptive title for the project\n (e.g. "Sunday yummy sundae: An ice cream study")\n This can change, later')
      },
      {
        type: 'input',
        name: 'appDescription',
        message: chalk.green.bold('\nWhat is a one sentence project description,\n (e.g. "A longitudinal analysis of ice cream habits revealed an uptick in toppings per ounce on Saturdays and Sundays")\n This can change, later')
      },
      {
        type: 'confirm',
        name: 'isPolicyCenter',
        message: chalk.green.bold('\nIs this project under a Policy Center?')
      },
      {
        type: 'list',
        name: 'policyCenter',
        message: chalk.green.bold('\nWhich Policy Center?'),
        choices: [
          "Health Policy Center (HPC)",
          "Housing Finance Policy Center (HFPC)",
          "Income and Benefits Policy Center (IBP)",
          "Center on International Development and Governance (IDG)",
          "Justice Policy Center (JPC)",
          "Center on Labor, Human Services, and Population (LHP)",
          "Metropolitan Housing and Communities Policy Center (Metro)",
          "Center of Nonprofits and Philanthropy (CNP)",
          "Statistical Methods Group (SMG)",
          "Urban-Brooking Tax Policy Center (TPC)"
        ],
        when: function(answers){
          return answers.isPolicyCenter;
        }
      },
      {
        type: 'confirm',
        name: 'isCrossCenter',
        message: chalk.green.bold('\nIs this project under a Cross Center Initiative?'),
        when: function(answers){
          return !isParent('isPolicyCenter')(answers)
        }
      },
      {
        type: 'list',
        name: 'crossCenter',
        message: chalk.green.bold('\nWhich Cross Center Initiative?'),
        choices: [
          "Kids in Context",
          "Low-Income Working Families",
          "Neighborhoods and Youth Development",
          "Opportunity and Ownership",
          "Performance Measurement and Management",
          "Program on Retirement Policy",
          "Social Determinants of Health",
          "State and Local Finance Initiative",
          "Tax Policy and Charities",
          "Washington, DC, Research Initiative"
        ],
        when: isParent('isCrossCenter')
      },
      {
        type: 'list',
        name: 'privacy',
        message: chalk.green.bold('\nShould this project be public or private?:'),
        choices: [
          "Public",
          "Private"
        ],
        default: "Public"
      },
      {
        type: "confirm",
        name: "includeCustomGoogleAnalytics",
        message: chalk.green.bold("Will this project use custom google analytics events?")
      },
      {
        type: "confirm",
        name: "includeD3",
        message: chalk.green.bold("Will this project use d3.js?")
      },
    ];

    function slugify(choice){
        var slugs ={
          "Health Policy Center (HPC)": "policy-centers/health-policy-center/",
          "Housing Finance Policy Center (HFPC)": "policy-centers/housing-finance-policy-center/",
          "Income and Benefits Policy Center (IBP)": "policy-centers/income-and-benefits-policy-center/",
          "Center on International Development and Governance (IDG)": "policy-centers/center-international-development-and-governance/",
          "Justice Policy Center (JPC)":"policy-centers/justice-policy-center/",
          "Center on Labor, Human Services, and Population (LHP)":"policy-centers/center-labor-human-services-and-population/",
          "Metropolitan Housing and Communities Policy Center (Metro)":"policy-centers/metropolitan-housing-and-communities-policy-center/",
          "Center of Nonprofits and Philanthropy (CNP)":"policy-centers/center-nonprofits-and-philanthropy/",
          "Statistical Methods Group (SMG)":"policy-centers/statistical-methods-group/",
          "Urban-Brooking Tax Policy Center (TPC)":"policy-centers/urban-brookings-tax-policy-center/",
          "Kids in Context": "policy-centers/cross-center-initiatives/kids-context/",
          "Low-Income Working Families": "policy-centers/cross-center-initiatives/low-income-working-families/",
          "Neighborhoods and Youth Development": "/policy-centers/cross-center-initiatives/neighborhoods-and-youth-development/",
          "Opportunity and Ownership": "policy-centers/cross-center-initiatives/opportunity-and-ownership/",
          "Performance Measurement and Management": "policy-centers/cross-center-initiatives/performance-measurement-and-management/",
          "Program on Retirement Policy": "policy-centers/cross-center-initiatives/program-retirement-policy/",
          "Social Determinants of Health": "policy-centers/cross-center-initiatives/social-determinants-health/",
          "State and Local Finance Initiative": "policy-centers/cross-center-initiatives/state-and-local-finance-initiative/",
          "Tax Policy and Charities": "policy-centers/cross-center-initiatives/tax-policy-and-charities/",
          "Washington, DC, Research Initiative": "policy-centers/cross-center-initiatives/washington-dc-research-initiative/"
        }
        return slugs[choice];
    }

    function githubOrg(privacy){
      var orgs = {
        "Public": "urbaninstitute",
        "Private": "UI-research"
      }
      return orgs[privacy];
    }
    function isParent ( parent ) {
      return function ( answers ) {
        return answers[ parent ];
      }
    }
    this.prompt(prompts, function (props) {
      if(typeof props.policyCenter === "undefined" && typeof props.crossCenter !== "undefined"){
        this.parentEntity = slugify(props.crossCenter);
      }
      else if(typeof props.policyCenter !== "undefined" && typeof props.crossCenter == "undefined"){
        this.parentEntity = slugify(props.policyCenter);
      }
      else{
       throw new Error(chalk.red.bold("The project must exist under either a Policy Center or a Cross Center Initiative"))
      }
      this.projectName = props.projectName;

      var dirExists = execSync('if test -d ' + config.params.projectPath + "/" + this.parentEntity + props.projectName +'; then echo "exists"; else echo "does not exist"; fi')
      if(dirExists === "exists"){
        throw new Error(chalk.red.bold("That project name already exists"))
      }

      this.appTitle = props.appTitle;
      this.appDescription = props.appDescription;
      this.googleAnalyticsID = config.params.googleAnalyticsID
      this.privacy = props.privacy;
      this.githubOrg = githubOrg(props.privacy)

      this.includeCustomGoogleAnalytics = props.includeCustomGoogleAnalytics;
      if(props.includeCustomGoogleAnalytics){
        this.customGoogleAnalyticsTag = '\n\t\t<script src=\"js/vendor/urban-analytics.min.js\"></script>'+
          '\n\t\t<script type=\"text/javascript\">'+
          '\n\t\t\t// custom analytics functions go here, see https://github.com/UrbanInstitute/custom-analytics'+
          '\n\t\t\t// for examples'+
          '\n\t\t</script>'
      }
      else{
        this.customGoogleAnalyticsTag = ""
      }

      this.includeD3 = props.includeD3;
      if(props.includeD3){
        this.d3Tag = '\n\t\t<script src = \"https://raw.githubusercontent.com/mbostock/d3/master/d3.min.js\"></script>'
      }
      else{
        this.d3Tag = ""
      }

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.destinationRoot(config.params.projectPath + "/" + this.parentEntity + this.projectName);
      this.template('_index.html','index.html')
      if(this.includeCustomGoogleAnalytics){
        this.fs.copy(
          this.templatePath('js/vendor/urban-analytics.min.js'),
          this.destinationPath('js/vendor/urban-analytics.min.js')
        );
      }
      if(this.includeD3){
        this.fs.copy(
          this.templatePath('js/vendor/d3.min.js'),
          this.destinationPath('js/vendor/d3.min.js')
        );
      }
      this.fs.copy(
        this.templatePath('css/_main.css'),
        this.destinationPath('css/main.css')
      );
      this.fs.copy(
        this.templatePath('css/bootstrap.min.css'),
        this.destinationPath('css/bootstrap.min.css')
      );
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
      this.fs.copy(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json')
      );
      this.fs.copy(
        this.templatePath('img/logo-01.png'),
        this.destinationPath('img/logo-01.png')
      );

    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    var path = this.destinationRoot();
    var org = this.githubOrg;
    var token = config.params.githubToken;
    var projectPath = config.params.projectPath
    var projectName = this.projectName;
    var parentEntity = this.parentEntity

    var urbanUser = config.params.urbanUser
    
    var stagingPort = config.params.staging.port;
    var stagingIP = config.params.staging.IP;

    var generator = this;

    this.installDependencies({
      skipInstall: this.options['skip-install'],
      callback: function () {
        // execSync('cd '+path)
        // execSync('git init')
        // execSync('git add package.json')
        // execSync('git commit -m "initial commit"')
        // execSync('curl -s -H \'Authorization: token '+ token +'\' -d \'{"name":"' + projectName + '"}\' https://api.github.com/orgs/' + org + '/repos')
        // execSync('git remote add origin git@github.com:' + org + '/' + projectName + '.git')
        // execSync('git push -u --quiet origin master')

        // //scp to staging
        // execSync('scp -rp ' + projectPath + "/" + parentEntity + projectName + ' -P ' + stagingPort + ' ' + urbanUser + '@' + stagingIP + '/var/www/apps.urban.org/')
      }.bind(this),
    });
  }
});
