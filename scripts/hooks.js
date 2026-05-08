// hooks.js - Tormenta20 Attack Automation v1.6

Hooks.once("ready", () => {
  // Registrar configurações do módulo
  const MOD = "arsenal-t20";

  game.settings.register(MOD, "autoAtaque", {
    name: "Automação de Ataque",
    hint: "Detecta acerto, erro, crítico e erro natural. Exibe painel privado ao GM com DEF, PV e botões para aplicar dano com resistências.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MOD, "autoSalvamento", {
    name: "Testes de Resistência",
    hint: "Ao lançar magias/poderes com resistência, exibe card no chat com botões para jogadores rolarem o teste (CD calculado automaticamente).",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MOD, "autoCondicoes", {
    name: "Aplicar Condições Automaticamente",
    hint: "Ao falhar/passar num teste de resistência, aplica automaticamente as condições listadas na descrição da magia (ex: Fatigado, Apavorado).",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MOD, "mensagemPublica", {
    name: "Mensagem Pública de Ataque",
    hint: "Exibe mensagem no chat visível a todos os jogadores indicando acerto/erro, sem revelar DEF ou PV do alvo.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MOD, "danoAutoGM", {
    name: "Painel de Dano do GM",
    hint: "Exibe painel privado ao GM com DEF, PV, resistências do alvo e botões para aplicar dano com um clique.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  const ativas = [];
  if (game.settings.get(MOD, "autoAtaque"))      ativas.push("Ataque");
  if (game.settings.get(MOD, "autoSalvamento"))  ativas.push("Salvamento");
  if (game.settings.get(MOD, "autoCondicoes"))   ativas.push("Condições");

  console.log(`Arsenal T20 | v1.6 carregado! Ativas: ${ativas.join(", ") || "nenhuma"}`);
  if (game.user.isGM) ui.notifications.info("⚔️ Arsenal T20 ativo!");

});

// ============================================================
// PAINEL DE CONDIÇÕES
// ============================================================

class PainelCondicoes extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "arsenal-painel-condicoes",
      title: "⚔️ Condições — Arsenal T20",
      width: 280,
      height: 560,
      resizable: true,
      minimizable: true,
    });
  }

  _getCondicoes() {
    return (CONFIG.statusEffects ?? [])
      .filter(e => e.id && e.name)
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  // Retorna HTML estático mínimo — o conteúdo real é injetado em activateListeners
  async getData() { return {}; }
  get template() { return null; }

  async _renderInner(_data) {
    const div = $(`<div id="arsenal-cond-inner" style="height:100%"></div>`);
    return div;
  }

  activateListeners(html) {
    super.activateListeners(html);
    // html pode ser jQuery (v12) ou wrapper — normalizar para elemento DOM
    const root = html instanceof jQuery ? html[0] : html;
    this._root = root;
    this._atualizarConteudo(root);
  }

  _atualizarConteudo(root) {
    const busca     = this._busca ?? "";
    const q         = busca.toLowerCase().trim();
    const condicoes = this._getCondicoes().filter(e =>
      !q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q)
    );
    const alvo = canvas.tokens?.controlled[0]?.name ?? "Nenhum token selecionado";

    const linhas = condicoes.map(e => {
      const ativa = canvas.tokens?.controlled[0]?.actor?.statuses?.has(e.id) ?? false;
      return `<button class="t20-painel-cond" data-id="${e.id}" data-nome="${e.name}"
        style="display:flex;align-items:center;gap:6px;width:100%;
          padding:5px 8px;margin-bottom:3px;border-radius:4px;
          cursor:pointer;text-align:left;font-size:0.82em;
          background:${ativa ? "#0a2a0a" : "#1a1a26"};
          border:1px solid ${ativa ? "#27ae60" : "#3a3a50"};
          color:${ativa ? "#27ae60" : "#d4c5a0"}">
        ${e.icon ? `<img src="${e.icon}" style="width:16px;height:16px;border:none;opacity:${ativa ? 1 : 0.7}">` : ""}
        <span>${e.name}</span>
        ${ativa ? `<span style="margin-left:auto">✓</span>` : ""}
      </button>`;
    }).join("");

    root.innerHTML = `
      <div style="padding:8px;font-family:'Crimson Text',serif;height:100%;display:flex;flex-direction:column;direction:ltr;unicode-bidi:normal;">
        <div style="font-size:0.8em;color:#888;margin-bottom:8px;
          padding:4px 8px;background:#1a1a26;border-radius:4px;
          border-left:3px solid #c9a227;flex-shrink:0">
          🎯 <b style="color:#c9a227">${alvo}</b>
        </div>
        <input id="t20-busca-cond" type="text" placeholder="🔍 Buscar condição..."
          value="${busca}"
          style="width:100%;padding:5px 8px;margin-bottom:8px;box-sizing:border-box;
            background:#1a1a26;border:1px solid #3a3a50;color:#d4c5a0;
            border-radius:4px;font-size:0.9em;flex-shrink:0;
            direction:ltr;unicode-bidi:normal;transform:none;text-align:left;">
        <div style="overflow-y:auto;flex:1;
          scrollbar-width:thin;scrollbar-color:#3a3a50 #0a0a0f">
          ${linhas || `<div style="color:#666;padding:10px;text-align:center">Nenhuma condição encontrada</div>`}
        </div>
        <div style="padding-top:6px;border-top:1px solid #2a2a38;
          font-size:0.72em;color:#555;text-align:center;flex-shrink:0">
          Clique para aplicar/remover no token selecionado
        </div>
      </div>`;

    // Busca
    root.querySelector("#t20-busca-cond")?.addEventListener("input", e => {
      this._busca = e.target.value;
      this._atualizarConteudo(root);
      root.querySelector("#t20-busca-cond")?.focus();
    });

    // Botões de condição
    root.querySelectorAll(".t20-painel-cond").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id   = btn.dataset.id;
        const nome = btn.dataset.nome;
        const actor = canvas.tokens.controlled[0]?.actor ?? game.user.character;
        if (!actor) return ui.notifications.warn("⚔️ Selecione um token primeiro!");

        if (game.user.isGM) {
          const jaAtiva = actor.statuses?.has(id);
          await actor.toggleStatusEffect(id);
          ui.notifications.info(`🔮 ${nome} ${jaAtiva ? "removida de" : "aplicada em"} ${actor.name}`);
        } else {
          game.socket.emit("module.arsenal-t20", {
            tipo: "aplicarCondicoes",
            actorId: actor.id,
            condicoes: [id],
            nomeItem: "Painel de Condições",
          });
          ui.notifications.info(`🔮 Solicitando ${nome} para ${actor.name}...`);
        }
        setTimeout(() => this._atualizarConteudo(root), 200);
      });
    });
  }
}

let _painelCondicoes = null;

function abrirPainelCondicoes() {
  if (_painelCondicoes?.rendered) {
    _painelCondicoes.close();
    _painelCondicoes = null;
  } else {
    _painelCondicoes = new PainelCondicoes();
    _painelCondicoes.render(true);
  }
}

// Botão nos controles da cena — compatível com Foundry v11/v12/v13
Hooks.on("getSceneControlButtons", (controls) => {
  // v13: controls é um objeto com chaves; v11/v12: array
  if (Array.isArray(controls)) {
    const tokens = controls.find(c => c.name === "token");
    if (tokens) {
      tokens.tools.push({
        name:    "arsenal-condicoes",
        title:   "Condições Rápidas — Arsenal T20",
        icon:    "fas fa-skull-crossbones",
        button:  true,
        onClick: () => abrirPainelCondicoes(),
      });
    }
  } else {
    // v13: controles são objetos com .tools como objeto também
    const tokens = controls.token ?? controls.tokens;
    if (tokens) {
      tokens.tools["arsenal-condicoes"] = {
        name:    "arsenal-condicoes",
        title:   "Condições Rápidas — Arsenal T20",
        icon:    "fas fa-skull-crossbones",
        button:  true,
        onChange: () => abrirPainelCondicoes(),
        order:   100,
      };
    }
  }
});

// Botão fixo ao lado da barra de players (canto inferior esquerdo)
Hooks.on("ready", () => {
  const btn = document.createElement("button");
  btn.id    = "arsenal-cond-btn";
  btn.title = "Condições Rápidas — Arsenal T20";
  btn.innerHTML = `<i class="fas fa-skull-crossbones" style="margin-right:4px"></i><span style="font-size:0.75em;font-family:'Cinzel',serif;letter-spacing:0.03em">Condições</span>`;
  btn.style.cssText = `
    position: fixed;
    bottom: 8px;
    left: 0;
    z-index: 100;
    height: 44px;
    padding: 0 12px;
    background: #1a1a26;
    border: 1px solid #3a3a50;
    border-radius: 0 6px 6px 0;
    color: #c9a227;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.6);
    transition: all 0.2s;
  `;
  // Posiciona acima da barra de players
  const ajustarPosicao = () => {
    const players = document.getElementById("players");
    if (players) {
      const alturaPlayers = players.offsetHeight;
      btn.style.bottom = (alturaPlayers + 12) + "px";
    }
  };
  btn.addEventListener("mouseenter", () => {
    btn.style.background = "#2a1a0a";
    btn.style.borderColor = "#c9a227";
    btn.style.color = "#f0c040";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.background = "#1a1a26";
    btn.style.borderColor = "#3a3a50";
    btn.style.color = "#c9a227";
  });
  btn.addEventListener("click", () => abrirPainelCondicoes());

  // Posiciona após a barra de players quando ela renderizar
  document.body.appendChild(btn);
  setTimeout(ajustarPosicao, 500);
  Hooks.on("renderPlayerList", ajustarPosicao);
});

// Helper para verificar configurações
function cfg(chave) {
  try { return game.settings.get("arsenal-t20", chave); }
  catch { return true; } // fallback: ativo por padrão
}

