import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://dlctpyhdpiywkisdinyl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsY3RweWhkcGl5d2tpc2RpbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4Mzk5MzEsImV4cCI6MjA4NjQxNTkzMX0.6sqflP0MT0-HYfEi0tu1E2H-kDslkn3urxaCjwtroTY"
);

let registros = [];

async function carregarRelatorios() {

  const { data: registrosData, error } = await supabase
    .from("registros")
    .select("*")
    .order("data", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  // Buscar todas tabelas necessárias
  const { data: professores } = await supabase.from("professores").select();
  const { data: turmas } = await supabase.from("turmas").select();
  const { data: ocorrencias } = await supabase.from("ocorrencias").select();
  const { data: registroAlunos } = await supabase.from("registro_alunos").select();
  const { data: alunos } = await supabase.from("alunos").select();

  registros = registrosData.map(registro => {

    const professor = professores.find(p => p.id === registro.professor_id);
    const turma = turmas.find(t => t.id === registro.turma_id);
    const ocorrencia = ocorrencias.find(o => o.id === registro.ocorrencia_id);

    const alunosDoRegistro = registroAlunos
      .filter(ra => ra.registro_id === registro.id)
      .map(ra => {
        const aluno = alunos.find(a => a.id === ra.aluno_id);
        return aluno ? aluno.nome : null;
      })
      .filter(nome => nome !== null)
      .join(", ");

    return {
      ...registro,
      professor_nome: professor?.nome || "-",
      turma_nome: turma?.nome || "-",
      ocorrencia_texto: ocorrencia ? `${ocorrencia.codigo} - ${ocorrencia.descricao}` : "-",
      alunos_nomes: alunosDoRegistro
    };
  });

  preencherTabela(registros);
}

function preencherTabela(dados) {

  const tbody = document.getElementById("tabela");
  tbody.innerHTML = "";

  dados.forEach(r => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${new Date(r.data).toLocaleString("pt-BR")}</td>
      <td>${r.professor_nome}</td>
      <td>${r.turma_nome}</td>
      <td>${r.alunos_nomes}</td>
      <td>${r.ocorrencia_texto}</td>
      <td>${r.retorna_sala ? "Sim" : "Não"}</td>
    `;

    tbody.appendChild(tr);
  });
}

carregarRelatorios();