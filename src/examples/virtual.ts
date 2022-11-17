
/**
 *  虚拟模块 rollup一致的规范，用于处理构建中人为导入模块， '\0'
 * resolveId 查找对应id，会在模块id加上\0 区分虚拟模块、解析load钩子完毕之后return 返回的js模块
 */
export default function myPlugin() {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'my-plugin', // 必须的，将会在 warning 和 error 中显示
    resolveId(id) {
      if (id === virtualModuleId) {
        console.log(resolvedVirtualModuleId);
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        console.log("resolvedVirtualModuleId", resolvedVirtualModuleId);
        console.log("id", id);
        return `export const msg = "from virtual module"`
      }
    }
  }
}