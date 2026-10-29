// ==UserScript==
// @name         HaxBall Client - Giro da Bola
// @namespace    haxball-client
// @version      1.0
// @description  Seta direita/esquerda: gruda e gira a bola (precisa da sala com o script)
// @match        https://www.haxball.com/play*
// @match        https://www.haxball.com/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://raw.githubusercontent.com/viniciusalexandrecantalice-code/Haxball---client/main/haxball-client.user.js
// @downloadURL  https://raw.githubusercontent.com/viniciusalexandrecantalice-code/Haxball---client/main/haxball-client.user.js
// ==/UserScript==

(function () {
  'use strict';

  let teclaAtual = null; // "ArrowRight" | "ArrowLeft" | null

  function getGameDoc() {
    const frame = document.querySelector('iframe.gameframe') || document.querySelector('iframe');
    try { return frame ? frame.contentDocument : null; } catch (e) { return null; }
  }

  function enviarComando(texto) {
    const doc = getGameDoc();
    if (!doc) return;
    const input = doc.querySelector('[data-hook="input"]');
    if (!input) return;

    const anterior = input.value;
    input.focus();
    input.value = texto;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    ['keydown', 'keyup'].forEach(tipo => {
      input.dispatchEvent(new KeyboardEvent(tipo, {
        key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
      }));
    });
    input.value = anterior;
    input.blur(); // devolve o controle das teclas ao jogo
  }

  function onKeyDown(e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    if (e.repeat || teclaAtual === e.key) return; // só no primeiro toque
    teclaAtual = e.key;
    enviarComando(e.key === 'ArrowRight' ? '!grudar d' : '!grudar e');
  }

  function onKeyUp(e) {
    if (e.key !== teclaAtual) return;
    teclaAtual = null;
    enviarComando('!soltar');
  }

  // escuta na página e dentro do iframe do jogo
  function ligar() {
    const doc = getGameDoc();
    [document, doc].forEach(d => {
      if (!d || d.__giroBola) return;
      d.__giroBola = true;
      d.addEventListener('keydown', onKeyDown, true);
      d.addEventListener('keyup', onKeyUp, true);
    });
  }

  setInterval(ligar, 1000);
})();
