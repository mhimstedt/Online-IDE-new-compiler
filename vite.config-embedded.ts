import type { UserConfig } from 'vite'
import commonConfig from './vite.config-common'


export default {
    ...commonConfig,
    build: {
        ...commonConfig.build,
        rollupOptions: {
            input: {
                embedded: './embedded.html',
            },
            //   output: {
            //     entryFileNames: assetInfo => 'online-ide-embedded.js',
            //     assetFileNames: assetInfo => assetInfo.name.endsWith('css') ? 'online-ide-embedded.css' : 'assets/[name]-[hash][extname]',
            //     manualChunks: {}
            //   }
        },
        outDir: './dist-embedded'
    }
} satisfies UserConfig
