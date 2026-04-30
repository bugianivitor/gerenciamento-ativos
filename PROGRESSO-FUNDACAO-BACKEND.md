# Progresso — fundação do back-end (registro)

Arquivo de **registro do que já foi documentado** nesta etapa (inclui esboço reconstituído pelo assistente, progresso técnico e changelog). Para a **documentação principal do produto**, use o `README.md` após colar o backup completo que você guardou (ex.: Gemini).

---

## Esboço do projeto

Esta seção consolida a **documentação de esboço** do produto. O texto foi **reconstituído** a partir da descrição atual do `package.json`, do nome do repositório e do código em `server.js` — o README anterior não pôde ser recuperado automaticamente (sem histórico Git no projeto). Se você tiver trechos do documento original, podemos fundi-los aqui.

### Visão geral

- Foco em **cadastro e acompanhamento de ativos de TI**, com dados centralizados em banco relacional.
- **Stack inicial** alinhada ao que a equipe já domina, com **caminho claro para evoluir** (por exemplo **React** no front-end quando for incorporada a interface).

### Arquitetura planejada (back-end)

| Camada / peça | Tecnologia |
| --------------- | ---------- |
| Runtime e módulos | Node.js com **ES Modules** (`"type": "module"`) |
| HTTP / API | **Express** (JSON, rotas REST) |
| Banco de dados | **PostgreSQL** |
| Acesso ao banco | **`pg`** (pool de conexões) |
| Configuração | **`dotenv`** (variáveis em `.env`, sem commit de segredos) |

### Domínio de dados (primeira versão)

- Banco: **`ativos_ti`**.
- Tabela inicial: **`equipamentos`** — colunas `id` (SERIAL), `modelo`, `descricao`, `patrimonio`, `status`, `observacoes`.

### O que já existe no repositório

- **`server.js`**: Express na porta `3000`, `express.json()`, rota `GET /`, **Pool** do `pg` com variáveis `DB_*`, função assíncrona de teste com `SELECT NOW()` e tratamento de erro.
- **`package.json`**: dependências `express`, `pg`, `dotenv`.
- **`.env`**: credenciais e parâmetros do PostgreSQL (manter fora do versionamento em ambientes reais).

### Próximos passos sugeridos (esboço)

- Rotas REST para CRUD de `equipamentos` e, se necessário, camadas de serviço/repositório.
- Scripts `npm start` / `dev` (ex.: nodemon) para desenvolvimento.
- Front-end consumindo a API (ex.: React), quando for o momento do projeto.

### Como rodar localmente

1. Copiar/ajustar **`.env`** com `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
2. Criar o banco e a tabela no PostgreSQL (ex.: DBeaver), conforme o domínio acima.
3. `npm install` e `node server.js` — servidor em `http://localhost:3000` e log da conexão com o banco no console.

---

## Progresso da fundação do back-end

Registro do que já foi construído na base do back-end (integração, ambiente e banco).

### Inicialização do projeto

- Projeto Node.js criado e configurado para **ES Modules** (`"type": "module"` no `package.json`), permitindo sintaxe moderna de JavaScript.

### Dependências instaladas

- **express** — roteamento da API REST.
- **pg** — driver de conexão com o PostgreSQL.
- **dotenv** — variáveis de ambiente sem expor credenciais no código.

### Segurança e ambiente

- Arquivo **`.env`** utilizado (e versionado fora do repositório quando aplicável), isolando credenciais do banco: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.

### Infraestrutura de banco de dados

- Banco **ativos_ti** no PostgreSQL (criação via DBeaver).
- Schema inicial com a tabela **equipamentos**: `id` (SERIAL), `modelo`, `descricao`, `patrimonio`, `status`, `observacoes`.

### Conexão assíncrona

- Ponto de entrada **`server.js`** configurado com **Pool** do `pg`, uso de **async/await** e tratamento de erros com **try/catch**.

### Testes validados

- Integração **Node.js ↔ PostgreSQL** validada com **`SELECT NOW()`** executado pela aplicação.
- Persistência verificada com **INSERT manual** na tabela `equipamentos` pelo DBeaver.

---

## Changelog (deste registro)

| Data       | Descrição |
| ---------- | ----------- |
| 2026-04-30 | Documentação da fundação: ES Modules, Express, pg, dotenv, `.env`, banco `ativos_ti`, tabela `equipamentos`, pool assíncrono e testes (SELECT / INSERT). |
| 2026-04-30 | Readme: reintroduzida a seção **Esboço do projeto** (reconstituída a partir do `package.json`, do código e do domínio acordado); mantidas **Progresso** e **Changelog**. |
