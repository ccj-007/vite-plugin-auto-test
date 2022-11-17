const fileRegex = /\.(my-file-ext)$/

export default function myPlugin() {
  return {
    name: 'transform-file',

    transform(src, id) {
      if (fileRegex.test(id)) {
        // return {
        //   code: compileFileToJS(src),
        //   map: null // 如果可行将提供 source map
        // }
      }
    }
  }
}