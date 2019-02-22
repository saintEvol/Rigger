/**
* name
*/
declare module rigger.config {
    class ApplicationConfig {
        /**
         * 工程类型,可用类型：rigger, serice, plugin, application
         */
        projectType: string;
        /**
         * 应用名称
         */
        applicationName: string;
        /**
         * 发布服务时，服务源码所在根目录
         */
        srcRoot: string;
        /**
         * 库路径
         * gulp 会读取此路径中的源文件，所以应写成如下形式:
         * ["./libs/*.ts"]
         */
        libPathes: string[];
        /**
         * 输出目录根路径,主要用于发布Rigger或服务
         */
        outRoot: string;
        /**
         * 构建项目时，服务执行文件的目标位置,构建项目时会将相关配置复制到此目录下
         */
        binRoot: string;
        /**
         * 配置的构建目录，如果未设置或为空字串，则同binRoot
         */
        configBuildRoot: string;
        /**
         * 自定义的服务(非第三方服务，而是本地服务)根目录
         */
        customServicesRoot: string[];
        /**
         * 应用需要启动的服务
         */
        services: DependentComponentInfo[][];
        /**
         * 应用依赖的包
         */
        packages: DependentComponentInfo[];
        /**
         * 依赖
         */
        deps: DependentComponentInfo[][];
    }
}
