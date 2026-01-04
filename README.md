# 🍰 Confeitaria Doce Sabor

Projeto simples de interface para listar, adicionar e excluir produtos de uma confeitaria.

[![Deploy - GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?logo=github&style=flat-square)](https://caroline-fraga.github.io/ConfeitariaDoceSabor/)

## 📝 Descrição

Aplicação front-end estática (HTML/CSS/JS) que consome uma API REST simples para gerenciar produtos. Os dados de exemplo ficam em `database/db.json` e a API de desenvolvimento pode ser iniciada com `json-server` (script já presente em `package.json`).

## ✨ Funcionalidades

- 🧾 Listar produtos (imagem, nome e preço)
- ➕ Adicionar novo produto via formulário (nome, preço, imagem)
- 🗑️ Deletar produto
- ✅ Validação simples de preço no cliente e mensagens de erro amigáveis

## 🛠 Tecnologias usadas

- HTML5
- CSS3 (variáveis CSS, media queries)
- JavaScript (módulos ES6)
- json-server (para mock da API)

## ▶️ Como rodar o projeto

1. Instalar dependências (usa `json-server` via `package.json`):

```powershell
npm install
```

2. Iniciar a API de desenvolvimento (serve `database/db.json` em `http://localhost:3000`):

```powershell
npm start
```

3. Abrir a interface:

- Você pode abrir `index.html` diretamente no navegador, ou usar um servidor estático (recomendado para evitar limitações de módulos/imports). Exemplo com `Live Server` no VS Code ou `npx http-server`:

```powershell
npx http-server . -o
```

4. Testar fluxos: listar, adicionar (formulário) e deletar produtos. Verifique a aba "Console" e "Network" do navegador para diagnóstico.

## 📁 Estrutura de pastas

- `index.html` — página principal
- `style.css` — estilos
- `js/`
  - `controladores/` — lógica de UI (manipulação do DOM)
  - `servicos/` — chamadas à API (fetch)
- `imagens/` — imagens usadas pela interface
- `database/db.json` — dados de exemplo para `json-server`
- `package.json` — script `start` para iniciar o `json-server`

## 🔮 Possíveis melhorias futuras

- 🔐 Tratar entradas do usuário no servidor (server-side validation)
- 📦 Paginação / carregamento incremental para muitos produtos
- 🖼️ Upload de imagens em vez de exigir URL
- 💬 Melhorar mensagens de erro e estados de carregamento (spinners)
- 🧪 Testes automatizados (unitários para funções utilitárias e testes de integração simples)
- 📦 Fazer build/estrutura para deploy (ex.: empacotar, minificar, CI)
- 📚 Documentar convenções de nomes e estilo (guia de contribuição)
- ⚠️ Verificar comportamento em pastas sincronizadas (OneDrive) e documentar requisitos de permissão no Windows

---


