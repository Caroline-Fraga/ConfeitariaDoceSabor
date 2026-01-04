const URL_BASE_PRODUTOS = "https://6762c6fb17ec5852cae70da5.mockapi.io/produtos";

// Recupera todos os produtos
const listarProdutos = async () => {
    try {
        const resposta = await fetch(URL_BASE_PRODUTOS);
        const dado = await resposta.json();
        return dado;
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        throw error;
    }
}

// Cria um novo produto
const criarProduto = async (nome, preco, imagem) => {
    try {
        const resposta = await fetch(URL_BASE_PRODUTOS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome, preco, imagem }),
        });
        const dado = await resposta.json();
        return dado;
    } catch (error) {
        console.error("Erro ao criar produto:", error);
        throw error;
    }
};

const deletarProduto = async (id) => {
    try {
        const resposta = await fetch(`${URL_BASE_PRODUTOS}/${id}`, {
            method: "DELETE",
        });

        if (!resposta.ok) {
            throw new Error("Erro ao deletar produto");
        }
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        throw error;
    }
};

export const servicoProdutos = {
    listarProdutos,
    criarProduto,
    deletarProduto,
};