// Extrai { tipo: total } ignorando operadores e termos sem valor numérico
function extrairDanoPorTipo(roll) {
  const porTipo = {};

  for (const term of roll.terms) {
    // Ignora operadores (+, -, etc) e parênteses
    if (term.constructor?.name === "OperatorTerm") continue;
    if (term.constructor?.name === "ParenthesisTerm") continue;

    const valor = term.total;
    // Ignora se não for número válido ou for zero sem dados
    if (valor === undefined || valor === null || isNaN(valor)) continue;
    // Ignora terms de dado que não rolaram nada
    if (typeof valor !== "number") continue;

    const flavor = (term.flavor ?? term.options?.flavor ?? "").toLowerCase().trim();
    const tipo = flavor || "sem_tipo";

    porTipo[tipo] = (porTipo[tipo] ?? 0) + valor;
  }

  return porTipo;
}

function calcularDanoComResistencias(valorBase, tipoNorm, tracos) {
  let dano = valorBase;
  const notas = [];

  if (tipoNorm && tipoNorm !== "sem_tipo") {
    const traco = tracos?.[tipoNorm];
    if (traco) {
      if (traco.imunidade) {
        return { dano: 0, notas: [`imune a ${tipoNorm}`] };
      }
      if (traco.vulnerabilidade) {
        dano *= 2;
        notas.push(`vuln. ×2`);
      } else if (traco.value > 0) {
        const antes = dano;
        dano = Math.max(0, dano - traco.value);
        notas.push(`RD ${traco.value}: ${antes}→${dano}`);
      }
    }
  }

  return { dano, notas };
}

Hooks.on("createChatMessage", async (message, options, userId) => {
  if (!cfg("autoAtaque")) return;
  if (!message.rolls?.length) return;
  if (userId !== game.userId) return;

  const rollAtaque = message.rolls.find(r => r.formula?.includes("d20"));
  if (!rollAtaque) return;

  const rollDano = message.rolls.find(r => !r.formula?.includes("d20"));
  const targets = Array.from(game.user.targets);
  if (!targets.length) return;

  const totalAtaque = rollAtaque.total;
  const d20Result = rollAtaque.dice?.[0]?.results?.[0]?.result;
  const danoPorTipo = rollDano ? extrairDanoPorTipo(rollDano) : null;

  const dadosAlvos = targets.map(target => {
    const actor = target.actor;

    const defesa =
      actor.system?.attributes?.defesa?.value ??
      actor.system?.defesa?.value ?? 10;

    const pvAtual =
      foundry.utils.getProperty(actor, "system.attributes.pv.value") ?? "?";

    const pvMax =
      foundry.utils.getProperty(actor, "system.attributes.pv.max") ?? "?";

    const tracos = actor.system?.tracos?.resistencias ?? {};
    const rdGeral = parseInt(tracos?.dano?.value) || parseInt(tracos?.dano?.base) || parseInt(tracos?.perda?.value) || parseInt(tracos?.perda?.base) || 0;

    const erroNatural = d20Result === 1;
    const possivelCritico = d20Result >= 20;
    const acertou = !erroNatural && totalAtaque >= defesa;

    return {
      tokenId: target.id,
      nome: target.name,
      defesa, pvAtual, pvMax,
      rdGeral, tracos,
      acertou, erroNatural, possivelCritico
    };
  });

  if (cfg("mensagemPublica")) await criarMensagemPublica(totalAtaque, dadosAlvos);

  if (game.user.isGM) {
    if (cfg("danoAutoGM")) await criarMensagemGM(totalAtaque, dadosAlvos, danoPorTipo, rollDano?.total ?? null);
  } else {
    game.socket.emit("module.arsenal-t20", {
      tipo: "atacou",
      totalAtaque, dadosAlvos,
      danoPorTipo,
      danoTotal: rollDano?.total ?? null
    });
  }
});

Hooks.once("ready", () => {
  game.socket.on("module.arsenal-t20", async (data) => {
    if (!game.user.isGM) return;
    if (data.tipo === "atacou") {
      if (cfg("danoAutoGM")) await criarMensagemGM(data.totalAtaque, data.dadosAlvos, data.danoPorTipo, data.danoTotal);
    }
    if (data.tipo === "aplicarCondicoes") {
      const actor = game.actors.get(data.actorId);
      if (actor) await aplicarCondicoes(actor, data.condicoes, data.nomeItem);
    }
  });
});

async function criarMensagemPublica(totalAtaque, dadosAlvos) {
  let html = `
    <div class="t20-card" style="background:linear-gradient(135deg,#1a1200,#2a1e00);border:1px solid #7a5a00;border-top:3px solid #c9a227;border-radius:6px;padding:10px;color:#e8d5b7;font-family:'Palatino Linotype',serif;">
      <div class="t20-card-titulo" style="color:#c9a227;font-family:'Cinzel',serif;font-weight:bold;margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid #3a2a00;">
        ⚔️ Ataque — Total: ${totalAtaque}
      </div>`;

  for (const a of dadosAlvos) {
    const cor = a.erroNatural ? "#888" : a.possivelCritico && a.acertou ? "#ff6b35" : a.acertou ? "#27ae60" : "#e74c3c";
    const label = a.erroNatural ? "💨 Erro Natural" : a.possivelCritico && a.acertou ? "⚔️ CRÍTICO!" : a.acertou ? "✅ Acertou!" : "❌ Errou";
    const classeRes = a.erroNatural ? "" : a.possivelCritico && a.acertou ? "critico" : a.acertou ? "acerto" : "erro";
    html += `
      <div class="t20-resultado ${classeRes}" style="border-left-color:${cor};">
        <span class="t20-nome">${a.nome}</span>
        <span style="color:${cor};font-weight:bold">${label}</span>
      </div>`;
  }
  html += `</div>`;
  await ChatMessage.create({ content: html });
}

async function criarMensagemGM(totalAtaque, dadosAlvos, danoPorTipo, danoTotal) {
  const temDano = danoPorTipo && Object.keys(danoPorTipo).length > 0;

  let html = `
    <div class="t20-card" style="background:linear-gradient(135deg,#0f0f1a,#1a1a2e);border:1px solid #2a2a5a;border-top:3px solid #9a7fd4;border-radius:6px;padding:12px;color:#e8d5b7;font-family:'Palatino Linotype',serif;">
      <div style="border-bottom:1px solid #5a3a1a;padding-bottom:8px;margin-bottom:10px">
        <span style="color:#c9a227;font-weight:bold">🎲 Painel do GM — Ataque: ${totalAtaque}</span>
        ${temDano ? `<span style="float:right;color:#e74c3c;font-weight:bold">Dano base: ${danoTotal}</span>` : ""}
      </div>`;

  for (const a of dadosAlvos) {
    const cor = a.erroNatural ? "#555" : a.possivelCritico && a.acertou ? "#ff6b35" : a.acertou ? "#27ae60" : "#e74c3c";
    const label = a.erroNatural ? "💨 Erro Natural" : a.possivelCritico && a.acertou ? "⚔️ CRÍTICO!" : a.acertou ? "✅ Acertou" : "❌ Errou";

    let danoFinalTotal = 0;
    let linhasDano = [];

    let danoPerda = 0; // perda de PV (reduz pvMax também)

    if (temDano && a.acertou) {
      // O sistema base de Tormenta20 já entrega o dano crítico corretamente na rolagem.
      // O Arsenal T20 não deve multiplicar o dano novamente; apenas aplica RD, imunidade
      // e vulnerabilidade sobre o valor já rolado pelo sistema.
      for (const [tipo, valor] of Object.entries(danoPorTipo)) {
        if (isNaN(valor) || valor === null) continue;

        const tipoNorm = tipo === "perfuração" ? "perfuracao" : tipo;
        const ePerda   = tipoNorm === "perda";

        if (ePerda) {
          // Perda de PV não sofre RD nem resistências — aplica direto.
          danoPerda += valor;
          linhasDano.push(`
            <div style="font-size:0.82em;color:#c0392b;padding:2px 0">
              perda de PV: ${valor} → <b>${valor}</b> (reduz PV máx)
            </div>`);
          continue;
        }

        const { dano, notas } = calcularDanoComResistencias(valor, tipoNorm, a.tracos);
        danoFinalTotal += dano;

        const notaStr   = notas.length ? ` (${notas.join(", ")})` : "";
        const tipoLabel = tipo !== "sem_tipo" ? tipo : "sem tipo específico";
        const corLinha  = dano === 0 ? "#666" : dano < valor ? "#e67e22" : "#ccc";

        linhasDano.push(`
          <div style="font-size:0.82em;color:${corLinha};padding:2px 0">
            ${tipoLabel}: ${valor} → <b>${dano}</b>${notaStr}
          </div>`);
      }

      // RD geral aplicada ao total de dano normal (não à perda de PV)
      if (a.rdGeral > 0 && danoFinalTotal > 0) {
        const antes = danoFinalTotal;
        danoFinalTotal = Math.max(0, danoFinalTotal - a.rdGeral);
        linhasDano.push(`
          <div style="font-size:0.82em;color:#aaa;padding:2px 0;
            border-top:1px solid rgba(255,255,255,0.08);margin-top:2px">
            RD geral ${a.rdGeral}: ${antes} → <b>${danoFinalTotal}</b>
          </div>`);
      }
    }

    // Resumo de resistências relevantes
    const resInfo = Object.entries(a.tracos ?? {})
      .filter(([k, v]) => k !== "perda" && k !== "dano" && (v?.imunidade || v?.vulnerabilidade || v?.value > 0))
      .map(([k, v]) => v?.imunidade ? `🛡️${k}` : v?.vulnerabilidade ? `⚡${k}` : `RD${v.value}[${k}]`)
      .join(" · ");

    html += `
      <div style="border-left:4px solid ${cor};padding:8px 10px;margin-bottom:6px;
        border-radius:0 4px 4px 0;background:rgba(255,255,255,0.03)">
        <div style="display:flex;justify-content:space-between">
          <b>${a.nome}</b>
          <span style="color:${cor};font-weight:bold">${label}</span>
        </div>
        <div style="font-size:0.8em;color:#888;margin-top:3px">
          DEF ${a.defesa} · PV ${a.pvAtual}/${a.pvMax}
          ${a.rdGeral > 0 ? ` · RD geral ${a.rdGeral}` : ""}
          ${resInfo ? ` · ${resInfo}` : ""}
        </div>
        ${a.acertou && temDano ? `
        <div style="margin-top:6px;padding:4px 6px;background:rgba(0,0,0,0.2);border-radius:4px">
          ${linhasDano.join("")}
          <div style="font-size:0.9em;font-weight:bold;color:#e8d5b7;margin-top:4px;
            border-top:1px solid rgba(255,255,255,0.1);padding-top:4px">
            Total final: ${danoFinalTotal + danoPerda}
            ${danoPerda > 0 ? `<span style="font-size:0.85em;color:#c0392b"> (${danoFinalTotal} dano + ${danoPerda} perda de PV)</span>` : ""}
          </div>
        </div>
        <div style="display:flex;gap:6px;margin-top:8px">
          <button class="t20-aplicar"
            data-token="${a.tokenId}"
            data-dano="${danoFinalTotal}"
            data-dano-perda="${danoPerda}"
            style="flex:1;padding:5px;border-radius:4px;cursor:pointer;
              background:#7a1a1a;border:1px solid #a02020;color:#fff;font-size:0.85em">
            💔 Aplicar ${danoFinalTotal + danoPerda} de Dano
          </button>
          <button class="t20-metade"
            data-token="${a.tokenId}"
            data-dano="${Math.floor(danoFinalTotal / 2)}"
            data-dano-perda="${Math.floor(danoPerda / 2)}"
            style="flex:1;padding:5px;border-radius:4px;cursor:pointer;
              background:#2c3e50;border:1px solid #3d5166;color:#fff;font-size:0.85em">
            🛡️ Metade (${Math.floor((danoFinalTotal + danoPerda) / 2)})
          </button>
        </div>` : a.acertou ? `
        <div style="font-size:0.8em;color:#e67e22;margin-top:6px">
          ⚠️ Nenhum roll de dano encontrado.
        </div>` : ""}
      </div>`;
  }

  html += `</div>`;

  const novaMsg = await ChatMessage.create({
    content: html,
    whisper: ChatMessage.getWhisperRecipients("GM")
  });

  Hooks.once("renderChatMessageHTML", (msg, html) => {
    if (msg.id !== novaMsg.id) return;
    // html is now HTMLElement directly in v13+
    html.querySelectorAll(".t20-aplicar, .t20-metade").forEach(btn =>
      btn.addEventListener("click", () => aplicarDano(btn))
    );
  })
}

