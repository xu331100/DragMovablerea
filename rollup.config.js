
import { nodeResolve } from '@rollup/plugin-node-resolve';
// import typescript from 'rollup-plugin-typescript'
import postcss from 'rollup-plugin-postcss'
import del from 'rollup-plugin-delete'
import babel from 'rollup-plugin-babel'
import commonjs from '@rollup/plugin-commonjs';
export default {
  input: 'src/index.js', // 打包入口
  output: { // 打包出口
  file: 'dist/index.js', // 最终打包出来的文件路径和文件名
    format: 'umd', // umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
    name: 'Drag' // 必须，不然报标题的错
  },
  watch: {
    include: ['src/*.js', 'index.js','styles/**'],
    exclude: 'node_modules/**',
    failAfterWarnings: true,
    clearScreen:false,
    buildDelay:300
  },
  plugins: [ // 打包插件
    nodeResolve({
      extensions: ['.js', '.ts']
    }), // 查找和打包node_modules中的第三方模块
    commonjs(),
    // 将 CommonJS 转换成 ES2015 模块供 Rollup 处理
    // typescript({
    //     tsconfig: './tsconfig.json'
    // }), // 解析TypeScript
    postcss(),
    del({
        targets: ['lib/**/*'] // 打包前删除之前的 bundle
    }),
    babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true       // 使plugin-transform-runtime生效
    })
  ]
}