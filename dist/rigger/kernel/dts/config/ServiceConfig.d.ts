/**
* name
*/
declare module rigger.config {
    /**
     * 服务配置
     */
    class ServiceConfig {
        constructor();
        /**
         * 服务的全名
         */
        fullName: string;
        version: string;
        /**
         * 依赖的服务信息
         */
        services: config.DependentComponentInfo[][];
        /**
         * 依赖的插件信息
         */
        plugins: config.DependentComponentInfo[];
    }
}
