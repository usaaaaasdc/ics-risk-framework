import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypeScript from 'eslint-config-next/typescript'

const config = [
  { ignores: ['playwright-report/**', 'test-results/**'] },
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      'react/no-unescaped-entities': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]

export default config
