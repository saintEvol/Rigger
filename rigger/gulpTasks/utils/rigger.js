var fs = require('fs');

var Rigger = {
    applicationConfig: undefined,
    configPath: "./RiggerConfig.json",
    thirdServicesRoot: "./rigger/thirdServices",
    thirdPluginsRoot: "./rigger/thirdPlugins",
    kernelServiceRoot: "./rigger/kernel/dts/kernelServices",


    init: function () {
        if (fs.existsSync(this.configPath)) {
            console.log(`init rigger, config path:${this.configPath}`);
            this.applicationConfig = JSON.parse(RiggerUtils.removeCommentsInJson(fs.readFileSync(this.configPath)));
            console.log(`init rigger, done`);
        }
        else {
            throw new Error("app config not exist!");
        }
    },

    makeThirdServiceRoot: function (fullName) {
        return `${Rigger.thirdServicesRoot}/${fullName}`;
    },

    makeKernelServiceRoot: function (fullName) {
        return `${Rigger.kernelServiceRoot}/${fullName}`;
    },

    makeThirdPluginRoot: function (fullName) {
        return `${Rigger.thirdPluginsRoot}/${fullName}`;
    },

    makeKennelServiceConfigPath: function (fullName) {
        return `${Rigger.makeKernelServiceRoot(fullName)}/${fullName}.json`;
    },

    makeThirdServiceConfigPath: function (fullName) {
        return `${Rigger.makeThirdServiceRoot(fullName)}/${fullName}.json`;
    }
}

module.exports = {
    // 属性
    configPath: Rigger.configPath,
    thirdServicesRoot: Rigger.thirdServicesRoot,
    thirdPluginsRoot: Rigger.thirdPluginsRoot,
    kernelServiceRoot: Rigger.kernelServiceRoot,

    // 方法
    applicationConfig: Rigger.applicationConfig,
    init: Rigger.init,
    makeThirdServiceRoot: Rigger.makeThirdServiceRoot,
    makeThirdPluginRoot: Rigger.makeThirdPluginRoot,
    makeThirdServiceConfigPath: Rigger.makeThirdServiceConfigPath,
    makeKennelServiceConfigPath: Rigger.makeKennelServiceConfigPath,
}

var RiggerUtils = require('./riggerUtils.js');