async function aplicarDano(btn) {
  const tokenId   = btn.dataset.token;
  const dano      = parseInt(btn.dataset.dano) || 0;
  const danoPerda = parseInt(btn.dataset.danoPerda) || 0;
  const token     = canvas.tokens.get(tokenId);
  if (!token) return;

  if (dano <= 0 && danoPerda <= 0) {
    return ChatMessage.create({
      content: `🛡️ <b>${token.name}</b> absorveu todo o dano.`
    });
  }

  const pvPath    = "system.attributes.pv.value";
  const pvMaxPath = "system.attributes.pv.max";
  const pvAtual   = foundry.utils.getProperty(token.actor, pvPath);
  const pvMax     = foundry.utils.getProperty(token.actor, pvMaxPath) ?? pvAtual;
  if (pvAtual === undefined) return ui.notifications.warn("PV não encontrado!");

  let novoMax = pvMax;
  let novoPV  = pvAtual;
  const update = {};
  let msgExtra = "";

  // Perda de PV: reduz pvMax E pvAtual pelo mesmo valor
  if (danoPerda > 0) {
    novoMax = Math.max(0, pvMax  - danoPerda);
    novoPV  = Math.max(0, pvAtual - danoPerda);
    update[pvMaxPath] = novoMax;
    update[pvPath]    = novoPV;
    msgExtra += `<br>💀 Perda de PV: máx ${pvMax} → <b>${novoMax}</b>`;
  }

  // Dano normal: reduz apenas pvAtual
  if (dano > 0) {
    novoPV = Math.max(0, novoPV - dano);
    update[pvPath] = novoPV;
  }

  await token.actor.update(update);

  const cor = novoPV === 0 ? "red" : novoPV <= novoMax / 2 ? "orange" : "green";
  const danTotal = dano + danoPerda;

  ChatMessage.create({
    content: `💔 <b>${token.name}</b> sofreu <b>${danTotal} de dano</b>.<br>
      PV: ${pvAtual} → <span style="color:${cor}"><b>${novoPV}</b>/${novoMax}</span>
      ${msgExtra}
      ${novoPV === 0 ? "<br>💀 <b>Incapacitado!</b>" : ""}`
  });

  btn.closest("div").querySelectorAll("button")
    .forEach(b => { b.disabled = true; b.style.opacity = "0.5"; });
}



// ============================================================
// SALVAMENTOS - Detecta magias/habilidades com teste de resistência
// ============================================================

const SALV_MAP = {
  refl:       { label: "Reflexos",   atributo: "des", pericia: "refl" },
  fort:       { label: "Fortitude",  atributo: "con", pericia: "fort" },
  vont:       { label: "Vontade",    atributo: "sab", pericia: "vont" },
  reflexos:   { label: "Reflexos",   atributo: "des", pericia: "refl" },
  fortitude:  { label: "Fortitude",  atributo: "con", pericia: "fort" },
  vontade:    { label: "Vontade",    atributo: "sab", pericia: "vont" },
};

