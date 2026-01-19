# Workflow App - Routine Control

Aplicação de controle de rotinas desenvolvida com React, TypeScript, Vite e Supabase.

## 🚀 Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Zustand (gerenciamento de estado)
- React Router DOM
- Radix UI (componentes)
- Recharts (gráficos)

## 📋 Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Conta no Supabase (para banco de dados)

## ⚙️ Configuração

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/workflow-master.git
cd workflow-master
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

4. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

## 🌐 Deploy no GitHub Pages

### Configuração Inicial

1. **Configure o GitHub Pages no repositório:**
   - Vá em Settings → Pages
   - Em "Source", selecione "GitHub Actions"

2. **Adicione as variáveis de ambiente como secrets:**
   - Vá em Settings → Secrets and variables → Actions
   - Adicione os seguintes secrets:
     - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
     - `VITE_SUPABASE_ANON_KEY`: Chave pública (anon key) do Supabase

3. **Atualize a propriedade `base` no `vite.config.ts`:**
   - Substitua `/workflow-master/` pelo nome do seu repositório

### Deploy Automático

O deploy é automático via GitHub Actions sempre que você fizer push na branch `main`.

### Deploy Manual

Para fazer deploy manualmente:

```bash
npm run deploy
```

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria o build de produção
- `npm run preview` - Visualiza o build de produção localmente
- `npm run lint` - Executa o ESLint
- `npm run deploy` - Faz deploy manual para GitHub Pages

## 📁 Estrutura do Projeto

```
src/
├── assets/          # Arquivos estáticos
├── components/      # Componentes reutilizáveis
│   ├── ui/         # Componentes de UI base
│   └── Calendar/   # Componentes do calendário
├── contexts/        # Contextos React
├── layouts/         # Layouts da aplicação
├── lib/            # Utilitários e configurações
├── pages/          # Páginas da aplicação
└── store/          # Gerenciamento de estado (Zustand)
```

## 🔧 Desenvolvimento

### Arquitetura

- **Componentes UI**: Utilizando Radix UI com Tailwind CSS
- **Estado Global**: Gerenciado com Zustand
- **Roteamento**: React Router DOM
- **Banco de Dados**: Supabase para autenticação e persistência

### Boas Práticas

- TypeScript strict mode habilitado
- ESLint configurado para React e TypeScript
- Componentes organizados por funcionalidade
- Separação clara entre UI, lógica e estado

## 📄 Licença

Este projeto é privado e de uso restrito.

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
