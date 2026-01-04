import { servicoProdutos } from "../servicos/produto-servicos.js";

// Seletores principais
const listaProdutosEl = document.querySelector("[data-lista-produtos]");
const formAdicionarEl = document.querySelector("[data-form-adicionar]");
const inputPrecoEl = document.querySelector('[data-input-preco]');

// Formatação e validação de preço (reutilizável)
function formatarPrecoParaExibicao(precoRaw) {
    if (!precoRaw) return precoRaw;
    const texto = String(precoRaw).trim();
    const match = texto.match(/[0-9]+[.,]?[0-9]*/);
    if (!match) return texto;
    let numStr = match[0].replace(',', '.');
    const num = parseFloat(numStr);
    if (isNaN(num)) return texto;
    const resto = texto.slice(match.index + match[0].length).trim();
    const formatted = num.toFixed(2).replace('.', ',');
    return resto ? `${formatted} ${resto}` : formatted;
}

function ehPrecoValido(precoRaw) {
    if (!precoRaw) return false;
    const texto = String(precoRaw).trim();
    const match = texto.match(/[0-9]+[.,]?[0-9]*/);
    if (!match) return false;
    const num = parseFloat(match[0].replace(',', '.'));
    return !isNaN(num) && num >= 0;
}

/**
 * Cria o elemento DOM de um cartão de produto.
 * Responsabilidade única: construir o HTML do cartão.
 */
// Escapa conteúdo para evitar XSS quando injetamos no DOM
function escaparHtml(valor = "") {
    return String(valor)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function criarCartaoProduto({ nome, preco, imagem, id }) {
    const cartao = document.createElement("div");
    cartao.classList.add("cartao");
    const nomeEscapado = escaparHtml(nome);
    const precoEscapado = escaparHtml(preco);
    const imagemEscapada = escaparHtml(imagem);

    cartao.innerHTML = `
        <img src="${imagemEscapada}" alt="${nomeEscapado}" loading="lazy">
        <div class="cartao__info">
            <div class="cartao__nome">
                <p>${nomeEscapado}</p>
            </div>
            <div class="cartao__valor">
                <p class="cartao__preco">R$ ${precoEscapado}</p>
                <button class="cartao__botao-deletar" data-id-produto="${id}" aria-label="Deletar ${nomeEscapado}">
                    <img src="./imagens/lixeira.png" alt="Deletar produto">
                </button>
            </div>
        </div>
    `;
    return cartao;
}

// Renderiza a lista de produtos vindos do serviço (normaliza preços)
const carregarProdutos = async () => {
    try {
        const lista = await servicoProdutos.listarProdutos();
        lista.forEach((produto) => {
            // normaliza o preço para exibição
            const precoFormatado = formatarPrecoParaExibicao(produto.preco);
            const produtoParaRender = { ...produto, preco: precoFormatado };
            const produtoCartao = criarCartaoProduto(produtoParaRender);
            listaProdutosEl.appendChild(produtoCartao);
        });
    } catch (error) {
        console.error("Erro ao renderizar produtos:", error);
    }
};

// Envio do formulário: cria um novo produto
formAdicionarEl.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nome = document.querySelector("[data-input-nome]").value.trim();
    const preco = document.querySelector("[data-input-preco]").value.trim();
    const imagem = document.querySelector("[data-input-imagem]").value.trim();

    const precoFormatado = formatarPrecoParaExibicao(preco);

    // validação final antes de enviar
    if (!ehPrecoValido(preco)) {
        // mostra mensagem amigável próxima ao formulário
        const erroFormulario = document.getElementById('mensagem-erro-formulario');
        if (erroFormulario) {
            erroFormulario.textContent = 'Por favor corrija o preço antes de enviar. Use formato 10,50 ou 10.50.';
            erroFormulario.classList.remove('visually-hidden');
        } else {
            alert('Preço inválido. Use formato numérico como 10,50 ou 10.50');
        }
        return;
    }

    try {
        const novoProduto = await servicoProdutos.criarProduto(nome, precoFormatado, imagem);
        const novoCartao = criarCartaoProduto(novoProduto);
        listaProdutosEl.appendChild(novoCartao);
        // ocultar mensagem de erro do formulário após sucesso
        const erroFormulario = document.getElementById('mensagem-erro-formulario');
        if (erroFormulario) {
            erroFormulario.textContent = '';
            erroFormulario.classList.add('visually-hidden');
        }
    } catch (error) {
        console.error("Erro ao criar produto:", error);
    }
    formAdicionarEl.reset();
});

// Validação em tempo real do input de preço
if (inputPrecoEl) {
    // criar elemento de erro ao lado do input, se ainda não existir
    let erroEl = document.getElementById('erro-preco');
    if (!erroEl) {
        erroEl = document.createElement('div');
        erroEl.id = 'erro-preco';
        erroEl.className = 'mensagem-erro-input visually-hidden';
        erroEl.setAttribute('aria-live', 'polite');
        inputPrecoEl.insertAdjacentElement('afterend', erroEl);
    }

    const validarVisual = () => {
        const valor = inputPrecoEl.value;
        const valido = ehPrecoValido(valor);
        if (!valido && valor.trim() !== '') {
            inputPrecoEl.classList.add('input-erro');
            inputPrecoEl.setAttribute('aria-invalid', 'true');
            inputPrecoEl.setAttribute('aria-describedby', 'erro-preco');
            erroEl.textContent = 'Preço inválido. Ex.: 10,50 ou 10.50';
            erroEl.classList.remove('visually-hidden');
        } else {
            inputPrecoEl.classList.remove('input-erro');
            inputPrecoEl.removeAttribute('aria-invalid');
            inputPrecoEl.removeAttribute('aria-describedby');
            erroEl.textContent = '';
            erroEl.classList.add('visually-hidden');
        }
    };

    inputPrecoEl.addEventListener('input', validarVisual);
    inputPrecoEl.addEventListener('blur', validarVisual);
}

// Delegação de evento para deletar produto
listaProdutosEl.addEventListener("click", async (event) => {
    const botaoDeletarEl = event.target.closest(".cartao__botao-deletar");
    if (botaoDeletarEl) {
        const idProduto = botaoDeletarEl.dataset.idProduto;
        try {
            await servicoProdutos.deletarProduto(idProduto);
            const cartao = botaoDeletarEl.closest(".cartao");
            cartao.remove();
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
        }
    }
});

// Inicialização
carregarProdutos();