function numeroOuNull(valor) {
  if (valor === undefined || valor === null || valor === "") return null;
  if (typeof valor === "number" && Number.isFinite(valor)) return valor;
  if (typeof valor === "string") {
    const normalizado = valor.trim().replace(",", ".");
    const direto = Number(normalizado);
    if (Number.isFinite(direto)) return direto;
    const match = normalizado.match(/[-+]?\d+(?:\.\d+)?/);
    if (match) {
      const parsed = Number(match[0]);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function obterNumeroEmCaminhos(obj, caminhos) {
  let maior = null;
  for (const caminho of caminhos) {
    const valor = foundry.utils.getProperty(obj, caminho);
    const num = numeroOuNull(valor);
    if (num === null) continue;
    if (maior === null || num > maior) maior = num;
  }
  return maior;
}

function bonusCDPorDescricao(descricao, multiplicador = 1) {
  const texto = (descricao ?? "").replace(/<[^>]+>/g, " ");
  const regexes = [
    /(?:\+|mais\s+)(\d+)\s+(?:na|à|nas|às|em)\s+CD(?:s)?(?:\s+de\s+magias?)?/i,
    /CD(?:s)?\s+(?:de\s+magias?\s*)?(?:\+|aumenta\s+em\s+)(\d+)/i,
    /aumenta\s+a\s+CD(?:s)?(?:\s+de\s+magias?)?\s+em\s+(\d+)/i,
    /CD(?:s)?\s+de\s+suas\s+magias\s+aumenta(?:m)?\s+em\s+\+?(\d+)/i,
  ];

  for (const regex of regexes) {
    const m = texto.match(regex);
    if (m) return (parseInt(m[1]) || 0) * multiplicador;
  }
  return 0;
}

function bonusCDPorEfeitosAtivos(actor) {
  let bonus = 0;
  const efeitos = actor?.effects?.contents ?? actor?.effects ?? [];

  for (const efeito of efeitos) {
    if (efeito?.disabled) continue;
    for (const change of (efeito?.changes ?? [])) {
      const key = String(change.key ?? "").toLowerCase();
      const value = numeroOuNull(change.value);
      if (value === null) continue;

      // Aceita chaves antigas data.* e novas system.*. O sistema T20 usa efeitos passivos
      // transferidos para o ator; dependendo da versão, o campo de CD pode aparecer com nomes
      // diferentes. Limitamos o match a chaves claramente ligadas à CD de magia/resistência.
      const pareceCD =
        /(^|\.)(cd|cds|dc|cdmagia|cdmagias|spellcd)(\.|$)/i.test(key) ||
        (key.includes("mag") && key.includes("cd")) ||
        (key.includes("resist") && key.includes("cd"));

      if (!pareceCD) continue;

      const modoAdicionar = change.mode === undefined ||
        change.mode === null ||
        change.mode === globalThis.CONST?.ACTIVE_EFFECT_MODES?.ADD ||
        change.mode === 2;

      if (modoAdicionar) bonus += value;
    }
  }

  return bonus;
}

function calcularCDMagiaAtor(actor, itemData, message) {
  const atribConjuracao =
    itemData?.cd?.atributo ??
    itemData?.resistencia?.atributo ??
    actor.system?.attributes?.conjuracao ??
    actor.system?.conjuracao ??
    "int";

  const valorAtrib = numeroOuNull(actor.system?.atributos?.[atribConjuracao]?.value) ?? 0;
  const nivel =
    numeroOuNull(actor.system?.attributes?.nivel?.value) ??
    numeroOuNull(actor.system?.nivel?.value) ??
    numeroOuNull(actor.system?.nivel) ??
    0;
  const metadeNivel = Math.floor(nivel / 2);

  // Cálculo-base de Tormenta20: 10 + metade do nível + atributo de conjuração.
  let bonusCD = 0;

  const onUseEffects = message.flags?.tormenta20?.onUseEffects ?? [];
  for (const efeito of onUseEffects) {
    const multiplicador = parseInt(efeito.qty) || 1;
    bonusCD += bonusCDPorDescricao(efeito.description ?? "", multiplicador);
  }

  // Mantém compatibilidade com bônus escritos na descrição de poderes/itens.
  for (const item of actor.items ?? []) {
    const tipo = item.type ?? "";
    if (!["feat", "power", "feature", "habilidade", "poder"].includes(tipo)) continue;
    bonusCD += bonusCDPorDescricao(item.system?.description?.value ?? "");
  }

  const cdCalculada = 10 + metadeNivel + valorAtrib + bonusCD;

  // Quando o próprio sistema T20 já preparou a CD total no actor.system, preferimos esse valor.
  // Isso captura bônus passivos transferidos por Active Effects que já aparecem na ficha.
  const cdSistema = obterNumeroEmCaminhos(actor, [
    "system.attributes.cd.value",
    "system.attributes.cd.final",
    "system.attributes.cd.total",
    "system.attributes.cdMagia.value",
    "system.attributes.cdMagia.final",
    "system.attributes.cdMagias.value",
    "system.attributes.cdMagias.final",
    "system.attributes.magias.cd.value",
    "system.attributes.magias.cd.final",
    "system.magias.cd.value",
    "system.magias.cd.final",
    "system.cdMagia.value",
    "system.cdMagia.final",
    "system.cdMagias.value",
    "system.cdMagias.final",
    "system.cd.value",
    "system.cd.final",
  ]);

  const cdComEfeitos = cdCalculada + bonusCDPorEfeitosAtivos(actor);
  const cd = Math.max(cdCalculada, cdComEfeitos, cdSistema ?? -Infinity);

  console.log(
    `Arsenal T20 | CD | nivel=${nivel} metade=${metadeNivel} atrib=${atribConjuracao}(${valorAtrib}) ` +
    `bonusDescr=${bonusCD} cdSistema=${cdSistema ?? "n/a"} → CD=${cd}`
  );

  return cd;
}

Hooks.on("createChatMessage", async (message, options, userId) => {
  if (!cfg("autoSalvamento")) return;
  if (userId !== game.userId) return;

  const actorId = message.speaker?.actor;
  if (!actorId) return;

  // T20 guarda os dados do item em flags.tormenta20.itemData
  const itemData = message.flags?.tormenta20?.itemData;
  if (!itemData) return;

  const resistencia = itemData?.resistencia;
  if (!resistencia?.txt && !resistencia?.pericia) return;

  // Ignorar se não houver texto de salvamento
  const txt = (resistencia.txt ?? "").toLowerCase();
  if (!txt) return;

  const actor = game.actors.get(actorId);
  if (!actor) return;

  // Detectar tipo de salvamento pelo campo pericia ou pelo texto
  const pericia = (resistencia.pericia ?? "").toLowerCase();
  let salvInfo = SALV_MAP[pericia];
  if (!salvInfo) {
    for (const [key, val] of Object.entries(SALV_MAP)) {
      if (txt.includes(key)) { salvInfo = val; break; }
    }
  }
  if (!salvInfo) return;

  // Nome e imagem do item pelo HTML da mensagem
  const nomeMatch = message.content?.match(/title="([^"]+)"/);
  const imgMatch  = message.content?.match(/img[^>]+src="([^"]+)"/);
  const nomeItem  = nomeMatch?.[1] ?? "Habilidade";
  const imgItem   = imgMatch?.[1]  ?? "";

  // ── Cálculo de CD de magias ────────────────────────────────
  // Preferimos a CD final preparada pelo sistema T20 quando disponível, pois ela já inclui
  // bônus passivos transferidos para a ficha. Se o campo não existir, usamos o cálculo-base
  // com fallbacks para descrições e Active Effects.
  const cd = calcularCDMagiaAtor(actor, itemData, message);

  // Dano da magia
  const rolls       = itemData?.rolls ?? [];
  const tipoDano    = rolls[0]?.parts?.[0]?.[1] ?? "";
  const formulaDano = rolls[0]?.parts?.[0]?.[0] ?? "";

  // Dano já rolado na mesma mensagem
  const rollDanoMagia = message.rolls?.find(r => !r.formula?.includes("d20"));
  const danoRolado = rollDanoMagia?.total ?? null;

  // Detectar condições por contexto textual.
  // Usa a descrição do item, o conteúdo final do chat e efeitos temporários/onUse,
  // pois algumas condições do sistema T20 aparecem apenas como link/efeito no card renderizado.
  const descricaoTexto = [
    itemData?.description?.value ?? "",
    message.content ?? "",
    ...(message.flags?.tormenta20?.onUseEffects ?? []).map(e => `${e?.label ?? e?.name ?? ""} ${e?.description ?? ""}`),
    ...(itemData?.effects ?? []).map(e => `${e?.label ?? e?.name ?? ""} ${e?.description ?? e?.system?.description?.value ?? ""}`),
  ].filter(Boolean).join(" ");
  const condicoesIA = detectarCondicoesContexto(nomeItem, descricaoTexto, resistencia.txt ?? "");
  const condicoesAoFalhar = condicoesIA.aoFalhar ?? [];
  const condicoesAoPassar = condicoesIA.aoPassar ?? [];

  // Verifica se o item tem área (template) — se sim, guarda dados para usar no template
  const temArea = !!(itemData?.target?.type && ["cone","circle","square","ray","line"].includes(itemData.target.type));

  if (temArea) {
    // Guarda os dados do salvamento para associar ao próximo template criado
    _salvamentoPendente = {
      nomeItem,
      imgItem,
      nomeConjurador: actor.name,
      salvLabel:    salvInfo.label,
      salvPericia:  salvInfo.pericia,
      salvAtributo: salvInfo.atributo,
      cd,
      efeitoSucesso: resistencia.txt,
      tipoDano,
      formulaDano,
      danoRolado,
      condicoesAoFalhar,
      condicoesAoPassar,
      actorId: actor.id,
      expira: Date.now() + 30000, // expira em 30s se nenhum template for criado
    };
    ui.notifications.info(`🎯 ${nomeItem} — posicione o template de área. O card de resistência será gerado automaticamente.`);
  } else {
    // Sem área: gera o card normal (alvos selecionados manualmente)
    await criarCartaoSalvamento({
      nomeItem,
      imgItem,
      nomeConjurador: actor.name,
      salvLabel:    salvInfo.label,
      salvPericia:  salvInfo.pericia,
      salvAtributo: salvInfo.atributo,
      cd,
      efeitoSucesso: resistencia.txt,
      tipoDano,
      formulaDano,
      danoRolado,
      condicoesAoFalhar,
      condicoesAoPassar,
    });
  }
});

// ── Dados do salvamento pendente (aguardando template de área) ──
let _salvamentoPendente = null;

// ── Detecta tokens dentro de um MeasuredTemplate ──────────
function tokensNaArea(template) {
  const scene = game.scenes.active;
  if (!scene) return [];

  const tokens = scene.tokens.contents;
  const resultado = [];

  for (const token of tokens) {
    try {
      // Centro do token em coordenadas do canvas
      const tokenDoc = token;
      const tw = (tokenDoc.width  ?? 1) * scene.grid.size;
      const th = (tokenDoc.height ?? 1) * scene.grid.size;
      const cx = tokenDoc.x + tw / 2;
      const cy = tokenDoc.y + th / 2;

      // Usa a API do Foundry para checar se o ponto está dentro do template
      const tmplObj = template.object ?? canvas.templates?.get(template.id);
      if (!tmplObj) continue;

      // Foundry v13: tmplObj.shape é um PIXI shape com método contains()
      if (tmplObj.shape?.contains) {
        // Coordenadas relativas ao template
        const relX = cx - template.x;
        const relY = cy - template.y;
        if (tmplObj.shape.contains(relX, relY)) {
          resultado.push(tokenDoc);
        }
      } else if (typeof tmplObj.isInside === "function") {
        // Fallback API mais antiga
        if (tmplObj.isInside({ x: cx, y: cy })) {
          resultado.push(tokenDoc);
        }
      }
    } catch(e) { /* ignora erros por token */ }
  }
  return resultado;
}

// ── Hook: template criado → associa ao salvamento pendente ──
Hooks.on("createMeasuredTemplate", async (template, options, userId) => {
  if (userId !== game.userId) return;
  if (!_salvamentoPendente) return;

  // Checa se expirou
  if (Date.now() > _salvamentoPendente.expira) {
    _salvamentoPendente = null;
    return;
  }

  const dados = _salvamentoPendente;
  _salvamentoPendente = null;

  // Pequena espera para o template renderizar no canvas
  await new Promise(r => setTimeout(r, 150));

  // Detecta tokens na área
  const tokensAlvos = tokensNaArea(template);
  const nomesAlvos  = tokensAlvos.map(t => t.name);

  // Gera o card de salvamento com a lista de alvos na área
  await criarCartaoSalvamento({
    ...dados,
    tokensNaArea: nomesAlvos,
    templateId:   template.id,
  });

  // Deleta o template após 60s automaticamente (opcional — pode remover se preferir)
  // setTimeout(() => template.delete?.(), 60000);
});

// Gera o HTML de um card de salvamento (reutilizável)
function htmlCartaoSalvamento({ nomeItem, imgItem, nomeConjurador,
    salvLabel, salvPericia, cd, efeitoSucesso, tipoDano, formulaDano, danoRolado,
    condicoesAoFalhar = [], condicoesAoPassar = [],
    nomeAlvo = null, tokenId = null }) {

  const tagAlvo = nomeAlvo
    ? `<div style="font-size:0.8em;color:#aaa;margin-bottom:8px;
        padding:3px 8px;background:rgba(0,0,0,0.2);border-radius:4px;
        border-left:3px solid #c9a227">
        🎯 Alvo: <b style="color:#e8d5b7">${nomeAlvo}</b>
      </div>`
    : "";

  const dataToken = tokenId ? `data-token-alvo="${tokenId}"` : "";

  return `
    <div class="t20-card" style="background:linear-gradient(135deg,#0a1a0a,#0f2a1a);
      border:1px solid #1a4a1a;border-top:3px solid #27ae60;
      border-radius:6px;padding:12px;color:#e8d5b7;font-family:'Palatino Linotype',serif;">
      <div style="display:flex;align-items:center;gap:10px;
        border-bottom:1px solid #1a6a2a;padding-bottom:8px;margin-bottom:10px">
        ${imgItem ? `<img src="${imgItem}" style="width:34px;height:34px;border-radius:4px;border:1px solid #c9a227;object-fit:cover"/>` : ""}
        <div>
          <div style="color:#c9a227;font-weight:bold">${nomeItem}</div>
          <div style="font-size:0.78em;color:#888">por ${nomeConjurador}</div>
        </div>
        <div style="margin-left:auto;text-align:center">
          <div style="font-size:0.7em;color:#aaa;text-transform:uppercase">CD</div>
          <input type="number" class="t20-cd-input" value="${cd}"
            style="width:50px;text-align:center;font-size:1.3em;font-weight:bold;
              color:#e74c3c;background:transparent;border:1px solid #e74c3c33;
              border-radius:4px;padding:2px"/>
        </div>
      </div>
      ${tagAlvo}
      <div style="font-size:0.85em;color:#aaa;margin-bottom:10px">
        🎲 Teste de <b style="color:#e8d5b7">${salvLabel}</b> CD ${cd}
        ${efeitoSucesso ? `<br>✅ Sucesso: ${efeitoSucesso}` : ""}
        ${formulaDano   ? `<br>💥 Dano: ${formulaDano}${tipoDano ? ` [${tipoDano}]` : ""}` : ""}
        ${condicoesAoFalhar.length ? `<br>❌ Falha aplica: <b>${condicoesAoFalhar.map(id => CONFIG.statusEffects.find(e=>e.id===id)?.name ?? id).join(", ")}</b>` : ""}
        ${condicoesAoPassar.length ? `<br>✅ Sucesso aplica: <b>${condicoesAoPassar.map(id => CONFIG.statusEffects.find(e=>e.id===id)?.name ?? id).join(", ")}</b>` : ""}
      </div>
      <div style="display:flex;gap:6px;margin-top:6px">
        <button class="t20-salvar"
          data-salv-pericia="${salvPericia}"
          data-salv-label="${salvLabel}"
          data-cd="${cd}"
          data-item="${nomeItem}"
          data-dano="${danoRolado ?? 0}"
          data-tipo-dano="${tipoDano}"
          data-condicoes-falhar="${condicoesAoFalhar.join(',')}"
          data-condicoes-passar="${condicoesAoPassar.join(',')}"
          data-poder="0"
          data-evasao="0"
          ${dataToken}
          title="Sucesso: ÷2 | Falha: total"
          style="flex:2;padding:6px 4px;border-radius:4px;cursor:pointer;font-size:0.82em;
            background:linear-gradient(135deg,#1a4a1a,#2a6a2a);
            border:1px solid #3a8a3a;color:#fff;font-weight:bold">
          🎲 ${salvLabel}
        </button>
        <button class="t20-custom"
          data-salv-pericia="${salvPericia}"
          data-salv-label="${salvLabel}"
          data-cd="${cd}"
          data-item="${nomeItem}"
          data-dano="${danoRolado ?? 0}"
          data-tipo-dano="${tipoDano}"
          data-condicoes-falhar="${condicoesAoFalhar.join(',')}"
          data-condicoes-passar="${condicoesAoPassar.join(',')}"
          ${dataToken}
          title="Escolher atributo, bônus e habilidades"
          style="flex:1;padding:6px 4px;border-radius:4px;cursor:pointer;font-size:0.82em;
            background:linear-gradient(135deg,#3a2a1a,#5a3a1a);
            border:1px solid #8a5a2a;color:#fff;font-weight:bold">
          ⚙️ Modificador
        </button>
      </div>
    </div>`;
}

async function criarCartaoSalvamento({ nomeItem, imgItem, nomeConjurador,
    salvLabel, salvPericia, salvAtributo, cd, efeitoSucesso, tipoDano, formulaDano, danoRolado,
    condicoesAoFalhar = [], condicoesAoPassar = [],
    tokensNaArea = [], templateId = null }) {

  const dadosBase = {
    nomeItem, imgItem, nomeConjurador, salvLabel, salvPericia,
    cd, efeitoSucesso, tipoDano, formulaDano, danoRolado,
    condicoesAoFalhar, condicoesAoPassar,
  };

  if (tokensNaArea.length > 0) {
    // Magia em área: gera um card individual por token detectado
    // Header único com o nome da magia
    const headerHtml = `
      <div style="background:linear-gradient(135deg,#0a1a0a,#0f2a1a);
        border:1px solid #1a4a1a;border-top:3px solid #27ae60;
        border-radius:6px;padding:8px 12px;margin-bottom:4px;
        color:#e8d5b7;font-family:'Palatino Linotype',serif;">
        <div style="display:flex;align-items:center;gap:8px">
          ${imgItem ? `<img src="${imgItem}" style="width:28px;height:28px;border-radius:4px;border:1px solid #c9a227;object-fit:cover"/>` : ""}
          <div>
            <div style="color:#c9a227;font-weight:bold">🎯 ${nomeItem} — Área</div>
            <div style="font-size:0.78em;color:#888">por ${nomeConjurador} · CD ${cd} · ${tokensNaArea.length} alvo(s)</div>
          </div>
        </div>
      </div>`;

    // Um card por token
    const cardsHtml = tokensNaArea.map(t =>
      htmlCartaoSalvamento({ ...dadosBase, nomeAlvo: t.name, tokenId: t.id })
    ).join("");

    await ChatMessage.create({ content: headerHtml + cardsHtml });

  } else {
    // Magia sem área: card único sem alvo fixo
    await ChatMessage.create({
      content: htmlCartaoSalvamento(dadosBase),
    });
  }
}

async function rolarSalvamento(btn) {
  const salvPericia = btn.dataset.salvPericia;
  const salvLabel   = btn.dataset.salvLabel;
  // Busca o input de CD subindo até o card inteiro (.t20-card ou a mensagem)
  const card        = btn.closest(".t20-card") ?? btn.closest(".message-content") ?? btn.parentElement;
  const cdInput     = card?.querySelector(".t20-cd-input");
  const cd          = cdInput ? parseInt(cdInput.value) : parseInt(btn.dataset.cd);
  const nomeItem    = btn.dataset.item;
  const danoBase    = parseInt(btn.dataset.dano) || 0;
  const tipoDano    = (btn.dataset.tipoDano ?? "").toLowerCase();
  const temPoder    = btn.dataset.poder === "1";
  const condicoesFalhar = (btn.dataset.condicoesFalhar ?? "").split(",").filter(Boolean);
  const condicoesPassar = (btn.dataset.condicoesPassar ?? "").split(",").filter(Boolean);

  // Se o card tem um token fixo (magia em área), usa ele; senão usa o controlado
  const tokenAlvoId = btn.dataset.tokenAlvo;
  const tokenAlvo   = tokenAlvoId ? canvas.tokens.get(tokenAlvoId) : canvas.tokens.controlled[0];
  const actor       = tokenAlvo?.actor ?? game.user.character;
  if (!actor) return ui.notifications.warn("Selecione seu token antes de rolar!");

  const pericias = actor.system?.pericias ?? {};
  const _pRaw    = pericias[salvPericia];
  // T20 às vezes serializa a perícia como string JSON — faz o parse se necessário
  const pericia  = typeof _pRaw === "string" ? JSON.parse(_pRaw) : (_pRaw ?? {});
  const bonus    = pericia?.total ?? pericia?.value ?? pericia?.mod ?? 0;

  const roll    = await new Roll(`1d20 + ${bonus}`).evaluate();
  const sucesso = roll.total >= cd;
  const cor     = sucesso ? "#27ae60" : "#e74c3c";
  const label   = sucesso ? "✅ SUCESSO!" : "❌ FALHOU!";

  // Com poder (Evasão Aprimorada): sucesso = ÷4, falha = ÷2
  // Evasão simples: sucesso = 0, falha = total
  // Sem evasão: sucesso = ÷2, falha = total
  const temEvasao = btn.dataset.evasao === "1";
  let danoFinal = temPoder
    ? (sucesso ? Math.floor(danoBase / 4) : Math.floor(danoBase / 2))
    : temEvasao
      ? (sucesso ? 0 : danoBase)
      : (sucesso ? Math.floor(danoBase / 2) : danoBase);
  let notaDano  = "";

  if (danoBase > 0) {
    const tracos  = actor.system?.tracos?.resistencias ?? {};
    const tipoNorm = tipoDano || null;
    const traco   = tipoNorm ? tracos?.[tipoNorm] : null;

    if (traco?.imunidade) {
      danoFinal = 0;
      notaDano  = `Imune a ${tipoDano}! Nenhum dano.`;
    } else {
      if (traco?.vulnerabilidade) {
        danoFinal *= 2;
        notaDano += ` (vuln. ${tipoDano}: ×2)`;
      } else if (traco?.value > 0) {
        const antes = danoFinal;
        danoFinal   = Math.max(0, danoFinal - parseInt(traco.value));
        notaDano   += ` (RD ${traco.value} [${tipoDano}]: ${antes}→${danoFinal})`;
      }

      const rdGeral = parseInt(tracos?.dano?.value) || parseInt(tracos?.dano?.base) || 0;
      if (rdGeral > 0 && danoFinal > 0) {
        const antes = danoFinal;
        danoFinal   = Math.max(0, danoFinal - rdGeral);
        notaDano   += ` (RD geral ${rdGeral}: ${antes}→${danoFinal})`;
      }

      const prefixo = temPoder
        ? (sucesso
            ? `✅ Sucesso + Evasão Aprimorada! Dano: ${danoBase}÷4 = ${Math.floor(danoBase/4)}`
            : `❌ Falhou + Evasão Aprimorada! Dano: ${danoBase}÷2 = ${Math.floor(danoBase/2)}`)
        : temEvasao
          ? (sucesso
              ? `🌀 Evasão! Sem dano.`
              : `❌ Falhou! Dano total: ${danoBase}`)
          : (sucesso
              ? `✅ Sucesso! Dano: ${danoBase}÷2 = ${Math.floor(danoBase/2)}`
              : `❌ Falhou! Dano total: ${danoBase}`);
      notaDano = prefixo + notaDano;

      if (danoFinal > 0) {
        const hpPath  = "system.attributes.pv.value";
        const pvAtual = foundry.utils.getProperty(actor, hpPath);
        const pvMax   = foundry.utils.getProperty(actor, "system.attributes.pv.max") ?? pvAtual;
        if (pvAtual !== undefined) {
          const novoPV = Math.max(0, pvAtual - danoFinal);
          await actor.update({ [hpPath]: novoPV });
          const corPV = novoPV === 0 ? "red" : novoPV <= pvMax / 2 ? "orange" : "green";
          notaDano += `<br>💔 ${danoFinal} de dano. PV: ${pvAtual} → <span style="color:${corPV}"><b>${novoPV}</b></span>`;
          if (novoPV === 0) notaDano += "<br>💀 <b>Incapacitado!</b>";
        }
      } else {
        notaDano += "<br>Nenhum dano aplicado.";
      }
    }
  }

  // Mensagem da rolagem (limpa, só o resultado do dado)
  await roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `<b>${salvLabel}</b> contra <i>${nomeItem}</i> (CD ${cd})`,
  });

  // Mensagem separada com resultado e dano aplicado
  const msgConteudo = `
    <div style="border-left:4px solid ${cor};padding:6px 10px;border-radius:0 4px 4px 0">
      <div style="font-weight:bold;font-size:1.05em;color:${cor};margin-bottom:4px">
        ${label} — ${actor.name}
      </div>
      <div style="font-size:0.88em">
        ${notaDano}
      </div>
    </div>`;

  await ChatMessage.create({
    content: msgConteudo,
    speaker: ChatMessage.getSpeaker({ actor }),
  });

  // Aplicar condições baseado no resultado
  const condicoesAplicar = sucesso ? condicoesPassar : condicoesFalhar;
  if (cfg("autoCondicoes") && condicoesAplicar.length) {
    if (game.user.isGM) {
      await aplicarCondicoes(actor, condicoesAplicar, nomeItem);
    } else {
      game.socket.emit("module.arsenal-t20", {
        tipo: "aplicarCondicoes",
        actorId: actor.id,
        condicoes: condicoesAplicar,
        nomeItem,
      });
    }
  }

  // NÃO desabilita o botão — outros jogadores podem precisar rolar também
}

