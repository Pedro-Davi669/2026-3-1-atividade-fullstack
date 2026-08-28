# 2026.3.1 - POS - Frondend web e Backend api restfull

## Informações gerais

- **Público alvo**: alunos da disciplina de **Programação orientada a serviços** do curso de [Infoweb](https://diatinf.ifrn.edu.br/cursos/tecnico-em-informatica-para-internet/) na [DIATINF](https://diatinf.ifrn.edu.br/) no [CNAT-IFRN](https://portal.ifrn.edu.br/campus/natalcentral/)
- **Professor**: [L A Minora](https://github.com/leonardo-minora/)
- **Objetivo**:
  1. Atividade avaliativa para construção de aplicativo com frontend web e backend api restfull

[A descrição da atividade](atividade.md)

---
## Relato da atividade
Leonardo Ataide Minora [![](assets/linkedin.png)](https://www.linkedin.com/in/leominora) [![](assets/github.png)](https://github.com/leonardo-minora/)



### Componentes e tecnologias

Utilizarei o aplicativo `pnpm` para gerência de pacotes dos projetos.

O frontend será construído com React usando o framework Next, com tailwind como alternativa ao CSS, componentes UI com shadcnui, hookforms para estado formulários, zod para validação de campos, e para conexão com o backend o axios.

FIXME definição do projeto
drizzle ORM porque quero testar
passport, bcrypt, e jwt para autenticação com login, senha e token
sqlite para iniciar sem complicações


### Agente de IA

Qual e como utilizou a IA?

Estou usando como método o _vibe coding_.

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

### Execução do projeto

como executar o projeto?
vídeo do projeto em execução

---
