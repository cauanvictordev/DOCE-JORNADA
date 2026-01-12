





























// ==========================================
// 3. LÓGICA DO MAPA VISUAL (MELHORADA E RESPONSIVA)
// ==========================================

function gerarMapa() {
    const caminho = document.getElementById('caminho-fases');
    const svgCaminho = document.getElementById('svg-caminho');
    const containerMapa = document.querySelector('.mapa-container');
    
    if (!caminho || !svgCaminho || !containerMapa) return;
    
    caminho.innerHTML = '';
    const fragmento = document.createDocumentFragment();
    const faseLiberada = parseInt(localStorage.getItem('fase_liberada')) || 1;
    const totalFases = 100;
    const espacamentoVertical = 260; 
    const alturaTotal = totalFases * espacamentoVertical;
    const larguraContainer = containerMapa.offsetWidth;

    // Configura o tamanho real do mapa
    caminho.style.height = `${alturaTotal}px`;
    svgCaminho.setAttribute('height', alturaTotal);
    svgCaminho.setAttribute('viewBox', `0 0 ${larguraContainer} ${alturaTotal}`);

    let pontosPath = ""; 

    for (let i = 1; i <= totalFases; i++) {
        // Cálculo da trilha central (senoide)
        const centroX = larguraContainer / 2;
        const horizontal = centroX + Math.sin(i * 0.7) * (larguraContainer * 0.28); 
        const verticalPos = alturaTotal - (i * espacamentoVertical) + 130;

        // Constrói a linha do SVG
        if (i === 1) pontosPath += `M ${horizontal} ${verticalPos} `;
        else pontosPath += `L ${horizontal} ${verticalPos} `;

        // Criação do Botão da Fase
        const btn = document.createElement('button');
        btn.className = `fase ${i > 70 ? 'mundo-dark' : 'mundo-fofo'}`;
        // Centraliza o botão de 90px (45px de offset)
        btn.style.left = `${horizontal - 45}px`; 
        btn.style.top = `${verticalPos - 45}px`;

        if (i > faseLiberada) {
            btn.classList.add('bloqueada');
            btn.innerHTML = `🔒`;
        } else {
            btn.innerHTML = i;
            if (i === faseLiberada) btn.classList.add('fase-atual');
            btn.onclick = () => window.location.href = `jogo.html?fase=${i}`;
        }
        
        fragmento.appendChild(btn);

        // Gera o cenário espalhado ao redor desta fase específica
        gerarCenarioOrganizado(horizontal, verticalPos, i, larguraContainer, fragmento);
    }

    // Adiciona todos os elementos de uma vez para melhor performance
    caminho.appendChild(fragmento);

    // Renderiza o caminho visual
    svgCaminho.innerHTML = `
        <path d="${pontosPath}" fill="none" stroke="#ffd1dc" stroke-width="35" stroke-linecap="round" opacity="0.6" />
        <path d="${pontosPath}" fill="none" stroke="#fdf5e6" stroke-width="35" stroke-dasharray="20" stroke-linecap="round" />
    `;
    
    // Scroll automático para a fase atual
    setTimeout(() => {
        const ativos = document.querySelectorAll('.fase:not(.bloqueada)');
        if(ativos.length > 0) {
            ativos[ativos.length - 1].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }, 500);
}











// Adicione isso no final da função gerarMapa(), antes de fechar a chave }
const faseMax = parseInt(localStorage.getItem('fase_liberada')) || 1;
if (faseMax > 100) {
    const msgFinal = document.createElement('div');
    msgFinal.style.cssText = `
        text-align: center;
        padding: 20px;
        background: white;
        border-radius: 20px;
        margin: 20px;
        border: 4px solid #ff4081;
        color: #ff4081;
        font-weight: bold;
    `;
    msgFinal.innerHTML = "🎉 VOCÊ CONQUISTOU O REINO DOCE! 🎉<br>Todas as 100 fases concluídas!";
    document.querySelector('.mapa-wrapper').prepend(msgFinal);
}






function gerarCenarioOrganizado(xTrilha, yTrilha, fase, largura, destino) {
    // Dividimos a largura total em 4 colunas para garantir que os doces não fiquem um sobre o outro
    const numColunas = 4;
    const larguraFatia = largura / numColunas;

    for (let col = 0; col < numColunas; col++) {
        // Chance de 70% de gerar um item em cada coluna desta "fatia" vertical
        if (Math.random() > 0.3) {
            const container = document.createElement('div');
            container.className = 'decoracao-container';
            
            const itensMágicos = [
                { emoji: '🍭', classe: 'doce-gigante' },
                { emoji: '🍬', classe: 'doce-medio' },
                { emoji: '🍩', classe: 'doce-gigante' },
                { emoji: '🧁', classe: 'doce-medio' },
                { emoji: '🍦', classe: 'doce-gigante' },
                { emoji: '🍪', classe: 'doce-pequeno' },
                { emoji: '☁️', classe: 'nuvem-algodao' },
             ];

            const sorteado = itensMágicos[Math.floor(Math.random() * itensMágicos.length)];
            const elemento = document.createElement('div');
            elemento.className = sorteado.classe;
            elemento.innerText = sorteado.emoji;
            container.appendChild(elemento);

            // Cálculo de posição X (aleatório dentro da sua respectiva coluna)
            let posX = (col * larguraFatia) + (Math.random() * (larguraFatia - 100));
            
            // Evita que o item fique exatamente em cima da trilha central
            if (Math.abs(posX - xTrilha) < 90) {
                posX = (posX < xTrilha) ? posX - 100 : posX + 100;
            }

            // Garante que o item não saia das bordas da tela
            posX = Math.max(10, Math.min(posX, largura - 110));

            // Variar a altura levemente para um look mais orgânico
            const posY = yTrilha + (Math.random() * 200 - 100);

            container.style.left = `${posX}px`;
            container.style.top = `${posY}px`;
            
            // Itens com posY maior (mais abaixo) ganham z-index maior para sobreposição correta
            container.style.zIndex = Math.floor(posY / 100);
            
            destino.appendChild(container);
        }
    }
}



















// ==========================================
// 4. INICIALIZAÇÃO GERAL
// ==========================================

window.addEventListener('load', () => {
    // Só gera o mapa se estivermos na página index.html
    if (document.getElementById('caminho-fases')) {
        gerarMapa();
    }
});

function resetar() {
    if(confirm("Deseja resetar todo o seu progresso?")) {
        localStorage.removeItem('fase_liberada');
        location.reload();
    }
}