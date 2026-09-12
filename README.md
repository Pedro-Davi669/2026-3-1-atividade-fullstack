# 2026.3.1 - POS - Frondend web e Backend api restfull

## Informações gerais

- **Público alvo**: alunos da disciplina de **Programação orientada a serviços** do curso de [Infoweb](https://diatinf.ifrn.edu.br/cursos/tecnico-em-informatica-para-internet/) na [DIATINF](https://diatinf.ifrn.edu.br/) no [CNAT-IFRN](https://portal.ifrn.edu.br/campus/natalcentral/)
- **Professor**: [L A Minora](https://github.com/leonardo-minora/)
- **Objetivo**:
  1. Atividade avaliativa para construção de aplicativo com frontend web e backend api restfull

[A descrição da atividade](atividade.md)

---
## Relato da atividade

**Aluno:** Pedro Davi de Lima Fernandes  
- **GitHub:** [Pedro-Davi669](https://github.com/Pedro-Davi669)  

---

### Componentes e tecnologias

```bash
# frontend WEB
npx create-next-app@latest web

cd web

pnpm dlx shadcn@latest init

pnpm install axios

pnpm install -D @types/axios

pnpm install react-hook-form zod @hookform/resolvers

# backend API
cd ..

npx @nestjs/cli new api

cd api

# pnpm install @prisma/client class-validator class-transformer
# pnpm install -D prisma
pnpm install drizzle-orm better-sqlite3
pnpm install -D drizzle-kit @types/better-sqlite3 dotenv

pnpm install @nestjs/passport passport passport-jwt @nestjs/jwt bcrypt
pnpm install -D @types/passport-jwt @types/bcrypt
```

#### Arquitetura e Bibliotecas do Projeto:
- **Frontend (`/web`)**:
  - React 19 com TypeScript e Vite
  - React Router DOM para navegação entre páginas
  - Layout Mobile-First inspirado no X (Twitter) e paleta visual DIATINF (#CE701B, #F1881D, #FDC616, #F9EBC2, #A4BCCC, #0C3453)
- **Backend API (`/api`)**:
  - Node.js (v22 LTS) com Express e TypeScript
  - Prisma ORM 7 com adapter SQLite (`better-sqlite3`)
  - Autenticação com JWT (`jsonwebtoken`) e hash seguro com `bcryptjs`
  - Validação de esquemas com `zod` e CORS habilitado

---

### Agente de IA

O desenvolvimento e a configuração do projeto contaram com o auxílio do agente de IA (Antigravity / Gemini) atuando como **AI Pair Programmer**:
- **Diagnóstico e compatibilidade de ambiente:** identificação da exigência do Node.js v20.19+/22+ para o Prisma 7, instalação e configuração do `fnm` (Fast Node Manager) com Node v22 LTS no ambiente Windows.
- **Configuração de banco e dependências:** auxílio na compilação dos binários nativos do `better-sqlite3`, execução de migrations do Prisma e povoamento da base (`seed.ts`) com usuários, postagens, comentários encadeados e avaliações.
- **Validação fullstack:** verificação dos endpoints da API RESTful e garantia de comunicação correta entre o frontend web e a API.
- **Prototipagem de UI/UX:** utilização do Google Stitch para concepção, definição e refinamento do protótipo visual, identidade e paleta de cores acadêmica do DIATINF X.

---

### Execução do projeto

#### 1. Pré-requisitos
- Node.js versão **20.19+** ou **22 LTS** (recomendado)
- Gerenciador de pacotes `npm` ou `pnpm`

#### 2. Configuração e execução da API (Backend)
```bash
cd api

# Configurar variáveis de ambiente
cp .env.example .env

# Instalar dependências
npm install

# Rodar migrations e gerar cliente Prisma
npm run prisma:migrate

# Popular o banco com dados iniciais (seed)
npm run seed

# Iniciar servidor de desenvolvimento (Porta 3333)
npm run dev
```

#### 3. Configuração e execução da Web (Frontend)
Em outro terminal:
```bash
cd web

# Configurar variáveis de ambiente
cp .env.example .env

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (Porta 5173)
npm run dev
```

#### 4. Credenciais de Teste (Seed)
- **Usuários cadastrados:** `joaosouza`, `mariasilva`, `pedrolima`, `carloscosta`, `anacosta`, etc.
- **Senha padrão para todos:** `diatinf123`

#### 5. Vídeo de demonstração
- [Vídeo de demonstração do projeto em execução](

https://github.com/user-attachments/assets/28731e65-263d-477b-b0ef-13cc5fe59e73

)