// Listener global persistente para botões de salvamento
Hooks.on("renderChatMessageHTML", (message, html) => {
  // html is HTMLElement directly in v13+
  html.querySelectorAll(".t20-salvar").forEach(btn => {
    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", () => rolarSalvamento(btn));
  });
  html.querySelectorAll(".t20-custom").forEach(btn => {
    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", () => abrirDialogCustom(btn));
  });
});

async function abrirDialogCustom(btn) {
  const cd              = parseInt(btn.dataset.cd);
  const nomeItem        = btn.dataset.item;
  const danoBase        = parseInt(btn.dataset.dano) || 0;
  const tipoDano        = (btn.dataset.tipoDano ?? "").toLowerCase();
  const salvPericiaBase = btn.dataset.salvPericia ?? "refl";
  const condicoesFalhar = (btn.dataset.condicoesFalhar ?? "").split(",").filter(Boolean);
  const condicoesPassar = (btn.dataset.condicoesPassar ?? "").split(",").filter(Boolean);

  const tokenAlvoId2 = btn.dataset.tokenAlvo;
  const tokenAlvo2   = tokenAlvoId2 ? canvas.tokens.get(tokenAlvoId2) : canvas.tokens.controlled[0];
  const actor        = tokenAlvo2?.actor ?? game.user.character;
  if (!actor) return ui.notifications.warn("Selecione seu token antes de rolar!");

  // Bônus de perícias de salvamento
  const pericias = actor.system?.pericias ?? {};
  const _parsePer = (k) => { const r = pericias[k]; return typeof r === "string" ? JSON.parse(r) : (r ?? {}); };
  const bRefl = _parsePer("refl")?.value ?? 0;
  const bFort = _parsePer("fort")?.value ?? 0;
  const bVont = _parsePer("vont")?.value ?? 0;
  const labelPericia = { refl: "Reflexos", fort: "Fortitude", vont: "Vontade" };

  // ── Coleta habilidades relevantes dos itens E da ficha do personagem ──
  const PALAVRAS_CHAVE = [
    "reflexos", "fortitude", "vontade", "salvamento", "resistência",
    "evasão", "resistir", "teste de", "bônus em", "bonus em",
    "resistencia a", "resistência a",
  ];

  // Padrão genérico para extrair "resistência a X +N" de texto corrido
  // Ex: "resistência a magia +5", "resistência a medo +5"
  const REGEX_RESIST_TEXTO = /resistên?cia\s+a\s+([\w\s]+?)\s*[+](\d+)/gi;

  const habilidades = [];

  // 1) Itens do ator
  for (const item of actor.items) {
    const nome = item.name ?? "";
    const desc = (item.system?.description?.value ?? "").replace(/<[^>]+>/g, " ").toLowerCase();
    const relevante = PALAVRAS_CHAVE.some(p => desc.includes(p) || nome.toLowerCase().includes(p));
    if (!relevante) continue;

    const matchBonus = desc.match(/[+]\s*(\d+)\s*(?:em|nos?|nos?\s+testes?|de bônus)/i);
    const bonusSugerido = matchBonus ? parseInt(matchBonus[1]) : null;
    const eEvasaoApr  = /evasão aprimorada/i.test(nome) || /evasão aprimorada/i.test(desc);
    const eEvasaoSimp = !eEvasaoApr && (/evasão/i.test(nome) || /evasão/i.test(desc));

    habilidades.push({
      id:   item.id,
      nome,
      bonus: bonusSugerido,
      evasaoAprimorada: eEvasaoApr,
      evasaoSimples:    eEvasaoSimp,
    });
  }

  // 2) Texto corrido da ficha (detalhes/biografia — onde NPCs têm seus traços)
  //    Busca campos comuns do sistema T20
  const camposTexto = [
    actor.system?.details?.biography?.value ?? "",
    actor.system?.details?.notes?.value     ?? "",
    actor.system?.details?.appearance?.value ?? "",
    actor.system?.attributes?.resistencias?.value ?? "",
    // Alguns sistemas guardam em "tracos" como texto
    actor.system?.tracos?.especiais?.value ?? "",
  ];
  const textoFicha = camposTexto
    .join(" ")
    .replace(/<[^>]+>/g, " ");

  // Também verifica o próprio nome + valor na linha de detalhes principais
  // (ex: "Fort: +21, Refl: +8, Vont: +15, imunidade a Confuso, resistência a magia +5")
  // Tenta extrair direto dos campos de atributo estruturados se existirem
  const resistTexto = textoFicha + " " + (actor.system?.details?.source ?? "");

  let m;
  REGEX_RESIST_TEXTO.lastIndex = 0;
  const vistas = new Set();
  while ((m = REGEX_RESIST_TEXTO.exec(resistTexto)) !== null) {
    const tipoResist = m[1].trim().toLowerCase();
    const valorResist = parseInt(m[2]);
    const chave = `resist_${tipoResist}`;
    if (vistas.has(chave)) continue;
    vistas.add(chave);

    // Mapeia tipo de resistência → qual perícia de salvamento é relevante
    // "resistência a magia" → Vontade/Fortitude/Reflexos (genérico — bônus em todos)
    // "resistência a medo"  → Vontade
    // Deixamos como bônus genérico; o jogador pode ajustar o atributo no select
    habilidades.push({
      id:   chave,
      nome: `Resistência a ${m[1].trim()} (+${valorResist})`,
      bonus: valorResist,
      evasaoAprimorada: false,
      evasaoSimples:    false,
      // Sugestão de perícia para auto-selecionar
      periciaAssociada: tipoResist.includes("medo") || tipoResist.includes("encantamento")
        ? "vont"
        : tipoResist.includes("veneno") || tipoResist.includes("doença")
          ? "fort"
          : null, // null = sem sugestão, fica com o padrão do efeito
    });
  }

  // Monta opções de habilidades para o select
  const opcoesHabilidades = habilidades.length > 0
    ? habilidades.map(h => {
        let label = h.nome;
        if (h.evasaoAprimorada)   label += " — Evasão Aprimorada (÷4/÷2)";
        else if (h.evasaoSimples)  label += " — Evasão Simples (sem dano/total)";
        // bônus já aparece no nome para resistências de texto; só adiciona para itens
        else if (h.bonus !== null && !h.id.startsWith("resist_")) label += ` — +${h.bonus} bônus`;
        return `<option value="${h.id}"
          data-bonus="${h.bonus ?? 0}"
          data-evasao-apr="${h.evasaoAprimorada ? 1 : 0}"
          data-evasao-simp="${h.evasaoSimples ? 1 : 0}"
          data-pericia="${h.periciaAssociada ?? ""}">
          ${label}
        </option>`;
      }).join("")
    : `<option value="" disabled>Nenhuma habilidade encontrada</option>`;

  const conteudo = `
    <div style="display:grid;gap:12px;padding:6px;font-family:'Crimson Text',serif">

      <div>
        <label style="font-weight:bold;display:block;margin-bottom:4px;font-size:0.9em;text-transform:uppercase;letter-spacing:0.04em">
          Atributo de salvamento
        </label>
        <select id="t20-mod-pericia" style="width:100%;padding:5px;border-radius:4px">
          <option value="refl" ${salvPericiaBase === "refl" ? "selected" : ""}>Reflexos (+${bRefl})</option>
          <option value="fort" ${salvPericiaBase === "fort" ? "selected" : ""}>Fortitude (+${bFort})</option>
          <option value="vont" ${salvPericiaBase === "vont" ? "selected" : ""}>Vontade (+${bVont})</option>
        </select>
      </div>

      <div>
        <label style="font-weight:bold;display:block;margin-bottom:4px;font-size:0.9em;text-transform:uppercase;letter-spacing:0.04em">
          Bônus adicional
        </label>
        <input id="t20-mod-bonus" type="number" value="0"
          style="width:100%;padding:5px;border-radius:4px;text-align:center"/>
      </div>

      <div>
        <label style="font-weight:bold;display:block;margin-bottom:4px;font-size:0.9em;text-transform:uppercase;letter-spacing:0.04em">
          Habilidade especial
        </label>
        <select id="t20-mod-habilidade" style="width:100%;padding:5px;border-radius:4px">
          <option value="" data-bonus="0" data-evasao-apr="0" data-evasao-simp="0">
            — Nenhuma —
          </option>
          ${opcoesHabilidades}
        </select>
        <div id="t20-mod-preview" style="margin-top:5px;font-size:0.82em;color:#aaa;min-height:1.4em;font-style:italic"></div>
      </div>

    </div>`;

  const dlg = new Dialog({
    title: `⚙️ Modificador — ${nomeItem}`,
    content: conteudo,
    render: (html) => {
      html.find("#t20-mod-habilidade").on("change", function() {
        const opt      = this.options[this.selectedIndex];
        const bonus    = parseInt(opt.dataset.bonus) || 0;
        const evaApr   = opt.dataset.evasaoApr === "1";
        const evaSimp  = opt.dataset.evasaoSimp === "1";
        const pericia  = opt.dataset.pericia;
        const prev     = html.find("#t20-mod-preview");

        if (evaApr)        prev.text("Evasão Aprimorada: sucesso ÷4 | falha ÷2");
        else if (evaSimp)  prev.text("Evasão Simples: sucesso sem dano | falha total");
        else if (bonus)    prev.text("+" + bonus + " no teste de salvamento");
        else               prev.text("");

        // Auto-selecionar atributo sugerido pela resistência
        if (pericia) html.find("#t20-mod-pericia").val(pericia);
      });
    },
    buttons: {
      rolar: {
        label: "🎲 Rolar",
        callback: (html) => {
          const pericia = html.find("#t20-mod-pericia").val();
          const bonusManual = parseInt(html.find("#t20-mod-bonus").val()) || 0;

          // Lê habilidade selecionada
          const sel      = html.find("#t20-mod-habilidade")[0];
          const opt      = sel?.options[sel.selectedIndex];
          const bonusHab = parseInt(opt?.dataset?.bonus) || 0;
          const evaApr   = opt?.dataset?.evasaoApr === "1";
          const evaSimp  = opt?.dataset?.evasaoSimp === "1";

          // Evasão tem prioridade sobre bônus numérico
          const temPoder = evaApr;
          const evasaoSimples = evaSimp;
          const bonusTotal = bonusManual + (evaApr || evaSimp ? 0 : bonusHab);

          rolarSalvamentoCustom({
            actor, cd, nomeItem, danoBase, tipoDano,
            salvPericia: pericia,
            salvLabel:   labelPericia[pericia],
            bonusExtra:  bonusTotal,
            temPoder,
            evasaoSimples,
            condicoesFalhar,
            condicoesPassar,
          });
        }
      },
      cancelar: { label: "Cancelar" }
    },
    default: "rolar",
  });
  dlg.render(true);
}

