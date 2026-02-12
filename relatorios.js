import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://dlctpyhdpiywkisdinyl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsY3RweWhkcGl5d2tpc2RpbnlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4Mzk5MzEsImV4cCI6MjA4NjQxNTkzMX0.6sqflP0MT0-HYfEi0tu1E2H-kDslkn3urxaCjwtroTY"
);

let registros = [];

async function carregarRelatorios() {
  const { data, error } = await supabase
    .from("registros")
    .select(`
      id,
      data,
      descricao,
      professores ( nome ),
      ocorrencias ( codigo, descricao ),
      turmas ( id, nome ),
      registro_alunos (
        alunos ( nome )
      )
    `)
    .order("data", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  registros = data;
  preencherTabela(registros);
}

function preencherTabela(dados) {
  const tbody = document.getElementById("tabela");
  tbody.innerHTML = "";


  dados.forEach(r => {
    const nomesAlunos = r.registro_alunos
      .map(ra => ra.alunos.nome)
      .join(", ");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
  ${new Date(r.data).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "medium"
  })}
</td>
      <td>${r.professores.nome}</td>
      <td>${r.turmas.nome}</td>
      <td>${nomesAlunos}</td>
      <td>${r.ocorrencias.codigo} - ${r.ocorrencias.descricao}</td>
    `;
    tbody.appendChild(tr);
  });
}

carregarRelatorios();
