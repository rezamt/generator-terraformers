'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const providers = require('./templates/providers.json');
const backends = require('./templates/backends.json');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        'Welcome to the slick ' +
          chalk.red('terraformers boilerplate') +
          ' generator!'
      )
    );

    const prompts = [
      {
        type: 'input',
        name: 'project',
        message:
          'What is your project name?',
        default: 'demo-project',
        store: true
      },
      {
        type: 'input',
        name: 'appName',
        message:
          'What is your application name?',
        default: 'demo-app',
        store: true
      },
      {
        type: 'input',
        name: 'environment',
        message:
          'What is your environment name [dev , prod]?',
        default: 'dev',
        store: true
      },
      {
        type: 'list',
        name: 'backend',
        message:
          'What state backend will you be using? Full list of backends here: https://www.terraform.io/docs/backend/types/index.html',
        choices: Object.keys(backends)
      },
      {
        type: 'list',
        name: 'provider',
        message:
          'What Terraform provider will you be using? Full list of providers here: https://www.terraform.io/docs/providers',
        choices: Object.keys(providers)
      },
      {
        when: props => props.provider === 'azurerm',
        type: 'input',
        name: 'location',
        message:
          'Which region/location Terraform should deploy your resources: ',
        default: 'australiaeast',
        store: true
      },
      {
        when: props => props.provider === 'aws',
        type: 'input',
        name: 'location',
        message:
          'Which region/location Terraform should deploy your resources: ',
        default: 'ap-southeast-2',
        store: true
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writingModules() {
    this.fs.copyTpl(
      this.templatePath('modules/provider.tf'),
      this.destinationPath(`${this.props.project}/provider.tf`),
      {
        appName: this.props.appName,
        backend: this.props.backend,
        provider: this.props.provider,
        providerAttributes: providers[this.props.provider],
        environment: this.props.environment
      }
    );
    this.fs.copyTpl(
      this.templatePath('modules/main.tf'),
      this.destinationPath(`${this.props.project}/main.tf`),
      {
        location: this.props.location,
        appName: this.props.appName,
        provider: this.props.provider
      }
    );
    this.fs.copyTpl(
      this.templatePath('modules/terraform.tfvars'),
      this.destinationPath(`${this.props.project}/terraform.tfvars`),
      {
        appName: this.props.appName,
        location: this.props.location,
        backend: this.props.backend,
        provider: this.props.provider,
        providerAttributes: providers[this.props.provider]
      }
    );
    this.fs.copy(
      this.templatePath('modules/output.tf'),
      this.destinationPath(`${this.props.project}/output.tf`)
    );
    this.fs.copy(this.templatePath('.gitignore'), this.destinationPath(`${this.props.project}/.gitignore`));
}

  install() {}
};
