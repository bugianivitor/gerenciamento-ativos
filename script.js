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
                </tr>`
            });
        }
    } catch (erro) {
        console.lerror('Erro ao buscar dados', erro)
    }
}

carregarEquipamento();