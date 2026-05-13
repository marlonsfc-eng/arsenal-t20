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

  game.settings.register(MOD, "autoCura", {
    name: "Botão de Cura",
    hint: "Detecta rolagens de cura e cria um card com botão para aplicar a recuperação de PV ao alvo selecionado.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MOD, "autoEfeitosContinuos", {
    name: "Efeitos Contínuos no Turno",
    hint: "No avanço do combate, cria lembretes e aplica efeitos contínuos simples, como Sangrando e Em Chamas.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MOD, "autoPMCard", {
    name: "Card de Controle de PM",
    hint: "Ao lançar uma magia, exibe um card de controle de custo em PM com botões de aplicar e reverter gasto.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MOD, "pmControlMode", {
    name: "Controle de PM",
    hint: "Define como o Arsenal T20 deve lidar com custos de PM ao lançar magias: desligado, card manual para o GM ou gasto automático.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      off: "Desligado",
      manual: "Controlar manualmente com card",
      auto: "Gastar PM automaticamente"
    },
    default: "manual",
  });

  game.settings.register(MOD, "sustentadasAtivas", {
    name: "Magias Sustentadas Ativas",
    hint: "Registro interno do Arsenal T20 para controle de magias sustentadas.",
    scope: "world",
    config: false,
    type: Object,
    default: {},
  });

  game.settings.register(MOD, "resourceMonitorMode", {
    name: "Monitor de Recursos",
    hint: "Define como alterações de PV/PM de personagens jogadores serão informadas ao GM.",
    scope: "world",
    config: true,
    type: String,
    choices: {
      off: "Desligado",
      notification: "Notificação discreta",
      panel: "Painel Arsenal T20",
      panel_notification: "Painel + notificação discreta",
      round_summary: "Resumo por rodada",
      chat: "Chat privado do GM"
    },
    default: "panel_notification",
  });

  game.settings.register(MOD, "autoAuras", {
    name: "Auras Dinâmicas",
    hint: "Permite ativar auras vinculadas ao token e aplicar bônus automaticamente em testes de resistência de aliados dentro da área.",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MOD, "auraAnimation", {
    name: "Animação de Auras",
    hint: "Exibe uma animação leve de emanação ondulante nas auras dinâmicas. Desative se quiser reduzir efeitos visuais ou melhorar desempenho.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(MOD, "arsenalHudMode", {
    name: "Arsenal HUD",
    hint: "Define como o HUD rápido do Arsenal aparece para este usuário.",
    scope: "client",
    config: true,
    type: String,
    choices: {
      off: "Desativado",
      sidebar: "Painel lateral",
      token: "Perto do token",
      bottom: "Barra inferior"
    },
    default: "sidebar",
  });

  game.settings.register(MOD, "arsenalHudLayout", {
    name: "Layout do Arsenal HUD",
    hint: "Define o visual interno do HUD. O layout Cartões dá mais destaque a habilidades, magias e ataques.",
    scope: "client",
    config: true,
    type: String,
    choices: {
      compact: "Lista compacta",
      cards: "Cartões de habilidades"
    },
    default: "cards",
  });

  game.settings.register(MOD, "arsenalHudColorTheme", {
    name: "Cor do Arsenal HUD",
    hint: "Define a paleta visual do HUD para este usuário.",
    scope: "client",
    config: true,
    type: String,
    choices: {
      darkGold: "Escuro/Dourado",
      arcane: "Arcano/Roxo",
      emerald: "Esmeralda",
      crimson: "Carmesim",
      steel: "Aço Azul"
    },
    default: "darkGold",
  });

  game.settings.register(MOD, "arsenalHudSpellMode", {
    name: "Magias no Arsenal HUD",
    hint: "Define como magias aparecem no HUD. Grimório por círculo troca a lista de magias por cards de 1º a 5º círculo que abrem uma janela separada.",
    scope: "client",
    config: true,
    type: String,
    choices: {
      list: "Lista direta",
      grimoire: "Grimório por círculo"
    },
    default: "grimoire",
  });

  game.settings.register(MOD, "melhorarDialogoMagias", {
    name: "Melhorar janela de aprimoramentos de magia",
    hint: "Reorganiza visualmente a janela de configuração de uso de magia do sistema T20, mantendo a lógica original do sistema.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
  });

  const ativas = [];
  if (game.settings.get(MOD, "autoAtaque"))      ativas.push("Ataque");
  if (game.settings.get(MOD, "autoSalvamento"))  ativas.push("Salvamento");
  if (game.settings.get(MOD, "autoCondicoes"))   ativas.push("Condições");
  if (game.settings.get(MOD, "autoCura"))        ativas.push("Cura");
  if (game.settings.get(MOD, "autoEfeitosContinuos")) ativas.push("Efeitos contínuos");
  if (game.settings.get(MOD, "autoPMCard"))      ativas.push("PM");
  if (game.settings.get(MOD, "autoAuras"))       ativas.push("Auras");

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
  btn.innerHTML = `<i class="fas fa-skull-crossbones" style="margin-right:4px"></i><span style="font-size:0.76em;font-family:'Cinzel',serif;letter-spacing:0.03em">Condições</span>`;
  btn.style.cssText = `
    position: fixed;
    top: 454px;
    left: 0;
    z-index: 100;
    height: 34px;
    padding: 0 10px;
    background: #1a1a26;
    border: 1px solid #3a3a50;
    border-radius: 0 6px 6px 0;
    color: #c9a227;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.6);
    transition: all 0.2s;
  `;
  // Mantém os botões logo abaixo da barra de ferramentas esquerda, sem sobrepor a lista de jogadores.
  const ajustarPosicao = () => {
    const controls = document.getElementById("controls") ?? document.querySelector("#ui-left #controls");
    if (controls) {
      const rect = controls.getBoundingClientRect();
      btn.style.top = `${Math.max(454, Math.ceil(rect.bottom + 8))}px`;
    } else {
      btn.style.top = "454px";
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

  // Reposiciona após renderização dos controles
  document.body.appendChild(btn);
  setTimeout(ajustarPosicao, 500);
  Hooks.on("renderPlayerList", ajustarPosicao);
  Hooks.on("canvasReady", ajustarPosicao);
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


function textoChatLimpo(html) {
  try {
    const div = document.createElement("div");
    div.innerHTML = html ?? "";
    return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
  } catch {
    return String(html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
}

function mensagemEhTesteDeResistencia(message) {
  const texto = [
    message.flavor,
    message.content,
    message.flags?.tormenta20?.itemData?.resistencia?.txt,
    message.flags?.tormenta20?.roll?.type,
  ].filter(Boolean).join(" ").toLowerCase();

  return (
    /\b(reflexos|fortitude|vontade)\b[^.]{0,80}\b(cd\s*\d+|contra)\b/i.test(texto) ||
    /\bresist[eê]ncia\b/i.test(texto) ||
    ["resistencia", "resistência", "save", "savingThrow"].includes(String(message.flags?.tormenta20?.roll?.type ?? ""))
  );
}

function mensagemEhAtaqueReal(message, rollAtaque) {
  if (mensagemEhTesteDeResistencia(message)) return false;

  const itemData = message.flags?.tormenta20?.itemData ?? {};
  const rollFlag = message.flags?.tormenta20?.roll ?? {};
  const texto = [
    message.flavor,
    message.content,
    rollFlag?.type,
    itemData?.type,
    itemData?.tipo,
    itemData?.activation?.type,
    itemData?.system?.activation?.type,
    itemData?.name,
    itemData?.nome,
  ].filter(Boolean).join(" ").toLowerCase();

  if (/\b(ataque|attack|arma|weapon|golpe)\b/i.test(texto)) return true;
  if (rollFlag?.type === "attack" || rollFlag?.tipo === "ataque") return true;

  // Fallback conservador: só considera ataque se houver pelo menos uma rolagem de dano junto
  // e não houver texto típico de teste de resistência/perícia.
  const temDano = message.rolls?.some(r => r !== rollAtaque && !r.formula?.includes("d20"));
  if (temDano && !/\b(reflexos|fortitude|vontade|per[ií]cia|teste)\b/i.test(texto)) return true;

  return false;
}

function extrairResistenciaDaMensagem(message, itemData = {}) {
  const res = itemData?.resistencia;
  if (res?.txt || res?.pericia) return { ...res };

  const texto = textoChatLimpo(message.content ?? "");
  const flavor = textoChatLimpo(message.flavor ?? "");
  const combinado = `${texto} ${flavor}`;

  const tipoMatch = combinado.match(/\b(Reflexos|Fortitude|Vontade)\b/i);
  if (!tipoMatch) return null;

  const tipo = tipoMatch[1].toLowerCase();
  const cdMatch = combinado.match(/\bCD\s*(\d+)\b/i);
  const txtMatch =
    combinado.match(/Resist[eê]ncia:\s*([^.;]+)/i) ??
    combinado.match(/\b(Reflexos|Fortitude|Vontade)\b[^.]{0,80}(?:CD\s*\d+)?/i);

  const pericia = tipo.startsWith("ref") ? "refl" : tipo.startsWith("fort") ? "fort" : "vont";
  return {
    txt: txtMatch?.[0] ?? tipoMatch[0],
    pericia,
    cdTexto: cdMatch ? parseInt(cdMatch[1]) : null,
  };
}


Hooks.on("createChatMessage", async (message, options, userId) => {
  if (!cfg("autoAtaque")) return;
  if (!message.rolls?.length) return;
  if (userId !== game.userId) return;

  const rollAtaque = message.rolls.find(r => r.formula?.includes("d20"));
  if (!rollAtaque) return;
  if (!mensagemEhAtaqueReal(message, rollAtaque)) return;

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


async function resolverActorParaAutomacao(data = {}) {
  try {
    if (data.sceneId && data.tokenId) {
      const scene = game.scenes.get(data.sceneId);
      const tokenDoc = scene?.tokens?.get(data.tokenId);
      if (tokenDoc?.actor) return tokenDoc.actor;
    }

    if (data.tokenId) {
      const token = canvas.tokens?.get(data.tokenId);
      if (token?.actor) return token.actor;
    }

    if (data.actorUuid) {
      const doc = await fromUuid(data.actorUuid);
      if (doc?.actor) return doc.actor;
      if (doc) return doc;
    }

    if (data.actorId) {
      const byId = game.actors.get(data.actorId);
      if (byId) return byId;
    }

    if (data.actorName) {
      const byName = game.actors.find(a => a.name === data.actorName);
      if (byName) return byName;
    }
  } catch (e) {
    console.warn("Arsenal T20 | erro ao resolver ator para automação", e);
  }

  return null;
}

function obterChatMessageDoBotao(btn) {
  const direto = btn?.dataset?.messageId;
  if (direto && game.messages.get(direto)) return game.messages.get(direto);

  const messageEl =
    btn.closest?.("[data-message-id]") ??
    btn.closest?.("[data-messageid]") ??
    btn.closest?.("[data-messageId]") ??
    btn.closest?.(".chat-message") ??
    btn.closest?.(".message");

  const id =
    messageEl?.dataset?.messageId ??
    messageEl?.dataset?.messageid ??
    messageEl?.dataset?.messageID ??
    messageEl?.id?.replace(/^chat-message-/, "");

  return id ? game.messages.get(id) : null;
}

async function atualizarCardConsolidadoDoBotao(btn, sucesso, danoFinal) {
  try {
    const row = btn.closest(".t20-alvo-row");
    const inline = row?.querySelector(".t20-resultado-inline");

    if (inline) {
      inline.innerHTML = `${sucesso ? "✅ Sucesso" : "❌ Falha"}${danoFinal > 0 ? ` · ${danoFinal} dano aplicado` : ""}`;
      inline.style.color = sucesso ? "#7dd3a7" : "#ff8d8d";
    }
    if (row) {
      row.dataset.resultado = sucesso ? "sucesso" : "falha";
      row.dataset.danoAplicado = String(danoFinal || 0);
    }

    btn.disabled = true;
    btn.setAttribute("disabled", "disabled");
    btn.style.opacity = "0.55";

    const msg = obterChatMessageDoBotao(btn);
    if (!msg) {
      console.warn("Arsenal T20 | não encontrei a mensagem do card para sincronizar.");
      return;
    }

    const card = btn.closest(".t20-card");
    let novoConteudo = card?.outerHTML ?? msg.content;

    // Não persistir data-listener-added no HTML salvo da mensagem.
    // Caso contrário, após atualizar o card, os botões restantes parecem já ter listener
    // e deixam de funcionar para outros alvos da mesma magia em área.
    if (typeof novoConteudo === "string") {
      novoConteudo = novoConteudo.replace(/\sdata-listener-added="[^"]*"/g, "");
      novoConteudo = novoConteudo.replace(/\sdata-listener-added='[^']*'/g, "");
      novoConteudo = novoConteudo.replace(/\sdata-listener-added\b/g, "");
    }

    if (game.user.isGM) {
      await msg.update({ content: novoConteudo });
    } else {
      game.socket.emit("module.arsenal-t20", {
        tipo: "atualizarCardConsolidado",
        messageId: msg.id,
        content: novoConteudo,
      });
    }
  } catch (e) {
    console.warn("Arsenal T20 | não foi possível atualizar o card consolidado para todos", e);
  }
}

Hooks.once("ready", () => {
  game.socket.on("module.arsenal-t20", async (data) => {
    if (!game.user.isGM) return;
    if (data.tipo === "atacou") {
      if (cfg("danoAutoGM")) await criarMensagemGM(data.totalAtaque, data.dadosAlvos, data.danoPorTipo, data.danoTotal);
    }
    if (data.tipo === "aplicarCondicoes") {
      const actor = await resolverActorParaAutomacao(data);
      if (actor) await aplicarCondicoes(actor, data.condicoes, data.nomeItem);
    }
    if (data.tipo === "atualizarCardConsolidado") {
      const msg = game.messages.get(data.messageId);
      if (msg && typeof data.content === "string") {
        await msg.update({ content: data.content });
      }
    }
    if (data.tipo === "registrarSustentada") {
      const actor = await resolverActorParaAutomacao(data);
      if (actor) {
        await t20RegistrarSustentada(actor, data.itemData ?? {}, {
          content: data.content ?? "",
          id: data.messageId ?? null,
        }, {
          force: !!data.force,
          solicitante: data.solicitante ?? null,
        });
      }
    }
    if (data.tipo === "removerSustentada") {
      const actor = await resolverActorParaAutomacao(data);
      if (actor) {
        await t20RemoverSustentada(actor, data.registroId, data.nomeItem, data.solicitante);
      }
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


function t20WhisperJogadoresDono(actor) {
  try {
    return game.users?.filter(u => !u.isGM && actor?.testUserPermission?.(u, "OWNER")) ?? [];
  } catch {
    return [];
  }
}

function t20SplitReducaoDano(dano, danoPerda, reducao) {
  let normal = Math.max(0, Number(dano) || 0);
  let perda  = Math.max(0, Number(danoPerda) || 0);
  let red    = Math.max(0, Number(reducao) || 0);

  // Defesa ativa reduz primeiro o dano normal. Se sobrar redução, reduz perda de PV.
  // Isso mantém compatibilidade com casos raros em que a rolagem tenha dano + perda.
  const redNormal = Math.min(normal, red);
  normal -= redNormal;
  red -= redNormal;

  const redPerda = Math.min(perda, red);
  perda -= redPerda;

  return { dano: normal, danoPerda: perda, reducaoAplicada: redNormal + redPerda };
}

function t20HtmlBotoesDano({ tokenId, danoFinalTotal, danoPerda }) {
  const total = Math.max(0, (Number(danoFinalTotal) || 0) + (Number(danoPerda) || 0));
  const metadeDano = Math.floor((Number(danoFinalTotal) || 0) / 2);
  const metadePerda = Math.floor((Number(danoPerda) || 0) / 2);
  const metadeTotal = Math.floor(total / 2);

  return `
    <div class="t20-dano-actions" style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap">
      <button class="t20-aplicar"
        data-token="${tokenId}"
        data-dano="${Number(danoFinalTotal) || 0}"
        data-dano-perda="${Number(danoPerda) || 0}"
        style="flex:1;min-width:120px;padding:7px 8px;border-radius:6px;cursor:pointer;
          background:linear-gradient(180deg,#8a2f38,#6b2028);border:1px solid #b94a58;color:#fff;font-size:0.85em;font-weight:bold;
          box-shadow:0 2px 6px rgba(0,0,0,0.25)">
        💔 Aplicar ${total} de Dano
      </button>
      <button class="t20-metade"
        data-token="${tokenId}"
        data-dano="${metadeDano}"
        data-dano-perda="${metadePerda}"
        style="flex:1;min-width:105px;padding:7px 8px;border-radius:6px;cursor:pointer;
          background:linear-gradient(180deg,#334765,#25344d);border:1px solid #47638c;color:#eef3ff;font-size:0.85em;font-weight:bold;
          box-shadow:0 2px 6px rgba(0,0,0,0.25)">
        🛡️ Metade (${metadeTotal})
      </button>
      <button class="t20-defesa-ativa"
        data-token="${tokenId}"
        style="flex:1;min-width:120px;padding:7px 8px;border-radius:6px;cursor:pointer;
          background:linear-gradient(180deg,#2f7d4f,#245f3d);border:1px solid #4ade80;color:#fff;font-size:0.85em;font-weight:bold;
          box-shadow:0 2px 6px rgba(0,0,0,0.25)">
        🛡️ Defesa Ativa
      </button>
    </div>
    <div class="t20-defesa-ativa-nota" style="font-size:0.8em;color:#9ca3af;margin-top:5px"></div>`;
}

function t20HtmlCardDanoJogador({ nomeAlvo, tokenId, danoFinalTotal, danoPerda, linhasDano }) {
  const total = Math.max(0, (Number(danoFinalTotal) || 0) + (Number(danoPerda) || 0));

  return `
    <div class="t20-card t20-card-dano-jogador" style="background:linear-gradient(180deg,#171b26 0%,#0f1420 100%);
      border:1px solid #2b3347;border-top:3px solid #b94a58;
      box-shadow:0 8px 18px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.04);
      border-radius:8px;padding:12px;color:#e8d5b7;font-family:'Palatino Linotype',serif;">
      <div style="border-bottom:1px solid rgba(185,74,88,0.28);padding-bottom:8px;margin-bottom:10px">
        <div style="color:#f07f7f;font-weight:bold">💥 Ataque recebido — ${nomeAlvo}</div>
        <div style="font-size:0.82em;color:#b8becf">Dano final calculado: <b>${total}</b></div>
      </div>

      <div style="background:rgba(0,0,0,0.20);padding:7px;border-radius:6px;margin-bottom:6px">
        ${linhasDano.join("")}
        <div style="border-top:1px solid rgba(255,255,255,0.08);margin-top:5px;padding-top:5px;color:#f2e6c9;font-weight:bold">
          Total final: ${total}
        </div>
      </div>

      ${t20HtmlBotoesDano({ tokenId, danoFinalTotal, danoPerda })}
    </div>`;
}


async function criarMensagemGM(totalAtaque, dadosAlvos, danoPorTipo, danoTotal) {
  const temDano = danoPorTipo && Object.keys(danoPorTipo).length > 0;

  let html = `
    <div class="t20-card" style="background:linear-gradient(135deg,#0f0f1a,#1a1a2e);border:1px solid #2a2a5a;border-top:3px solid #9a7fd4;border-radius:6px;padding:12px;color:#e8d5b7;font-family:'Palatino Linotype',serif;">
      <div style="border-bottom:1px solid #5a3a1a;padding-bottom:8px;margin-bottom:10px">
        <span style="color:#c9a227;font-weight:bold">🎲 Painel do GM — Ataque: ${totalAtaque}</span>
        ${temDano ? `<span style="float:right;color:#e74c3c;font-weight:bold">Dano base: ${danoTotal}</span>` : ""}
      </div>`;

  const cardsJogadores = [];

  for (const a of dadosAlvos) {
    const cor = a.erroNatural ? "#555" : a.possivelCritico && a.acertou ? "#ff6b35" : a.acertou ? "#27ae60" : "#e74c3c";
    const label = a.erroNatural ? "💨 Erro Natural" : a.possivelCritico && a.acertou ? "⚔️ CRÍTICO!" : a.acertou ? "✅ Acertou" : "❌ Errou";

    let danoFinalTotal = 0;
    let linhasDano = [];

    let danoPerda = 0; // perda de PV: ignora RD/resistências, mas NÃO ignora RDimo

    if (temDano && a.acertou) {
      // O sistema base de Tormenta20 já entrega o dano crítico corretamente na rolagem.
      // O Arsenal T20 não deve multiplicar o dano novamente; apenas aplica RD, imunidade
      // e vulnerabilidade sobre o valor já rolado pelo sistema.
      for (const [tipo, valor] of Object.entries(danoPorTipo)) {
        if (isNaN(valor) || valor === null) continue;

        const tipoNorm = tipo === "perfuração" ? "perfuracao" : tipo;
        const ePerda   = tipoNorm === "perda";

        if (ePerda) {
          // Perda de PV não sofre RD nem resistências — aplica direto no PV atual.
          // Importante: em Tormenta20 isso NÃO reduz o PV máximo.
          danoPerda += valor;
          linhasDano.push(`
            <div style="font-size:0.82em;color:#c0392b;padding:2px 0">
              perda de PV: ${valor} → <b>${valor}</b> (ignora RD)
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

    if (temDano && a.acertou && (danoFinalTotal + danoPerda) > 0) {
      const tokenAlvo = canvas.tokens?.get(a.tokenId);
      const actorAlvo = tokenAlvo?.actor;
      const donos = t20WhisperJogadoresDono(actorAlvo);
      if (donos.length) {
        cardsJogadores.push({
          whisper: donos,
          content: t20HtmlCardDanoJogador({
            nomeAlvo: tokenAlvo?.name ?? a.nome,
            tokenId: a.tokenId,
            danoFinalTotal,
            danoPerda,
            linhasDano,
          }),
        });
      }
    }

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
        ${t20HtmlBotoesDano({ tokenId: a.tokenId, danoFinalTotal, danoPerda })}` : a.acertou ? `
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
    html.querySelectorAll(".t20-aplicar, .t20-metade, .t20-defesa-ativa").forEach(btn => {
      if (btn.dataset.listenerAdded) return;
      btn.dataset.listenerAdded = "1";
      if (btn.classList.contains("t20-defesa-ativa")) btn.addEventListener("click", () => defesaAtivaDano(btn));
      else btn.addEventListener("click", () => aplicarDano(btn));
    });
  });

  for (const card of cardsJogadores) {
    await ChatMessage.create({
      content: card.content,
      whisper: card.whisper,
    });
  }
}


async function defesaAtivaDano(btn) {
  const grupo = btn.closest(".t20-dano-actions");
  if (!grupo) return;

  const aplicar = grupo.querySelector(".t20-aplicar");
  const metade  = grupo.querySelector(".t20-metade");
  if (!aplicar) return ui.notifications.warn("Botão de aplicar dano não encontrado.");

  const danoAtual = parseInt(aplicar.dataset.dano) || 0;
  const perdaAtual = parseInt(aplicar.dataset.danoPerda) || 0;
  const totalAtual = danoAtual + perdaAtual;

  if (totalAtual <= 0) return ui.notifications.info("Não há dano para reduzir.");

  const reducao = await new Promise(resolve => {
    new Dialog({
      title: "Defesa Ativa",
      content: `
        <form>
          <p>Informe quanto dano será reduzido por defesa ativa/reação.</p>
          <div class="form-group">
            <label>Redução de dano</label>
            <input type="number" name="reducao" value="0" min="0" step="1" autofocus>
          </div>
          <p style="font-size:0.85em;color:#666">Dano atual: <b>${totalAtual}</b></p>
        </form>`,
      buttons: {
        ok: {
          label: "Confirmar",
          callback: html => {
            const val = Number(html.find?.('[name="reducao"]').val?.() ?? html.querySelector?.('[name="reducao"]')?.value ?? 0);
            resolve(Math.max(0, Math.floor(val || 0)));
          }
        },
        cancel: {
          label: "Cancelar",
          callback: () => resolve(null)
        }
      },
      default: "ok",
      close: () => resolve(null),
    }).render(true);
  });

  if (reducao === null) return;

  const reduzido = t20SplitReducaoDano(danoAtual, perdaAtual, reducao);
  const novoTotal = reduzido.dano + reduzido.danoPerda;
  const metadeDano = Math.floor(reduzido.dano / 2);
  const metadePerda = Math.floor(reduzido.danoPerda / 2);
  const metadeTotal = Math.floor(novoTotal / 2);

  aplicar.dataset.dano = String(reduzido.dano);
  aplicar.dataset.danoPerda = String(reduzido.danoPerda);
  aplicar.innerHTML = `💔 Aplicar ${novoTotal} de Dano`;

  if (metade) {
    metade.dataset.dano = String(metadeDano);
    metade.dataset.danoPerda = String(metadePerda);
    metade.innerHTML = `🛡️ Metade (${metadeTotal})`;
  }

  const nota = grupo.parentElement?.querySelector(".t20-defesa-ativa-nota");
  if (nota) {
    nota.innerHTML = `🛡️ Defesa ativa: redução de <b>${reduzido.reducaoAplicada}</b>. Dano ajustado: <b>${totalAtual}</b> → <b>${novoTotal}</b>.`;
  }

  ui.notifications.info(`Defesa ativa aplicada: dano ${totalAtual} → ${novoTotal}.`);
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

  const pvPath  = "system.attributes.pv.value";
  const pvAtual = foundry.utils.getProperty(token.actor, pvPath);
  if (pvAtual === undefined) return ui.notifications.warn("PV não encontrado!");

  let novoPV = pvAtual;
  const update = {};

  // Perda de PV: ignora RD/resistências, mas NÃO ignora RDimo.
  if (danoPerda > 0) {
    novoPV = Math.max(0, novoPV - danoPerda);
    update[pvPath] = novoPV;
  }

  // Dano normal: reduz apenas PV atual.
  if (dano > 0) {
    novoPV = Math.max(0, novoPV - dano);
    update[pvPath] = novoPV;
  }

  await token.actor.update(update);

  const danTotal = dano + danoPerda;

  // Mensagem pública sem revelar PV atual/máximo do alvo.
  ChatMessage.create({
    content: `<div style="background:linear-gradient(180deg,#171b26 0%,#0f1420 100%);border:1px solid #2b3347;border-left:4px solid #b94a58;padding:8px 11px;border-radius:6px;box-shadow:0 4px 10px rgba(0,0,0,0.22);color:#d7dcea">
      💔 <b>${token.name}</b> sofreu <b>${danTotal} de dano</b>.
    </div>`
  });

  const grupo = btn.closest(".t20-dano-actions") ?? btn.closest("div");
  grupo?.querySelectorAll("button")
    .forEach(b => { b.disabled = true; b.style.opacity = "0.5"; });
}




// ============================================================
// AURAS DINÂMICAS
// ============================================================

function t20AurasAtivasActor(actor) {
  try {
    const auras = actor?.getFlag?.("arsenal-t20", "aurasAtivas");
    return Array.isArray(auras) ? auras : [];
  } catch {
    return [];
  }
}

async function t20SetAurasAtivasActor(actor, auras) {
  if (!actor) return;
  await actor.setFlag("arsenal-t20", "aurasAtivas", Array.isArray(auras) ? auras : []);
}

function t20ValorAtributo(actor, atributo = "car") {
  const paths = [
    `system.atributos.${atributo}.mod`,
    `system.atributos.${atributo}.value`,
    `system.atributos.${atributo}.total`,
    `system.atributos.${atributo}.bonus`,
    `system.atributos.${atributo}.modificador`,
    `system.attributes.${atributo}.mod`,
    `system.attributes.${atributo}.value`,
    `system.attributes.${atributo}.total`,
    `system.attributes.${atributo}.bonus`,
    `system.${atributo}.mod`,
    `system.${atributo}.value`,
    `system.${atributo}.total`,
  ];

  for (const path of paths) {
    const raw = foundry.utils.getProperty(actor, path);
    const n = Number(raw);
    if (Number.isFinite(n)) {
      // Em T20/FVTT normalmente o campo value já é o modificador.
      // Se alguma ficha retornar valor de atributo bruto alto, converte de forma conservadora.
      if (n > 10) return Math.floor((n - 10) / 2);
      return n;
    }
  }

  return 0;
}

function t20DistanciaTokensMetros(tokenA, tokenB) {
  if (!tokenA || !tokenB) return Infinity;

  const a = tokenA.center ?? { x: tokenA.x, y: tokenA.y };
  const b = tokenB.center ?? { x: tokenB.x, y: tokenB.y };

  const gridSize = canvas.grid?.size ?? canvas.scene?.grid?.size ?? 100;
  const sceneDistance = Number(canvas.scene?.grid?.distance ?? 1) || 1;
  const distPx = Math.hypot((a.x ?? 0) - (b.x ?? 0), (a.y ?? 0) - (b.y ?? 0));

  return (distPx / gridSize) * sceneDistance;
}

function t20TokensSaoAliadosAura(tokenFonte, tokenAlvo, aura) {
  if (!tokenFonte || !tokenAlvo) return false;

  if (tokenFonte.id === tokenAlvo.id) return true;

  const dispFonte = tokenFonte.document?.disposition;
  const dispAlvo = tokenAlvo.document?.disposition;

  // Critério 1: mesma disposição do token.
  if (dispFonte !== undefined && dispAlvo !== undefined && dispFonte === dispAlvo) return true;

  // Critério 2: ambos são personagens controlados por jogadores.
  // Isso corrige mesas em que os PCs estão como Neutral/sem a mesma disposição.
  if (tokenFonte.actor?.hasPlayerOwner && tokenAlvo.actor?.hasPlayerOwner) return true;

  return false;
}

function t20BonusAurasResistencia(actorAlvo, tokenAlvo, salvPericia = "") {
  if (!cfg("autoAuras")) return { bonus: 0, detalhes: [] };
  if (!actorAlvo || !tokenAlvo) return { bonus: 0, detalhes: [] };

  const detalhes = [];
  let bonusTotal = 0;

  const tokens = Array.from(canvas.tokens?.placeables ?? []).filter(t => t?.actor);
  const periciaNorm = String(salvPericia ?? "").toLowerCase();

  for (const tokenFonte of tokens) {
    const auras = t20AurasAtivasActor(tokenFonte.actor);
    if (!auras.length) continue;

    for (const aura of auras) {
      if (aura.tipo !== "resistencia") continue;

      const aplica = aura.aplica ?? ["refl", "fort", "vont", "reflexos", "fortitude", "vontade"];
      if (periciaNorm && !aplica.map(x => String(x).toLowerCase()).includes(periciaNorm)) continue;

      if (!t20TokensSaoAliadosAura(tokenFonte, tokenAlvo, aura)) continue;

      const raio = Number(aura.raio ?? 9);
      const dist = t20DistanciaTokensMetros(tokenFonte, tokenAlvo);
      if (dist > raio) continue;

      const atributo = aura.atributo ?? "car";
      const bonus = Number.isFinite(Number(aura.bonusFixo))
        ? Number(aura.bonusFixo)
        : t20ValorAtributo(tokenFonte.actor, atributo);

      if (!bonus) continue;

      bonusTotal += bonus;
      detalhes.push({
        nome: aura.nome ?? "Aura",
        fonte: tokenFonte.name,
        bonus,
        distancia: dist,
      });
      console.log(`Arsenal T20 | Aura aplicada: ${aura.nome ?? "Aura"} de ${tokenFonte.name} +${bonus} em ${tokenAlvo.name} (${dist.toFixed(1)}m)`);
    }
  }

  return { bonus: bonusTotal, detalhes };
}

function t20TextoAuras(detalhes = []) {
  if (!detalhes.length) return "";
  return detalhes
    .map(a => `${a.nome} de ${a.fonte} ${a.bonus >= 0 ? "+" : ""}${a.bonus}`)
    .join(", ");
}

async function t20ToggleAuraSagrada() {
  if (!cfg("autoAuras")) return ui.notifications.warn("Auras dinâmicas estão desativadas nas configurações do Arsenal T20.");

  const token = canvas.tokens?.controlled?.[0];
  if (!token?.actor) return ui.notifications.warn("Selecione o token do conjurador da aura.");

  const actor = token.actor;
  if (!game.user.isGM && !actor.isOwner) {
    return ui.notifications.warn("Você não tem permissão para alterar auras deste personagem.");
  }

  const auras = t20AurasAtivasActor(actor);
  const idx = auras.findIndex(a => a.id === "aura-sagrada");

  if (idx >= 0) {
    const removida = auras.splice(idx, 1)[0];
    await t20SetAurasAtivasActor(actor, auras);
    t20AtualizarAurasVisuais();
    await ChatMessage.create({
      content: `<div style="background:#171b26;border:1px solid #2b3347;border-left:4px solid #64748b;padding:8px 11px;border-radius:6px;color:#d7dcea">
        🛡️ <b>${removida.nome ?? "Aura Sagrada"}</b> foi desativada em <b>${actor.name}</b>.
      </div>`
    });
    return;
  }

  const bonus = t20ValorAtributo(actor, "car");
  auras.push({
    id: "aura-sagrada",
    nome: "Aura Sagrada",
    tipo: "resistencia",
    raio: 9,
    atributo: "car",
    aplica: ["refl", "fort", "vont", "reflexos", "fortitude", "vontade"],
    aliados: "mesmaDisposicao",
    criadoEm: Date.now(),
  });

  await t20SetAurasAtivasActor(actor, auras);
  t20AtualizarAurasVisuais();

  await ChatMessage.create({
    content: `<div style="background:#171b26;border:1px solid #2b3347;border-left:4px solid #2dd4bf;padding:8px 11px;border-radius:6px;color:#d7dcea">
      🛡️ <b>Aura Sagrada</b> ativada em <b>${actor.name}</b>.
      <br><span style="font-size:0.88em;color:#9ca3af">Raio: 9m · Bônus: CAR (${bonus >= 0 ? "+" : ""}${bonus}) · Afeta aliados pela disposição do token.</span>
    </div>`
  });
}

function t20AuraAnimacaoAtiva() {
  try {
    return !!game.settings.get("arsenal-t20", "auraAnimation");
  } catch {
    return true;
  }
}

function t20PararAnimacaoAuras() {
  try {
    if (canvas?.arsenalT20AuraTicker) {
      canvas.app?.ticker?.remove(canvas.arsenalT20AuraTicker);
      canvas.arsenalT20AuraTicker = null;
    }
  } catch (e) {
    console.warn("Arsenal T20 | erro ao parar animação de aura", e);
  }
}

function t20AtualizarAurasVisuais() {
  try {
    if (!canvas?.ready || !window.PIXI) return;

    t20PararAnimacaoAuras();

    if (canvas.arsenalT20AuraLayer) {
      canvas.arsenalT20AuraLayer.destroy({ children: true });
      canvas.arsenalT20AuraLayer = null;
    }

    if (!cfg("autoAuras")) return;

    const parentLayer = canvas.tokens ?? canvas.interface;
    if (!parentLayer?.addChild) return;

    const layer = new PIXI.Container();
    layer.name = "arsenal-t20-aura-layer";
    layer.sortableChildren = true;
    layer.zIndex = -10;
    // Não captura clique/mouse: a aura é apenas visual e não deve bloquear seleção de tokens.
    layer.interactive = false;
    layer.interactiveChildren = false;
    layer.eventMode = "none";
    parentLayer.addChild(layer);
    canvas.arsenalT20AuraLayer = layer;

    const animar = t20AuraAnimacaoAtiva();
    const animados = [];

    const gridSize = canvas.grid?.size ?? canvas.scene?.grid?.size ?? 100;
    const sceneDistance = Number(canvas.scene?.grid?.distance ?? 1) || 1;

    for (const token of canvas.tokens?.placeables ?? []) {
      const auras = t20AurasAtivasActor(token.actor);
      if (!auras.length) continue;

      for (const aura of auras) {
        const raio = Number(aura.raio ?? 9);
        const raioPx = (raio / sceneDistance) * gridSize;
        const center = token.center ?? { x: token.x, y: token.y };

        // Sem círculo base fixo: a aura aparece apenas como emanação ondulante.
        // O pequeno núcleo identifica a origem da aura sem ocupar a área inteira.
        const nucleo = new PIXI.Graphics();
        nucleo.interactive = false;
        nucleo.interactiveChildren = false;
        nucleo.eventMode = "none";
        nucleo.beginFill(0xfacc15, 0.26);
        nucleo.drawCircle(center.x, center.y, Math.max(12, gridSize * 0.20));
        nucleo.endFill();
        layer.addChild(nucleo);

        if (animar) {
          // Ondas visíveis e leves, sem preenchimento fixo.
          const ondas = [];
          for (let i = 0; i < 3; i++) {
            const onda = new PIXI.Graphics();
            onda.interactive = false;
            onda.interactiveChildren = false;
            onda.eventMode = "none";
            onda.x = center.x;
            onda.y = center.y;
            onda.lineStyle(i === 0 ? 3 : 2, i % 2 === 0 ? 0x7dd3fc : 0xfacc15, 0.72);
            onda.drawCircle(0, 0, raioPx);
            layer.addChild(onda);
            ondas.push({ grafico: onda, fase: i / 3 });
          }

          animados.push({
            tokenId: token.id,
            raioPx,
            nucleo,
            ondas,
            tempo: Math.random(),
          });
        } else {
          // Com animação desligada, mantém apenas uma linha pontilhada muito discreta para indicar o alcance.
          const limite = new PIXI.Graphics();
          limite.interactive = false;
          limite.interactiveChildren = false;
          limite.eventMode = "none";
          limite.lineStyle(2, 0x7dd3fc, 0.45);
          limite.drawCircle(center.x, center.y, raioPx);
          layer.addChild(limite);
        }
      }
    }

    if (animar && animados.length) {
      const ticker = (delta) => {
        try {
          const dt = Math.min(0.08, (delta || 1) / 60);
          for (const item of animados) {
            const token = canvas.tokens?.get(item.tokenId);
            if (!token) continue;
            const center = token.center ?? { x: token.x, y: token.y };

            // Reposiciona tudo para acompanhar o token sem recriar a camada a cada movimento fino.
            item.nucleo.clear();
            item.nucleo.beginFill(0xfacc15, 0.22 + 0.10 * Math.sin(performance.now() / 360));
            item.nucleo.drawCircle(center.x, center.y, Math.max(12, gridSize * 0.20));
            item.nucleo.endFill();

            item.tempo = (item.tempo + dt * 0.28) % 1;

            for (const o of item.ondas) {
              const t = (item.tempo + o.fase) % 1;
              const escala = 0.55 + t * 0.55;
              const alpha = Math.max(0, 0.72 * (1 - t));
              o.grafico.x = center.x;
              o.grafico.y = center.y;
              o.grafico.scale.set(escala);
              o.grafico.alpha = alpha;
            }
          }
        } catch (e) {
          console.warn("Arsenal T20 | erro no ticker da aura", e);
        }
      };

      canvas.arsenalT20AuraTicker = ticker;
      canvas.app?.ticker?.add(ticker);
    }
  } catch (e) {
    console.warn("Arsenal T20 | erro ao desenhar auras", e);
  }
}

Hooks.once("ready", () => {
  setTimeout(() => t20AtualizarAurasVisuais(), 1000);
});

Hooks.on("canvasReady", () => t20AtualizarAurasVisuais());
Hooks.on("tearDownCanvas", () => t20PararAnimacaoAuras());
Hooks.on("updateToken", () => t20AtualizarAurasVisuais());
Hooks.on("deleteToken", () => t20AtualizarAurasVisuais());
Hooks.on("controlToken", () => t20AtualizarAurasVisuais());
Hooks.on("updateActor", (actor, changed) => {
  if (foundry.utils.getProperty(changed, "flags.arsenal-t20.aurasAtivas") !== undefined) {
    t20AtualizarAurasVisuais();
  }
});

Hooks.on("getSceneControlButtons", (controls) => {
  if (Array.isArray(controls)) {
    const tokens = controls.find(c => c.name === "token");
    if (tokens) {
      tokens.tools.push({
        name: "arsenal-aura-sagrada",
        title: "Alternar Aura Sagrada — Arsenal T20",
        icon: "fas fa-shield-alt",
        button: true,
        onClick: () => t20ToggleAuraSagrada(),
      });
    }
  } else {
    const tokens = controls.token ?? controls.tokens;
    if (tokens) {
      tokens.tools["arsenal-aura-sagrada"] = {
        name: "arsenal-aura-sagrada",
        title: "Alternar Aura Sagrada — Arsenal T20",
        icon: "fas fa-shield-alt",
        button: true,
        onChange: () => t20ToggleAuraSagrada(),
        order: 103,
      };
    }
  }
});

Hooks.once("ready", () => {
  if (!game.user.isGM && !game.user.character) return;
  if (document.getElementById("arsenal-aura-btn")) return;

  const btn = document.createElement("button");
  btn.id = "arsenal-aura-btn";
  btn.title = "Alternar Aura Sagrada — Arsenal T20";
  btn.innerHTML = `<i class="fas fa-shield-alt" style="margin-right:4px"></i><span style="font-size:0.76em;font-family:'Cinzel',serif;letter-spacing:0.03em">Aura</span>`;
  btn.style.cssText = `
    position: fixed;
    top: 534px;
    left: 0;
    z-index: 102;
    height: 34px;
    padding: 0 10px;
    background: #10231f;
    border: 1px solid #2dd4bf;
    border-radius: 0 6px 6px 0;
    color: #7dd3fc;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    box-shadow: 2px 2px 8px rgba(0,0,0,0.55);
  `;

  const ajustarPosicaoAura = () => {
    const recBtn = document.getElementById("arsenal-recursos-btn");
    if (recBtn) {
      const rect = recBtn.getBoundingClientRect();
      btn.style.top = `${Math.ceil(rect.bottom + 6)}px`;
    } else {
      const controls = document.getElementById("controls") ?? document.querySelector("#ui-left #controls");
      if (controls) {
        const rect = controls.getBoundingClientRect();
        btn.style.top = `${Math.max(534, Math.ceil(rect.bottom + 88))}px`;
      } else {
        btn.style.top = "534px";
      }
    }
  };

  btn.addEventListener("click", () => t20ToggleAuraSagrada());
  document.body.appendChild(btn);
  setTimeout(ajustarPosicaoAura, 800);
  Hooks.on("renderPlayerList", ajustarPosicaoAura);
  Hooks.on("canvasReady", ajustarPosicaoAura);
});


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

function itemTemAreaOuTemplate(itemData = {}, message = null) {
  const norm = (v) => String(v ?? "").toLowerCase();

  const targetType = norm(
    itemData?.target?.type ??
    itemData?.system?.target?.type ??
    itemData?.alvo?.type ??
    itemData?.area?.type ??
    ""
  );

  // Tipos explicitamente geométricos. "ray/raio" NÃO entra aqui porque, no T20,
  // muitas magias de alvo único/direcionadas usam raio/linha visual sem serem área.
  if (["cone", "circle", "square", "line", "rect", "rectangle", "sphere", "cylinder", "area"].includes(targetType)) {
    return true;
  }

  const targetText = [
    itemData?.target?.type,
    itemData?.target?.value,
    itemData?.target?.units,
    itemData?.system?.target?.type,
    itemData?.system?.target?.value,
    itemData?.alvo,
    itemData?.alvo?.value,
    itemData?.alvo?.type,
  ].filter(Boolean).join(" ").toLowerCase();

  const textoCompleto = [
    targetText,
    itemData?.area,
    itemData?.efeito,
    itemData?.effect,
    itemData?.description?.value,
    message?.content,
  ].filter(Boolean).join(" ").toLowerCase().replace(/<[^>]+>/g, " ");

  // Veto forte para magias de alvo único. Isso corrige casos como Flecha de Luz:
  // "Alvo: 1 criatura" não deve pedir template.
  const pareceAlvoUnico =
    /\balvo\s*:?\s*(?:1|uma|um)\s+(?:criatura|alvo|ser|personagem|objeto)\b/i.test(textoCompleto) ||
    /\btarget\s*:?\s*(?:1|one)\s+(?:creature|target|object)\b/i.test(textoCompleto);

  // Campos estruturados de efeito/área são mais confiáveis que o HTML inteiro.
  const textoEstruturadoArea = [
    itemData?.area,
    itemData?.efeito,
    itemData?.effect,
    itemData?.system?.area,
    itemData?.system?.efeito,
    itemData?.system?.effect,
  ].filter(Boolean).join(" ").toLowerCase();

  const temAreaEstruturada =
    /\b(área|area|cone|linha|círculo|circulo|esfera|quadrado|cubo|cilindro|explosão|explosao|emanação|emanacao|template|modelo)\b/i.test(textoEstruturadoArea);

  if (temAreaEstruturada && !pareceAlvoUnico) return true;

  // Fallback pelo card renderizado: só considera área quando o próprio campo "Efeito:"
  // do card indicar uma geometria/template. Evita que palavras soltas na descrição
  // façam uma magia de alvo único ser tratada como área.
  const conteudoLimpo = norm(message?.content).replace(/<[^>]+>/g, " ");
  const efeitoMatch = conteudoLimpo.match(/\befeito\s*:?\s*([^.;\n]+)/i);
  const efeitoTexto = efeitoMatch?.[1] ?? "";
  const efeitoIndicaArea = /\b(área|area|cone|linha|círculo|circulo|esfera|quadrado|cubo|cilindro|explosão|explosao|emanação|emanacao|template|modelo)\b/i.test(efeitoTexto);

  if (efeitoIndicaArea && !pareceAlvoUnico) return true;

  return false;
}

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

  // T20 normalmente guarda os dados do item em flags.tormenta20.itemData.
  // Algumas rolagens de magia chegam apenas com o HTML do card; por isso há fallback por texto.
  // Porém, mensagens que são APENAS testes de resistência dos alvos não devem gerar novo card.
  const itemData = message.flags?.tormenta20?.itemData ?? {};
  const temRollD20 = message.rolls?.some(r => r.formula?.includes("d20")) ?? false;
  const temItemResistencia = !!(itemData?.resistencia?.txt || itemData?.resistencia?.pericia);

  if (temRollD20 && !temItemResistencia) {
    // Ex.: "Reflexos contra Bola de Fogo (CD 23)".
    // Essa mensagem é o teste do alvo, não o lançamento da magia.
    return;
  }

  const resistencia = extrairResistenciaDaMensagem(message, itemData);
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
  const nomeMatch =
    message.content?.match(/title="([^"]+)"/) ??
    message.content?.match(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/i);
  const imgMatch  = message.content?.match(/img[^>]+src="([^"]+)"/);
  const nomeFallbackTexto = (() => {
    const limpo = textoChatLimpo(message.content ?? "");
    // Tenta capturar a primeira linha após o nome do conjurador e antes da escola/círculo.
    const linhas = limpo.split(/(?=\b(?:Universal|Arcana|Divina)\b|\bExecução:|\bDano\b)/i)[0]
      .split(/\s{2,}|\n/)
      .map(s => s.trim())
      .filter(Boolean);
    // Remove o alias do ator se aparecer no começo.
    const semAtor = linhas.filter(l => l !== actor.name && !/^\d+\s*PM$/i.test(l));
    return semAtor[0] || "";
  })();
  const nomeItem  = itemData?.name ?? itemData?.nome ?? (nomeMatch?.[1] ? textoChatLimpo(nomeMatch[1]) : nomeFallbackTexto || "Habilidade");
  const imgItem   = itemData?.img ?? imgMatch?.[1]  ?? "";

  // ── Cálculo de CD de magias ────────────────────────────────
  // Preferimos a CD final preparada pelo sistema T20 quando disponível, pois ela já inclui
  // bônus passivos transferidos para a ficha. Se o campo não existir, usamos o cálculo-base
  // com fallbacks para descrições e Active Effects.
  const cdCalculada = calcularCDMagiaAtor(actor, itemData, message);
  const cdTexto = Number.isFinite(resistencia.cdTexto) ? resistencia.cdTexto : null;
  const cd = Math.max(cdCalculada, cdTexto ?? -Infinity);

  // Dano da magia
  const rolls       = itemData?.rolls ?? [];
  // Dano já rolado na mesma mensagem
  const rollDanoMagia = message.rolls?.find(r => !r.formula?.includes("d20"));

  const tipoDano    = rolls[0]?.parts?.[0]?.[1] ?? "";
  const formulaDano = rolls[0]?.parts?.[0]?.[0] ?? rollDanoMagia?.formula ?? "";

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
  const temArea = itemTemAreaOuTemplate(itemData, message);

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
    // Sem área: gera o card normal (alvos selecionados manualmente).
    // Também limpa qualquer salvamento pendente antigo para evitar pedido indevido de template.
    _salvamentoPendente = null;
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
  const doc = template?.document ?? template;
  const tmplObj = template?.object ?? canvas.templates?.get(doc?.id);
  const tokens = Array.from(canvas.tokens?.placeables ?? []).filter(t => t?.actor);
  const resultado = [];

  if (!doc && !tmplObj) return resultado;

  const tipo = String(doc?.t ?? doc?.type ?? doc?.shape ?? "").toLowerCase();
  const gridSize = canvas.grid?.size ?? canvas.scene?.grid?.size ?? 100;
  const sceneDistance = Number(canvas.scene?.grid?.distance ?? 1) || 1;
  const distancia = Number(doc?.distance ?? doc?.d ?? doc?.radius ?? 0);
  const distanciaPx = distancia > 0 ? (distancia / sceneDistance) * gridSize : 0;

  const origem = {
    x: Number(doc?.x ?? tmplObj?.x ?? 0),
    y: Number(doc?.y ?? tmplObj?.y ?? 0),
  };

  const direcaoRad = Math.toRadians?.(Number(doc?.direction ?? 0)) ?? ((Number(doc?.direction ?? 0) * Math.PI) / 180);

  function centroToken(token) {
    return token.center ?? {
      x: token.x + (token.w ?? token.width * gridSize ?? gridSize) / 2,
      y: token.y + (token.h ?? token.height * gridSize ?? gridSize) / 2,
    };
  }

  function pontoManualDentro(p) {
    const dx = p.x - origem.x;
    const dy = p.y - origem.y;

    // Círculo é o tipo mais comum para explosões/bolas de fogo.
    if (["circle", "circulo", "círculo"].includes(tipo) && distanciaPx > 0) {
      return Math.hypot(dx, dy) <= distanciaPx + 1;
    }

    // Retângulo/quadrado centrado e rotacionável.
    // Usamos uma leitura conservadora para evitar pegar tokens fora da área visual.
    if (["rect", "rectangle", "square", "quadrado"].includes(tipo) && distanciaPx > 0) {
      const cos = Math.cos(-direcaoRad);
      const sin = Math.sin(-direcaoRad);
      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;
      const half = distanciaPx / 2;
      return Math.abs(rx) <= half + 1 && Math.abs(ry) <= half + 1;
    }

    // Cone conservador.
    if (["cone"].includes(tipo) && distanciaPx > 0) {
      const dist = Math.hypot(dx, dy);
      if (dist > distanciaPx + 1) return false;
      const angulo = Number(doc?.angle ?? 90);
      const aPonto = Math.atan2(dy, dx);
      let diff = Math.abs(((aPonto - direcaoRad + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
      return diff <= (angulo * Math.PI / 180) / 2;
    }

    // Linha/raio conservador.
    if (["ray", "line", "linha"].includes(tipo) && distanciaPx > 0) {
      const larguraPx = ((Number(doc?.width ?? 1) || 1) / sceneDistance) * gridSize;
      const cos = Math.cos(-direcaoRad);
      const sin = Math.sin(-direcaoRad);
      const rx = dx * cos - dy * sin;
      const ry = dx * sin + dy * cos;
      return rx >= -1 && rx <= distanciaPx + 1 && Math.abs(ry) <= larguraPx / 2 + 1;
    }

    return null;
  }

  for (const token of tokens) {
    try {
      const center = centroToken(token);

      let dentro = pontoManualDentro(center);

      // Se conseguimos calcular manualmente, confiamos nesse resultado.
      // Isso evita falsos positivos de shape.contains/bounds em templates rotacionados.
      if (dentro === null) {
        dentro = false;

        if (tmplObj?.shape?.contains) {
          let local;
          if (typeof tmplObj.toLocal === "function") {
            local = tmplObj.toLocal(center);
          } else if (tmplObj.worldTransform?.applyInverse) {
            local = tmplObj.worldTransform.applyInverse(center);
          } else {
            local = { x: center.x - origem.x, y: center.y - origem.y };
          }
          dentro = tmplObj.shape.contains(local.x, local.y);
        }

        if (!dentro && typeof tmplObj?.isInside === "function") {
          dentro = tmplObj.isInside(center);
        }
      }

      if (dentro) resultado.push(token);
    } catch (e) {
      console.warn("Arsenal T20 | erro ao checar token na área", e);
    }
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

  // Espera o template ser desenhado no canvas. Alguns sistemas criam o documento antes do objeto visual existir.
  await new Promise(r => setTimeout(r, 500));

  const templateAtualizado = canvas.templates?.get(template.id)?.document ?? template;

  // Detecta tokens na área
  const tokensAlvos = tokensNaArea(templateAtualizado);

  if (!tokensAlvos.length) {
    ui.notifications.warn(`Arsenal T20 | Nenhum token foi detectado dentro da área de ${dados.nomeItem}.`);
  }

  // Gera o prompt/card de salvamento individual para cada token enquadrado no template.
  // Se nenhum token for detectado, ainda gera um card manual para não perder a rolagem.
  await criarCartaoSalvamento({
    ...dados,
    tokensNaArea: tokensAlvos,
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
    ? `<div style="font-size:0.8em;color:#b8becf;margin-bottom:10px;
        padding:5px 9px;background:rgba(255,255,255,0.045);border-radius:6px;
        border-left:3px solid #c9a227;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.04)">
        🎯 Alvo: <b style="color:#f2e6c9">${nomeAlvo}</b>
      </div>`
    : "";

  const dataToken = tokenId ? `data-token-alvo="${tokenId}"` : "";

  return `
    <div class="t20-card" style="background:linear-gradient(180deg,#131722 0%,#0e1320 100%);
      border:1px solid #2c3448;border-top:3px solid #c9a227;
      box-shadow:0 8px 18px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.04);
      border-radius:8px;padding:12px;color:#e8d5b7;font-family:'Palatino Linotype',serif;">
      <div style="display:flex;align-items:center;gap:10px;
        border-bottom:1px solid rgba(201,162,39,0.22);padding-bottom:8px;margin-bottom:10px">
        ${imgItem ? `<img src="${imgItem}" style="width:36px;height:36px;border-radius:6px;border:1px solid rgba(201,162,39,0.55);object-fit:cover;box-shadow:0 2px 6px rgba(0,0,0,0.35)"/>` : ""}
        <div>
          <div style="color:#d9b85f;font-weight:bold;font-size:1.05em">${nomeItem}</div>
          <div style="font-size:0.78em;color:#8f97aa">por ${nomeConjurador}</div>
        </div>
        <div style="margin-left:auto;text-align:center;background:rgba(0,0,0,0.18);padding:5px 8px;border-radius:6px;border:1px solid rgba(217,184,95,0.18)">
          <div style="font-size:0.68em;color:#8f97aa;text-transform:uppercase;letter-spacing:0.05em">CD</div>
          <input type="number" class="t20-cd-input" value="${cd}"
            style="width:52px;text-align:center;font-size:1.28em;font-weight:bold;
              color:#ff6b6b;background:transparent;border:1px solid rgba(255,107,107,0.22);
              border-radius:5px;padding:2px 4px"/>
        </div>
      </div>
      ${tagAlvo}
      <div style="font-size:0.85em;color:#b8becf;margin-bottom:12px;line-height:1.45">
        🎲 Teste de <b style="color:#f2e6c9">${salvLabel}</b> CD ${cd}
        ${efeitoSucesso ? `<br><span style="color:#7dd3a7">✅ Sucesso:</span> ${efeitoSucesso}` : ""}
        ${formulaDano   ? `<br><span style="color:#f07f7f">✷ Dano:</span> ${formulaDano}${tipoDano ? ` [${tipoDano}]` : ""}` : ""}
        ${condicoesAoFalhar.length ? `<br><span style="color:#ff8d8d">❌ Falha aplica:</span> <b>${condicoesAoFalhar.map(id => CONFIG.statusEffects.find(e=>e.id===id)?.name ?? id).join(", ")}</b>` : ""}
        ${condicoesAoPassar.length ? `<br><span style="color:#e8cc82">⚠️ Sucesso aplica:</span> <b>${condicoesAoPassar.map(id => CONFIG.statusEffects.find(e=>e.id===id)?.name ?? id).join(", ")}</b>` : ""}
      </div>
      <div style="display:flex;gap:8px;margin-top:6px">
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
          style="flex:2;padding:8px 8px;border-radius:6px;cursor:pointer;font-size:0.84em;
            background:linear-gradient(180deg,#2d7a52,#245f42);
            border:1px solid #3c9870;color:#fff;font-weight:bold;
            box-shadow:0 2px 6px rgba(0,0,0,0.25)">
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
          style="flex:1;padding:8px 8px;border-radius:6px;cursor:pointer;font-size:0.84em;
            background:linear-gradient(180deg,#334765,#25344d);
            border:1px solid #47638c;color:#eef3ff;font-weight:bold;
            box-shadow:0 2px 6px rgba(0,0,0,0.25)">
          ⚙️ Modificador
        </button>
      </div>
    </div>`;
}


function htmlCartaoMagiaConsolidado({ nomeItem, imgItem, nomeConjurador,
    salvLabel, salvPericia, cd, efeitoSucesso, tipoDano, formulaDano, danoRolado,
    condicoesAoFalhar = [], condicoesAoPassar = [],
    alvos = [], area = false, templateId = null }) {

  const condFalhaLabel = condicoesAoFalhar
    .map(id => CONFIG.statusEffects.find(e => e.id === id)?.name ?? id)
    .join(", ");

  const condSucessoLabel = condicoesAoPassar
    .map(id => CONFIG.statusEffects.find(e => e.id === id)?.name ?? id)
    .join(", ");

  const temAlvos = Array.isArray(alvos) && alvos.length > 0;
  const alvosRender = temAlvos ? alvos : [{ id: "", name: "Token selecionado", img: "" }];

  const linhasAlvos = alvosRender.map((t, idx) => {
    const tokenData = t.id ? `data-token-alvo="${t.id}"` : "";
    const alvoNome = t.name ?? `Alvo ${idx + 1}`;
    const alvoImg = t.img ? `<img src="${t.img}" style="width:26px;height:26px;border-radius:50%;object-fit:cover;border:1px solid rgba(201,162,39,0.45)">` : `<span style="width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:#20283a;border:1px solid rgba(201,162,39,0.35);color:#d9b85f;font-size:0.8em">🎯</span>`;

    return `
      <div class="t20-alvo-row" data-token-row="${t.id ?? ""}" style="
        display:grid;grid-template-columns:minmax(0,1.15fr) 0.95fr 0.75fr;gap:8px;
        align-items:center;padding:8px;margin-top:6px;border-radius:7px;
        background:rgba(255,255,255,0.045);border:1px solid rgba(255,255,255,0.06)">
        <div style="display:flex;align-items:center;gap:7px;min-width:0">
          ${alvoImg}
          <div style="min-width:0">
            <div style="color:#f2e6c9;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${alvoNome}</div>
            <div class="t20-resultado-inline" style="font-size:0.74em;color:#8f97aa">Aguardando teste</div>
          </div>
        </div>

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
          ${tokenData}
          title="Sucesso: ÷2 | Falha: total"
          style="padding:7px 7px;border-radius:6px;cursor:pointer;font-size:0.82em;
            background:linear-gradient(180deg,#2d7a52,#245f42);
            border:1px solid #3c9870;color:#fff;font-weight:bold;
            box-shadow:0 2px 6px rgba(0,0,0,0.25)">
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
          ${tokenData}
          title="Escolher atributo, bônus e habilidades"
          style="padding:7px 7px;border-radius:6px;cursor:pointer;font-size:0.82em;
            background:linear-gradient(180deg,#334765,#25344d);
            border:1px solid #47638c;color:#eef3ff;font-weight:bold;
            box-shadow:0 2px 6px rgba(0,0,0,0.25)">
          ⚙️ Mod.
        </button>
      </div>`;
  }).join("");

  return `
    <div class="t20-card t20-magia-card" data-template-id="${templateId ?? ""}" style="
      background:linear-gradient(180deg,#131722 0%,#0e1320 100%);
      border:1px solid #2c3448;border-top:3px solid #c9a227;
      box-shadow:0 8px 18px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.04);
      border-radius:8px;padding:12px;color:#e8d5b7;font-family:'Palatino Linotype',serif;">

      <div style="display:flex;align-items:center;gap:10px;
        border-bottom:1px solid rgba(201,162,39,0.22);padding-bottom:8px;margin-bottom:10px">
        ${imgItem ? `<img src="${imgItem}" style="width:40px;height:40px;border-radius:6px;border:1px solid rgba(201,162,39,0.55);object-fit:cover;box-shadow:0 2px 6px rgba(0,0,0,0.35)"/>` : ""}
        <div style="min-width:0;flex:1">
          <div style="color:#d9b85f;font-weight:bold;font-size:1.08em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${area ? "🎯 " : ""}${nomeItem}</div>
          <div style="font-size:0.78em;color:#8f97aa">por ${nomeConjurador}${area ? ` · área · ${temAlvos ? alvos.length : 0} alvo(s)` : ""}</div>
        </div>
        <div style="text-align:center;background:rgba(0,0,0,0.18);padding:5px 8px;border-radius:6px;border:1px solid rgba(217,184,95,0.18)">
          <div style="font-size:0.68em;color:#8f97aa;text-transform:uppercase;letter-spacing:0.05em">CD</div>
          <input type="number" class="t20-cd-input" value="${cd}"
            style="width:52px;text-align:center;font-size:1.28em;font-weight:bold;
              color:#ff6b6b;background:transparent;border:1px solid rgba(255,107,107,0.22);
              border-radius:5px;padding:2px 4px"/>
        </div>
      </div>

      <div style="font-size:0.85em;color:#b8becf;margin-bottom:10px;line-height:1.45">
        🎲 <b style="color:#f2e6c9">${salvLabel}</b> CD ${cd}
        ${efeitoSucesso ? `<br><span style="color:#7dd3a7">✅ Sucesso:</span> ${efeitoSucesso}` : ""}
        ${formulaDano ? `<br><span style="color:#f07f7f">✷ Dano:</span> ${formulaDano}${tipoDano ? ` [${tipoDano}]` : ""}${danoRolado ? ` · rolado: <b>${danoRolado}</b>` : ""}` : ""}
        ${condFalhaLabel ? `<br><span style="color:#ff8d8d">❌ Falha aplica:</span> <b>${condFalhaLabel}</b>` : ""}
        ${condSucessoLabel ? `<br><span style="color:#e8cc82">⚠️ Sucesso aplica:</span> <b>${condSucessoLabel}</b>` : ""}
      </div>

      <div style="padding-top:2px">
        <div style="font-size:0.78em;color:#8f97aa;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px">
          ${temAlvos ? "Alvos e testes" : "Teste manual"}
        </div>
        ${linhasAlvos}
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

  // Card consolidado:
  // - para magia em área: usa os tokens detectados dentro do template;
  // - para magia sem área: usa os alvos selecionados no momento, se houver;
  // - se não houver alvo, cria um teste manual usando o token controlado/personagem.
  const alvosSelecionados = Array.from(game.user?.targets ?? []);
  const alvos = tokensNaArea.length > 0
    ? tokensNaArea
    : alvosSelecionados.length > 0
      ? alvosSelecionados
      : [];

  await ChatMessage.create({
    content: htmlCartaoMagiaConsolidado({
      ...dadosBase,
      alvos,
      area: tokensNaArea.length > 0,
      templateId,
    }),
  });
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
  const bonusBase = pericia?.total ?? pericia?.value ?? pericia?.mod ?? 0;
  const auraInfo = t20BonusAurasResistencia(actor, tokenAlvo, salvPericia);
  const bonus    = bonusBase + auraInfo.bonus;
  const auraTxt  = t20TextoAuras(auraInfo.detalhes);

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
          notaDano += `<br>💔 ${danoFinal} de dano aplicado.`;
        }
      } else {
        notaDano += "<br>Nenhum dano aplicado.";
      }
    }
  }

  // Mensagem da rolagem (limpa, só o resultado do dado)
  await roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `<b>${salvLabel}${auraTxt ? ` (${auraTxt})` : ""}</b> contra <i>${nomeItem}</i> (CD ${cd})`,
  });

  // Mensagem separada com resultado e dano aplicado
  const msgConteudo = `
    <div style="background:linear-gradient(180deg,#171b26 0%,#0f1420 100%);border:1px solid #2b3347;border-left:4px solid ${cor};padding:8px 11px;border-radius:6px;box-shadow:0 4px 10px rgba(0,0,0,0.22)">
      <div style="font-weight:bold;font-size:1.02em;color:${cor};margin-bottom:5px">
        ${label} — ${actor.name}
      </div>
      <div style="font-size:0.88em;color:#d7dcea;line-height:1.4">
        ${notaDano}
      </div>
    </div>`;

  await ChatMessage.create({
    content: msgConteudo,
    speaker: ChatMessage.getSpeaker({ actor }),
  });

  // Atualiza o card consolidado para todos os usuários, sem revelar PV.
  await atualizarCardConsolidadoDoBotao(btn, sucesso, danoFinal);

  // Aplicar condições baseado no resultado
  const condicoesAplicar = sucesso ? condicoesPassar : condicoesFalhar;
  if (cfg("autoCondicoes") && condicoesAplicar.length) {
    if (game.user.isGM || actor.isOwner) {
      await aplicarCondicoes(actor, condicoesAplicar, nomeItem);
    } else {
      game.socket.emit("module.arsenal-t20", {
        tipo: "aplicarCondicoes",
        actorId: actor.id,
        actorUuid: actor.uuid,
        tokenId: tokenAlvo?.id,
        sceneId: canvas.scene?.id,
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
    btn.dataset.messageId = message.id;
    if (btn._arsenalListenerAdded) return;
    btn._arsenalListenerAdded = true;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", () => rolarSalvamento(btn));
  });
  html.querySelectorAll(".t20-custom").forEach(btn => {
    btn.dataset.messageId = message.id;
    if (btn._arsenalListenerAdded) return;
    btn._arsenalListenerAdded = true;
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
            contextButton: btn,
            tokenAlvo: tokenAlvo2,
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
    salvPericia, salvLabel, bonusExtra, temPoder, evasaoSimples = false, condicoesFalhar = [], condicoesPassar = [],
    contextButton = null, tokenAlvo = null }) {

  const pericias  = actor.system?.pericias ?? {};
  const _pRaw2    = pericias[salvPericia];
  const p         = typeof _pRaw2 === "string" ? JSON.parse(_pRaw2) : (_pRaw2 ?? {});
  const bonusBase = p?.total ?? p?.value ?? p?.mod ?? 0;
  const tokenParaAura = tokenAlvo ?? actor.getActiveTokens?.()[0] ?? canvas.tokens.controlled?.[0] ?? null;
  const auraInfo = t20BonusAurasResistencia(actor, tokenParaAura, salvPericia);
  const bonus     = bonusBase + bonusExtra + auraInfo.bonus;
  const auraTxt   = t20TextoAuras(auraInfo.detalhes);
  const bonusStr = `${bonusExtra !== 0 ? ` ${bonusExtra > 0 ? "+" : ""}${bonusExtra} custom` : ""}${auraTxt ? ` (${auraTxt})` : ""}`;

  console.log(`Arsenal T20 | rolarSalvamentoCustom | pericia=${salvPericia} bonusBase=${bonusBase} bonusExtra=${bonusExtra} aura=${auraInfo.bonus} total=${bonus} cd=${cd}`);
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
          notaDano += `<br>💔 ${danoFinal} de dano aplicado.`;
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
    content: `<div style="background:linear-gradient(180deg,#171b26 0%,#0f1420 100%);border:1px solid #2b3347;border-left:4px solid ${cor};padding:8px 11px;border-radius:6px;box-shadow:0 4px 10px rgba(0,0,0,0.22)">
      <div style="font-weight:bold;color:${cor};margin-bottom:5px">${label} — ${actor.name}</div>
      <div style="font-size:0.88em;color:#d7dcea;line-height:1.4">${notaDano}</div>
    </div>`,
    speaker: ChatMessage.getSpeaker({ actor }),
  });

  // Atualiza o card consolidado para todos os usuários, sem revelar PV.
  if (contextButton) {
    await atualizarCardConsolidadoDoBotao(contextButton, sucesso, danoFinal);
  }

  const condicoesAplicar2 = sucesso ? condicoesPassar : condicoesFalhar;
  if (cfg("autoCondicoes") && condicoesAplicar2.length) {
    if (game.user.isGM || actor.isOwner) {
      await aplicarCondicoes(actor, condicoesAplicar2, nomeItem);
    } else {
      game.socket.emit("module.arsenal-t20", {
        tipo: "aplicarCondicoes",
        actorId: actor.id,
        actorUuid: actor.uuid,
        tokenId: tokenAlvo?.id,
        sceneId: canvas.scene?.id,
        condicoes: condicoesAplicar2,
        nomeItem,
      });
    }
  }
}


// ============================================================
// CURA - Detecta rolagens de cura e cria botão para aplicar PV
// ============================================================

function ehRolagemDeCura(message, roll) {
  const itemData = message.flags?.tormenta20?.itemData ?? {};
  const textoBusca = [
    itemData?.name,
    itemData?.nome,
    itemData?.type,
    itemData?.tipo,
    itemData?.description?.value,
    itemData?.system?.description?.value,
    message.flavor,
    message.content,
    roll?.formula,
    ...(itemData?.rolls ?? []).flatMap(r => [
      r?.name,
      r?.label,
      r?.type,
      r?.parts?.map?.(p => p?.[1])?.join(" ")
    ])
  ].filter(Boolean).join(" ").toLowerCase();

  // Padrões comuns no sistema T20: campo/label "Cura", magia "Curar Ferimentos",
  // descrições como "recupera X pontos de vida" etc.
  const temIndicadorCura =
    /\bcura\b/i.test(textoBusca) ||
    /\bcurar\b/i.test(textoBusca) ||
    /\bcurativo\b/i.test(textoBusca) ||
    /\brecupera(?:r)?\b[^.]{0,80}\b(?:pv|pontos?\s+de\s+vida|vida)\b/i.test(textoBusca) ||
    /\brecupera(?:r)?\s+\d*d?\d+/i.test(textoBusca);

  if (!temIndicadorCura) return false;

  // Evita confundir descrições negativas ou efeitos que impedem cura.
  if (/\bn[aã]o\s+pode\s+recuperar\s+(?:pv|pontos?\s+de\s+vida|vida)\b/i.test(textoBusca)) return false;
  if (/\bimpede\s+(?:a\s+)?cura\b/i.test(textoBusca)) return false;

  return true;
}

function obterAlvosCura() {
  // Prioridade: todos os alvos selecionados com T.
  const alvosSelecionados = Array.from(game.user.targets ?? []).filter(t => t?.actor);
  if (alvosSelecionados.length) return alvosSelecionados;

  // Fallback: todos os tokens controlados.
  const tokensControlados = Array.from(canvas.tokens?.controlled ?? []).filter(t => t?.actor);
  if (tokensControlados.length) return tokensControlados;

  // Último fallback: personagem do usuário, empacotado como alvo lógico.
  if (game.user.character) {
    return [{ actor: game.user.character, name: game.user.character.name }];
  }

  return [];
}

function htmlCartaoCura({ nomeItem, imgItem, nomeConjurador, valorCura }) {
  return `
    <div class="t20-card t20-cura-card" style="
      background:linear-gradient(180deg,#e8f7df 0%,#cdeec2 100%);
      border:1px solid #7fbf72;border-top:3px solid #3f9f58;
      box-shadow:0 6px 14px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.65);
      border-radius:8px;padding:12px;color:#1f3523;font-family:'Palatino Linotype',serif;">
      <div style="display:flex;align-items:center;gap:10px;
        border-bottom:1px solid rgba(63,159,88,0.28);padding-bottom:8px;margin-bottom:10px">
        ${imgItem ? `<img src="${imgItem}" style="width:36px;height:36px;border-radius:6px;border:1px solid rgba(63,159,88,0.55);object-fit:cover;box-shadow:0 2px 6px rgba(0,0,0,0.20)"/>` : ""}
        <div style="flex:1">
          <div style="color:#25753a;font-weight:bold;font-size:1.05em">✚ ${nomeItem}</div>
          <div style="font-size:0.78em;color:#55735b">por ${nomeConjurador}</div>
        </div>
        <div style="text-align:center;background:rgba(255,255,255,0.45);padding:5px 9px;border-radius:6px;border:1px solid rgba(63,159,88,0.18)">
          <div style="font-size:0.68em;color:#55735b;text-transform:uppercase;letter-spacing:0.05em">Cura</div>
          <div style="font-size:1.35em;color:#1f8f45;font-weight:bold">${valorCura}</div>
        </div>
      </div>

      <div style="font-size:0.86em;color:#304f36;margin-bottom:12px;line-height:1.45">
        🌿 Recupera <b>${valorCura} PV</b> dos alvos escolhidos.
      </div>

      <div style="display:flex;gap:8px;margin-top:6px">
        <button class="t20-aplicar-cura"
          data-cura="${valorCura}"
          data-item="${nomeItem}"
          title="Aplica a cura a todos os alvos selecionados ou tokens controlados"
          style="flex:1;padding:8px 8px;border-radius:6px;cursor:pointer;font-size:0.86em;
            background:linear-gradient(180deg,#3fa35b,#2f7f47);
            border:1px solid #56bd75;color:#fff;font-weight:bold;
            box-shadow:0 2px 6px rgba(0,0,0,0.22)">
          ✚ Aplicar ${valorCura} de Cura
        </button>
      </div>
    </div>`;
}

async function criarCartaoCura(message, roll) {
  if (!cfg("autoCura")) return;
  if (!roll || !ehRolagemDeCura(message, roll)) return;

  // Evita duplicar caso o próprio card de cura do Arsenal já tenha sido renderizado.
  if (message.flags?.["arsenal-t20"]?.tipo === "cura") return;

  const itemData = message.flags?.tormenta20?.itemData ?? {};
  const actor = game.actors.get(message.speaker?.actor);

  const nomeItem =
    itemData?.name ??
    itemData?.nome ??
    message.flavor?.replace(/<[^>]+>/g, " ")?.trim() ??
    "Cura";

  const imgItem =
    itemData?.img ??
    itemData?.image ??
    itemData?.system?.img ??
    message.content?.match(/img[^>]+src="([^"]+)"/)?.[1] ??
    "";

  const nomeConjurador = actor?.name ?? message.speaker?.alias ?? "Conjurador";
  const valorCura = Number(roll.total) || 0;
  if (valorCura <= 0) return;

  await ChatMessage.create({
    content: htmlCartaoCura({ nomeItem, imgItem, nomeConjurador, valorCura }),
    speaker: message.speaker,
    flags: { "arsenal-t20": { tipo: "cura", origem: message.id } }
  });
}

async function aplicarCura(btn) {
  const cura = parseInt(btn.dataset.cura) || 0;
  if (cura <= 0) return;

  const alvos = obterAlvosCura();
  if (!alvos.length) return ui.notifications.warn("Selecione um ou mais alvos, ou controle um token, para receber a cura.");

  const pvPath = "system.attributes.pv.value";
  const pvMaxPath = "system.attributes.pv.max";
  const resultados = [];

  for (const alvo of alvos) {
    const actor = alvo.actor;
    if (!actor) continue;

    const pvAtual = foundry.utils.getProperty(actor, pvPath);
    const pvMax = foundry.utils.getProperty(actor, pvMaxPath) ?? pvAtual;

    if (pvAtual === undefined) {
      resultados.push(`<div>⚠️ <b>${actor.name}</b>: PV não encontrado.</div>`);
      continue;
    }

    const novoPV = Math.min(pvMax, pvAtual + cura);
    const curaEfetiva = Math.max(0, novoPV - pvAtual);

    await actor.update({ [pvPath]: novoPV });

    resultados.push(`
      <div style="margin:2px 0">
        ✚ <b>${actor.name}</b> recuperou <b>${curaEfetiva}</b> PV${curaEfetiva < cura ? ` <span style="color:#55735b">(limitado pelo PV máximo)</span>` : ""}.
      </div>`);
  }

  await ChatMessage.create({
    content: `
      <div style="background:linear-gradient(180deg,#e8f7df 0%,#cdeec2 100%);
        border:1px solid #7fbf72;border-left:4px solid #3f9f58;
        padding:8px 11px;border-radius:6px;color:#1f3523;
        box-shadow:0 4px 10px rgba(0,0,0,0.18)">
        <div style="font-weight:bold;color:#25753a;margin-bottom:5px">✚ Cura aplicada</div>
        <div style="font-size:0.9em;line-height:1.4">
          ${resultados.join("")}
        </div>
      </div>`,
    speaker: ChatMessage.getSpeaker({ actor: alvos[0]?.actor }),
  });

  btn.disabled = true;
  btn.style.opacity = "0.55";
}

// Listener global persistente para botões de cura
Hooks.on("renderChatMessageHTML", (message, html) => {
  html.querySelectorAll(".t20-aplicar-cura").forEach(btn => {
    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", () => aplicarCura(btn));
  });
});

// Detecta mensagens de cura criadas pelo sistema T20
Hooks.on("createChatMessage", async (message, options, userId) => {
  if (!cfg("autoCura")) return;
  if (userId !== game.userId) return;
  if (!message.rolls?.length) return;

  // Não processa mensagens que tenham ataque d20 para evitar colisão com automação de ataque/salvamento.
  const rollCura = message.rolls.find(r => !r.formula?.includes("d20") && ehRolagemDeCura(message, r));
  if (!rollCura) return;

  await criarCartaoCura(message, rollCura);
});

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

  // 3) Se há apenas bloco de sucesso, o texto anterior costuma descrever o efeito da falha.
  // Ex.: "sofre dano e fica Atordoado. Se passar, sofre metade e evita a condição".
  // Exigimos verbo de aplicação para evitar falsos positivos como "morcegos" -> "cego".
  if (idxSucesso >= 0) {
    const antesDoSucesso = texto.slice(0, idxSucesso);
    for (const id of _condicoesNoTexto(antesDoSucesso, { exigirAplicacao: true })) aoFalhar.add(id);
  }

  // 4) Sem bloco explícito, exigir verbo de aplicação para evitar falsos positivos.
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




function t20PMModoControle() {
  try {
    return game.settings.get("arsenal-t20", "pmControlMode") ?? "manual";
  } catch {
    try {
      return game.settings.get("arsenal-t20", "autoPMCard") ? "manual" : "off";
    } catch {
      return "manual";
    }
  }
}

function t20GetSustentadas() {
  try {
    return game.settings.get("arsenal-t20", "sustentadasAtivas") ?? {};
  } catch {
    return {};
  }
}

async function t20SetSustentadas(data) {
  await game.settings.set("arsenal-t20", "sustentadasAtivas", data ?? {});
}

function t20ActorKey(actor) {
  return actor?.uuid ?? actor?.id ?? actor?.name ?? "desconhecido";
}

function t20ActorKeys(actor) {
  const keys = new Set();
  if (!actor) return ["desconhecido"];
  if (actor.uuid) keys.add(actor.uuid);
  if (actor.id) keys.add(actor.id);
  if (actor.name) keys.add(actor.name);

  // Para tokens vinculados/desvinculados, o ator do combatente pode ter chave diferente.
  try {
    for (const token of actor.getActiveTokens?.() ?? []) {
      if (token?.document?.uuid) keys.add(token.document.uuid);
      if (token?.id) keys.add(token.id);
    }
  } catch {}

  return [...keys].filter(Boolean);
}

function t20GetSustentadasActorFlag(actor) {
  try {
    const lista = actor?.getFlag?.("arsenal-t20", "sustentadasAtivas");
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

async function t20SetSustentadasActorFlag(actor, lista) {
  if (!actor) return;
  await actor.setFlag("arsenal-t20", "sustentadasAtivas", Array.isArray(lista) ? lista : []);
}

function t20GetSustentadasLegacyPorActor(actor) {
  const registros = t20GetSustentadas();
  const vistos = new Set();
  const lista = [];

  for (const key of t20ActorKeys(actor)) {
    for (const item of (Array.isArray(registros[key]) ? registros[key] : [])) {
      const chave = `${item.id ?? ""}|${item.nome ?? ""}`;
      if (vistos.has(chave)) continue;
      vistos.add(chave);
      lista.push({ ...item, origem: item.origem ?? "legacy" });
    }
  }

  return lista;
}

function t20GetSustentadasPorActor(actor) {
  const vistos = new Set();
  const lista = [];

  // Nova fonte principal: flag do próprio actor, editável pelo dono da ficha.
  for (const item of t20GetSustentadasActorFlag(actor)) {
    const chave = `${item.id ?? ""}|${item.nome ?? ""}`;
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    lista.push({ ...item, origem: item.origem ?? "actorFlag" });
  }

  // Fallback legado: registros antigos que ficaram no world setting.
  for (const item of t20GetSustentadasLegacyPorActor(actor)) {
    const chave = `${item.id ?? ""}|${item.nome ?? ""}`;
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    lista.push(item);
  }

  return lista;
}

async function t20AddSustentadaParaActor(actor, registro) {
  if (!actor) return;

  const lista = t20GetSustentadasActorFlag(actor);
  if (!lista.some(r => String(r.nome ?? "").toLowerCase() === String(registro.nome ?? "").toLowerCase())) {
    lista.push({
      ...registro,
      origem: registro.origem ?? "actorFlag",
      actorUuid: actor.uuid,
      actorId: actor.id,
      actorName: actor.name,
    });
    await t20SetSustentadasActorFlag(actor, lista);
  }
}

async function t20RemoveSustentadaParaActor(actor, registroId, nomeItem = null) {
  if (!actor) return;

  const lista = t20GetSustentadasActorFlag(actor);
  const filtrada = lista.filter(r => r.id !== registroId && r.nome !== nomeItem);
  await t20SetSustentadasActorFlag(actor, filtrada);

  // Limpa também o registro legado quando o usuário for GM.
  if (game.user.isGM) {
    try {
      const registros = t20GetSustentadas();
      for (const key of t20ActorKeys(actor)) {
        const leg = Array.isArray(registros[key]) ? registros[key] : [];
        registros[key] = leg.filter(r => r.id !== registroId && r.nome !== nomeItem);
      }
      await t20SetSustentadas(registros);
    } catch (e) {
      console.warn("Arsenal T20 | não foi possível limpar registro legado de sustentada", e);
    }
  }
}

function t20SustentadasRemovidas(actor) {
  try {
    const lista = actor?.getFlag?.("arsenal-t20", "sustentadasRemovidas");
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
}

async function t20SetSustentadasRemovidas(actor, lista) {
  if (!actor) return;
  await actor.setFlag("arsenal-t20", "sustentadasRemovidas", Array.isArray(lista) ? lista : []);
}

function t20RegistroSustentadoRemovido(actor, registro) {
  const removidas = t20SustentadasRemovidas(actor);
  return removidas.some(r => r.id === registro?.id || (r.nome && r.nome === registro?.nome));
}

function t20TextoLimpoLocal(html) {
  try {
    const div = document.createElement("div");
    div.innerHTML = html ?? "";
    return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
  } catch {
    return String(html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
}


// ============================================================
// AÇÕES EM GRUPO, EFEITOS CONTÍNUOS, SUSTENTADAS E PM
// ============================================================

function t20GetPVPaths() {
  return {
    pv: "system.attributes.pv.value",
    pvMax: "system.attributes.pv.max",
    pm: "system.attributes.pm.value",
    pmMax: "system.attributes.pm.max",
  };
}

async function t20ResolverActorPorTokenId(tokenId) {
  const token = canvas.tokens?.get(tokenId);
  return token?.actor ?? null;
}

function t20RowsDoCard(card) {
  return Array.from(card?.querySelectorAll?.(".t20-alvo-row") ?? []);
}

async function t20AplicarDanoDireto(actor, valor) {
  const { pv } = t20GetPVPaths();
  const atual = foundry.utils.getProperty(actor, pv);
  if (atual === undefined || atual === null) return null;
  const novo = Math.max(0, Number(atual) - Math.max(0, valor));
  await actor.update({ [pv]: novo });
  return { antes: Number(atual), depois: novo };
}

async function t20AplicarCuraDireta(actor, valor) {
  const { pv, pvMax } = t20GetPVPaths();
  const atual = foundry.utils.getProperty(actor, pv);
  const max = foundry.utils.getProperty(actor, pvMax) ?? atual;
  if (atual === undefined || atual === null) return null;
  const novo = Math.min(Number(max), Number(atual) + Math.max(0, valor));
  await actor.update({ [pv]: novo });
  return { antes: Number(atual), depois: novo };
}

async function t20AplicarPMDireto(actor, valor) {
  const { pm } = t20GetPVPaths();
  const atual = foundry.utils.getProperty(actor, pm);
  if (atual === undefined || atual === null) return null;
  const novo = Math.max(0, Number(atual) - Math.max(0, valor));
  await actor.update({ [pm]: novo });
  return { antes: Number(atual), depois: novo };
}

async function t20ReverterPMDireto(actor, valor) {
  const { pm, pmMax } = t20GetPVPaths();
  const atual = foundry.utils.getProperty(actor, pm);
  const max = foundry.utils.getProperty(actor, pmMax) ?? atual + valor;
  if (atual === undefined || atual === null) return null;
  const novo = Math.min(Number(max), Number(atual) + Math.max(0, valor));
  await actor.update({ [pm]: novo });
  return { antes: Number(atual), depois: novo };
}

async function t20AplicarCondicoesDireto(actor, condicoes, nomeItem) {
  const lista = (condicoes ?? []).filter(Boolean);
  if (!lista.length || !actor) return;
  if (game.user.isGM || actor.isOwner) {
    await aplicarCondicoes(actor, lista, nomeItem ?? "Arsenal T20");
  } else {
    game.socket.emit("module.arsenal-t20", {
      tipo: "aplicarCondicoes",
      actorId: actor.id,
      actorUuid: actor.uuid,
      tokenId: actor.getActiveTokens?.()[0]?.id,
      sceneId: canvas.scene?.id,
      condicoes: lista,
      nomeItem: nomeItem ?? "Arsenal T20",
    });
  }
}

async function t20RemoverCondicoesDireto(actor, condicoes) {
  const lista = (condicoes ?? []).filter(Boolean);
  if (!lista.length || !actor) return;

  for (const id of lista) {
    try {
      if (actor.statuses?.has(id)) await actor.toggleStatusEffect(id);
    } catch (e) {
      console.warn(`Arsenal T20 | erro ao remover condição ${id}`, e);
    }
  }
}

async function t20AtualizarMensagemDoCard(btn) {
  const msg = obterChatMessageDoBotao(btn);
  const card = btn.closest(".t20-card");
  if (!msg || !card) return;

  const content = card.outerHTML;
  if (game.user.isGM) await msg.update({ content });
  else game.socket.emit("module.arsenal-t20", {
    tipo: "atualizarCardConsolidado",
    messageId: msg.id,
    content,
  });
}

async function t20GrupoDano(btn) {
  const card = btn.closest(".t20-card");
  const rows = t20RowsDoCard(card);
  const base = parseInt(btn.dataset.valor) || 0;
  const valor = btn.dataset.modo === "metade" ? Math.floor(base / 2) : base;
  if (valor <= 0) return ui.notifications.warn("Nenhum dano rolado para aplicar.");

  let aplicados = 0;
  for (const row of rows) {
    const tokenId = row.dataset.tokenRow;
    const actor = await t20ResolverActorPorTokenId(tokenId);
    if (!actor) continue;
    await t20AplicarDanoDireto(actor, valor);
    row.dataset.danoGrupo = String(valor);
    const inline = row.querySelector(".t20-resultado-inline");
    if (inline) {
      inline.innerHTML = `💔 ${valor} dano aplicado em grupo`;
      inline.style.color = "#ff8d8d";
    }
    aplicados++;
  }

  await t20AtualizarMensagemDoCard(btn);
  ChatMessage.create({
    content: `<div style="background:#171b26;border-left:4px solid #b94a58;padding:8px 11px;border-radius:6px;color:#d7dcea">
      💔 <b>${valor}</b> de dano aplicado em <b>${aplicados}</b> alvo(s).
    </div>`
  });
}

async function t20GrupoCondFalha(btn) {
  const card = btn.closest(".t20-card");
  const rows = t20RowsDoCard(card);
  const condicoes = (btn.dataset.condicoes ?? "").split(",").filter(Boolean);
  if (!condicoes.length) return ui.notifications.warn("Nenhuma condição de falha detectada para este efeito.");

  let aplicados = 0;
  for (const row of rows) {
    const falhou = row.dataset.resultado === "falha" || /falha/i.test(row.querySelector(".t20-resultado-inline")?.textContent ?? "");
    if (!falhou) continue;
    const actor = await t20ResolverActorPorTokenId(row.dataset.tokenRow);
    if (!actor) continue;
    await t20AplicarCondicoesDireto(actor, condicoes, "Efeito em grupo");
    const inline = row.querySelector(".t20-resultado-inline");
    if (inline) {
      inline.innerHTML = `${inline.textContent || "❌ Falha"} · 🔮 condição aplicada`;
      inline.style.color = "#ff8d8d";
    }
    aplicados++;
  }

  await t20AtualizarMensagemDoCard(btn);
  ui.notifications.info(`Condição aplicada em ${aplicados} alvo(s) que falharam.`);
}

async function t20GrupoRemoverCond(btn) {
  const card = btn.closest(".t20-card");
  const rows = t20RowsDoCard(card);
  const condicoes = (btn.dataset.condicoes ?? "").split(",").filter(Boolean);
  if (!condicoes.length) return ui.notifications.warn("Nenhuma condição detectada para remover neste card.");

  let removidos = 0;
  for (const row of rows) {
    const actor = await t20ResolverActorPorTokenId(row.dataset.tokenRow);
    if (!actor) continue;
    await t20RemoverCondicoesDireto(actor, condicoes);
    removidos++;
  }

  await t20AtualizarMensagemDoCard(btn);
  ui.notifications.info(`Condições removidas/tentadas em ${removidos} alvo(s).`);
}

// Listener dos botões globais do card consolidado
Hooks.on("renderChatMessageHTML", (message, html) => {
  html.querySelectorAll(".t20-grupo-dano").forEach(btn => {
    btn.dataset.messageId = message.id;
    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", () => t20GrupoDano(btn));
  });

  html.querySelectorAll(".t20-grupo-cond-falha").forEach(btn => {
    btn.dataset.messageId = message.id;
    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", () => t20GrupoCondFalha(btn));
  });

  html.querySelectorAll(".t20-grupo-remover-cond").forEach(btn => {
    btn.dataset.messageId = message.id;
    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", () => t20GrupoRemoverCond(btn));
  });

  html.querySelectorAll(".t20-pm-aplicar").forEach(btn => {
    btn.dataset.messageId = message.id;
    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", () => t20AplicarPMBotao(btn));
  });

  html.querySelectorAll(".t20-pm-reverter").forEach(btn => {
    btn.dataset.messageId = message.id;
    if (btn.dataset.listenerAdded) return;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", () => t20ReverterPMBotao(btn));
  });

  html.querySelectorAll(".t20-pm-sustentar").forEach(btn => {
    btn.dataset.messageId = message.id;
    if (btn._arsenalListenerAdded) return;
    btn._arsenalListenerAdded = true;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", () => t20AtivarSustentacaoBotao(btn));
  });

  html.querySelectorAll(".t20-turno-encerrar-sustentada").forEach(btn => {
    btn.dataset.messageId = message.id;
    if (btn._arsenalListenerAdded) return;
    btn._arsenalListenerAdded = true;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", async () => {
      const actor = await fromUuid(btn.dataset.actor);
      if (!actor) return ui.notifications.warn("Ator não encontrado.");
      await t20RemoverSustentada(actor, btn.dataset.registro, btn.dataset.nome, game.user.name);
      btn.disabled = true;
      btn.style.opacity = "0.55";
      btn.textContent = "Encerrada";
    });
  });

  html.querySelectorAll(".t20-aplicar, .t20-metade").forEach(btn => {
    btn.dataset.messageId = message.id;
    if (btn._arsenalListenerAdded) return;
    btn._arsenalListenerAdded = true;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", () => aplicarDano(btn));
  });

  html.querySelectorAll(".t20-defesa-ativa").forEach(btn => {
    btn.dataset.messageId = message.id;
    if (btn._arsenalListenerAdded) return;
    btn._arsenalListenerAdded = true;
    btn.dataset.listenerAdded = "1";
    btn.addEventListener("click", () => defesaAtivaDano(btn));
  });
});

// ── Efeitos contínuos no avanço de turno ─────────────────────

function t20ActorTemStatus(actor, nomes) {
  const alvos = nomes.map(n => n.toLowerCase());
  if ([...(actor.statuses ?? [])].some(s => alvos.includes(String(s).toLowerCase()))) return true;
  return (actor.effects ?? []).some(e => {
    const n = String(e.name ?? e.label ?? "").toLowerCase();
    return alvos.some(a => n.includes(a));
  });
}

async function t20ProcessarEfeitosContinuos(actor) {
  if (!cfg("autoEfeitosContinuos")) return;
  if (!game.user.isGM || !actor) return;

  const linhas = [];

  if (t20ActorTemStatus(actor, ["sangrando", "bleeding"])) {
    const roll = await new Roll("1d6").evaluate();
    await t20AplicarDanoDireto(actor, roll.total);
    linhas.push(`🩸 Sangrando: sofreu <b>${roll.total}</b> dano.`);
  }

  if (t20ActorTemStatus(actor, ["emchamas", "em chamas", "burning"])) {
    const roll = await new Roll("1d6").evaluate();
    await t20AplicarDanoDireto(actor, roll.total);
    linhas.push(`🔥 Em chamas: sofreu <b>${roll.total}</b> dano.`);
  }

  if (t20ActorTemStatus(actor, ["envenenado", "poisoned", "veneno"])) {
    linhas.push(`☠️ Envenenado: verifique se há novo teste de resistência neste turno.`);
  }

  const sustentadas = t20EfeitosSustentados(actor);
  if (sustentadas.length) {
    const custoSustentadas = sustentadas.length; // Em Tormenta20, cada magia sustentada custa sempre 1 PM por turno.
    const resultadoPM = await t20AplicarPMDireto(actor, custoSustentadas);

    const nomesSustentadas = sustentadas
      .map(e => e.nome ?? e.name ?? e.label ?? "efeito sustentado")
      .filter(Boolean);

    const nomesTexto = nomesSustentadas.length === 1
      ? `<b>${nomesSustentadas[0]}</b>`
      : nomesSustentadas.length === 2
        ? `<b>${nomesSustentadas[0]}</b> e <b>${nomesSustentadas[1]}</b>`
        : `<b>${nomesSustentadas.slice(0, -1).join("</b>, <b>")}</b> e <b>${nomesSustentadas.at(-1)}</b>`;

    const botoesEncerrar = sustentadas.map(e => `
      <button class="t20-turno-encerrar-sustentada"
        data-actor="${actor.uuid}"
        data-registro="${e.id ?? ""}"
        data-nome="${e.nome ?? e.name ?? e.label ?? "efeito sustentado"}"
        style="margin:4px 4px 0 0;padding:4px 8px;border-radius:5px;background:#4b5563;border:1px solid #9ca3af;color:#fff;cursor:pointer;font-size:0.82em">
        Encerrar ${e.nome ?? e.name ?? e.label ?? "sustentação"}
      </button>`).join("");

    if (resultadoPM) {
      linhas.push(`🪄 Sustentação: gastou <b>${custoSustentadas} PM</b> para manter ${nomesTexto} sustentado(s).<br>${botoesEncerrar}`);
    } else {
      linhas.push(`🪄 Sustentação: ${nomesTexto} está/estão sustentado(s), mas o Arsenal não encontrou o campo de PM para aplicar o custo.<br>${botoesEncerrar}`);
    }
  }

  if (!linhas.length) return;

  await ChatMessage.create({
    whisper: t20WhisperGMAndActorOwners(actor),
    content: `<div style="background:#171b26;border:1px solid #2b3347;border-left:4px solid #c9a227;padding:8px 11px;border-radius:6px;color:#d7dcea">
      <b>⏱️ Início do turno — ${actor.name}</b><br>${linhas.join("<br>")}
    </div>`
  });
}

Hooks.on("updateCombat", async (combat, changed) => {
  if (!cfg("autoEfeitosContinuos")) return;
  if (!game.user.isGM) return;
  if (!("turn" in changed) && !("round" in changed)) return;

  const combatant = combat.combatant;
  const actor = combatant?.actor;
  await t20ProcessarEfeitosContinuos(actor);
});

// ── Painel de magias sustentadas ─────────────────────────────

function t20ItemEhSustentado(itemData = {}, message = null) {
  const texto = [
    itemData?.duration,
    itemData?.duracao,
    itemData?.duração,
    itemData?.system?.duration,
    itemData?.system?.duracao,
    itemData?.system?.duração,
    itemData?.description?.value,
    message?.content,
  ].filter(Boolean).join(" ").toLowerCase().replace(/<[^>]+>/g, " ");

  return /\bdura[cç][aã]o\s*:?\s*sustentad[ao]\b/i.test(texto) ||
    /\bsustentad[ao]\b/i.test(texto);
}

function t20EfeitosSustentados(actor) {
  const porRegistro = t20GetSustentadasPorActor(actor);

  const porEfeito = Array.from(actor?.effects ?? []).filter(e => {
    const nome = String(e.name ?? e.label ?? "").toLowerCase();
    const desc = String(e.description ?? e.system?.description?.value ?? "").toLowerCase();
    const dur = String(e.duration?.type ?? e.duration?.label ?? "").toLowerCase();
    return nome.includes("sustentad") || desc.includes("sustentad") || dur.includes("sustentad");
  }).map(e => ({
    id: e.id,
    uuid: e.uuid,
    nome: e.name ?? e.label ?? "Efeito sustentado",
    img: e.icon ?? "",
    origem: "effect",
    custoPM: 1,
  }));

  const todos = [...porRegistro, ...porEfeito];
  const vistos = new Set();
  return todos.filter(e => {
    const chave = String(e.nome ?? e.name ?? e.label ?? e.id ?? "").toLowerCase();
    if (!chave || vistos.has(chave)) return false;
    vistos.add(chave);
    return true;
  });
}

async function t20RegistrarSustentada(actor, itemData = {}, message = null, options = {}) {
  if (!actor) return;
  if (!game.user.isGM && !actor.isOwner) {
    return ui.notifications?.warn?.("Você não tem permissão para ativar sustentação neste ator.");
  }
  if (!options.force && !t20ItemEhSustentado(itemData, message)) return;

  const nomeFallback = (() => {
    const html = message?.content ?? "";
    const title = html.match(/title="([^"]+)"/)?.[1];
    if (title) return title;
    const limpo = t20TextoLimpoLocal(html);
    const m = limpo.match(/([A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ'’\- ]{2,60})\s+(?:Universal|Arcana|Divina)\b/);
    return m?.[1]?.trim() ?? "";
  })();

  const nomeExtraido = t20ExtrairNomeItemDeMensagem(itemData, message);
  const nome = (!/^magia$/i.test(String(nomeExtraido ?? "").trim()) ? nomeExtraido : nomeFallback) || "Magia sustentada";
  const img = itemData?.img ?? message?.content?.match(/img[^>]+src="([^"]+)"/)?.[1] ?? "";

  const lista = t20GetSustentadasActorFlag(actor);
  const existe = lista.some(r => String(r.nome ?? "").toLowerCase() === String(nome).toLowerCase());

  if (existe) {
    if (options.solicitante) ui.notifications?.info?.(`${nome} já estava marcada como sustentada para ${actor.name}.`);
    return;
  }

  const registro = {
    id: foundry.utils.randomID?.() ?? `${Date.now()}`,
    nome,
    img,
    actorUuid: actor.uuid,
    actorId: actor.id,
    actorName: actor.name,
    custoPM: 1,
    origem: "actorFlag",
    criadoEm: Date.now(),
  };

  await t20AddSustentadaParaActor(actor, registro);

  await ChatMessage.create({
    content: `<div style="background:#171b26;border:1px solid #2b3347;border-left:4px solid #c9a227;padding:8px 11px;border-radius:6px;color:#d7dcea">
      🪄 <b>${nome}</b> agora está sendo sustentada por <b>${actor.name}</b>.
      ${options.solicitante ? `<br><span style="font-size:0.85em;color:#9ca3af">Ativada por ${options.solicitante}.</span>` : ""}
    </div>`
  });
}

async function t20RemoverSustentada(actor, registroId, nomeItem = null, solicitante = null) {
  if (!actor) return;
  if (!game.user.isGM && !actor.isOwner) {
    return ui.notifications?.warn?.("Você não tem permissão para encerrar sustentação neste ator.");
  }

  const nome = nomeItem ?? "magia sustentada";
  await t20RemoveSustentadaParaActor(actor, registroId, nomeItem);

  await ChatMessage.create({
    content: `<div style="background:#171b26;border:1px solid #2b3347;border-left:4px solid #c9a227;padding:8px 11px;border-radius:6px;color:#d7dcea">
      🪄 <b>${nome}</b> não está mais sendo sustentada por <b>${actor.name}</b>.
      ${solicitante ? `<br><span style="font-size:0.85em;color:#9ca3af">Encerrada por ${solicitante}.</span>` : ""}
    </div>`
  });
}

class ArsenalSustentadasPanel extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "arsenal-sustentadas-panel",
      title: "🪄 Magias Sustentadas — Arsenal T20",
      width: 460,
      height: "auto",
      resizable: true,
    });
  }

  async getData() { return {}; }
  get template() { return null; }

  async _renderInner() {
    const div = document.createElement("div");
    div.innerHTML = this._html();
    return $(div);
  }

  _html() {
    const tokens = canvas.tokens?.controlled ?? [];
    const actors = tokens.length ? tokens.map(t => t.actor).filter(Boolean) : [game.user.character].filter(Boolean);

    if (!actors.length) {
      return `<div style="padding:12px">Selecione um token ou defina um personagem de usuário.</div>`;
    }

    return `<div style="padding:12px;background:#111827;color:#e5e7eb;font-family:serif">
      ${actors.map(actor => {
        const efeitos = t20EfeitosSustentados(actor);
        return `<div style="margin-bottom:12px;padding:10px;border:1px solid #374151;border-radius:8px;background:#0f172a">
          <h3 style="margin:0 0 8px;color:#d9b85f">${actor.name}</h3>
          ${efeitos.length ? efeitos.map(e => `
            <div style="display:flex;align-items:center;gap:8px;margin:6px 0;padding:6px;background:rgba(255,255,255,0.04);border-radius:6px">
              ${e.img ? `<img src="${e.img}" style="width:24px;height:24px;border:none">` : e.icon ? `<img src="${e.icon}" style="width:24px;height:24px;border:none">` : ""}
              <div style="flex:1">
                <b>${e.nome ?? e.name ?? e.label}</b>
                <div style="font-size:0.8em;color:#9ca3af">Custo automático: ${e.custoPM ?? 1} PM/turno · ${e.origem === "registro" ? "registrada pelo Arsenal" : "efeito ativo"}</div>
              </div>
              <button class="t20-sustentar-pm" data-actor="${actor.uuid}" data-pm="${e.custoPM ?? 1}" style="padding:4px 8px">Pagar PM manualmente</button>
              ${e.origem === "registro"
                ? `<button class="t20-remover-sustentada" data-actor="${actor.uuid}" data-registro="${e.id}" data-nome="${e.nome ?? e.name ?? e.label ?? "magia sustentada"}" style="padding:4px 8px">Remover</button>`
                : `<button class="t20-encerrar-efeito" data-effect="${e.uuid}" style="padding:4px 8px">Encerrar</button>`}
            </div>`).join("") : `<div style="color:#9ca3af">Nenhuma magia sustentada registrada/detectada.</div>`}
        </div>`;
      }).join("")}
      <div style="font-size:0.82em;color:#9ca3af;margin-top:8px">
        Magias com <b>Duração: Sustentada</b> são registradas automaticamente quando lançadas. Se algo não aparecer, selecione o token e relance a magia.
      </div>
    </div>`;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".t20-sustentar-pm").on("click", async ev => {
      const actor = await fromUuid(ev.currentTarget.dataset.actor);
      const pm = parseInt(ev.currentTarget.dataset.pm) || 1;
      if (actor) {
        await t20AplicarPMDireto(actor, pm);
        ui.notifications.info(`${actor.name}: ${pm} PM gasto(s) para sustentar.`);
      }
    });
    html.find(".t20-encerrar-efeito").on("click", async ev => {
      const ef = await fromUuid(ev.currentTarget.dataset.effect);
      await ef?.delete?.();
      this.render();
    });
    html.find(".t20-remover-sustentada").on("click", async ev => {
      const actor = await fromUuid(ev.currentTarget.dataset.actor);
      const registroId = ev.currentTarget.dataset.registro;
      const nomeItem = ev.currentTarget.dataset.nome;

      if (!actor) return ui.notifications.warn("Ator não encontrado.");
      if (!game.user.isGM && !actor.isOwner) {
        return ui.notifications.warn("Você não tem permissão para encerrar sustentação neste ator.");
      }

      await t20RemoverSustentada(actor, registroId, nomeItem, game.user.name);
      this.render();
    });
  }
}

let _arsenalSustentadasPanel = null;
function abrirPainelSustentadas() {
  if (_arsenalSustentadasPanel?.rendered) _arsenalSustentadasPanel.close();
  else {
    _arsenalSustentadasPanel = new ArsenalSustentadasPanel();
    _arsenalSustentadasPanel.render(true);
  }
}

Hooks.on("getSceneControlButtons", (controls) => {
  if (Array.isArray(controls)) {
    const tokens = controls.find(c => c.name === "token");
    if (tokens) {
      tokens.tools.push({
        name: "arsenal-sustentadas",
        title: "Magias Sustentadas — Arsenal T20",
        icon: "fas fa-hourglass-half",
        button: true,
        onClick: () => abrirPainelSustentadas(),
      });
    }
  } else {
    const tokens = controls.token ?? controls.tokens;
    if (tokens) {
      tokens.tools["arsenal-sustentadas"] = {
        name: "arsenal-sustentadas",
        title: "Magias Sustentadas — Arsenal T20",
        icon: "fas fa-hourglass-half",
        button: true,
        onChange: () => abrirPainelSustentadas(),
        order: 101,
      };
    }
  }
});

// Registro automático de sustentadas desativado.
// A sustentação agora é ativada manualmente pelo botão no card de PM da magia.



// ── Monitor discreto de PV/PM de personagens jogadores ─────
// Opções disponíveis no módulo: desligado, notificação, painel, painel+notificação, resumo por rodada ou chat privado.

function t20IsPersonagemJogador(actor) {
  if (!actor) return false;
  if (!actor.hasPlayerOwner) return false;
  const tipo = String(actor.type ?? "").toLowerCase();
  if (["ameaca", "ameaça", "npc", "threat", "monster", "creature"].includes(tipo)) return false;
  return true;
}

function t20GetRecursoAtual(actor) {
  const pvPath = "system.attributes.pv.value";
  const pmPath = "system.attributes.pm.value";
  return {
    pv: Number(foundry.utils.getProperty(actor, pvPath)),
    pm: Number(foundry.utils.getProperty(actor, pmPath)),
  };
}

function t20GetChangedValue(changed, path) {
  return foundry.utils.getProperty(changed, path);
}

function t20ResourceMonitorMode() {
  try {
    return game.settings.get("arsenal-t20", "resourceMonitorMode") ?? "panel_notification";
  } catch {
    return "panel_notification";
  }
}

const t20RecursosCacheGM = new Map();
const t20RecursosLogGM = [];
const t20RecursosResumoRodada = [];
let _arsenalRecursosPanel = null;

function t20KeyRecursoActor(actor) {
  return actor?.uuid ?? actor?.id;
}

function t20AtualizarCacheRecursos(actor) {
  if (!actor || !t20IsPersonagemJogador(actor)) return;
  t20RecursosCacheGM.set(t20KeyRecursoActor(actor), t20GetRecursoAtual(actor));
}

function t20PushLogRecursos(entrada) {
  t20RecursosLogGM.unshift(entrada);
  if (t20RecursosLogGM.length > 200) t20RecursosLogGM.length = 200;

  if (_arsenalRecursosPanel?.rendered) {
    _arsenalRecursosPanel.render(false);
  }
}

async function t20MensagemChatRecurso(entrada) {
  await ChatMessage.create({
    whisper: ChatMessage.getWhisperRecipients("GM"),
    content: `<div style="background:#111827;border:1px solid #2b3347;border-left:4px solid #64748b;padding:7px 10px;border-radius:6px;color:#d7dcea;font-size:0.9em">
      <b>📊 Recurso alterado — ${entrada.actor}</b><br>
      ${entrada.linhas.join("<br>")}
      <br><span style="font-size:0.82em;color:#9ca3af">Origem: ${entrada.origem}</span>
    </div>`
  });
}

function t20RegistrarLogRecurso({ actor, linhas, textoCurto, userId }) {
  if (!game.user.isGM || !actor || !linhas?.length) return;

  const modo = t20ResourceMonitorMode();
  if (modo === "off") return;

  const quem = game.users.get(userId)?.name ?? "Sistema";
  const entrada = {
    id: foundry.utils.randomID?.() ?? `${Date.now()}-${Math.random()}`,
    time: Date.now(),
    round: game.combat?.round ?? null,
    actor: actor.name,
    actorUuid: actor.uuid,
    origem: quem,
    linhas,
    textoCurto,
  };

  if (modo === "chat") {
    t20MensagemChatRecurso(entrada);
    return;
  }

  if (modo === "notification" || modo === "panel_notification") {
    ui.notifications.info(`📊 ${textoCurto}`);
  }

  if (modo === "panel" || modo === "panel_notification" || modo === "round_summary") {
    t20PushLogRecursos(entrada);
  }

  if (modo === "round_summary") {
    t20RecursosResumoRodada.push(entrada);
  }
}

function t20ResumoRecursosRodada() {
  if (!game.user.isGM) return;
  if (t20ResourceMonitorMode() !== "round_summary") return;
  if (!t20RecursosResumoRodada.length) return;

  const porAtor = new Map();
  for (const e of t20RecursosResumoRodada) {
    const arr = porAtor.get(e.actor) ?? [];
    arr.push(...e.linhas.map(l => l.replace(/<[^>]+>/g, "")));
    porAtor.set(e.actor, arr);
  }

  const resumo = [...porAtor.entries()]
    .map(([ator, linhas]) => `${ator}: ${linhas.join(" | ")}`)
    .join(" · ");

  ui.notifications.info(`📊 Resumo de recursos: ${resumo}`);
  t20RecursosResumoRodada.length = 0;
}

class ArsenalRecursosPanel extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "arsenal-recursos-panel",
      title: "📊 Log de Recursos — Arsenal T20",
      width: 520,
      height: "auto",
      resizable: true,
    });
  }

  async getData() { return {}; }
  get template() { return null; }

  async _renderInner() {
    const div = document.createElement("div");
    div.innerHTML = this._html();
    return $(div);
  }

  _html() {
    const entradas = t20RecursosLogGM;
    const modo = t20ResourceMonitorMode();

    return `<div style="padding:12px;background:#111827;color:#e5e7eb;font-family:serif;max-height:640px;overflow:auto">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
        <div style="flex:1">
          <div style="color:#d9b85f;font-weight:bold;font-size:1.1em">Alterações de PV/PM</div>
          <div style="font-size:0.82em;color:#9ca3af">Modo atual: <b>${modo}</b>. Este painel não envia mensagens ao chat, exceto no modo “Chat privado do GM”.</div>
        </div>
        <button class="t20-limpar-log-recursos" style="padding:6px 10px;border-radius:6px;background:#374151;border:1px solid #6b7280;color:#fff;cursor:pointer">Limpar</button>
      </div>

      ${entradas.length ? entradas.map(e => {
        const hora = new Date(e.time).toLocaleTimeString();
        return `<div style="margin-bottom:8px;padding:9px;border:1px solid #2b3347;border-left:4px solid #64748b;border-radius:7px;background:#0f172a">
          <div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start">
            <div style="font-weight:bold;color:#f2e6c9">📊 ${e.actor}</div>
            <div style="font-size:0.78em;color:#9ca3af">${hora}</div>
          </div>
          <div style="font-size:0.92em;color:#d7dcea;margin-top:4px;line-height:1.35">${e.linhas.join("<br>")}</div>
          <div style="font-size:0.78em;color:#9ca3af;margin-top:4px">Origem: ${e.origem}</div>
        </div>`;
      }).join("") : `<div style="padding:14px;border:1px dashed #374151;border-radius:8px;color:#9ca3af;text-align:center">
        Nenhuma alteração de PV/PM registrada nesta sessão.
      </div>`}
    </div>`;
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".t20-limpar-log-recursos").on("click", () => {
      t20RecursosLogGM.length = 0;
      t20RecursosResumoRodada.length = 0;
      this.render(false);
    });
  }
}

function abrirPainelRecursosArsenal() {
  if (!game.user.isGM) return ui.notifications.warn("O log de recursos é visível apenas ao GM.");

  if (_arsenalRecursosPanel?.rendered) {
    _arsenalRecursosPanel.close();
  } else {
    _arsenalRecursosPanel = new ArsenalRecursosPanel();
    _arsenalRecursosPanel.render(true);
  }
}

Hooks.once("ready", () => {
  if (!game.user.isGM) return;
  for (const actor of game.actors ?? []) {
    t20AtualizarCacheRecursos(actor);
  }

  // Botão fixo discreto para o GM abrir o log sem usar o chat.
  if (!document.getElementById("arsenal-recursos-btn")) {
    const btn = document.createElement("button");
    btn.id = "arsenal-recursos-btn";
    btn.title = "Log de Recursos — Arsenal T20";
    btn.innerHTML = `<i class="fas fa-chart-line" style="margin-right:4px"></i><span style="font-size:0.76em;font-family:'Cinzel',serif;letter-spacing:0.03em">Recursos</span>`;
    btn.style.cssText = `
      position: fixed;
      top: 494px;
      left: 0;
      z-index: 101;
      height: 34px;
      padding: 0 10px;
      background: #111827;
      border: 1px solid #374151;
      border-radius: 0 6px 6px 0;
      color: #93c5fd;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      box-shadow: 2px 2px 8px rgba(0,0,0,0.55);
    `;

    const ajustarPosicaoRecursos = () => {
      const condBtn = document.getElementById("arsenal-cond-btn");
      if (condBtn) {
        const rect = condBtn.getBoundingClientRect();
        btn.style.top = `${Math.ceil(rect.bottom + 6)}px`;
      } else {
        const controls = document.getElementById("controls") ?? document.querySelector("#ui-left #controls");
        if (controls) {
          const rect = controls.getBoundingClientRect();
          btn.style.top = `${Math.max(494, Math.ceil(rect.bottom + 48))}px`;
        } else {
          btn.style.top = "494px";
        }
      }
    };

    btn.addEventListener("mouseenter", () => {
      btn.style.background = "#1f2937";
      btn.style.borderColor = "#93c5fd";
      btn.style.color = "#bfdbfe";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "#111827";
      btn.style.borderColor = "#374151";
      btn.style.color = "#93c5fd";
    });
    btn.addEventListener("click", () => abrirPainelRecursosArsenal());
    document.body.appendChild(btn);
    setTimeout(ajustarPosicaoRecursos, 500);
    Hooks.on("renderPlayerList", ajustarPosicaoRecursos);
    Hooks.on("canvasReady", ajustarPosicaoRecursos);
  }
});

Hooks.on("getSceneControlButtons", (controls) => {
  if (!game.user.isGM) return;

  if (Array.isArray(controls)) {
    const tokens = controls.find(c => c.name === "token");
    if (tokens) {
      tokens.tools.push({
        name: "arsenal-recursos",
        title: "Log de Recursos — Arsenal T20",
        icon: "fas fa-chart-line",
        button: true,
        onClick: () => abrirPainelRecursosArsenal(),
      });
    }
  } else {
    const tokens = controls.token ?? controls.tokens;
    if (tokens) {
      tokens.tools["arsenal-recursos"] = {
        name: "arsenal-recursos",
        title: "Log de Recursos — Arsenal T20",
        icon: "fas fa-chart-line",
        button: true,
        onChange: () => abrirPainelRecursosArsenal(),
        order: 102,
      };
    }
  }
});

Hooks.on("updateCombat", (combat, changed) => {
  if (!game.user.isGM) return;
  if (!("round" in changed)) return;
  t20ResumoRecursosRodada();
});

Hooks.on("createActor", (actor) => {
  if (!game.user.isGM) return;
  t20AtualizarCacheRecursos(actor);
});

Hooks.on("updateActor", async (actor, changed, options, userId) => {
  if (!game.user.isGM) return;
  if (!t20IsPersonagemJogador(actor)) return;

  const pvPath = "system.attributes.pv.value";
  const pmPath = "system.attributes.pm.value";

  const pvMudou = t20GetChangedValue(changed, pvPath) !== undefined;
  const pmMudou = t20GetChangedValue(changed, pmPath) !== undefined;

  if (!pvMudou && !pmMudou) {
    t20AtualizarCacheRecursos(actor);
    return;
  }

  const key = t20KeyRecursoActor(actor);
  const antes = t20RecursosCacheGM.get(key);
  const agora = t20GetRecursoAtual(actor);

  if (!antes) {
    t20RecursosCacheGM.set(key, agora);
    return;
  }

  const linhas = [];
  const curtas = [];

  if (pvMudou && Number.isFinite(agora.pv) && Number.isFinite(antes.pv) && agora.pv !== antes.pv) {
    const delta = agora.pv - antes.pv;
    const desc = delta > 0 ? `cura +${delta}` : `dano ${Math.abs(delta)}`;
    linhas.push(`❤️ PV: <b>${antes.pv}</b> → <b>${agora.pv}</b> (${desc})`);
    curtas.push(`PV ${antes.pv}→${agora.pv}`);
  }

  if (pmMudou && Number.isFinite(agora.pm) && Number.isFinite(antes.pm) && agora.pm !== antes.pm) {
    const delta = agora.pm - antes.pm;
    const desc = delta > 0 ? `recuperou +${delta}` : `gastou ${Math.abs(delta)}`;
    linhas.push(`🔷 PM: <b>${antes.pm}</b> → <b>${agora.pm}</b> (${desc})`);
    curtas.push(`PM ${antes.pm}→${agora.pm}`);
  }

  t20RecursosCacheGM.set(key, agora);

  if (!linhas.length) return;

  t20RegistrarLogRecurso({
    actor,
    linhas,
    textoCurto: `${actor.name}: ${curtas.join(", ")}`,
    userId,
  });
});


// ============================================================
// ARSENAL HUD — atalhos de favoritos, ataques, poderes, magias e perícias
// ============================================================

function t20HudMode() {
  try {
    return game.settings.get("arsenal-t20", "arsenalHudMode") ?? "sidebar";
  } catch {
    return "sidebar";
  }
}

function t20HudLayout() {
  try {
    return game.settings.get("arsenal-t20", "arsenalHudLayout") ?? "compact";
  } catch {
    return "compact";
  }
}

function t20HudSpellMode() {
  try {
    return game.settings.get("arsenal-t20", "arsenalHudSpellMode") ?? "list";
  } catch {
    return "list";
  }
}

function t20HudTheme() {
  let key = "darkGold";
  try { key = game.settings.get("arsenal-t20", "arsenalHudColorTheme") ?? "darkGold"; } catch {}

  const temas = {
    darkGold: {
      bg1:"#111827", bg2:"#0b1020", panel:"#151c2b", panel2:"#182235",
      border:"#374151", accent:"#c9a227", accent2:"#d9b85f",
      text:"#e5e7eb", title:"#f2e6c9", muted:"#9ca3af"
    },
    arcane: {
      bg1:"#161326", bg2:"#0d0a18", panel:"#21183a", panel2:"#2c2140",
      border:"#514174", accent:"#a78bfa", accent2:"#c4b5fd",
      text:"#ede9fe", title:"#f5f3ff", muted:"#b6a9d6"
    },
    emerald: {
      bg1:"#0f211b", bg2:"#071510", panel:"#123126", panel2:"#164030",
      border:"#2f5f4b", accent:"#34d399", accent2:"#86efac",
      text:"#ecfdf5", title:"#d1fae5", muted:"#9ac7b5"
    },
    crimson: {
      bg1:"#241014", bg2:"#14080b", panel:"#32141b", panel2:"#451923",
      border:"#6f2c39", accent:"#f87171", accent2:"#fca5a5",
      text:"#fff1f2", title:"#ffe4e6", muted:"#d6a5ab"
    },
    steel: {
      bg1:"#101827", bg2:"#0b1220", panel:"#142033", panel2:"#1b2b43",
      border:"#39506e", accent:"#60a5fa", accent2:"#93c5fd",
      text:"#eff6ff", title:"#dbeafe", muted:"#9fb8d6"
    },
  };
  return temas[key] ?? temas.darkGold;
}

function t20HudTokenSelecionado() {
  return canvas.tokens?.controlled?.[0] ?? null;
}

function t20HudActorSelecionado() {
  return t20HudTokenSelecionado()?.actor ?? game.user.character ?? null;
}

function t20HudStorageKey(modo, tipo = "position") {
  return `arsenal-t20.hud.${tipo}.${game.user?.id ?? "user"}.${modo}`;
}

function t20HudGetSavedPosition(modo) {
  try {
    const raw = localStorage.getItem(t20HudStorageKey(modo, "position"));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function t20HudSetSavedPosition(modo, pos) {
  try { localStorage.setItem(t20HudStorageKey(modo, "position"), JSON.stringify(pos)); } catch {}
}

function t20HudGetSavedSize(modo) {
  try {
    const raw = localStorage.getItem(t20HudStorageKey(modo, "size"));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function t20HudSetSavedSize(modo, size) {
  try { localStorage.setItem(t20HudStorageKey(modo, "size"), JSON.stringify(size)); } catch {}
}

function t20HudIsCollapsed() {
  try {
    return localStorage.getItem(`arsenal-t20.hud.collapsed.${game.user?.id ?? "user"}`) === "1";
  } catch {
    return false;
  }
}

function t20HudSetCollapsed(value) {
  try {
    localStorage.setItem(`arsenal-t20.hud.collapsed.${game.user?.id ?? "user"}`, value ? "1" : "0");
  } catch {}
}


function t20HudSecaoRecolhida(cat) {
  try {
    return localStorage.getItem(`arsenal-t20.hud.sectionCollapsed.${game.user?.id ?? "user"}.${cat}`) === "1";
  } catch {
    return false;
  }
}

function t20HudSetSecaoRecolhida(cat, value) {
  try {
    localStorage.setItem(`arsenal-t20.hud.sectionCollapsed.${game.user?.id ?? "user"}.${cat}`, value ? "1" : "0");
  } catch {}
}


const T20_HUD_CATEGORIAS_PADRAO = ["favoritos", "magias", "poderes", "pericias", "ataques"];

function t20HudGetCategoryOrder() {
  try {
    const raw = localStorage.getItem(`arsenal-t20.hud.categoryOrder.${game.user?.id ?? "user"}`);
    const arr = raw ? JSON.parse(raw) : null;
    if (Array.isArray(arr)) {
      const validas = arr.filter(x => T20_HUD_CATEGORIAS_PADRAO.includes(x));
      for (const c of T20_HUD_CATEGORIAS_PADRAO) if (!validas.includes(c)) validas.push(c);
      return validas;
    }
  } catch {}
  return [...T20_HUD_CATEGORIAS_PADRAO];
}

function t20HudSetCategoryOrder(order) {
  try {
    const validas = (order ?? []).filter(x => T20_HUD_CATEGORIAS_PADRAO.includes(x));
    for (const c of T20_HUD_CATEGORIAS_PADRAO) if (!validas.includes(c)) validas.push(c);
    localStorage.setItem(`arsenal-t20.hud.categoryOrder.${game.user?.id ?? "user"}`, JSON.stringify(validas));
  } catch {}
}

function t20HudMoverCategoria(cat, dir) {
  const order = t20HudGetCategoryOrder();
  const i = order.indexOf(cat);
  if (i < 0) return;
  const j = i + dir;
  if (j < 0 || j >= order.length) return;
  [order[i], order[j]] = [order[j], order[i]];
  t20HudSetCategoryOrder(order);
  atualizarArsenalHUD();
}


function t20HudItemTexto(item) {
  return [
    item.type, item.name,
    item.system?.tipo, item.system?.type,
    item.system?.categoria, item.system?.category,
    item.system?.subtype, item.system?.subtipo,
    item.system?.description?.value, item.system?.descricao,
    item.system?.ativacao?.execucao, item.system?.activation?.type,
  ].filter(Boolean).join(" ").toLowerCase();
}

function t20HudClassificarItem(item) {
  const txt = t20HudItemTexto(item);
  const tipo = String(item.type ?? "").toLowerCase();

  if (
    tipo.includes("magia") || tipo.includes("spell") ||
    /\b(arcana|divina|universal)\b/i.test(txt) ||
    /\b\d+[ºo]?\s*c[ií]rculo\b/i.test(txt) ||
    /\bexecu[cç][aã]o\s*:/i.test(txt)
  ) return "magias";

  if (
    tipo.includes("arma") || tipo.includes("weapon") || tipo.includes("attack") ||
    /\bataque\b/i.test(txt) ||
    item.system?.rolls?.some?.(r => String(r?.type ?? r?.label ?? r?.name ?? "").toLowerCase().includes("ataque"))
  ) return "ataques";

  if (
    tipo.includes("poder") || tipo.includes("power") || tipo.includes("feat") ||
    tipo.includes("feature") || tipo.includes("habilidade") ||
    /\bpoder\b|\bhabilidade\b/i.test(txt)
  ) return "poderes";

  return null;
}

function t20HudValorEhFavorito(valor) {
  if (valor === true || valor === 1) return true;
  if (typeof valor === "string" && /^(true|sim|yes|favorito|favorite|on|1)$/i.test(valor.trim())) return true;
  if (valor && typeof valor === "object") {
    if (t20HudValorEhFavorito(valor.value)) return true;
    if (t20HudValorEhFavorito(valor.enabled)) return true;
    if (t20HudValorEhFavorito(valor.checked)) return true;
  }
  return false;
}

function t20HudItemFavorito(item) {
  const nomesFav = new Set([
    "favorite", "favorites", "favorito", "favorita", "fav",
    "isfavorite", "isfavorito", "atalho", "shortcut", "quick", "quickbar",
    "marcado", "pinned", "pin", "hud", "tokenactionhud"
  ]);

  const checarObjeto = (obj, depth = 0) => {
    if (!obj || typeof obj !== "object" || depth > 4) return false;

    for (const [k, v] of Object.entries(obj)) {
      const key = String(k).toLowerCase().replace(/[^a-z0-9]/g, "");
      if (nomesFav.has(key) && t20HudValorEhFavorito(v)) return true;
      if (v && typeof v === "object" && checarObjeto(v, depth + 1)) return true;
    }
    return false;
  };

  return checarObjeto(item.flags ?? {}) || checarObjeto(item.system ?? {});
}

function t20HudActorEhPersonagemJogador(actor) {
  if (!actor) return false;
  if (!actor.hasPlayerOwner) return false;
  const tipo = String(actor.type ?? "").toLowerCase();
  return !["ameaca", "ameaça", "npc", "threat", "monster", "creature"].includes(tipo);
}

function t20HudItemAtivavel(item) {
  if (!item) return false;
  const txt = t20HudItemTexto(item);
  if (typeof item.use === "function" || typeof item.roll === "function" || typeof item.displayCard === "function" || typeof item.toMessage === "function") return true;
  if (/execu[cç][aã]o|a[cç][aã]o|rea[cç][aã]o|movimento|padr[aã]o|completa|livre|mana|pm|ataque|teste|rolagem|dano|cura|resist[eê]ncia/i.test(txt)) return true;
  return false;
}

function t20HudItensActor(actor) {
  const grupos = { favoritos: [], ataques: [], magias: [], poderes: [] };
  if (!actor) return grupos;

  const personagemJogador = t20HudActorEhPersonagemJogador(actor);

  for (const item of actor.items ?? []) {
    const cat = t20HudClassificarItem(item);
    const favorito = t20HudItemFavorito(item);

    if (favorito && cat) {
      grupos.favoritos.push(item);
    }

    if (!cat) continue;

    if (personagemJogador) {
      // Com o grimório, magias podem ser buscadas fora dos favoritos.
      // Ataques e poderes/habilidades aparecem quando forem utilizáveis/ativáveis.
      if (cat === "magias") {
        grupos.magias.push(item);
      } else if (cat === "ataques" || cat === "poderes") {
        if (t20HudItemAtivavel(item) || favorito) grupos[cat].push(item);
      }
    } else {
      // NPC/ameaça: mantém ações úteis para o GM.
      if (["ataques", "poderes"].includes(cat)) grupos[cat].push(item);
    }
  }

  for (const k of Object.keys(grupos)) {
    const vistos = new Set();
    grupos[k] = grupos[k]
      .filter(item => {
        if (vistos.has(item.id)) return false;
        vistos.add(item.id);
        return true;
      })
      .sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));
  }

  return grupos;
}

function t20HudTodasMagiasActor(actor) {
  if (!actor) return [];
  return Array.from(actor.items ?? [])
    .filter(item => t20HudClassificarItem(item) === "magias")
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "pt-BR"));
}

function t20HudExtrairCirculoMagia(item) {
  const candidatos = [
    item?.system?.circulo,
    item?.system?.circle,
    item?.system?.nivel,
    item?.system?.level,
    item?.system?.rank,
    item?.system?.grau,
    item?.system?.spellLevel,
    item?.system?.spell?.level,
  ];

  for (const c of candidatos) {
    const val = (c && typeof c === "object") ? (c.value ?? c.total ?? c.nivel ?? c.level) : c;
    const n = Number(String(val ?? "").match(/[1-5]/)?.[0]);
    if (Number.isFinite(n) && n >= 1 && n <= 5) return n;
  }

  const txt = t20HudItemTexto(item);
  const m =
    txt.match(/([1-5])\s*[ºo]?\s*c[ií]rculo/i) ??
    txt.match(/c[ií]rculo\s*[:\-]?\s*([1-5])/i) ??
    txt.match(/\b([1-5])\s*circ/i);

  if (m) {
    const n = Number(m[1]);
    if (n >= 1 && n <= 5) return n;
  }

  const palavras = [
    ["primeiro", 1], ["segundo", 2], ["terceiro", 3], ["quarto", 4], ["quinto", 5],
    ["1º", 1], ["2º", 2], ["3º", 3], ["4º", 4], ["5º", 5],
  ];
  for (const [p, n] of palavras) {
    if (txt.includes(`${p} círculo`) || txt.includes(`${p} circulo`)) return n;
  }

  return null;
}

function t20HudMagiasPorCirculo(actor) {
  const grupos = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  for (const item of t20HudTodasMagiasActor(actor)) {
    const c = t20HudExtrairCirculoMagia(item);
    if (c && grupos[c]) grupos[c].push(item);
  }
  return grupos;
}

let _arsenalGrimorio = null;

function abrirArsenalGrimorio(actor, circulo) {
  if (!actor) return ui.notifications.warn("Nenhum personagem selecionado.");
  if (_arsenalGrimorio?.rendered) _arsenalGrimorio.close();
  _arsenalGrimorio = new ArsenalGrimorio(actor, circulo);
  _arsenalGrimorio.render(true);
}

class ArsenalGrimorio extends Application {
  constructor(actor, circulo, options = {}) {
    super(options);
    this.actor = actor;
    this.circulo = Number(circulo);
    this.busca = "";
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "arsenal-grimorio",
      title: "Grimório — Arsenal T20",
      width: 360,
      height: "auto",
      resizable: true,
      minimizable: true,
    });
  }

  async getData() { return {}; }
  get template() { return null; }

  async _renderInner() {
    const div = document.createElement("div");
    div.innerHTML = this._html();
    return $(div);
  }

  _magias() {
    const q = String(this.busca ?? "").trim().toLowerCase();
    return t20HudTodasMagiasActor(this.actor)
      .filter(item => t20HudExtrairCirculoMagia(item) === this.circulo)
      .filter(item => !q || String(item.name ?? "").toLowerCase().includes(q));
  }

  _html() {
    const magias = this._magias();

    return `<div style="background:linear-gradient(180deg,#111827,#0b1020);border:1px solid #374151;border-top:3px solid #c9a227;
      border-radius:8px;color:#e5e7eb;font-family:serif;padding:10px;max-height:620px;display:flex;flex-direction:column">
      <div style="display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(201,162,39,0.22);padding-bottom:8px;margin-bottom:8px">
        ${this.actor?.img ? `<img src="${this.actor.img}" style="width:34px;height:34px;border-radius:6px;object-fit:cover;border:1px solid rgba(201,162,39,0.45)">` : ""}
        <div style="min-width:0;flex:1">
          <div style="font-size:0.78em;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em">Grimório — ${this.circulo}º Círculo</div>
          <div style="color:#f2e6c9;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${this.actor?.name ?? "Conjurador"}</div>
        </div>
        <div style="font-size:0.82em;color:#9ca3af">${magias.length} magia(s)</div>
      </div>

      <input class="t20-grimorio-busca" type="text" placeholder="Buscar magia..."
        value="${this.busca ?? ""}"
        style="width:100%;box-sizing:border-box;margin-bottom:8px;padding:7px 9px;border-radius:6px;
        background:#0f172a;border:1px solid #303b52;color:#e5e7eb">

      <div style="overflow:auto;min-height:0">
        ${magias.length ? magias.map(item => `
          <button class="t20-grimorio-magia" data-item-id="${item.id}" title="${item.name}"
            style="display:flex;align-items:center;gap:8px;width:100%;padding:7px 8px;margin-bottom:5px;border-radius:7px;
            background:linear-gradient(180deg,#182235,#111827);border:1px solid #374151;color:#e5e7eb;cursor:pointer;
            font-size:0.92em;text-align:left;min-width:0">
            ${item.img ? `<img src="${item.img}" style="width:28px;height:28px;border-radius:5px;object-fit:cover;border:1px solid rgba(201,162,39,0.35)">` : `<span style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;border-radius:5px;background:#0f172a">🪄</span>`}
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${item.name}</span>
          </button>`).join("") : `<div style="color:#9ca3af;padding:12px;text-align:center">Nenhuma magia encontrada neste círculo.</div>`}
      </div>
    </div>`;
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.find(".t20-grimorio-busca").on("input", ev => {
      this.busca = ev.currentTarget.value ?? "";
      this.render(false);
    });

    html.find(".t20-grimorio-magia").on("click", async ev => {
      await t20HudUsarItem(this.actor, ev.currentTarget.dataset.itemId);
    });
  }
}


const T20_HUD_PERICIAS_LABELS = {
  acro: "Acrobacia", ades: "Adestramento", atua: "Atuação", cava: "Cavalgar",
  conh: "Conhecimento", cura: "Cura", dipl: "Diplomacia", enga: "Enganação",
  fort: "Fortitude", furt: "Furtividade", inic: "Iniciativa", inti: "Intimidação",
  intu: "Intuição", inve: "Investigação", joga: "Jogatina", luta: "Luta",
  mist: "Misticismo", nobr: "Nobreza", ofic: "Ofício", perc: "Percepção",
  pilo: "Pilotagem", pont: "Pontaria", refl: "Reflexos", reli: "Religião",
  sobr: "Sobrevivência", vond: "Vontade", vont: "Vontade",
};

function t20HudParsePericia(raw) {
  if (typeof raw === "string") {
    try { return JSON.parse(raw); } catch { return { value: Number(raw) || 0 }; }
  }
  return raw ?? {};
}

function t20HudPericiaTreinada(p) {
  if (!p || typeof p !== "object") return false;
  const vals = [
    p.treinado, p.treinada, p.trained, p.training, p.isTrained,
    p.proficient, p.proficiencia, p.prof, p.favorite, p.favorito
  ];
  if (vals.some(v => v === true || v === 1 || /^(true|sim|yes|trained|treinado|proficient)$/i.test(String(v ?? "")))) return true;

  const nivel = p.nivel ?? p.level ?? p.rank ?? p.graduacao ?? p.grau ?? p.treino;
  if (typeof nivel === "string" && /(treinad|trained|proficient|expert|mestre)/i.test(nivel)) return true;
  if (Number(nivel) > 0) return true;

  return false;
}

function t20HudBonusPericia(p) {
  const n = Number(p?.total ?? p?.value ?? p?.mod ?? p?.bonus ?? p?.modificador ?? p?.valor ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function t20HudPericiasTreinadasActor(actor) {
  if (!actor || !t20HudActorEhPersonagemJogador(actor)) return [];
  const pericias = actor.system?.pericias ?? actor.system?.skills ?? {};
  const lista = [];

  for (const [id, raw] of Object.entries(pericias)) {
    const p = t20HudParsePericia(raw);
    if (!t20HudPericiaTreinada(p)) continue;

    const label = p.label ?? p.name ?? p.nome ?? T20_HUD_PERICIAS_LABELS[id] ?? id;
    const bonus = t20HudBonusPericia(p);
    lista.push({ id, label, bonus });
  }

  return lista.sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
}

function t20HudRecursosAtuais(actor) {
  const pv = Number(foundry.utils.getProperty(actor, "system.attributes.pv.value"));
  const pvMax = Number(foundry.utils.getProperty(actor, "system.attributes.pv.max"));
  const pm = Number(foundry.utils.getProperty(actor, "system.attributes.pm.value"));
  const pmMax = Number(foundry.utils.getProperty(actor, "system.attributes.pm.max"));
  return {
    pv: Number.isFinite(pv) ? pv : null,
    pvMax: Number.isFinite(pvMax) ? pvMax : null,
    pm: Number.isFinite(pm) ? pm : null,
    pmMax: Number.isFinite(pmMax) ? pmMax : null,
  };
}

function t20HudFormatarRecursos(actor) {
  const r = t20HudRecursosAtuais(actor);
  const pv = r.pv === null ? "?" : r.pv;
  const pvMax = r.pvMax === null ? "" : `/${r.pvMax}`;
  const pm = r.pm === null ? "?" : r.pm;
  const pmMax = r.pmMax === null ? "" : `/${r.pmMax}`;
  return `PV ${pv}${pvMax} · PM ${pm}${pmMax}`;
}

async function t20HudRolarPericia(actor, periciaId) {
  if (!actor) return ui.notifications.warn("Nenhum personagem selecionado.");

  const raw = actor.system?.pericias?.[periciaId] ?? actor.system?.skills?.[periciaId];
  const p = t20HudParsePericia(raw);
  const label = p.label ?? p.name ?? p.nome ?? T20_HUD_PERICIAS_LABELS[periciaId] ?? periciaId;
  const bonus = t20HudBonusPericia(p);

  const roll = await new Roll(`1d20 + ${bonus}`).evaluate();
  await roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `<b>${label}</b> — ${actor.name}`,
  });
}

async function t20HudUsarItem(actor, itemId) {
  if (!actor) return ui.notifications.warn("Nenhum personagem selecionado.");
  const item = actor.items?.get?.(itemId);
  if (!item) return ui.notifications.warn("Item não encontrado.");

  try {
    if (typeof item.use === "function") return await item.use();
    if (typeof item.roll === "function") return await item.roll();
    if (typeof item.displayCard === "function") return await item.displayCard();
    if (typeof item.toMessage === "function") return await item.toMessage();
    return item.sheet?.render?.(true);
  } catch (e) {
    console.warn("Arsenal T20 | erro ao usar item pelo HUD", e);
    ui.notifications.warn(`Não foi possível usar ${item.name} automaticamente. Abrindo o item.`);
    item.sheet?.render?.(true);
  }
}

async function t20HudGastarPM(actor) {
  if (!actor) return ui.notifications.warn("Nenhum personagem selecionado.");
  const valor = await new Promise(resolve => {
    new Dialog({
      title: "Gastar PM",
      content: `<form><div class="form-group"><label>PM</label><input type="number" name="pm" value="1" min="0" step="1" autofocus></div></form>`,
      buttons: {
        ok: { label: "Gastar", callback: html => resolve(Math.max(0, Math.floor(Number(html.find?.('[name="pm"]').val?.() ?? html.querySelector?.('[name="pm"]')?.value ?? 0) || 0))) },
        cancel: { label: "Cancelar", callback: () => resolve(null) }
      },
      default: "ok",
      close: () => resolve(null),
    }).render(true);
  });
  if (valor === null || valor <= 0) return;
  await t20AplicarPMDireto(actor, valor);
  ui.notifications.info(`${actor.name}: ${valor} PM gasto(s).`);
}

async function t20HudRecuperarPM(actor) {
  if (!actor) return ui.notifications.warn("Nenhum personagem selecionado.");
  const valor = await new Promise(resolve => {
    new Dialog({
      title: "Recuperar PM",
      content: `<form><div class="form-group"><label>PM</label><input type="number" name="pm" value="1" min="0" step="1" autofocus></div></form>`,
      buttons: {
        ok: { label: "Recuperar", callback: html => resolve(Math.max(0, Math.floor(Number(html.find?.('[name="pm"]').val?.() ?? html.querySelector?.('[name="pm"]')?.value ?? 0) || 0))) },
        cancel: { label: "Cancelar", callback: () => resolve(null) }
      },
      default: "ok",
      close: () => resolve(null),
    }).render(true);
  });
  if (valor === null || valor <= 0) return;
  await t20ReverterPMDireto(actor, valor);
  ui.notifications.info(`${actor.name}: ${valor} PM recuperado(s).`);
}

async function t20HudDanoManual(actor) {
  const token = t20HudTokenSelecionado();
  if (!token?.actor) return ui.notifications.warn("Selecione um token para aplicar dano.");
  const valor = await new Promise(resolve => {
    new Dialog({
      title: "Aplicar Dano Manual",
      content: `<form><div class="form-group"><label>Dano</label><input type="number" name="dano" value="1" min="0" step="1" autofocus></div></form>`,
      buttons: {
        ok: { label: "Aplicar", callback: html => resolve(Math.max(0, Math.floor(Number(html.find?.('[name="dano"]').val?.() ?? html.querySelector?.('[name="dano"]')?.value ?? 0) || 0))) },
        cancel: { label: "Cancelar", callback: () => resolve(null) }
      },
      default: "ok",
      close: () => resolve(null),
    }).render(true);
  });
  if (valor === null || valor <= 0) return;
  await t20AplicarDanoDireto(token.actor, valor);
  await ChatMessage.create({ content: `<div style="background:#171b26;border:1px solid #2b3347;border-left:4px solid #b94a58;padding:8px 11px;border-radius:6px;color:#d7dcea">💔 <b>${token.name}</b> sofreu <b>${valor}</b> de dano manual.</div>` });
}

async function t20HudCurarManual(actor) {
  const token = t20HudTokenSelecionado();
  if (!token?.actor) return ui.notifications.warn("Selecione um token para curar.");
  const valor = await new Promise(resolve => {
    new Dialog({
      title: "Aplicar Cura Manual",
      content: `<form><div class="form-group"><label>Cura</label><input type="number" name="cura" value="1" min="0" step="1" autofocus></div></form>`,
      buttons: {
        ok: { label: "Curar", callback: html => resolve(Math.max(0, Math.floor(Number(html.find?.('[name="cura"]').val?.() ?? html.querySelector?.('[name="cura"]')?.value ?? 0) || 0))) },
        cancel: { label: "Cancelar", callback: () => resolve(null) }
      },
      default: "ok",
      close: () => resolve(null),
    }).render(true);
  });
  if (valor === null || valor <= 0) return;

  const hpPath = "system.attributes.pv.value";
  const maxPath = "system.attributes.pv.max";
  const pvAtual = Number(foundry.utils.getProperty(token.actor, hpPath));
  const pvMax = Number(foundry.utils.getProperty(token.actor, maxPath) ?? pvAtual);
  if (!Number.isFinite(pvAtual)) return ui.notifications.warn("PV não encontrado.");
  await token.actor.update({ [hpPath]: Math.min(pvMax, pvAtual + valor) });
  await ChatMessage.create({ content: `<div style="background:#171b26;border:1px solid #2b3347;border-left:4px solid #4ade80;padding:8px 11px;border-radius:6px;color:#d7dcea">💚 <b>${token.name}</b> recuperou <b>${valor}</b> PV.</div>` });
}

async function t20HudRemoverTodasCondicoes(actor) {
  if (!actor) return ui.notifications.warn("Nenhum personagem selecionado.");
  const efeitos = Array.from(actor.effects ?? []).filter(e => {
    const id = e.statuses?.first?.() ?? e.statuses?.values?.().next?.().value ?? e.flags?.core?.statusId;
    return id || CONFIG.statusEffects.some(s => s.id === e.name || s.name === e.name);
  });
  if (!efeitos.length) return ui.notifications.info(`${actor.name} não possui condições detectadas.`);
  await actor.deleteEmbeddedDocuments("ActiveEffect", efeitos.map(e => e.id));
  ui.notifications.info(`${efeitos.length} condição(ões) removida(s) de ${actor.name}.`);
}

let _arsenalHUD = null;

function abrirArsenalHUD(force = false) {
  const modo = t20HudMode();
  if (modo === "off") {
    if (_arsenalHUD?.rendered) _arsenalHUD.close();
    return;
  }
  if (!_arsenalHUD) _arsenalHUD = new ArsenalHUD();
  if (!_arsenalHUD.rendered || force) _arsenalHUD.render(true);
  else _arsenalHUD.render(false);
}

function fecharArsenalHUD() {
  if (_arsenalHUD?.rendered) _arsenalHUD.close();
}

function atualizarArsenalHUD() {
  const modo = t20HudMode();
  if (modo === "off") {
    fecharArsenalHUD();
    return;
  }
  if (_arsenalHUD?.rendered) _arsenalHUD.render(false);
}

class ArsenalHUD extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "arsenal-hud",
      title: "Arsenal HUD",
      width: 260,
      height: "auto",
      resizable: false,
      minimizable: false,
      popOut: false,
    });
  }

  async getData() { return {}; }
  get template() { return null; }

  async _renderInner() {
    const div = document.createElement("div");
    div.innerHTML = this._html();
    return $(div);
  }

  render(force, options = {}) {
    const r = super.render(force, options);
    setTimeout(() => {
      this._reposicionar();
      this._iniciarResize();
    }, 50);
    return r;
  }

  setPosition(options = {}) {
    super.setPosition(options);
    this._reposicionar();
  }

  _aplicarTamanho(el, modo) {
    const salvo = t20HudGetSavedSize(modo);
    const defaults = modo === "bottom" ? { width: 660, height: 250 } : { width: 330, height: 420 };
    const w = Number(salvo?.width) || defaults.width;
    const h = t20HudIsCollapsed() ? 68 : (Number(salvo?.height) || defaults.height);

    el.style.width = `${Math.max(260, Math.min(window.innerWidth - 24, w))}px`;
    el.style.height = `${t20HudIsCollapsed() ? 68 : Math.max(180, Math.min(window.innerHeight - 32, h))}px`;
    el.style.minWidth = "260px";
    el.style.minHeight = t20HudIsCollapsed() ? "68px" : "180px";
    el.style.maxWidth = `${window.innerWidth - 12}px`;
    el.style.maxHeight = `${window.innerHeight - 12}px`;
    el.style.overflow = "hidden";
  }

  _reposicionar() {
    const el = this.element?.[0] ?? document.getElementById("arsenal-hud");
    if (!el) return;

    const modo = t20HudMode();
    const token = t20HudTokenSelecionado();

    el.classList.add("arsenal-hud-root");
    el.style.position = "fixed";
    el.style.zIndex = "120";
    el.style.pointerEvents = "auto";
    el.style.transform = "";
    el.style.bottom = "auto";

    this._aplicarTamanho(el, modo);

    if (modo === "token" && token) {
      const c = token.center ?? { x: token.x, y: token.y };
      const world = new PIXI.Point(c.x, c.y);
      const screen = canvas.stage.worldTransform.apply(world);
      const rect = el.getBoundingClientRect();

      el.style.left = `${Math.min(window.innerWidth - rect.width - 8, Math.max(72, screen.x + 22))}px`;
      el.style.top = `${Math.min(window.innerHeight - rect.height - 8, Math.max(64, screen.y - 22))}px`;
      return;
    }

    const salvo = t20HudGetSavedPosition(modo);
    if (salvo && Number.isFinite(salvo.left) && Number.isFinite(salvo.top)) {
      const rect = el.getBoundingClientRect();
      el.style.left = `${Math.min(window.innerWidth - rect.width - 8, Math.max(0, salvo.left))}px`;
      el.style.top = `${Math.min(window.innerHeight - rect.height - 8, Math.max(0, salvo.top))}px`;
      return;
    }

    if (modo === "bottom") {
      const rect = el.getBoundingClientRect();
      el.style.left = `${Math.max(80, Math.round((window.innerWidth - rect.width) / 2))}px`;
      el.style.top = `${Math.max(80, window.innerHeight - rect.height - 78)}px`;
      return;
    }

    el.style.left = "76px";
    el.style.top = "118px";
  }

  _html() {
    const modo = t20HudMode();
    const token = t20HudTokenSelecionado();
    const actor = token?.actor ?? game.user.character;
    const nome = actor?.name ?? "Nenhum token";
    const img = token?.document?.texture?.src ?? actor?.img ?? "";
    const sustentadas = actor ? t20EfeitosSustentados(actor) : [];
    const grupos = t20HudItensActor(actor);
    const pericias = t20HudPericiasTreinadasActor(actor);
    const recursos = actor ? t20HudFormatarRecursos(actor) : "";
    const bottom = modo === "bottom";
    const layout = t20HudLayout();
    const collapsed = t20HudIsCollapsed();
    const personagemJogador = t20HudActorEhPersonagemJogador(actor);
    const th = t20HudTheme();

    return `<div style="
      height:100%;box-sizing:border-box;display:flex;flex-direction:column;position:relative;
      background:linear-gradient(180deg,${th.bg1},${th.bg2});
      border:1px solid ${th.border};border-top:2px solid ${th.accent};
      box-shadow:0 6px 14px rgba(0,0,0,0.38);
      border-radius:8px;color:${th.text};font-family:serif;padding:7px;font-size:14px">
      <div class="t20-hud-drag" style="display:grid;grid-template-columns:auto 1fr auto;gap:7px;margin-bottom:6px;border-bottom:1px solid ${th.accent}44;padding-bottom:6px;cursor:${modo === "token" ? "default" : "move"};flex-shrink:0">
        ${img ? `<img src="${img}" style="grid-row:1 / span 2;width:34px;height:34px;border-radius:6px;object-fit:cover;border:1px solid ${th.accent}66">` : ""}
        <div style="min-width:0;align-self:end">
          <div style="color:${th.title};font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.05">${nome}</div>
        </div>
        <div style="display:flex;gap:4px;align-items:start;justify-content:flex-end">
          <button class="t20-hud-refresh" title="Atualizar" style="${this._smallCtrl(th)}">↻</button>
          <button class="t20-hud-minimize" title="${collapsed ? "Expandir HUD" : "Minimizar HUD"}" style="${this._smallCtrl(th)}">${collapsed ? "▣" : "—"}</button>
        </div>
        <div style="min-width:0;font-size:0.82em;color:${th.muted};white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${recursos}</div>
        ${actor ? `
          <div style="display:flex;gap:4px;justify-content:flex-end;align-items:center">
            <button class="t20-hud-action" title="Recuperar PM" data-action="recuperarPM" style="${this._iconBtn("#14213a","#60a5fa")}">PM+</button>
            <button class="t20-hud-action" title="Gastar PM" data-action="gastarPM" style="${this._iconBtn("#251b44","#a78bfa")}">PM−</button>
            <button class="t20-hud-action" title="Dano manual" data-action="dano" style="${this._iconBtn("#3b151b","#f87171")}">💔</button>
            <button class="t20-hud-action" title="Cura manual" data-action="cura" style="${this._iconBtn("#14351f","#4ade80")}">💚</button>
          </div>` : ""}
      </div>

      ${collapsed ? "" : (!actor ? `<div style="color:${th.muted};padding:6px">Selecione um token para usar o HUD.</div>` : `
        <div style="${bottom ? "display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:7px;overflow:auto;min-height:0;flex:1;padding-right:2px" : "overflow:auto;min-height:0;flex:1;padding-right:2px"}">
          ${this._renderCategoriasOrdenadas(grupos, pericias, bottom, personagemJogador, layout, actor)}
        </div>

        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;border-top:1px solid rgba(255,255,255,0.08);padding-top:6px;flex-shrink:0;padding-right:12px">
          <button class="t20-hud-action" data-action="condicoes" style="${this._textBtn("#3a2a00","#c9a227")}">☠️ Condições</button>
          <button class="t20-hud-action" data-action="recursos" style="${this._textBtn("#10223a","#93c5fd")}">📊 Recursos</button>
          <button class="t20-hud-action" data-action="sustentadas" style="${this._textBtn("#2c2140","#c4b5fd")}">🪄 Sustentadas</button>
          <button class="t20-hud-action" data-action="aura" style="${this._textBtn("#10231f","#2dd4bf")}">🛡️ Aura</button>
          <button class="t20-hud-action" data-action="limparCondicoes" style="${this._textBtn("#2d1b1b","#fca5a5")}">🧹 Limpar Cond.</button>
        </div>

        <div style="margin-top:5px;font-size:0.78em;color:${th.muted};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;padding-right:12px">
          ${personagemJogador ? "Grimório + habilidades/poderes ativáveis + favoritos. Use ▲▼ para reordenar." : "NPC: ataques e habilidades. Use ▲▼ para reordenar."}
          ${sustentadas.length ? ` · Sust.: <b style="color:${th.title}">${sustentadas.map(s => s.nome ?? s.name ?? s.label).join(", ")}</b>` : ""}
        </div>
      `)}
      <div class="t20-hud-resize" title="Redimensionar"
        style="position:absolute;right:2px;bottom:2px;width:14px;height:14px;cursor:nwse-resize;
          border-right:2px solid ${th.accent};border-bottom:2px solid ${th.accent};
          opacity:0.9"></div>
    </div>`;
  }

  _renderCategoriasOrdenadas(grupos, pericias, bottom, personagemJogador, layout = "compact", actor = null) {
    const defs = {
      favoritos:{ titulo: "⭐ Favoritos", itens: grupos.favoritos ?? [], tipo: "item" },
      ataques:  { titulo: "⚔️ Ataques", itens: grupos.ataques, tipo: "item" },
      magias:   { titulo: "🪄 Magias", itens: grupos.magias, tipo: "item" },
      poderes:  { titulo: "✨ Poderes/Habilidades", itens: grupos.poderes, tipo: "item" },
      pericias: { titulo: "🎲 Perícias treinadas", itens: personagemJogador ? pericias : [], tipo: "pericia" },
    };

    return t20HudGetCategoryOrder()
      .filter(cat => cat !== "pericias" || personagemJogador)
      .map(cat => {
        if (cat === "magias" && t20HudSpellMode() === "grimoire") {
          return this._secaoGrimorio(actor, bottom, layout);
        }
        return this._secao(defs[cat].titulo, defs[cat].itens, bottom, defs[cat].tipo, cat, layout);
      })
      .join("");
  }

  _secaoHeader(titulo, cat, qtd = null) {
    const th = t20HudTheme();
    const recolhida = t20HudSecaoRecolhida(cat);
    return `<div style="display:flex;align-items:center;gap:4px;margin:3px 0 5px">
      <button class="t20-hud-sec-toggle" data-cat="${cat}" title="${recolhida ? "Expandir" : "Recolher"}"
        style="padding:1px 6px;border-radius:4px;background:${th.panel};border:1px solid ${th.border};color:${th.accent2};cursor:pointer;font-size:0.78em">${recolhida ? "▸" : "▾"}</button>
      <div style="font-size:0.92em;color:${th.accent2};font-weight:bold;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${titulo}${qtd !== null ? ` <span style="font-size:0.82em;color:${th.muted}">(${qtd})</span>` : ""}</div>
      <button class="t20-hud-cat-move" data-cat="${cat}" data-dir="-1" title="Mover categoria para cima/esquerda"
        style="padding:1px 5px;border-radius:4px;background:${th.panel};border:1px solid ${th.border};color:${th.text};cursor:pointer;font-size:0.78em">▲</button>
      <button class="t20-hud-cat-move" data-cat="${cat}" data-dir="1" title="Mover categoria para baixo/direita"
        style="padding:1px 5px;border-radius:4px;background:${th.panel};border:1px solid ${th.border};color:${th.text};cursor:pointer;font-size:0.78em">▼</button>
    </div>`;
  }

  _secaoGrimorio(actor, bottom, layout = "compact") {
    const grupos = t20HudMagiasPorCirculo(actor);
    const cards = layout === "cards";
    const circulos = [1, 2, 3, 4, 5];
    const total = circulos.reduce((s, c) => s + (grupos[c]?.length ?? 0), 0);
    const recolhida = t20HudSecaoRecolhida("magias");
    const th = t20HudTheme();

    return `<div style="${bottom ? "min-width:0" : "margin-bottom:9px"}">
      ${this._secaoHeader("🪄 Grimório", "magias", total)}
      ${recolhida ? "" : `<div style="display:grid;grid-template-columns:${cards ? "repeat(auto-fit,minmax(118px,1fr))" : "repeat(auto-fit,minmax(92px,1fr))"};gap:6px">
        ${circulos.map(c => {
          const qtd = grupos[c]?.length ?? 0;
          const disabled = qtd <= 0;
          return `<button class="t20-hud-grimorio-circulo" data-circulo="${c}" ${disabled ? "disabled" : ""}
            style="min-height:${cards ? "54px" : "42px"};padding:7px;border-radius:8px;
            background:${disabled ? th.panel : `linear-gradient(180deg,${th.panel2},${th.panel})`};
            border:1px solid ${disabled ? th.border : th.accent};color:${disabled ? th.muted : th.text};
            cursor:${disabled ? "not-allowed" : "pointer"};font-weight:bold;text-align:center;font-size:${cards ? "0.92em" : "0.86em"};
            box-shadow:${disabled ? "none" : "inset 0 1px 0 rgba(255,255,255,0.05)"}">
            <div>${c}º Círculo</div>
            <div style="font-size:0.78em;color:${disabled ? th.muted : th.accent2}">${qtd} magia(s)</div>
          </button>`;
        }).join("")}
      </div>`}
    </div>`;
  }

  _secao(titulo, itens, bottom, tipo = "item", cat = "", layout = "compact") {
    const maxItens = 80;
    const lista = (itens ?? []).slice(0, maxItens);
    const vazio = !lista.length ? `<div style="font-size:0.86em;color:${t20HudTheme().muted};padding:4px 2px">Nenhum</div>` : "";
    const cards = layout === "cards";
    const th = t20HudTheme();
    const recolhida = t20HudSecaoRecolhida(cat);

    return `<div style="${bottom ? "min-width:0" : "margin-bottom:9px"}">
      ${this._secaoHeader(titulo, cat, lista.length)}
      ${recolhida ? "" : `${vazio}
      <div style="${cards ? "display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px" : ""}">
        ${lista.map(item => {
          const id = tipo === "pericia" ? item.id : item.id;
          const label = tipo === "pericia" ? `${item.label} ${item.bonus >= 0 ? "+" : ""}${item.bonus}` : item.name;
          const img = tipo === "pericia" ? "" : item.img;

          if (cards) {
            return `<button class="${tipo === "pericia" ? "t20-hud-pericia" : "t20-hud-item"}"
              data-${tipo === "pericia" ? "pericia-id" : "item-id"}="${id}" title="${label}"
              style="display:flex;align-items:center;gap:7px;width:100%;min-height:42px;padding:7px;margin:0;border-radius:8px;
              background:linear-gradient(180deg,${th.panel2},${th.panel});border:1px solid ${th.border};color:${th.text};cursor:pointer;
              font-size:0.92em;text-align:left;min-width:0;box-shadow:inset 0 1px 0 rgba(255,255,255,0.04)">
              ${img ? `<img src="${img}" style="width:26px;height:26px;border-radius:5px;object-fit:cover;border:1px solid ${th.accent}55">` : `<span style="width:26px;height:26px;display:flex;align-items:center;justify-content:center;border-radius:5px;background:${th.bg2}">${tipo === "pericia" ? "🎲" : "•"}</span>`}
              <span style="white-space:normal;overflow:hidden;text-overflow:ellipsis;line-height:1.12">${label}</span>
            </button>`;
          }

          return `<button class="${tipo === "pericia" ? "t20-hud-pericia" : "t20-hud-item"}"
            data-${tipo === "pericia" ? "pericia-id" : "item-id"}="${id}" title="${label}"
            style="display:flex;align-items:center;gap:6px;width:100%;padding:6px 7px;margin-bottom:4px;border-radius:6px;
            background:${th.panel};border:1px solid ${th.border};color:${th.text};cursor:pointer;font-size:0.9em;text-align:left;min-width:0">
            ${img ? `<img src="${img}" style="width:20px;height:20px;border-radius:4px;object-fit:cover;border:none">` : `<span style="width:20px;text-align:center">${tipo === "pericia" ? "🎲" : "•"}</span>`}
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${label}</span>
          </button>`;
        }).join("")}
      </div>`}
    </div>`;
  }

  _textBtn(bg, fg) {
    return `padding:4px 6px;border-radius:5px;background:${bg};border:1px solid ${fg};color:${fg};font-weight:bold;cursor:pointer;font-size:0.84em;line-height:1.1`;
  }

  _smallCtrl(th) {
    return `padding:2px 6px;border-radius:5px;background:${th.panel};border:1px solid ${th.border};color:${th.text};cursor:pointer;font-size:13px`;
  }

  _iconBtn(bg, fg) {
    return `min-width:34px;height:25px;padding:2px 5px;border-radius:5px;background:${bg};border:1px solid ${fg};color:${fg};font-weight:bold;cursor:pointer;font-size:0.76em;line-height:1`;
  }

  _iniciarArraste(html) {
    const modo = t20HudMode();
    if (modo === "token") return;

    const root = this.element?.[0];
    const handle = html.find(".t20-hud-drag")?.[0];
    if (!root || !handle) return;

    let dragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;

    const move = ev => {
      if (!dragging) return;
      const rect = root.getBoundingClientRect();
      const left = Math.min(window.innerWidth - rect.width - 8, Math.max(0, startLeft + ev.clientX - startX));
      const top = Math.min(window.innerHeight - rect.height - 8, Math.max(0, startTop + ev.clientY - startY));
      root.style.left = `${left}px`;
      root.style.top = `${top}px`;
      root.style.bottom = "auto";
    };

    const up = () => {
      if (!dragging) return;
      dragging = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      t20HudSetSavedPosition(modo, {
        left: parseInt(root.style.left) || root.offsetLeft || 0,
        top: parseInt(root.style.top) || root.offsetTop || 0,
      });
    };

    handle.addEventListener("mousedown", ev => {
      if (ev.target?.closest?.("button")) return;
      dragging = true;
      startX = ev.clientX;
      startY = ev.clientY;
      const rect = root.getBoundingClientRect();
      startLeft = rect.left;
      startTop = rect.top;
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
      ev.preventDefault();
    });
  }

  _iniciarResize() {
    const root = this.element?.[0];
    const handle = root?.querySelector?.(".t20-hud-resize");
    if (!root || !handle || handle._arsenalResizeReady) return;
    handle._arsenalResizeReady = true;

    let resizing = false;
    let startX = 0, startY = 0, startW = 0, startH = 0;

    const move = ev => {
      if (!resizing) return;
      const w = Math.max(260, Math.min(window.innerWidth - root.getBoundingClientRect().left - 8, startW + ev.clientX - startX));
      const h = Math.max(180, Math.min(window.innerHeight - root.getBoundingClientRect().top - 8, startH + ev.clientY - startY));
      root.style.width = `${w}px`;
      root.style.height = `${h}px`;
    };

    const up = () => {
      if (!resizing) return;
      resizing = false;
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      const rect = root.getBoundingClientRect();
      t20HudSetSavedSize(t20HudMode(), {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    };

    handle.addEventListener("mousedown", ev => {
      resizing = true;
      startX = ev.clientX;
      startY = ev.clientY;
      const rect = root.getBoundingClientRect();
      startW = rect.width;
      startH = rect.height;
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
      ev.preventDefault();
      ev.stopPropagation();
    });
  }

  activateListeners(html) {
    super.activateListeners(html);

    this._iniciarArraste(html);
    this._iniciarResize();

    html.find(".t20-hud-refresh").on("click", () => this.render(false));

    html.find(".t20-hud-minimize").on("click", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      t20HudSetCollapsed(!t20HudIsCollapsed());
      this.render(false);
    });

    html.find(".t20-hud-sec-toggle").on("click", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      const cat = ev.currentTarget.dataset.cat;
      t20HudSetSecaoRecolhida(cat, !t20HudSecaoRecolhida(cat));
      this.render(false);
    });

    html.find(".t20-hud-cat-move").on("click", ev => {
      ev.preventDefault();
      ev.stopPropagation();
      t20HudMoverCategoria(ev.currentTarget.dataset.cat, parseInt(ev.currentTarget.dataset.dir) || 0);
    });

    html.find(".t20-hud-item").on("click", async ev => {
      const actor = t20HudActorSelecionado();
      const itemId = ev.currentTarget.dataset.itemId;
      await t20HudUsarItem(actor, itemId);
    });

    html.find(".t20-hud-pericia").on("click", async ev => {
      const actor = t20HudActorSelecionado();
      await t20HudRolarPericia(actor, ev.currentTarget.dataset.periciaId);
    });

    html.find(".t20-hud-grimorio-circulo").on("click", ev => {
      const actor = t20HudActorSelecionado();
      const circulo = Number(ev.currentTarget.dataset.circulo);
      abrirArsenalGrimorio(actor, circulo);
    });

    html.find(".t20-hud-action").on("click", async ev => {
      const action = ev.currentTarget.dataset.action;
      const actor = t20HudActorSelecionado();

      switch (action) {
        case "condicoes": return abrirPainelCondicoes();
        case "recursos": return abrirPainelRecursosArsenal();
        case "sustentadas": return abrirPainelSustentadas();
        case "aura": return t20ToggleAuraSagrada();
        case "gastarPM": return t20HudGastarPM(actor);
        case "recuperarPM": return t20HudRecuperarPM(actor);
        case "dano": return t20HudDanoManual(actor);
        case "cura": return t20HudCurarManual(actor);
        case "limparCondicoes": return t20HudRemoverTodasCondicoes(actor);
      }
    });
  }
}

Hooks.once("ready", () => {
  if (t20HudMode() !== "off") {
    setTimeout(() => abrirArsenalHUD(true), 1200);
  }
});

Hooks.on("controlToken", () => atualizarArsenalHUD());
Hooks.on("updateToken", () => atualizarArsenalHUD());
Hooks.on("updateActor", (actor) => {
  const atual = t20HudActorSelecionado();
  if (_arsenalHUD?.rendered && atual?.id === actor?.id) atualizarArsenalHUD();
});
Hooks.on("refreshToken", () => {
  if (t20HudMode() === "token") atualizarArsenalHUD();
});
Hooks.on("canvasPan", () => {
  if (t20HudMode() === "token") atualizarArsenalHUD();
});
Hooks.on("canvasReady", () => atualizarArsenalHUD());

Hooks.on("getSceneControlButtons", (controls) => {
  if (Array.isArray(controls)) {
    const tokens = controls.find(c => c.name === "token");
    if (tokens) {
      tokens.tools.push({
        name: "arsenal-hud",
        title: "Arsenal HUD",
        icon: "fas fa-layer-group",
        button: true,
        onClick: () => abrirArsenalHUD(true),
      });
    }
  } else {
    const tokens = controls.token ?? controls.tokens;
    if (tokens) {
      tokens.tools["arsenal-hud"] = {
        name: "arsenal-hud",
        title: "Arsenal HUD",
        icon: "fas fa-layer-group",
        button: true,
        onChange: () => abrirArsenalHUD(true),
        order: 104,
      };
    }
  }
});


// ============================================================
// MELHORIA VISUAL — DIÁLOGO DE APRIMORAMENTOS DE MAGIA
// ============================================================

function t20DialogoMagiaAtivo() {
  try {
    return !!game.settings.get("arsenal-t20", "melhorarDialogoMagias");
  } catch {
    return true;
  }
}

function t20EhDialogoUsoMagia(app, root) {
  const win = root?.closest?.(".window-app, .app") ?? root;
  const titulo = [
    app?.title,
    app?.options?.title,
    win?.querySelector?.(".window-title")?.textContent,
    root?.querySelector?.(".window-title")?.textContent,
  ].filter(Boolean).join(" ");

  if (/configura[cç][aã]o de uso de magia/i.test(titulo)) return true;
  if (/uso de magia/i.test(titulo) && (win?.querySelector?.("table") || root?.querySelector?.("table"))) return true;

  const table = win?.querySelector?.("table") ?? root?.querySelector?.("table");
  const header = String(table?.querySelector?.("thead")?.innerText ?? table?.querySelector?.("tr")?.innerText ?? "");
  if (/Aplicar/i.test(header) && /Nome/i.test(header) && /PM/i.test(String(table?.innerText ?? ""))) return true;

  return false;
}

function t20ExtrairCustoLinhaMagia(row) {
  const texto = String(row?.innerText ?? row?.textContent ?? "").replace(/\s+/g, " ").trim();
  const aplicar = row?.querySelector?.("td:first-child, th:first-child")?.innerText ?? "";
  const mAplicar = String(aplicar).match(/([+-]?\d+)\s*PM/i);
  if (mAplicar) return `${Number(mAplicar[1]) >= 0 ? "+" : ""}${Number(mAplicar[1])} PM`;
  const m = texto.match(/([+-]?\d+)\s*PM/i);
  if (m) return `${Number(m[1]) >= 0 ? "+" : ""}${Number(m[1])} PM`;
  return "";
}

function t20MelhorarDialogoUsoMagia(app, html) {
  if (!t20DialogoMagiaAtivo()) return;

  const root = html instanceof jQuery ? html[0] : html;
  if (!root || root.dataset?.arsenalDialogoMagia === "1") return;
  if (!t20EhDialogoUsoMagia(app, root)) return;

  root.dataset.arsenalDialogoMagia = "1";

  const win = root.closest?.(".app, .window-app") ?? root.parentElement;
  if (win) {
    win.style.minWidth = "720px";
    win.style.maxWidth = "920px";
  }

  const form = root.querySelector("form") ?? root;
  form.style.fontSize = "14px";

  const table = root.querySelector("table");
  if (!table) return;

  table.classList.add("arsenal-t20-magia-table");
  table.style.display = "block";
  table.style.width = "100%";
  table.style.borderCollapse = "separate";
  table.style.borderSpacing = "0";
  table.style.maxHeight = "58vh";
  table.style.overflowY = "auto";
  table.style.paddingRight = "6px";

  const thead = table.querySelector("thead");
  if (thead) thead.style.display = "none";

  const tbody = table.querySelector("tbody") ?? table;
  tbody.style.display = "block";
  tbody.style.width = "100%";

  const rows = Array.from(tbody.querySelectorAll("tr")).filter(row => row.querySelector("td"));
  rows.forEach((row, index) => {
    if (row.dataset.arsenalCard === "1") return;
    row.dataset.arsenalCard = "1";

    const cells = Array.from(row.querySelectorAll("td"));
    const aplicar = cells[0];
    const nome = cells[1] ?? cells[cells.length - 1];

    const custo = t20ExtrairCustoLinhaMagia(row);
    const controles = aplicar ? Array.from(aplicar.querySelectorAll("input, button, select")).length : 0;
    const selecionavel = !!aplicar?.querySelector?.('input[type="checkbox"], input[type="number"], button');

    row.style.display = "grid";
    row.style.gridTemplateColumns = "minmax(110px, 150px) 1fr";
    row.style.gap = "10px";
    row.style.alignItems = "start";
    row.style.margin = "0 0 8px 0";
    row.style.padding = "10px";
    row.style.border = "1px solid rgba(55,65,81,0.75)";
    row.style.borderRadius = "10px";
    row.style.background = index % 2 === 0
      ? "linear-gradient(180deg, rgba(17,24,39,0.12), rgba(15,23,42,0.05))"
      : "linear-gradient(180deg, rgba(30,41,59,0.12), rgba(15,23,42,0.05))";
    row.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.05)";

    if (aplicar) {
      aplicar.style.display = "flex";
      aplicar.style.alignItems = "center";
      aplicar.style.justifyContent = "center";
      aplicar.style.gap = "6px";
      aplicar.style.padding = "6px";
      aplicar.style.borderRadius = "8px";
      aplicar.style.background = "rgba(15,23,42,0.10)";
      aplicar.style.border = "1px solid rgba(55,65,81,0.45)";
      aplicar.style.minHeight = "48px";
      aplicar.style.whiteSpace = "nowrap";
      aplicar.style.fontWeight = "bold";
      aplicar.style.color = custo.startsWith("-") ? "#2563eb" : "#7c2d12";

      const badge = document.createElement("div");
      badge.className = "arsenal-t20-custo-badge";
      badge.textContent = custo || (selecionavel ? "Aumento" : "");
      badge.style.fontSize = "0.86em";
      badge.style.color = custo.startsWith("-") ? "#1d4ed8" : "#92400e";
      badge.style.marginRight = controles ? "4px" : "0";
      if (custo || selecionavel) aplicar.prepend(badge);

      aplicar.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.style.width = "18px";
        cb.style.height = "18px";
        cb.style.cursor = "pointer";
      });

      aplicar.querySelectorAll("button").forEach(btn => {
        btn.style.minWidth = "28px";
        btn.style.height = "28px";
        btn.style.borderRadius = "6px";
        btn.style.border = "1px solid #6b7280";
        btn.style.background = "#f3f4f6";
        btn.style.cursor = "pointer";
        btn.style.fontWeight = "bold";
      });

      aplicar.querySelectorAll("input[type='number'], input:not([type])").forEach(input => {
        input.style.width = "44px";
        input.style.textAlign = "center";
        input.style.borderRadius = "6px";
        input.style.border = "1px solid #6b7280";
      });
    }

    if (nome) {
      nome.style.display = "block";
      nome.style.padding = "2px 4px";
      nome.style.lineHeight = "1.45";
      nome.style.fontSize = "0.98em";
      nome.style.color = "#111827";
    }

    const baseBg = row.style.background;
    const atualizarEstado = () => {
      const checked = !!row.querySelector("input[type='checkbox']:checked");
      const qtd = Array.from(row.querySelectorAll("input[type='number'], input:not([type])"))
        .some(inp => Number(inp.value) > 0);
      row.style.outline = (checked || qtd) ? "2px solid rgba(37,99,235,0.65)" : "none";
      row.style.background = (checked || qtd)
        ? "linear-gradient(180deg, rgba(219,234,254,0.55), rgba(191,219,254,0.35))"
        : baseBg;
    };

    row.querySelectorAll("input, button, select").forEach(el => {
      el.addEventListener("change", atualizarEstado);
      el.addEventListener("click", () => setTimeout(atualizarEstado, 30));
    });
    atualizarEstado();
  });

  if (!root.querySelector(".arsenal-t20-magia-toolbar")) {
    const toolbar = document.createElement("div");
    toolbar.className = "arsenal-t20-magia-toolbar";
    toolbar.style.display = "flex";
    toolbar.style.gap = "8px";
    toolbar.style.alignItems = "center";
    toolbar.style.margin = "6px 0 10px";
    toolbar.style.padding = "8px";
    toolbar.style.border = "1px solid rgba(55,65,81,0.55)";
    toolbar.style.borderRadius = "8px";
    toolbar.style.background = "rgba(15,23,42,0.08)";

    toolbar.innerHTML = `
      <input type="text" placeholder="Filtrar aprimoramentos..."
        style="flex:1;padding:7px 9px;border-radius:6px;border:1px solid #9ca3af;background:rgba(255,255,255,0.8)">
      <button type="button" data-action="limpar"
        style="padding:7px 9px;border-radius:6px;border:1px solid #9ca3af;background:#f3f4f6;cursor:pointer">Limpar</button>
    `;

    table.parentElement?.insertBefore(toolbar, table);

    const filtro = toolbar.querySelector("input");
    filtro?.addEventListener("input", () => {
      const q = String(filtro.value ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      rows.forEach(row => {
        const txt = String(row.innerText ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        row.style.display = !q || txt.includes(q) ? "grid" : "none";
      });
    });

    toolbar.querySelector("[data-action='limpar']")?.addEventListener("click", () => {
      filtro.value = "";
      filtro.dispatchEvent(new Event("input", { bubbles: true }));
    });
  }

  root.querySelectorAll(".dialog-buttons button, button.dialog-button").forEach(btn => {
    btn.style.minHeight = "38px";
    btn.style.fontWeight = "bold";
    btn.style.fontSize = "1em";
    btn.style.borderRadius = "7px";
  });
}

Hooks.on("renderDialog", (app, html) => setTimeout(() => t20MelhorarDialogoUsoMagia(app, html), 20));
Hooks.on("renderApplication", (app, html) => setTimeout(() => t20MelhorarDialogoUsoMagia(app, html), 20));
Hooks.on("renderApplicationV2", (app, html) => setTimeout(() => t20MelhorarDialogoUsoMagia(app, html), 20));

function t20ObservarDialogosMagia() {
  if (window._arsenalT20DialogoMagiaObserver) return;

  const tentarAplicar = () => {
    if (!t20DialogoMagiaAtivo()) return;
    document.querySelectorAll(".window-app, .app").forEach(win => {
      try {
        if (win.dataset?.arsenalDialogoMagia === "1") return;
        if (!t20EhDialogoUsoMagia(null, win)) return;
        t20MelhorarDialogoUsoMagia(null, win);
      } catch (e) {
        console.warn("Arsenal T20 | erro no observador de diálogo de magia", e);
      }
    });
  };

  window._arsenalT20DialogoMagiaObserver = new MutationObserver(() => {
    clearTimeout(window._arsenalT20DialogoMagiaObserverTimer);
    window._arsenalT20DialogoMagiaObserverTimer = setTimeout(tentarAplicar, 60);
  });

  window._arsenalT20DialogoMagiaObserver.observe(document.body, { childList: true, subtree: true });
  setInterval(tentarAplicar, 1500);
}

Hooks.once("ready", () => setTimeout(t20ObservarDialogosMagia, 1000));


// ── Card de controle de PM ───────────────────────────────────

function t20ExtrairCustoPM(itemData = {}, message = null) {
  const numeroPM = (valor) => {
    const m = String(valor ?? "").match(/\b(\d+)\s*(?:PM)?\b/i);
    return m ? parseInt(m[1]) || 0 : 0;
  };

  const bruto =
    itemData?.pm ??
    itemData?.custo ??
    itemData?.custoPM ??
    itemData?.system?.pm ??
    itemData?.system?.custo ??
    itemData?.system?.custoPM ??
    itemData?.activation?.cost ??
    itemData?.system?.activation?.cost ??
    null;

  const custoEstruturado = numeroPM(bruto);

  // O card renderizado pelo sistema T20 já mostra o custo FINAL da magia,
  // incluindo aprimoramentos selecionados. Ex.: Adaga Mental com +2 PM aparece como "3 PM".
  // Portanto, quando esse valor existe, ele deve ser usado como total final,
  // sem somar novamente os textos de aprimoramento da descrição.
  const textoCard = t20TextoLimpoLocal(message?.content ?? "");
  const custoCardMatch = textoCard.match(/\b(\d+)\s*PM\b/i);
  const custoCard = custoCardMatch ? parseInt(custoCardMatch[1]) || 0 : 0;

  const totalFinal = custoCard || custoEstruturado;

  // Mantemos uma tentativa de identificar extras apenas para exibição quando ela não
  // causará dupla contagem. Os textos "+2 PM" na descrição são opções da magia,
  // não necessariamente custos adicionais a somar ao card.
  let extraSelecionado = 0;
  const onUseEffects = message?.flags?.tormenta20?.onUseEffects ?? [];
  for (const efeito of onUseEffects) {
    const textoEf = `${efeito?.label ?? efeito?.name ?? ""} ${efeito?.description ?? ""}`;
    const m = textoEf.match(/[+]\s*(\d+)\s*PM/i);
    if (m) extraSelecionado += (parseInt(m[1]) || 0) * (parseInt(efeito?.qty) || 1);
  }

  // Se o sistema já informou o total final, não somamos extra.
  // Apenas estimamos o custo base para fins visuais quando possível.
  const baseEstimado = totalFinal && extraSelecionado && totalFinal > extraSelecionado
    ? totalFinal - extraSelecionado
    : totalFinal;

  return {
    base: baseEstimado,
    extra: extraSelecionado && totalFinal > extraSelecionado ? extraSelecionado : 0,
    total: totalFinal,
    fonte: custoCard ? "card" : custoEstruturado ? "sistema" : "indefinido",
  };
}


function t20WhisperGMAndActorOwners(actor) {
  const users = game.users?.filter(u => {
    if (u.isGM) return true;
    try { return actor?.testUserPermission?.(u, "OWNER"); }
    catch { return false; }
  }) ?? [];

  return users.length ? users : ChatMessage.getWhisperRecipients("GM");
}


function t20ExtrairNomeItemDeMensagem(itemData = {}, message = null) {
  // Em algumas mensagens do sistema T20 o itemData vem genérico como "Magia".
  const nomeEstruturado = itemData?.name ?? itemData?.nome ?? "";
  if (nomeEstruturado && !/^magia$/i.test(String(nomeEstruturado).trim())) {
    return String(nomeEstruturado).trim();
  }

  const html = message?.content ?? "";

  // 1. Títulos/atributos comuns no card.
  const title =
    html.match(/title="([^"]+)"/i)?.[1] ??
    html.match(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/i)?.[1];

  if (title) {
    const limpo = t20TextoLimpoLocal(title);
    if (limpo && !/^magia$/i.test(limpo)) return limpo;
  }

  // 2. Pelo texto renderizado: geralmente vem "Nome da Magia Arcana/Divina/Universal..."
  const limpo = t20TextoLimpoLocal(html);

  const antesDoTipo = limpo.match(/([A-ZÁÉÍÓÚÂÊÔÃÕÇ][\wÀ-ÿ'’\- ]{2,70})\s+(?:Universal|Arcana|Divina)\b/i)?.[1]?.trim();
  if (antesDoTipo && !/^magia$/i.test(antesDoTipo)) return antesDoTipo;

  // 3. Se houver "Controle de PM — ..." em cards já gerados.
  const controle = limpo.match(/Controle de PM\s*[—-]\s*([^|]+?)(?:\s+por\s+|$)/i)?.[1]?.trim();
  if (controle && !/^magia$/i.test(controle)) return controle;

  return nomeEstruturado || "Magia";
}

function t20HtmlCardPM({ actor, nomeItem, custo, sustentavel = false, imgItem = "", pmJaAplicado = false }) {
  const botaoGasto = pmJaAplicado
    ? `<button disabled style="flex:1;padding:7px;border-radius:6px;background:#374151;border:1px solid #64748b;color:#cbd5e1;font-weight:bold;opacity:0.75">PM já gasto</button>`
    : `<button class="t20-pm-aplicar" data-actor="${actor.uuid}" data-pm="${custo.total}" style="flex:1;padding:7px;border-radius:6px;background:#5b45a0;border:1px solid #7c65c7;color:white;font-weight:bold;cursor:pointer">Gastar PM</button>`;

  const botaoSustentar = sustentavel
    ? `<button class="t20-pm-sustentar"
          data-actor="${actor.uuid}"
          data-nome="${nomeItem}"
          data-img="${imgItem ?? ""}"
          style="flex:1;padding:7px;border-radius:6px;background:#2f7d4f;border:1px solid #4ade80;color:white;font-weight:bold;cursor:pointer">
          🪄 Sustentar
       </button>`
    : "";

  return `<div class="t20-pm-card" style="background:linear-gradient(180deg,#1f1a2e,#15111f);border:1px solid #51416f;border-top:3px solid #a78bfa;border-radius:8px;padding:12px;color:#e9ddff;font-family:serif">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;border-bottom:1px solid rgba(167,139,250,0.25);padding-bottom:8px;margin-bottom:8px">
      <div>
        <div style="color:#c4b5fd;font-weight:bold">🔷 Controle de PM — ${nomeItem}</div>
        <div style="font-size:0.82em;color:#b9a7d9">por ${actor.name}</div>
      </div>
      <div style="text-align:center;background:rgba(0,0,0,0.22);padding:5px 10px;border-radius:6px">
        <div style="font-size:0.68em;color:#b9a7d9">Custo</div>
        <b style="font-size:1.25em;color:#fcd34d">${custo.total}</b>
      </div>
    </div>
    <div style="font-size:0.88em;margin-bottom:10px;color:#ddd6fe">
      ${custo.extra ? `Custo base estimado: <b>${custo.base}</b> PM<br>Aprimoramentos detectados: <b>+${custo.extra}</b> PM<br>` : `Custo detectado: <b>${custo.total}</b> PM<br>`}
      Custo total: <b>${custo.total}</b> PM
      ${sustentavel ? `<br><span style="color:#86efac">Duração sustentada detectada. O jogador pode ativar a sustentação manualmente.</span>` : ""}
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${botaoGasto}
      <button class="t20-pm-reverter" data-actor="${actor.uuid}" data-pm="${custo.total}" style="flex:1;padding:7px;border-radius:6px;background:#334155;border:1px solid #64748b;color:white;font-weight:bold;cursor:pointer">Reverter gasto</button>
      ${botaoSustentar}
    </div>
  </div>`;
}

async function t20CriarCardPM(message) {
  const modo = t20PMModoControle();
  if (modo === "off") return;
  if (message.flags?.["arsenal-t20"]?.tipo === "pm") return;

  const itemData = message.flags?.tormenta20?.itemData;
  if (!itemData) return;

  const actor = game.actors.get(message.speaker?.actor);
  if (!actor) return;

  const nomeItem = t20ExtrairNomeItemDeMensagem(itemData, message);
  const imgItem = itemData.img ?? message.content?.match(/img[^>]+src="([^"]+)"/)?.[1] ?? "";
  const custo = t20ExtrairCustoPM(itemData, message);
  if (!custo.total) return;

  const sustentavel = t20ItemEhSustentado(itemData, message);
  const whisper = t20WhisperGMAndActorOwners(actor);

  if (modo === "auto") {
    await t20AplicarPMDireto(actor, custo.total);
    await ChatMessage.create({
      content: t20HtmlCardPM({ actor, nomeItem, custo, sustentavel, imgItem, pmJaAplicado: true }),
      speaker: message.speaker,
      whisper,
      flags: { "arsenal-t20": { tipo: "pm", origem: message.id, auto: true } }
    });
    return;
  }

  // manual
  await ChatMessage.create({
    content: t20HtmlCardPM({ actor, nomeItem, custo, sustentavel, imgItem, pmJaAplicado: false }),
    speaker: message.speaker,
    whisper,
    flags: { "arsenal-t20": { tipo: "pm", origem: message.id } }
  });
}

async function t20AplicarPMBotao(btn) {
  const actor = await fromUuid(btn.dataset.actor);
  const pm = parseInt(btn.dataset.pm) || 0;
  if (!actor || !pm) return;
  await t20AplicarPMDireto(actor, pm);
  btn.disabled = true;
  btn.style.opacity = "0.55";
  ui.notifications.info(`${actor.name}: ${pm} PM gastos.`);
}

async function t20ReverterPMBotao(btn) {
  const actor = await fromUuid(btn.dataset.actor);
  const pm = parseInt(btn.dataset.pm) || 0;
  if (!actor || !pm) return;
  await t20ReverterPMDireto(actor, pm);
  ui.notifications.info(`${actor.name}: ${pm} PM revertidos.`);
}

async function t20AtivarSustentacaoBotao(btn) {
  const actor = await fromUuid(btn.dataset.actor);
  if (!actor) return ui.notifications.warn("Ator não encontrado para ativar sustentação.");
  if (!game.user.isGM && !actor.isOwner) {
    return ui.notifications.warn("Você não tem permissão para ativar sustentação neste ator.");
  }

  const nomeItem = btn.dataset.nome ?? "Magia sustentada";
  const imgItem = btn.dataset.img ?? "";

  const itemData = {
    name: nomeItem,
    img: imgItem,
    duration: "Sustentada",
    description: { value: "Duração: Sustentada" },
  };

  const fakeMessage = {
    content: `Duração: Sustentada ${nomeItem}`,
    id: obterChatMessageDoBotao(btn)?.id ?? null,
  };

  await t20RegistrarSustentada(actor, itemData, fakeMessage, {
    force: true,
    solicitante: game.user.name,
  });

  btn.disabled = true;
  btn.style.opacity = "0.55";
  btn.textContent = "🪄 Sustentação ativa";
}


Hooks.on("createChatMessage", async (message, options, userId) => {
  if (t20PMModoControle() === "off") return;
  if (userId !== game.userId) return;
  await t20CriarCardPM(message);
});


// ============================================================
// CURA ACELERADA
// ============================================================
