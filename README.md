# Plataforma de gerenciamento de equipamentos (ativos de TI)

Documentação de esboço do projeto. Stack inicial alinhada ao que você já domina, com caminho claro para evoluir (por exemplo com React).

---

## 1. Visão geral

**Problema hoje:** solicitações de equipamentos pelo Jira, controle em planilhas, termos e assinatura digital manualmente coordenados.

**Objetivo:** manter o **Jira como canal de solicitação**, mas centralizar **cadastro de equipamentos**, **vínculo equipamento ↔ colaborador**, **visão de estoque/disponibilidade** e **ciclo de termos** (geração, assinatura via **D4Sign**, anexo no chamado), com **APIs** que o Jira (ou automações) possam consumir e alimentar.

**Princípio de arquitetura:** backend **Node** expondo **API REST** + **CRUD**; frontend estático com **HTML, CSS e JavaScript** (páginas ou SPA leve sem framework no início). Contratos JSON estáveis desde o MVP para que um front **React** possa substituir ou conviver depois, sem reescrever a API.

---

## 2. Stack e evolução

| Camada | Início (seu conhecimento) | Evolução sugerida |
|--------|---------------------------|-------------------|
| Frontend | HTML, CSS, JS (fetch para REST) | React consumindo as mesmas rotas |
| Backend | Node.js (Express ou similar) | Mesma base; mais rotas, filas, etc. |
| Dados | Banco relacional (recomendado: PostgreSQL ou SQLite no MVP) via driver ou query simples | Migrações, ORM opcional mais tarde |
| Integrações | REST cliente (`fetch`) do Node para Jira e D4Sign | Webhooks, filas, retries |

**Importante:** desde o MVP, padronize **URLs**, **códigos HTTP** e **formato JSON** dos recursos; o React será só outro cliente da mesma API.

---

## 3. Atores e sistemas

| Ator / sistema | Papel |
|----------------|--------|
| Colaborador / RH / Suporte | Abre chamado no **Jira** (continua assim). |
| Jira | Origem da solicitação; destino de anexos e comentários com link do termo. |
| **Sua plataforma** | Fonte da verdade de equipamentos, colaboradores (espelho do necessário), movimentações, termos. |
| **D4Sign** | Assinatura digital do termo de recebimento/devolução. |
| Automação (opcional) | Script no Jira Automation, n8n, ou middleware que chama **sua API** em eventos do chamado. |

---

## 4. Fluxos principais (conceituais)

### 4.1 Consulta e sugestão no chamado (Jira → sua API)

1. Automação ou app lê o chamado (área, tipo de vaga, etc.).
2. Chama `GET` na sua API (ex.: equipamentos disponíveis, kits por perfil).
3. Exibe no comentário ou painel sugestões de modelo/descrição e quantidade sugerida.

*Detalhe de implementação pode ser fase 2; no MVP a API já pode listar estoque e filtros básicos.*

### 4.2 Dados do novo colaborador (Jira → sua API)

1. Evento no Jira (transição, campo preenchido, formulário).
2. **POST** para sua API com payload acordado (nome, CPF, e-mail, área, CNPJ da razão social, endereço, telefone, etc.).
3. Backend valida, persiste ou atualiza **cadastro de colaboradores** (evitar duplicidade por CPF/e-mail/chave Jira).

### 4.3 Termo + D4Sign + retorno ao Jira

1. Na plataforma (ou via API disparada pela automação): gerar PDF do termo (template + dados colaborador + equipamento).
2. Enviar documento à API do **D4Sign**; guardar IDs do envelope/documento.
3. Após webhook ou polling: status “assinado”.
4. Baixar PDF assinado e **anexar ao chamado Jira** via API do Jira (issue attachments ou link em comentário estruturado).

---

## 5. Módulos da plataforma web

1. **Equipamentos:** CRUD; campos como tipo, modelo, descrição, número de patrimônio, status (disponível, alocado, manutenção, baixado).
2. **Colaboradores:** dados cadastrais e contratuais que você listou (área, CNPJ, CPF, razão social, nome, endereço, telefone, vínculo com unidade legal se necessário).
3. **Alocações / movimentações:** qual equipamento está com quem; datas de **entrrega (saída do estoque)** e **devolução (entrada)**; histórico.
4. **Chamados (referência Jira):** armazenar `issueKey` ou ID para correlacionar termos e movimentações.
5. **Termos:** registro de cada termo (versão, PDF gerado, IDs D4Sign, status, data).
6. **Dashboards simples:** contagens — disponíveis, alocados, em trâmite de assinatura; alertas de “abaixo do mínimo” por categoria (opcional, fase 2).

