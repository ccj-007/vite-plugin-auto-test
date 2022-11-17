/**
 * 钩子
 * 
 * 服务器启动  options buildStart
 * 模块请求  resolveId load  transform
 * 服务器关闭  buildEnd closeBundle
 */
 import type { PluginOption } from 'vite';
export default function myPlugin(): PluginOption {
   let oldtime = new Date().getTime()
  return {
    name: 'my-plugin', 
    enforce: 'pre',
    // apply: 'build',  默认预览serve和构建都会执行

    /**  ============== vite 钩子 ====== */
    //用于对传入的参数处理
    config(config, env) {

    },
    //vite解析后的配置
    configResolved(resolvedConfig) {

    },
    configureServer(server) {

    },
    //转换html的钩子
    transformIndexHtml(html) {

    },
    //hmr更新
    handleHotUpdate(ctx) {

    },
    /**  ============ vite 与rollup通用钩子 ====== */
    // 获取vite插件加载
    options(opts) {
    },
    buildStart(opts) {
    },
    resolveId(source, importer, options) {
    },
    load(id) {
    },
    //转换模块
    transform(code, id) {
    },
    buildEnd() {},

    /**  ============== vite 和rollup的输出阶段 的钩子 ====== */
    outputOptions(options) {

    },
    renderStart(outOptions, inputOptions) {

    },
    augmentChunkHash(chunkInfo) {

    },
    renderChunk() {
      return ''
    },
    generateBundle() {
      
    },
    writeBundle() {

    },
    closeBundle() {
      let newtime =  new Date().getTime()
      let diff = ((newtime - oldtime) / 1000) + 's'
      console.log("打包用时", diff);
      
    }
  }
}