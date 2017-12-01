'use strict';
const Generator = require('yeoman-generator');
const commandExists = require('command-exists').sync;
const yosay = require('yosay');
const chalk = require('chalk');
// // const wiredep = require('wiredep');
const mkdirp = require('mkdirp');
// const _s = require('underscore.string');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('skip-welcome-message', {
      desc: 'Skips the welcome message',
      type: Boolean
    });

    this.option('skip-install-message', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

    this.option('skip-install', {
      desc: 'Skips the message after the installation of dependencies',
      type: Boolean
    });

  }
  initializing() {
    this.pkg = require('../package.json');
    // this.composeWith(
    //   require.resolve(`generator-${this.options['test-framework']}/generators/app`),
    //   { 'skip-install': this.options['skip-install'] }
    // );
  }
  writing() {
    this._writingGulpfile();
    this._writingPackageJSON();
    this._writingStyles();
    this._writingScripts();
    this._writingHtml();
    this._writingJinja();
    this._writingData();
    this._writingMisc();
  }
  prompting() {
    if (!this.options['skip-welcome-message']) {
      this.log(yosay('\'Allo \'allo! Out of the box I include Jinja, Zepto, Sass, and a gulpfile to build your app.'));
    }

    const prompts = [{
      type: 'confirm',
      name: 'includeSass',
      message: 'Would you like to use sass?',
      default: true
    }, {
      type: 'confirm',
      name: 'includeJQuery',
      message: 'Would you like to include jQuery?',
      default: false
    }];

    return this.prompt(prompts).then(answers => {
      // const features = answers.features;
      // const hasFeature = feat => features && features.indexOf(feat) !== -1;

      // manually deal with the response, get back and store the results.
      // we change a bit this way of doing to automatically do this in the self.prompt() method.
      this.includeSass = answers.includeSass;
      this.includejQuery = answers.includejQuery;

    });
  }
  _writingHtml() {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('app/index.html'),
      {
        includeSass: this.includeSass,
        includeJQuery: this.includeJQuery
      }
    );
  }
  _writingGulpfile() {
    this.fs.copyTpl(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      {
        date: (new Date).toISOString().split('T')[0],
        name: this.pkg.name,
        version: this.pkg.version,
        includeSass: this.includeSass
      }
    );
  }
  _writingPackageJSON() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        includeSass: this.includeSass
      }
    );
  }
  _writingStyles() {
    let css = '';
    let target = 'app/';
    console.log(this.includeSass, 'include sass')
    if (this.includeSass) {
      target += 'scss/';
      css += 'scss/*.scss';
    } else {
      target += 'css/';
      css += 'css/*.css';
    }
    this.fs.copy(
      this.templatePath(css),
      this.destinationPath(target)
    );
  }
  _writingScripts() {
    this.fs.copyTpl(
      this.templatePath('js/index.js'),
      this.destinationPath('app/scripts/index.js')
    );
  }
  _writingJinja() {
    this.fs.copyTpl(
      this.templatePath('tpl/index.tpl'),
      this.destinationPath('app/tpl/index.tpl')
    );
  }
  _writingData() {
    this.fs.copyTpl(
      this.templatePath('data.json'),
      this.destinationPath('app/data.json')
    );
  }
  _writingMisc() {
    mkdirp('app/images');
    mkdirp('app/fonts');
  }
  install() {
    // 安装依赖
    const hasYarn = commandExists('yarn');
    this.installDependencies({
      npm: !hasYarn,
      yarn: hasYarn,
      bower: false,
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install']
    });
  }
  end() {
//     const howToInstall = `
// After running ${chalk.yellow.bold('npm install & bower install')}, inject your front end dependencies by running ${chalk.yellow.bold('gulp wiredep')}.`;

//     if (this.options['skip-install']) {
//       this.log(howToInstall);
//       return;
//     }
  }
};