---

## 6. Modelo de dados (esboço de entidades)

Relações simplificadas (ajuste nomes ao seu banco):

- **Colaborador** — id, dados pessoais/empresa, `jira_account_id` ou referência externa opcional.
- **Equipamento** — id, modelo, descrição, patrimônio, status, observações.
- **Movimentacao** — id, `equipamento_id`, `colaborador_id`, `data_saida`, `data_devolucao` (nullable), tipo (entrega/devolução), `jira_issue_key` opcional.
- **Termo** — id, `movimentacao_id` ou `colaborador_id`, arquivo PDF (path ou blob), `d4sign_document_id`, status, `jira_issue_key`.

Isso sustenta “quem está com o quê” e o histórico para auditoria.

---

## 7. API REST (rascunho de recursos)

Prefixo exemplo: `/api/v1/...`

| Método | Recurso | Uso |
|--------|---------|-----|
| GET | `/equipamentos` | Lista; filtros `?status=disponivel` |
| GET | `/equipamentos/:id` | Detalhe |
| POST/PUT/DELETE | `/equipamentos` | CRUD |
| GET | `/colaboradores` | Lista / busca |
| POST | `/colaboradores` | Upsert a partir do Jira |
| GET | `/colaboradores/:id` | Detalhe |
| GET | `/movimentacoes` | Histórico; filtros por colaborador ou equipamento |
| POST | `/movimentacoes` | Registrar entrega (amarrar equipamento + colaborador) |
| POST | `/termos` | Iniciar fluxo (gerar PDF + chamar D4Sign) |
| GET | `/termos/:id/status` | Consulta status assinatura |
| GET | `/dashboard/resumo` | Números agregados (opcional) |

**Integração Jira (lado servidor Node):** rotas internas ou serviço separado que use credenciais guardadas em variáveis de ambiente (nunca no front).

---

## 8. Fases de entrega (para não travar no “projeto gigante”)

| Fase | Escopo |
|------|--------|
| **MVP** | CRUD equipamentos + colaboradores (sem Jira); front HTML/CSS/JS; SQLite ou Postgres local. |
| **MVP+** | Movimentações + dashboard simples de contagem. |
| **Integração 1** | `POST /colaboradores` e `GET /equipamentos` documentados para automação Jira (mock do payload no README). |
| **Integração 2** | Geração de PDF do termo + API D4Sign + gravação de status. |
| **Integração 3** | Anexar PDF assinado ao issue Jira + webhooks D4Sign. |

---

## 9. Segurança, LGPD e operação

- **CPF e dados sensíveis:** acesso autenticado (sessão ou JWT no futuro); HTTPS em produção; minimizar dados no Jira (só o necessário no comentário).
- **Credenciais:** `.env` para Jira, D4Sign, string do banco; nunca commitar segredos.
- **Logs:** registrar quem alterou alocação e termos (auditoria).

---

## 10. Glossário rápido

| Termo | Significado aqui |
|--------|-------------------|
| Ativo / equipamento | Item físico de TI sujeito a termo. |
| Movimentação | Registro de entrega ou devolução com datas. |
| Web service | Neste doc: **API REST** JSON servida pelo Node. |

---

## 11. Próximos passos sugeridos (documentação viva)

1. Desenhar **um diagrama** (papel ou Mermaid) Jira ↔ API ↔ Banco ↔ D4Sign.
2. Congelar o **JSON de exemplo** do `POST /colaboradores` que o Jira enviará.
3. Escolher **banco** (SQLite para começar em um único arquivo facilita).
4. Quando for para React: extrair o JS de `fetch` para **módulos** ou **services** que os componentes apenas chamam.

---

*Esboço inicial — ajuste nomes de rotas e entidades conforme for implementando. Se quiser, na próxima iteração podemos derivar deste README um `openapi.yaml` rascunho ou tarefas no estilo checklist por fase.*
