const perfis = [
    {
        id: 1,
        nome: "Engenheiro de Sistemas",
        categoria: "Construção",
        descricao: "Transforma problemas em soluções. É criativo, lógico e gosta de construir, corrigir falhas e manter os equipamentos funcionando.",
        imagem: "perfil-1.jpg",
        recomendacao: "Você será responsável pela manutenção dos sistemas da nave, pela criação de ferramentas e pela solução de problemas técnicos."
    },
    {
        id: 2,
        nome: "Cientista Explorador",
        categoria: "Investigação",
        descricao: "É curioso, observador e analítico. Gosta de pesquisar, analisar evidências e descobrir como as coisas funcionam.",
        imagem: "perfil-2.jpg",
        recomendacao: "Você investigará amostras do planeta, analisará sinais misteriosos e registrará descobertas científicas importantes."
    },
    {
        id: 3,
        nome: "Explorador de Campo",
        categoria: "Exploração",
        descricao: "É aventureiro, adaptável e corajoso. Gosta de descobrir lugares, experimentar alternativas e enfrentar situações novas.",
        imagem: "perfil-3.jpg",
        recomendacao: "Você liderará expedições em terrenos desconhecidos, mapeará regiões e identificará caminhos e recursos naturais."
    },
    {
        id: 4,
        nome: "Estrategista da Missão",
        categoria: "Planejamento",
        descricao: "É organizado, responsável e estratégico. Gosta de coordenar pessoas, organizar informações e decidir os próximos passos.",
        imagem: "perfil-4.jpg",
        recomendacao: "Você organizará as operações da equipe, distribuirá tarefas e ajudará a tomar decisões para manter a missão no caminho certo."
    }
];

const formulario = document.getElementById("testeAura");
const campoNome = document.getElementById("nome");
const campoNascimento = document.getElementById("nascimento");
const mensagem = document.getElementById("mensagem");
const telaFormulario = document.getElementById("formulario");
const telaResultado = document.getElementById("resultado");
const botaoRefazer = document.getElementById("refazer");

// Usa a data local para evitar problemas de fuso horário.
function dataLocalISO(data = new Date()) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

// Impede selecionar datas futuras no calendário.
campoNascimento.max = dataLocalISO();

// Calcula a idade considerando o dia e o mês do aniversário.
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(
        `${dataNascimento}T12:00:00`
    );

    let idade = hoje.getFullYear() - nascimento.getFullYear();

    const aniversarioAindaNaoOcorreu =
        hoje.getMonth() < nascimento.getMonth() ||
        (
            hoje.getMonth() === nascimento.getMonth() &&
            hoje.getDate() < nascimento.getDate()
        );

    if (aniversarioAindaNaoOcorreu) {
        idade--;
    }

    return idade;
}

// Confere se o nome e a data foram preenchidos corretamente.
function validarDados() {
    const nome = campoNome.value.trim();
    const nascimento = campoNascimento.value;
    const hoje = dataLocalISO();

    if (!nome) {
        return "Por favor, informe seu nome.";
    }

    if (!nascimento) {
        return "Informe sua data de nascimento.";
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) {
        return "Informe uma data de nascimento válida.";
    }

    const data = new Date(`${nascimento}T12:00:00`);

    if (
        Number.isNaN(data.getTime()) ||
        dataLocalISO(data) !== nascimento
    ) {
        return "A data informada não é válida.";
    }

    if (nascimento > hoje) {
        return "A data de nascimento não pode ser futura.";
    }

    if (calcularIdade(nascimento) < 0) {
        return "Confira sua data de nascimento.";
    }

    return "";
}

// Soma os pontos recebidos por cada perfil.
function calcularPontuacao(respostas) {
    const pontuacao = {
        1: 0,
        2: 0,
        3: 0,
        4: 0
    };

    respostas.forEach(function (resposta) {
        pontuacao[resposta]++;
    });

    return pontuacao;
}

// Identifica o perfil com maior pontuação e trata empates.
function identificarPerfil(pontuacao) {
    const maiorPontuacao = Math.max(
        ...Object.values(pontuacao)
    );

    const vencedores = Object.keys(pontuacao).filter(
        function (id) {
            return pontuacao[id] === maiorPontuacao;
        }
    );

    if (vencedores.length > 1) {
        return null;
    }

    return perfis.find(function (perfil) {
        return perfil.id === Number(vencedores[0]);
    });
}

// Preenche a tela com os dados do perfil encontrado.
function mostrarResultado(nome, idade, perfil, pontuacao) {
    document.getElementById("saudacao").textContent =
        `Participante: ${nome} • Idade: ${idade} anos`;

    document.getElementById("nomePerfil").textContent =
        perfil.nome;

    document.getElementById("categoria").textContent =
        `Categoria: ${perfil.categoria}`;

    document.getElementById("descricao").textContent =
        perfil.descricao;

    document.getElementById("recomendacao").textContent =
        perfil.recomendacao;

    const imagem = document.getElementById("imagemPerfil");

    imagem.src = perfil.imagem;
    imagem.alt = `Ilustração de ${perfil.nome}`;

    imagem.onerror = function () {
        imagem.onerror = null;
        imagem.alt =
            `Imagem de ${perfil.nome} não encontrada. Adicione o arquivo ${perfil.imagem} à pasta do projeto.`;
        imagem.removeAttribute("src");
    };

    document.getElementById("detalhes").textContent =
        `Pontuação: ${perfil.nome} — ${pontuacao[perfil.id]} de 4 pontos.`;

    telaFormulario.hidden = true;
    telaResultado.hidden = false;

    telaResultado.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// Executa o teste quando o participante envia o formulário.
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    mensagem.textContent = "";

    const erro = validarDados();

    if (erro) {
        mensagem.textContent = erro;
        return;
    }

    if (!formulario.reportValidity()) {
        return;
    }

    const nome = campoNome.value.trim();
    const idade = calcularIdade(campoNascimento.value);

    const respostas = [];

    for (let i = 1; i <= 4; i++) {
        const selecionada = formulario.querySelector(
            `input[name="p${i}"]:checked`
        );

        if (!selecionada) {
            mensagem.textContent =
                `Responda à pergunta ${i} antes de continuar.`;
            return;
        }

        respostas.push(Number(selecionada.value));
    }

    const pontuacao = calcularPontuacao(respostas);
    const perfil = identificarPerfil(pontuacao);

    if (!perfil) {
        mensagem.textContent =
            "Empate detectado! Escolha as respostas que melhor representam suas preferências e tente novamente.";
        return;
    }

    mostrarResultado(nome, idade, perfil, pontuacao);
});

// Permite realizar o teste novamente.
botaoRefazer.addEventListener("click", function () {
    formulario.reset();
    mensagem.textContent = "";

    campoNascimento.max = dataLocalISO();

    telaResultado.hidden = true;
    telaFormulario.hidden = false;

    telaFormulario.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});