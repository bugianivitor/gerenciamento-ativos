# Progresso — Interface do Usuário (Front-end)

Registro da evolução da interface cliente para o sistema de Gestão de Ativos TI.

## Visão Geral
- Interface **Single Page Application (SPA)** simples usando HTML5, CSS3 e JavaScript Moderno (Vanilla JS).
- Consumo de API REST de forma assíncrona com `fetch`.

## Tecnologias e Técnicas
- **Layout**: Flexbox para o formulário e design responsivo.
- **Estilização**: 
    - Tabela Zebra para facilitar a leitura.
    - Efeito `:hover` nas linhas para feedback visual.
    - Hierarquia visual com o uso de um `container` centralizado.
- **Interatividade**: Manipulação de DOM para atualização da tabela sem recarregar a página.

## Funcionalidades Implementadas
- **Listagem Dinâmica**: Busca dados da API e renderiza as linhas da tabela automaticamente.
- **Formulário Híbrido**: O mesmo formulário detecta se deve Criar ou Editar com base em um campo `hidden` (ID).
- **Feedback de Usuário**:
    - Mensagem de "Nenhum equipamento encontrado" com `colspan`.
    - Confirmação (`confirm`) antes de exclusões.
    - Alertas de sucesso ao salvar/deletar.

## Componentes Visuais (CSS)
- **Container**: Bloco centralizado com sombra suave (`box-shadow`).
- **Status Select**: Uso de `<select>` para padronizar os estados (Ativo, Manutenção, Em uso).
- **Ações**: Botões coloridos e distintos para Editar (Amarelo) e Excluir (Vermelho).

---

## Changelog
| Data       | Descrição |
| ---------- | ----------- |
| 2026-05-04 | Criação da interface: HTML5/CSS3, integração com API via Fetch, implementação visual do CRUD (Listar, Criar, Editar, Deletar). |