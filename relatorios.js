import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

let mapaAlunos = {};
let registros = [];

async function carregarAlunos() {
    const { data, error } = await supabase
      .from("alunos")
      .select("id, nome");
  
    if (error) {
      console.error("Erro ao carregar alunos", error);
      return;
    }
  
    data.forEach(a => {
      mapaAlunos[a.id] = a.nome;
    });
  }
  

const supabase = createClient(
  "https://pwjacmiiuhruheslgjoa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3amFjbWlpdWhydWhlc2xnam9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NjM0OTEsImV4cCI6MjA4NjMzOTQ5MX0.7Y_Iy0HEj_RKDoEhfEFFlgmODRy1NjsJbKfXxF-_sT4"
);



async function carregarRelatorios() {
    const { data } = await supabase
      .from("registros")
      .select(`
        id,
        data,
        alunos,
        professores(id, nome),
        turmas(id, nome),
        ocorrencias(codigo, descricao)
      `);
  
    registros = data;
  
    preencherFiltros(data);
    preencherTabela(data);
  }
  

function preencherTabela(dados) {
  const tbody = document.getElementById("tabela");
  tbody.innerHTML = "";

  dados.forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${new Date(r.data).toLocaleString()}</td>
      <td>${r.professores.nome}</td>
      <td>${r.turmas.nome}</td>
      <td>${r.alunos.join(", ")}</td>
      <td>${r.ocorrencias.codigo} - ${r.ocorrencias.descricao}</td>
    `;
    tbody.appendChild(tr);
  });
}

carregarRelatorios();

function preencherFiltros(dados) {
    const filtroTurma = document.getElementById("filtroTurma");
    const filtroAluno = document.getElementById("filtroAluno");
    const filtroProfessor = document.getElementById("filtroProfessor");
  
    filtroTurma.innerHTML = `<option value="">Todas</option>`;
    filtroAluno.innerHTML = `<option value="">Todos</option>`;
    filtroProfessor.innerHTML = `<option value="">Todos</option>`;
  
    const turmas = new Map();
    const professores = new Map();
    const alunos = new Set();
  
    dados.forEach(r => {
      turmas.set(r.turmas.id, r.turmas.nome);
      professores.set(r.professores.id, r.professores.nome);
      r.alunos.forEach(a => alunos.add(a));
    });
  
    turmas.forEach((nome, id) => {
      filtroTurma.innerHTML += `<option value="${id}">${nome}</option>`;
    });
  
    professores.forEach((nome, id) => {
      filtroProfessor.innerHTML += `<option value="${id}">${nome}</option>`;
    });
  
    alunos.forEach(id => {
      filtroAluno.innerHTML += `<option value="${id}">Aluno ID ${id}</option>`;
    });
  }
  
  document.getElementById("filtroTurma").addEventListener("change", aplicarFiltros);
  document.getElementById("filtroProfessor").addEventListener("change", aplicarFiltros);
  document.getElementById("filtroAluno").addEventListener("change", aplicarFiltros);
  
  function aplicarFiltros() {
    const turmaId = document.getElementById("filtroTurma").value;
    const professorId = document.getElementById("filtroProfessor").value;
    const alunoId = document.getElementById("filtroAluno").value;
  
    let filtrados = registros;
  
    if (turmaId) {
      filtrados = filtrados.filter(r => r.turmas.id == turmaId);
    }
  
    if (professorId) {
      filtrados = filtrados.filter(r => r.professores.id == professorId);
    }
  
    if (alunoId) {
      filtrados = filtrados.filter(r => r.alunos.includes(Number(alunoId)));
    }
  
    preencherTabela(filtrados);
  }

  await carregarAlunos();
carregarRelatorios();

  