async function rolarSalvamentoCustom({ actor, cd, nomeItem, danoBase, tipoDano,
    salvPericia, salvLabel, bonusExtra, temPoder, evasaoSimples = false, condicoesFalhar = [], condicoesPassar = [] }) {

  const pericias  = actor.system?.pericias ?? {};
  const _pRaw2    = pericias[salvPericia];
  const p         = typeof _pRaw2 === "string" ? JSON.parse(_pRaw2) : (_pRaw2 ?? {});
  const bonusBase = p?.total ?? p?.value ?? p?.mod ?? 0;
  const bonus     = bonusBase + bonusExtra;
  const bonusStr = bonusExtra !== 0 ? ` ${bonusExtra > 0 ? "+" : ""}${bonusExtra} custom` : "";

  console.log(`Arsenal T20 | rolarSalvamentoCustom | pericia=${salvPericia} bonusBase=${bonusBase} bonusExtra=${bonusExtra} total=${bonus} cd=${cd}`);
  const roll    = await new Roll(`1d20 + ${bonus}`).evaluate();
  const sucesso = roll.total >= cd;
  const cor     = sucesso ? "#27ae60" : "#e74c3c";
  const label   = sucesso ? "✅ SUCESSO!" : "❌ FALHOU!";

  const temEvasaoC = evasaoSimples;
  let danoFinal = temPoder
    ? (sucesso ? Math.floor(danoBase / 4) : Math.floor(danoBase / 2))
    : temEvasaoC
      ? (sucesso ? 0 : danoBase)
      : (sucesso ? Math.floor(danoBase / 2) : danoBase);

  let notaDano = "";

  if (danoBase > 0) {
    const tracos   = actor.system?.tracos?.resistencias ?? {};
    const tipoNorm = tipoDano || null;
    const traco    = tipoNorm ? tracos?.[tipoNorm] : null;

    if (traco?.imunidade) {
      danoFinal = 0;
      notaDano  = `Imune a ${tipoDano}! Nenhum dano.`;
    } else {
      if (traco?.vulnerabilidade) {
        danoFinal *= 2;
        notaDano += ` (vuln. ${tipoDano}: ×2)`;
      } else if (traco?.value > 0) {
        const antes = danoFinal;
        danoFinal   = Math.max(0, danoFinal - parseInt(traco.value));
        notaDano   += ` (RD ${traco.value} [${tipoDano}]: ${antes}→${danoFinal})`;
      }
      const rdGeral = parseInt(tracos?.dano?.value) || parseInt(tracos?.dano?.base) || 0;
      if (rdGeral > 0 && danoFinal > 0) {
        const antes = danoFinal;
        danoFinal   = Math.max(0, danoFinal - rdGeral);
        notaDano   += ` (RD geral ${rdGeral}: ${antes}→${danoFinal})`;
      }

      const prefixo = temPoder
        ? (sucesso ? `✅ Sucesso+Evasão Apr.! ${danoBase}÷4=${Math.floor(danoBase/4)}` : `❌ Falhou+Evasão Apr.! ${danoBase}÷2=${Math.floor(danoBase/2)}`)
        : temEvasaoC
          ? (sucesso ? `🌀 Evasão! Sem dano.` : `❌ Falhou! Dano total: ${danoBase}`)
          : (sucesso ? `✅ Sucesso! ${danoBase}÷2=${Math.floor(danoBase/2)}` : `❌ Falhou! Dano total: ${danoBase}`);
      notaDano = prefixo + notaDano;

      if (danoFinal > 0) {
        const hpPath  = "system.attributes.pv.value";
        const pvAtual = foundry.utils.getProperty(actor, hpPath);
        const pvMax   = foundry.utils.getProperty(actor, "system.attributes.pv.max") ?? pvAtual;
        if (pvAtual !== undefined) {
          const novoPV = Math.max(0, pvAtual - danoFinal);
          await actor.update({ [hpPath]: novoPV });
          const corPV = novoPV === 0 ? "red" : novoPV <= pvMax / 2 ? "orange" : "green";
          notaDano += `<br>💔 ${danoFinal} de dano. PV: ${pvAtual} → <span style="color:${corPV}"><b>${novoPV}</b></span>`;
          if (novoPV === 0) notaDano += "<br>💀 <b>Incapacitado!</b>";
        }
      } else {
        notaDano += "<br>Nenhum dano aplicado.";
      }
    }
  }

  await roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `<b>${salvLabel}${bonusStr}</b> contra <i>${nomeItem}</i> (CD ${cd})`,
  });

  await ChatMessage.create({
    content: `<div style="border-left:4px solid ${cor};padding:6px 10px;border-radius:0 4px 4px 0">
      <div style="font-weight:bold;color:${cor}">${label} — ${actor.name}</div>
      <div style="font-size:0.88em">${notaDano}</div>
    </div>`,
    speaker: ChatMessage.getSpeaker({ actor }),
  });

  const condicoesAplicar2 = sucesso ? condicoesPassar : condicoesFalhar;
  if (cfg("autoCondicoes") && condicoesAplicar2.length) {
    if (game.user.isGM) {
      await aplicarCondicoes(actor, condicoesAplicar2, nomeItem);
    } else {
      game.socket.emit("module.arsenal-t20", {
        tipo: "aplicarCondicoes",
        actorId: actor.id,
        condicoes: condicoesAplicar2,
        nomeItem,
      });
    }
  }
}

