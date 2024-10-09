/**
 * @fileoverview Este arquivo contém funções para carregar e exibir dados do perfil de uma comunidade.
 * @author Fabio
 * @version 1.5.0
 */

/**
 * Carrega os dados da comunidade e preenche os elementos HTML correspondentes.
 * @function
 * @async
 */
async function carregarDadosComunidade() {
    try {
        // Carrega o arquivo JSON com os dados das comunidades
        const response = await fetch('/src/data/comunidades.json');
        const comunidades = await response.json();

        // Obtém o ID da comunidade da URL (por exemplo, ?id=comunidade-x)
        const urlParams = new URLSearchParams(window.location.search);
        const comunidadeId = urlParams.get('id');

        // Verifica se o ID da comunidade existe no JSON
        if (!comunidades[comunidadeId]) {
            throw new Error('Comunidade não encontrada');
        }

        const comunidade = comunidades[comunidadeId];

        // Preenche os elementos HTML com os dados da comunidade
        document.getElementById('comunidade-imagem').src = comunidade.imagem;
        document.getElementById('comunidade-nome').textContent = comunidade.nome;
        document.getElementById('comunidade-localizacao').textContent = comunidade.localizacao;

        // Atualiza as informações de doadores e doações com fonte ainda menor
        const infoDoadoresElement = document.createElement('p');
        infoDoadoresElement.classList.add('text-muted', 'mb-0');
        infoDoadoresElement.innerHTML = `
            <span style="font-size: 0.65rem;">
                <i class="fas fa-user me-2 text-primary"></i>${comunidade.numDoadores} Doadores
                <i class="fas fa-gift ms-3 me-2 text-primary"></i>${comunidade.numDoacoes} Doações
            </span>
        `;
        document.querySelector('.d-flex.align-items-center.mb-4').innerHTML = '';
        document.querySelector('.d-flex.align-items-center.mb-4').appendChild(infoDoadoresElement);

        // Carrega as conquistas
        carregarConquistas(comunidade.conquistas);

        // Carrega as atividades
        carregarAtividades(comunidade.atividades, comunidade);

        console.log('Dados da comunidade carregados:', comunidade);
    } catch (error) {
        console.error('Erro ao carregar dados da comunidade:', error);
        // Exibe uma mensagem de erro para o usuário
        alert('Ocorreu um erro ao carregar os dados da comunidade. Por favor, tente novamente mais tarde.');
    }
}

/**
 * Carrega e exibe as conquistas da comunidade.
 * @function
 * @param {Array} conquistas - Array de objetos representando as conquistas da comunidade.
 */
function carregarConquistas(conquistas) {
    const conquistasContainer = document.getElementById('conquistas-container');
    conquistasContainer.innerHTML = '';

    conquistas.forEach(conquista => {
        const conquistaElement = document.createElement('div');
        conquistaElement.classList.add('mb-2');
        conquistaElement.innerHTML = `
            <i class="fas fa-trophy text-primary me-2"></i>
            <span class="text-muted" style="font-size: 0.65rem;">${conquista.titulo}: ${conquista.descricao}</span>
        `;
        conquistasContainer.appendChild(conquistaElement);
    });
}

/**
 * Carrega e exibe as atividades da comunidade.
 * @function
 * @param {Array} atividades - Array de objetos representando as atividades da comunidade.
 * @param {Object} comunidade - Objeto contendo os dados da comunidade
 */
function carregarAtividades(atividades, comunidade) {
    const atividadesContainer = document.getElementById('atividades-container');
    atividadesContainer.innerHTML = '';

    atividades.forEach(atividade => {
        const atividadeElement = document.createElement('div');
        atividadeElement.classList.add('card', 'mb-3');
        atividadeElement.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                    <img src="${comunidade.imagem}" alt="Avatar ${comunidade.nome}" class="rounded-circle me-3" width="50" height="50" style="object-fit: cover;">
                    <div>
                        <h5 class="card-title mb-0">${comunidade.nome}</h5>
                        <small class="text-muted" style="font-size: 0.65rem;">${atividade.tempo}</small>
                    </div>
                </div>
                <p class="card-text">${atividade.mensagem}</p>
                ${gerarGaleriaImagens(atividade.imagens)}
            </div>
        `;
        atividadesContainer.appendChild(atividadeElement);
    });
}

/**
 * Gera a galeria de imagens com base na quantidade de imagens disponíveis
 * @function
 * @param {Array} imagens - Array de URLs das imagens
 * @returns {string} HTML da galeria de imagens
 */
function gerarGaleriaImagens(imagens) {
    if (imagens.length === 0) {
        return '';
    }

    const imagensHTML = imagens.map(img => `
        <div class="col">
            <img src="${img}" alt="Imagem de atividade" class="img-fluid rounded" style="width: 100%; height: auto; object-fit: contain;">
        </div>
    `).join('');

    return `
        <div class="row row-cols-2 row-cols-md-${Math.min(imagens.length, 4)} g-2 mt-3">
            ${imagensHTML}
        </div>
    `;
}

// Carrega os dados da comunidade quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarDadosComunidade);