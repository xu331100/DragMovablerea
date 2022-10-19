
import config from './rollup.config.js'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

config.cache = true
config.plugins.push(
    serve({
        open: true,
        openPage: '/dist/index.html',
    }),
   
    livereload('dist')
)

export default config