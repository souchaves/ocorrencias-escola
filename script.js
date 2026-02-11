import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://pwjacmiiuhruheslgjoa.supabase.co/",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3amFjbWlpdWhydWhlc2xnam9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NjM0OTEsImV4cCI6MjA4NjMzOTQ5MX0.7Y_Iy0HEj_RKDoEhfEFFlgmODRy1NjsJbKfXxF-_sT4"
);

let alunosPorTurma = {};
async function carregarDados() {
    const { data: professores } = await supabase.from("professores").select();
    const { data: turmas } = await supabase.from("turmas").select();
    const { data: alunos } = await supabase.from("alunos").select();
    const { data: ocorrencias } = await supabase.from("ocorrencias").select();
  
    preencherSelect("professor", professores, "nome");
    preencherSelect("turma", turmas, "nome");
    preencherSelect("ocorrencia", ocorrencias, "codigo", "descricao");
  
    alunosPorTurma = alunos.reduce((mapa, aluno) => {
      if (!mapa[aluno.turma_id]) mapa[aluno.turma_id] = [];
      mapa[aluno.turma_id].push(aluno);
      return mapa;
    }, {});
  }
  
  function preencherSelect(id, dados, campo, campo2) {
    const select = document.getElementById(id);
    select.innerHTML = "<option value=''>Selecione</option>";
  
    dados.forEach(d => {
      const opt = document.createElement("option");
      opt.value = d.id;
      opt.textContent = campo2 ? `${d[campo]} - ${d[campo2]}` : d[campo];
      select.appendChild(opt);
    });
  }
  document.getElementById("turma").addEventListener("change", e => {
    const turmaId = e.target.value;
    const alunosSelect = document.getElementById("alunos");
  
    alunosSelect.innerHTML = "";
  
    if (!alunosPorTurma[turmaId]) return;
  
    alunosPorTurma[turmaId].forEach(aluno => {
      const opt = document.createElement("option");
      opt.value = aluno.id;
      opt.textContent = aluno.nome;
      alunosSelect.appendChild(opt);
    });
  });
  window.registrar = async function () {
    const professor = document.getElementById("professor").value;
    const turma = document.getElementById("turma").value;
    const ocorrencia = document.getElementById("ocorrencia").value;
    const descricao = document.getElementById("descricao").value;
  
    const alunos = [...document.getElementById("alunos").selectedOptions]
      .map(o => Number(o.value));
  
    if (!professor || !turma || !ocorrencia || alunos.length === 0) {
      alert("Preencha todos os campos");
      return;
    }
  
    const { error } = await supabase
    .from("registros")
    .insert([{
      turma_id: Number(turma),
      professor_id: Number(professor),
      ocorrencia_id: Number(ocorrencia),
      alunos: alunos,
      descricao: descricao,
      data: new Date().toISOString()
    }]);
  
  if (error) {
    console.error("Erro ao registrar:", error);
    alert("Erro ao registrar ocorrência");
    return;
  }
      
  
    alert("Ocorrência registrada com sucesso!");


  };
  carregarDados();

  window.abrirRelatorios = function () {
    window.location.href = "relatorios.html";
  };
  
    
  