// ============================================================
// CONDIÇÕES AUTOMÁTICAS
// ============================================================

// Mapa de texto → ID da condição do T20
const CONDICOES_MAP = {
  "em chamas":     "emchamas",
  "chamas":        "emchamas",
  "abalado":       "abalado",
  "agarrado":      "agarrado",
  "alquebrado":    "alquebrado",
  "apavorado":     "apavorado",
  "atordoado":     "atordoado",
  "caído":         "caido",
  "caido":         "caido",
  "cego":          "cego",
  "confuso":       "confuso",
  "debilitado":    "debilitado",
  "desprevenido":  "desprevenido",
  "doente":        "doente",
  "enfeitiçado":   "enfeiticado",
  "enfeiticado":   "enfeiticado",
  "enjoado":       "enjoado",
  "enredado":      "enredado",
  "envenenado":    "envenenado",
  "esmorecido":    "esmorecido",
  "exausto":       "exausto",
  "fascinado":     "fascinado",
  "fatigado":      "fatigado",
  "fraco":         "fraco",
  "frustrado":     "frustrado",
  "imóvel":        "imovel",
  "imovel":        "imovel",
  "inconsciente":  "inconsciente",
  "indefeso":      "indefeso",
  "invisível":     "invisivel",
  "invisivel":     "invisivel",
  "lento":         "lento",
  "morto":         "morto",
  "ofuscado":      "ofuscado",
  "paralisado":    "paralisado",
  "pasmo":         "pasmo",
  "petrificado":   "petrificado",
  "sangrando":     "sangrando",
  "surdo":         "surdo",
  "surpreendido":  "surpreendido",
  "vulnerável":    "vulneravel",
  "vulneravel":    "vulneravel",
  "sobrecarregado":"sobrecarregado",
};

