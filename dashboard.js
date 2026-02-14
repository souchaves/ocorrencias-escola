async function carregarDashboard() {
  try {
    const { data, error } = await supabase
      .from("registros")
      .select(`
        id,
        data,
        turmas ( nome ),
        ocorrencias ( descricao ),
        registro_alunos!registro_alunos_registro_id_fkey ( aluno_id )
      `);

    if (error) {
      console.error("Erro ao carregar dashboard:", error);
      return;
    }

    console.log("DADOS DASHBOARD:", data);

    // Totais
    document.getElementById("totalOcorrencias").innerText = data.length;

    const alunosSet = new Set();
    data.forEach(r => {
      if (r.registro_alunos) {
        r.registro_alunos.forEach(a => alunosSet.add(a.aluno_id));
      }
    });
    document.getElementById("totalAlunos").innerText = alunosSet.size;

    const turmasSet = new Set();
    data.forEach(r => {
      if (r.turmas?.nome) turmasSet.add(r.turmas.nome);
    });
    document.getElementById("totalTurmas").innerText = turmasSet.size;

    // Agrupar por Turma
    const porTurma = {};
    data.forEach(r => {
      const turma = r.turmas?.nome || "Sem turma";
      porTurma[turma] = (porTurma[turma] || 0) + 1;
    });

    // Agrupar por Tipo
    const porTipo = {};
    data.forEach(r => {
      const tipo = r.ocorrencias?.descricao || "Sem tipo";
      porTipo[tipo] = (porTipo[tipo] || 0) + 1;
    });

    // Render Turmas (Bootstrap)
    const listaTurma = document.getElementById("porTurma");
    listaTurma.innerHTML = "";

    const maxTurma = Math.max(...Object.values(porTurma), 1);

    for (let turma in porTurma) {
      const percentual = (porTurma[turma] / maxTurma) * 100;

      listaTurma.innerHTML += `
        <div class="mb-3">
          <div class="d-flex justify-content-between">
            <strong>${turma}</strong>
            <span class="badge bg-primary">${porTurma[turma]}</span>
          </div>
          <div class="progress mt-1" style="height: 10px;">
            <div class="progress-bar bg-success" style="width: ${percentual}%"></div>
          </div>
        </div>
      `;
    }

    // Render Tipos (Bootstrap)
    const listaTipo = document.getElementById("porTipo");
    listaTipo.innerHTML = "";

    const maxTipo = Math.max(...Object.values(porTipo), 1);

    for (let tipo in porTipo) {
      const percentual = (porTipo[tipo] / maxTipo) * 100;

      listaTipo.innerHTML += `
        <div class="mb-3">
          <div class="d-flex justify-content-between">
            <strong>${tipo}</strong>
            <span class="badge bg-warning text-dark">${porTipo[tipo]}</span>
          </div>
          <div class="progress mt-1" style="height: 10px;">
            <div class="progress-bar bg-warning" style="width: ${percentual}%"></div>
          </div>
        </div>
      `;
    }

    // Destaques automáticos
    const destaqueDiv = document.getElementById("destaque");

    if (Object.keys(porTurma).length && Object.keys(porTipo).length) {
      const turmaTop = Object.entries(porTurma).sort((a, b) => b[1] - a[1])[0];
      const tipoTop = Object.entries(porTipo).sort((a, b) => b[1] - a[1])[0];

      destaqueDiv.innerHTML = `
        <p class="mb-1"> ⚠️ <strong>Turma com mais ocorrências:</strong></p>
        <span class="badge bg-danger">${turmaTop[0]} (${turmaTop[1]})</span>

        <p class="mt-3 mb-1">⚠️ <strong>Ocorrência mais comum:</strong></p>
        <span class="badge bg-danger">${tipoTop[0]} (${tipoTop[1]})</span>
      `;
    } else {
      destaqueDiv.innerHTML = `<span class="text-muted">Sem dados para destaque.</span>`;
    }

  } catch (err) {
    console.error("Erro inesperado no dashboard:", err);
  }
}

document.addEventListener("DOMContentLoaded", carregarDashboard);
  