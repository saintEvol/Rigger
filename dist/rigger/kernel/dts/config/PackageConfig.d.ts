/**
* name
*/
declare module rigger.config {
    class PackageConfig {
        /**
         * 服务的全名
         */
        fullName: string;
        version: string;
        customServicesRoot: string[];
        /**
         * 依赖的服务信息
         */
        packages: config.DependentComponentInfo[];
        constructor();
    }
}
