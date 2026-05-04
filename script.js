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

    const novoEquipamento = {
        modelo: document.getElementById('modelo').value,
        descricao: document.getElementById('descricao').value,
        patrimonio: document.getElementById('patrimonio').value,
        status: document.getElementById('status').value,
        observacoes: document.getElementById('observacoes').value
    };

    try {
        const resposta = await fetch('http://localhost:3000/equipamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoEquipamento)
        });

        if (resposta.ok) {
            alert('Equipamento cadastrado com sucesso! 🎉')
            form.reset(); // Limpa todos os campos do formulário
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