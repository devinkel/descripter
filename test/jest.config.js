const { resolve } = require('path');
const  root  = resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`); //importando a configuração global do jest

// \/ sobrescrevendo algumas chaves 
module.exports = {...rootConfig, ...{
    rootDir : root,
    displayName: "end2end-tests",
    setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"], //arquivo de setup que roda antes dos testes 
    testMatch: ["<rootDir>/test/**/*.test.ts"], //quais arquivos ele vai rodar os testes
}}