async function carregarDashboard() {
    try {
      const { data, error } = await window.supabase
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
  
      document.getElementById("totalOcorrencias").innerText = data.length;
  
      const alunosSet = new Set();
      data.forEach(r => {
        if (r.registro_alunos) {
          r.registro_alunos.forEach(a => {
            if (a.aluno_id) alunosSet.add(a.aluno_id);
          });
        }
      });
      document.getElementById("totalAlunos").innerText = alunosSet.size;
  
      const turmasSet = new Set();
      data.forEach(r => {
        if (r.turmas?.nome) turmasSet.add(r.turmas.nome);
      });
      document.getElementById("totalTurmas").innerText = turmasSet.size;
  
      const porTurma = {};
      data.forEach(r => {
        const turma = r.turmas?.nome || "Sem turma";
        porTurma[turma] = (porTurma[turma] || 0) + 1;
      });
  
      const listaTurma = document.getElementById("porTurma");
      listaTurma.innerHTML = "";
      for (let turma in porTurma) {
        listaTurma.innerHTML += `<li>${turma}: ${porTurma[turma]}</li>`;
      }
  
      const porTipo = {};
      data.forEach(r => {
        const tipo = r.ocorrencias?.descricao || "Sem tipo";
        porTipo[tipo] = (porTipo[tipo] || 0) + 1;
      });
  
      const listaTipo = document.getElementById("porTipo");
      listaTipo.innerHTML = "";
      for (let tipo in porTipo) {
        listaTipo.innerHTML += `<li>${tipo}: ${porTipo[tipo]}</li>`;
      }
  
    } catch (err) {
      console.error("Erro inesperado no dashboard:", err);
    }
  }
  
  carregarDashboard();
  