function _stripT20Text(texto) {
  return String(texto ?? "")
    // Foundry/T20 costuma renderizar condições como @UUID[...]{Atordoado}; manter apenas o rótulo.
    .replace(/@(?:UUID|Compendium|Actor|Item|JournalEntry|Scene|Token)\[[^\]]*\]\{([^}]*)\}/gi, "$1")
    .replace(/<script[^>]*>.*?<\/script>/gis, " ")
    .replace(/<style[^>]*>.*?<\/style>/gis, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&aacute;/gi, "á").replace(/&eacute;/gi, "é").replace(/&iacute;/gi, "í").replace(/&oacute;/gi, "ó").replace(/&uacute;/gi, "ú")
    .replace(/&atilde;/gi, "ã").replace(/&otilde;/gi, "õ").replace(/&ccedil;/gi, "ç")
    .replace(/&Aacute;/g, "Á").replace(/&Eacute;/g, "É").replace(/&Iacute;/g, "Í").replace(/&Oacute;/g, "Ó").replace(/&Uacute;/g, "Ú")
    .replace(/&Atilde;/g, "Ã").replace(/&Otilde;/g, "Õ").replace(/&Ccedil;/g, "Ç")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function _normalizarT20(texto) {
  return _stripT20Text(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[“”„]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function _escapeRegexT20(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function _temTermoInteiro(textoNorm, termoNorm) {
  // Evita falso positivo por substring: "cego" não deve casar dentro de "morcegos".
  const re = new RegExp(`(^|[^a-z0-9_])${_escapeRegexT20(termoNorm)}(?=$|[^a-z0-9_])`, "i");
  return re.test(textoNorm);
}

function _trechosComTermo(textoNorm, termoNorm) {
  const re = new RegExp(`(^|[^a-z0-9_])${_escapeRegexT20(termoNorm)}(?=$|[^a-z0-9_])`, "gi");
  const out = [];
  for (const m of textoNorm.matchAll(re)) {
    const idx = Math.max(0, (m.index ?? 0) - 90);
    out.push(textoNorm.slice(idx, Math.min(textoNorm.length, (m.index ?? 0) + termoNorm.length + 120)));
  }
  return out;
}

function _contextoNegativoCondicao(trecho) {
  // Referências que citam a condição sem aplicá-la.
  return [
    /nao\s+(?:fica|ficara|ficam|ficarao|aplica|aplicara|causa|causara|recebe|recebera|sofre|sofrera)/,
    /nao\s+(?:e|eh)\s+afetad[oa]s?/,
    /sem\s+(?:ficar|aplicar|causar|receber|sofrer)/,
    /evita\s+(?:a\s+)?(?:condicao|essa\s+condicao|o\s+efeito)/,
    /impede\s+(?:a\s+)?(?:condicao|esse\s+efeito)/,
    /imune\s+a/,
    /como\s+se\s+(?:estivesse|ficasse|fosse)/,
    /conta\s+como/,
    /considerad[oa]\s+como/,
    /nao\s+acumula/,
  ].some(re => re.test(trecho));
}

function _condicoesNoTexto(texto, { exigirAplicacao = false } = {}) {
  const textoNorm = _normalizarT20(texto);
  const encontrados = new Set();
  if (!textoNorm) return encontrados;

  const gatilhosAplicacao = [
    /(?:fica|ficam|ficara|ficarao|ficou)\s+$/,
    /(?:deixa|deixam|deixando|torna|tornam|tornando|causa|causam|causando|aplica|aplicam|aplicando)\s+$/,
    /(?:alvo|criatura|inimigo|vitima|personagem|voce|ele|ela)\s+(?:fica|ficam|ficara|recebe|sofre)\s+$/,
    /(?:falha\s+aplica|sucesso\s+aplica)\s*:?\s*$/,
  ];

  for (const [chave, id] of Object.entries(CONDICOES_MAP)) {
    const termo = _normalizarT20(chave);
    if (!_temTermoInteiro(textoNorm, termo)) continue;

    const trechos = _trechosComTermo(textoNorm, termo);
    const valido = trechos.some(trecho => {
      if (_contextoNegativoCondicao(trecho)) return false;
      if (!exigirAplicacao) return true;

      const pos = trecho.search(new RegExp(`(^|[^a-z0-9_])${_escapeRegexT20(termo)}(?=$|[^a-z0-9_])`, "i"));
      const antes = pos >= 0 ? trecho.slice(Math.max(0, pos - 70), pos + 1) : trecho;
      return gatilhosAplicacao.some(re => re.test(antes));
    });

    if (valido) encontrados.add(id);
  }
  return encontrados;
}

// Detecta condições com contexto — distingue aplicação real de mera citação.
function detectarCondicoesContexto(nomeItem, descricao, txtResistencia) {
  const texto = _normalizarT20(descricao);
  const resistencia = _normalizarT20(txtResistencia);

  const aoFalhar = new Set();
  const aoPassar = new Set();

  // 1) Formato mais confiável: cards/effects explícitos, ex. "Adaga Mental (Atordoado)".
  // Esses rótulos normalmente vêm dos Efeitos Temporários do item e indicam a condição aplicada na falha.
  const rotuloEfeito = new RegExp(`${_escapeRegexT20(_normalizarT20(nomeItem))}\\s*\\(([^)]+)\\)`, "gi");
  for (const m of texto.matchAll(rotuloEfeito)) {
    for (const id of _condicoesNoTexto(m[1])) aoFalhar.add(id);
  }

  // 2) Separação por blocos de sucesso/falha. Inclui "se o alvo falhar" e variações.
  const marcadorFalha = /(?:se\s+(?:o\s+alvo|a\s+criatura|ele|ela|voce)?\s*falhar|falhar\s+n[oa]\s+teste\s+de\s+resistencia|falhar\s+na\s+resistencia|ao\s+falhar|em\s+caso\s+de\s+falha)/i;
  const marcadorSucesso = /(?:se\s+(?:o\s+alvo|a\s+criatura|ele|ela|voce)?\s*passar|passar\s+n[oa]\s+teste\s+de\s+resistencia|passar\s+na\s+resistencia|ao\s+passar|em\s+caso\s+de\s+sucesso|se\s+resistir)/i;

  const idxFalha = texto.search(marcadorFalha);
  const idxSucesso = texto.search(marcadorSucesso);

  let blocoFalha = "";
  let blocoSucesso = "";

  if (idxFalha >= 0) {
    const fim = idxSucesso >= 0 && idxSucesso > idxFalha ? idxSucesso : texto.length;
    blocoFalha = texto.slice(idxFalha, fim);
  }
  if (idxSucesso >= 0) {
    const fim = idxFalha >= 0 && idxFalha > idxSucesso ? idxFalha : texto.length;
    blocoSucesso = texto.slice(idxSucesso, fim);
  }

  for (const id of _condicoesNoTexto(blocoFalha, { exigirAplicacao: false })) aoFalhar.add(id);

  // Só considera condição em sucesso se houver aplicação explícita; textos como
  // "se passar, evita a condição" não devem adicionar nada.
  for (const id of _condicoesNoTexto(blocoSucesso, { exigirAplicacao: true })) aoPassar.add(id);

  // 3) Sem bloco explícito, exigir verbo de aplicação para evitar falsos positivos.
  // Ex.: "morcegos" não casa com "cego"; e mera citação de imunidade/evitar é ignorada.
  if (idxFalha < 0 && idxSucesso < 0) {
    for (const id of _condicoesNoTexto(texto, { exigirAplicacao: true })) aoFalhar.add(id);
  }

  // 4) O campo de resistência pode dizer "evita a condição"; nesse caso, mantém falha apenas.
  // Se algum sistema colocar explicitamente "falha aplica: X" no texto da resistência, capturamos.
  if (/falha\s+aplica/.test(resistencia)) {
    for (const id of _condicoesNoTexto(resistencia, { exigirAplicacao: false })) aoFalhar.add(id);
  }
  if (/sucesso\s+aplica/.test(resistencia)) {
    for (const id of _condicoesNoTexto(resistencia, { exigirAplicacao: false })) aoPassar.add(id);
  }

  return {
    aoFalhar: [...aoFalhar],
    aoPassar: [...aoPassar],
  };
}

// Aplica condições em um ator (requer permissão de GM ou owner)
async function aplicarCondicoes(actor, condicoes, nomeItem) {
  if (!condicoes.length) return;
  for (const id of condicoes) {
    const jaAtiva = actor.statuses?.has(id);
    if (!jaAtiva) {
      await actor.toggleStatusEffect(id);
    }
  }
  const nomes = condicoes.map(id =>
    CONFIG.statusEffects.find(e => e.id === id)?.name ?? id
  ).join(", ");

  ChatMessage.create({
    content: `<div style="border-left:4px solid #9b59b6;padding:6px 10px;border-radius:0 4px 4px 0">
      <b>🔮 ${actor.name}</b> recebeu a condição: <b>${nomes}</b>
      <div style="font-size:0.85em;color:#888">por: ${nomeItem}</div>
    </div>`
  });
}

// ============================================================
// CURA ACELERADA
// ============================================================
