import coreWebVitals from 'eslint-config-next/core-web-vitals'
import prettier from 'eslint-config-prettier/flat'

const config = [
  { ignores: ['.next/**', 'out/**'] },
  ...coreWebVitals,
  prettier,
]

export default config
