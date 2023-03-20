/* eslint-disable prettier/prettier */
declare module "*.vue" {
    import { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module '@function-ui/packages/utils'
declare module '@function-ui/packages/components'
