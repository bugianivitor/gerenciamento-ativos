const API_URL = 'http://localhost:3000/equipamentos';

async function carregarEquipamento() {
    const corpoTabela = document.getElementById('tabela-corpo')

    try {
        const resposta = await fetch('http://localhost:3000/equipamentos')
        const equipamentos = await resposta.json()

        corpoTabela.innerHTML = ''

        if (equipamentos.length === 0) {
            corpoTabela.innerHTML +=
                '<tr> <td colspan="6" style="text-align: center;">  Nenhum equipamento cadastrado. 🔎 </td> </tr>'
        } else {
            equipamentos.forEach(equipamento => {
                corpoTabela.innerHTML +=
                    `<tr>
                        <td>${equipamento.id}</td>
                        <td>${equipamento.modelo}</td>
                        <td>${equipamento.descricao}</td>
                        <td>${equipamento.patrimonio}</td>
                        <td>${equipamento.status}</td>
                        <td>${equipamento.observacoes}</td>
                        <td>
                            <button onclick="prepararEdicao(${equipamento.id})" class="btn-editar">✏️ Editar</button>
                            <button onclick="deletarEquipamento(${equipamento.id})" class="btn-excluir">🗑️ Excluir </button>
                        </td>
                    </tr>`
            });
        }
    } catch (erro) {
        console.error('Erro ao buscar dados', erro)
    }
}

carregarEquipamento();

const form = document.getElementById('form-equipamento')

form.addEventListener('submit', async (event) => {
    event.preventDefault()

    const id = document.getElementById('equipamento-id').value;

    const novoEquipamento = {
        modelo: document.getElementById('modelo').value,
        descricao: document.getElementById('descricao').value,
        patrimonio: document.getElementById('patrimonio').value,
        status: document.getElementById('status').value,
        observacoes: document.getElementById('observacoes').value
    };

    let url = API_URL;
    let metodo = 'POST';

    if (id) {
        metodo = 'PUT';
        url = `${API_URL}/${id}`;
    }

    try {
        const resposta = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoEquipamento)
        });

        if (resposta.ok) {
            alert(id ? 'Atualizado com sucesso!' : 'Equipamento cadastrado com sucesso! 🎉')
            form.reset(); // Limpa todos os campos do formulário
            document.getElementById('equipamento-id').value = ''
            document.querySelector('#form-equipamento button').textContent = "Cadastrar equipamento"
            carregarEquipamento(); // Atualiza a tabela automaticamente
        } else {
            alert('Erro ao cadastrar equipamento. ❌');
        }
    } catch (erro) {
        console.error('Erro na requisição:', erro);
    }
})

async function deletarEquipamento(id) {
    // É sempre bom confirmar com o usuário antes de apagar algo!
    if (confirm("Tem certeza que deseja excluir este item?")) {
        try {
            const resposta = await fetch(`http://localhost:3000/equipamentos/${id}`, {
                method: 'DELETE'
            });

            if (resposta.ok) {
                alert("Equipamento removido! 🚮");
                // O que precisamos fazer agora para a tabela se atualizar?
                carregarEquipamento()
            }
        } catch (erro) {
            console.error("Erro ao deletar:", erro);
        }
    }
}

async function prepararEdicao(id) {
    const resposta = await fetch(`${API_URL}/${id}`);
    const item = await resposta.json();

    // Preenche os campos do formulário com o que veio do banco
    document.getElementById('equipamento-id').value = item.id;
    document.getElementById('modelo').value = item.modelo;
    document.getElementById('patrimonio').value = item.patrimonio;
    document.getElementById('status').value = item.status;
    document.getElementById('descricao').value = item.descricao;
    document.getElementById('observacoes').value = item.observacoes;

    // Muda o texto do botão para o usuário saber que está editando
    document.querySelector('#form-equipamento button').textContent = "Atualizar 💾";
}