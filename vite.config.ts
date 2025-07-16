import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // 可以添加更多别名
      '@components': path.resolve(__dirname, './src/components'),
      '@api': path.resolve(__dirname, './src/api'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@reducers': path.resolve(__dirname, './src/reducers'),
      '@views': path.resolve(__dirname, './src/views'),
    }
  },
  plugins: [
    react(),
    AutoImport({
      imports: [
        'react', // 自动导入 React 的 hooks（如 useState）
        {
          'antd': [
            'Button','Input','Table','Select', 'Layout', 'Menu', 'Input', 'Pagination', 'Tag',
            'Space', 'message', 'Modal', 'Form'
          ],
          '@tanstack/react-query': ['useQuery', 'useMutation', 'QueryClient', 'useQueryClient'],
          '@ant-design/icons': ['SmileOutlined', 'SearchOutlined', 'MailOutlined'],
          'use-immer': ['useImmer', 'useImmerReducer'],
          'react-router-dom': ['useLoaderData']
        },
      ],
      dts: 'src/auto-imports.d.ts', // 生成类型声明文件
    }),
    /* 
      // ant-design的v4版本需要同时引入对应的样式文件
      vitePluginImp({
      libList: [
        {
          libName: 'antd',
          style: (name) => `antd/lib/${name}/style/index.less`, // v4 Less 路径
        },
      ],
    }), */
  ],
  /* css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // v4版本必须开启
        modifyVars: { '@primary-color': '#ff4d4f' },
      },
    },
  }, */
});