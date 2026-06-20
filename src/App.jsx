import { useState, useEffect, useRef, useCallback } from "react";

// ── THEME TOKENS ──────────────────────────────────────────────────────────────
const G = {
  gold: "#e8b84f",
  goldDim: "#c99a30",
  goldGlow: "rgba(232,184,79,0.18)",
  dark: "#080910",
  card: "#0f1117",
  cardBorder: "#1a1d28",
  surface: "#13161f",
  text: "#f0ede4",
  muted: "#6b6f82",
  red: "#e84f4f",
  green: "#4fe87a",
  blue: "#4f9ee8",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Orbitron:wght@700;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: ${G.dark}; color: ${G.text}; font-family: 'Inter', sans-serif; overflow: hidden; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${G.cardBorder}; border-radius: 2px; }
  input, button { font-family: inherit; }
  button { cursor: pointer; border: none; background: none; }
  
  .app { display: flex; flex-direction: column; height: 100vh; max-width: 430px; margin: 0 auto; position: relative; }
  
  /* Header */
  .header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px 10px; background: ${G.card}; border-bottom: 1px solid ${G.cardBorder}; flex-shrink: 0; }
  .logo { font-family: 'Orbitron', sans-serif; font-size: 18px; font-weight: 900; color: ${G.gold}; letter-spacing: 1px; text-shadow: 0 0 20px ${G.goldGlow}; }
  .logo span { color: ${G.text}; font-size: 11px; font-family: 'Inter', sans-serif; font-weight: 500; display: block; letter-spacing: 2px; opacity: 0.6; margin-top: -2px; }
  .bal-pill { background: ${G.surface}; border: 1px solid ${G.cardBorder}; border-radius: 20px; padding: 6px 12px; display: flex; align-items: center; gap: 6px; }
  .bal-pill .label { font-size: 10px; color: ${G.muted}; font-weight: 600; letter-spacing: 1px; }
  .bal-pill .amount { font-size: 14px; font-weight: 700; color: ${G.gold}; }
  
  /* Nav */
  .nav { display: flex; background: ${G.card}; border-top: 1px solid ${G.cardBorder}; flex-shrink: 0; }
  .nav-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 4px 10px; font-size: 9px; font-weight: 600; letter-spacing: 0.5px; color: ${G.muted}; transition: color .2s; }
  .nav-btn.active { color: ${G.gold}; }
  .nav-btn svg { width: 20px; height: 20px; }
  .nav-indicator { width: 20px; height: 2px; border-radius: 1px; background: transparent; margin-top: 2px; }
  .nav-btn.active .nav-indicator { background: ${G.gold}; }
  
  /* Page */
  .page { flex: 1; overflow-y: auto; overflow-x: hidden; }
  
  /* Cards & Sections */
  .section-title { font-size: 11px; font-weight: 700; letter-spacing: 1.5px; color: ${G.muted}; text-transform: uppercase; padding: 16px 16px 8px; }
  .card { background: ${G.card}; border: 1px solid ${G.cardBorder}; border-radius: 12px; margin: 0 12px 10px; }
  
  /* Hero Banner */
  .hero { margin: 12px; border-radius: 16px; background: linear-gradient(135deg, #1a1400 0%, #0f1117 40%, #1a1000 100%); border: 1px solid ${G.goldDim}; padding: 20px 16px; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: radial-gradient(circle, ${G.goldGlow} 0%, transparent 70%); pointer-events: none; }
  .hero-tag { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: ${G.goldDim}; text-transform: uppercase; margin-bottom: 6px; }
  .hero-title { font-size: 22px; font-weight: 800; color: ${G.text}; line-height: 1.2; margin-bottom: 4px; }
  .hero-title span { color: ${G.gold}; }
  .hero-sub { font-size: 12px; color: ${G.muted}; margin-bottom: 14px; }
  .hero-btn { display: inline-block; background: ${G.gold}; color: ${G.dark}; font-size: 12px; font-weight: 700; padding: 8px 18px; border-radius: 8px; letter-spacing: 0.5px; }
  
  /* Quick Games Grid */
  .games-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 0 12px 12px; }
  .game-tile { background: ${G.card}; border: 1px solid ${G.cardBorder}; border-radius: 12px; padding: 14px 8px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; transition: border-color .2s, transform .1s; }
  .game-tile:active { transform: scale(0.96); }
  .game-tile.active, .game-tile:hover { border-color: ${G.goldDim}; }
  .game-tile .icon { font-size: 26px; line-height: 1; }
  .game-tile .name { font-size: 11px; font-weight: 600; color: ${G.text}; text-align: center; }
  .game-tile .tag { font-size: 9px; color: ${G.muted}; }
  
  /* Aviator / Crash */
  .aviator-wrap { margin: 0 12px 12px; border-radius: 16px; background: #0a0c12; border: 1px solid ${G.cardBorder}; overflow: hidden; }
  .aviator-sky { position: relative; height: 220px; background: linear-gradient(180deg, #090b14 0%, #0d1020 100%); overflow: hidden; display: flex; align-items: flex-end; justify-content: flex-start; padding: 10px; }
  .aviator-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(232,184,79,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,184,79,0.04) 1px, transparent 1px); background-size: 30px 30px; }
  .crash-multiplier { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-family: 'Orbitron', sans-serif; font-size: 48px; font-weight: 900; color: ${G.gold}; text-shadow: 0 0 30px ${G.goldGlow}; transition: all .1s; z-index: 2; }
  .crash-multiplier.crashed { color: ${G.red}; text-shadow: 0 0 30px rgba(232,79,79,0.4); }
  .plane { position: absolute; font-size: 32px; transition: bottom .3s, left .3s; z-index: 3; filter: drop-shadow(0 0 8px ${G.gold}); }
  .trail { position: absolute; bottom: 0; left: 0; height: 2px; background: linear-gradient(90deg, transparent, ${G.gold}); border-radius: 2px; transition: width .3s; opacity: 0.6; }
  .aviator-controls { padding: 12px; display: flex; gap: 8px; align-items: center; }
  .avi-input { flex: 1; background: ${G.surface}; border: 1px solid ${G.cardBorder}; border-radius: 8px; padding: 10px 12px; color: ${G.text}; font-size: 14px; font-weight: 600; text-align: center; }
  .avi-input:focus { outline: none; border-color: ${G.goldDim}; }
  .avi-btn { padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; transition: all .2s; }
  .avi-btn.bet { background: ${G.gold}; color: ${G.dark}; }
  .avi-btn.cashout { background: ${G.green}; color: ${G.dark}; }
  .avi-btn.disabled { background: ${G.surface}; color: ${G.muted}; cursor: not-allowed; }
  .avi-stats { display: flex; gap: 8px; padding: 0 12px 12px; }
  .avi-stat { flex: 1; background: ${G.surface}; border-radius: 8px; padding: 8px; text-align: center; }
  .avi-stat .val { font-size: 13px; font-weight: 700; color: ${G.gold}; }
  .avi-stat .lbl { font-size: 10px; color: ${G.muted}; margin-top: 2px; }
  .history-pills { display: flex; gap: 4px; padding: 0 12px 10px; overflow-x: auto; }
  .history-pill { flex-shrink: 0; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; font-family: 'Orbitron', sans-serif; }
  .history-pill.win { background: rgba(79,232,122,0.15); color: ${G.green}; }
  .history-pill.lose { background: rgba(232,79,79,0.15); color: ${G.red}; }
  
  /* Slots */
  .slots-wrap { margin: 0 12px 12px; background: ${G.card}; border: 1px solid ${G.cardBorder}; border-radius: 16px; padding: 16px; }
  .slots-reels { display: flex; gap: 8px; justify-content: center; margin-bottom: 14px; }
  .reel { width: 70px; height: 80px; background: ${G.surface}; border: 1px solid ${G.cardBorder}; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 40px; overflow: hidden; position: relative; }
  .reel.spinning { animation: spinReel .15s steps(1) infinite; }
  @keyframes spinReel { 0%{transform:translateY(0)} 33%{transform:translateY(-4px)} 66%{transform:translateY(4px)} 100%{transform:translateY(0)} }
  .slots-row { display: flex; gap: 8px; align-items: center; }
  .slots-result { flex: 1; text-align: center; font-size: 12px; font-weight: 600; min-height: 20px; }
  .slots-result.win { color: ${G.green}; } .slots-result.lose { color: ${G.red}; }
  
  /* Dice */
  .dice-wrap { margin: 0 12px 12px; background: ${G.card}; border: 1px solid ${G.cardBorder}; border-radius: 16px; padding: 16px; }
  .dice-display { display: flex; justify-content: center; gap: 16px; margin-bottom: 14px; }
  .die { width: 64px; height: 64px; background: ${G.surface}; border: 2px solid ${G.cardBorder}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 36px; transition: transform .3s; }
  .die.rolling { animation: rollDie .5s ease-out; }
  @keyframes rollDie { 0%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(180deg) scale(1.15)} 100%{transform:rotate(360deg) scale(1)} }
  .dice-total { text-align: center; font-family: 'Orbitron', sans-serif; font-size: 28px; font-weight: 700; color: ${G.gold}; margin-bottom: 4px; }
  .dice-target { text-align: center; font-size: 11px; color: ${G.muted}; margin-bottom: 12px; }
  .dice-options { display: flex; gap: 6px; margin-bottom: 12px; }
  .dice-opt { flex: 1; padding: 8px 4px; border-radius: 8px; border: 1px solid ${G.cardBorder}; background: ${G.surface}; color: ${G.muted}; font-size: 11px; font-weight: 600; text-align: center; transition: all .2s; }
  .dice-opt.selected { border-color: ${G.gold}; color: ${G.gold}; background: ${G.goldGlow}; }
  
  /* Cards / Blackjack */
  .cards-wrap { margin: 0 12px 12px; background: #0a1a0a; border: 1px solid #1a3a1a; border-radius: 16px; padding: 16px; }
  .cards-area { min-height: 80px; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; }
  .playing-card { width: 46px; height: 64px; background: #fff; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; color: #111; border: 1px solid #ddd; box-shadow: 0 2px 8px rgba(0,0,0,0.4); transition: transform .3s; flex-shrink: 0; }
  .playing-card.red { color: #c0392b; }
  .playing-card.face-down { background: linear-gradient(135deg, #1a3a8f, #0d1f4f); }
  .card-area-label { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: ${G.muted}; margin-bottom: 6px; text-transform: uppercase; }
  .card-score { font-size: 13px; font-weight: 700; color: ${G.gold}; margin-left: 8px; }
  .card-actions { display: flex; gap: 6px; margin-top: 10px; }
  .card-btn { flex: 1; padding: 9px; border-radius: 8px; font-size: 12px; font-weight: 700; }
  .card-btn.hit { background: ${G.blue}; color: #fff; }
  .card-btn.stand { background: ${G.goldDim}; color: ${G.dark}; }
  .card-btn.deal { background: ${G.gold}; color: ${G.dark}; }
  .card-btn.disabled { background: ${G.surface}; color: ${G.muted}; cursor: not-allowed; }
  .cards-status { text-align: center; font-size: 13px; font-weight: 600; min-height: 20px; padding: 4px 0; }
  .cards-status.win { color: ${G.green}; } .cards-status.lose { color: ${G.red}; } .cards-status.push { color: ${G.gold}; }
  
  /* Virtual Football */
  .vf-wrap { margin: 0 12px 12px; background: #06120a; border: 1px solid #0f2a14; border-radius: 16px; padding: 16px; }
  .pitch { background: linear-gradient(180deg, #0a1f0e 0%, #06140a 100%); border: 2px solid #1a3a1e; border-radius: 12px; height: 130px; position: relative; overflow: hidden; margin-bottom: 12px; }
  .pitch-lines { position: absolute; inset: 0; }
  .pitch-center { position: absolute; top: 50%; left: 50%; width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.15); border-radius: 50%; transform: translate(-50%, -50%); }
  .pitch-mid { position: absolute; top: 0; bottom: 0; left: 50%; width: 1px; background: rgba(255,255,255,0.1); }
  .pitch-goal-l, .pitch-goal-r { position: absolute; top: 35%; height: 30%; width: 12%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); }
  .pitch-goal-l { left: 0; border-left: none; border-radius: 0 4px 4px 0; }
  .pitch-goal-r { right: 0; border-right: none; border-radius: 4px 0 0 4px; }
  .ball { position: absolute; font-size: 18px; transition: all .6s cubic-bezier(.4,0,.2,1); }
  .vf-score { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 12px; }
  .vf-team { text-align: center; }
  .vf-team .name { font-size: 11px; color: ${G.muted}; font-weight: 600; }
  .vf-team .score { font-family: 'Orbitron', sans-serif; font-size: 28px; font-weight: 900; color: ${G.text}; }
  .vf-vs { font-size: 11px; color: ${G.muted}; }
  .vf-bets { display: flex; gap: 6px; margin-bottom: 10px; }
  .vf-bet-btn { flex: 1; padding: 9px 4px; border-radius: 8px; border: 1px solid ${G.cardBorder}; background: ${G.surface}; color: ${G.text}; font-size: 11px; font-weight: 600; text-align: center; transition: all .2s; }
  .vf-bet-btn.selected { border-color: ${G.gold}; color: ${G.gold}; background: ${G.goldGlow}; }
  .vf-bet-btn .odds { font-family: 'Orbitron', sans-serif; font-size: 13px; color: ${G.gold}; display: block; }
  
  /* Penalty Shootout */
  .penalty-wrap { margin: 0 12px 12px; background: #030d06; border: 1px solid #0f2a14; border-radius: 16px; padding: 16px; }
  .goal-net { background: linear-gradient(180deg, #0f1a10, #060d07); border: 2px solid #2a4a2e; border-radius: 10px; height: 120px; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(2, 1fr); gap: 2px; padding: 8px; margin-bottom: 12px; position: relative; overflow: hidden; }
  .goal-net::before { content: ''; position: absolute; inset: 0; background-image: repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 30%), repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 30%); }
  .goal-zone { border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 1px solid transparent; transition: all .2s; position: relative; z-index: 1; }
  .goal-zone:hover, .goal-zone.hovered { background: rgba(232,184,79,0.12); border-color: ${G.goldDim}; }
  .goal-zone.scored { background: rgba(79,232,122,0.2); border-color: ${G.green}; }
  .goal-zone.saved { background: rgba(232,79,79,0.2); border-color: ${G.red}; }
  .penalty-status { text-align: center; font-size: 13px; min-height: 24px; font-weight: 600; }
  .penalty-score { display: flex; justify-content: center; gap: 8px; margin-bottom: 8px; font-size: 11px; color: ${G.muted}; }
  .penalty-score span { color: ${G.gold}; font-weight: 700; }
  
  /* Sports */
  .sports-tabs { display: flex; gap: 4px; padding: 12px 12px 0; overflow-x: auto; }
  .sport-tab { flex-shrink: 0; padding: 7px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; border: 1px solid ${G.cardBorder}; color: ${G.muted}; background: ${G.surface}; transition: all .2s; }
  .sport-tab.active { background: ${G.gold}; color: ${G.dark}; border-color: ${G.gold}; }
  .match-card { background: ${G.card}; border: 1px solid ${G.cardBorder}; border-radius: 12px; margin: 8px 12px; padding: 12px; }
  .match-league { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: ${G.goldDim}; text-transform: uppercase; margin-bottom: 8px; }
  .match-teams { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .team-name { font-size: 13px; font-weight: 600; color: ${G.text}; flex: 1; }
  .team-name.away { text-align: right; }
  .match-time { font-size: 11px; color: ${G.muted}; text-align: center; padding: 0 8px; flex-shrink: 0; }
  .match-odds { display: flex; gap: 6px; }
  .odd-btn { flex: 1; padding: 8px 4px; background: ${G.surface}; border: 1px solid ${G.cardBorder}; border-radius: 8px; text-align: center; cursor: pointer; transition: all .2s; }
  .odd-btn.selected { border-color: ${G.gold}; background: ${G.goldGlow}; }
  .odd-btn .odd-label { font-size: 9px; color: ${G.muted}; font-weight: 600; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
  .odd-btn .odd-val { font-size: 14px; font-weight: 700; color: ${G.gold}; font-family: 'Orbitron', sans-serif; }
  .live-badge { display: inline-block; padding: 2px 6px; background: rgba(232,79,79,0.2); border: 1px solid ${G.red}; border-radius: 4px; font-size: 9px; font-weight: 700; color: ${G.red}; letter-spacing: 1px; margin-bottom: 6px; }
  .loading-pulse { text-align: center; padding: 40px 20px; color: ${G.muted}; font-size: 13px; }
  .loading-pulse::after { content: ''; display: block; width: 40px; height: 2px; background: ${G.goldDim}; margin: 12px auto 0; border-radius: 1px; animation: pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:.3;transform:scaleX(.5)} 50%{opacity:1;transform:scaleX(1)} }
  
  /* Betslip */
  .betslip-fab { position: fixed; bottom: 70px; right: 16px; background: ${G.gold}; color: ${G.dark}; border-radius: 50%; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 4px 20px rgba(232,184,79,0.4); z-index: 100; cursor: pointer; transition: transform .2s; }
  .betslip-fab:active { transform: scale(0.9); }
  .betslip-fab .bs-count { position: absolute; top: -4px; right: -4px; background: ${G.red}; color: #fff; width: 18px; height: 18px; border-radius: 50%; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: 2px solid ${G.dark}; }
  .betslip-drawer { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: ${G.card}; border-top: 1px solid ${G.cardBorder}; border-radius: 20px 20px 0 0; z-index: 200; padding: 16px; transition: transform .3s cubic-bezier(.4,0,.2,1); max-height: 80vh; overflow-y: auto; }
  .betslip-drawer.hidden { transform: translateX(-50%) translateY(100%); }
  .bs-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .bs-title { font-size: 15px; font-weight: 700; color: ${G.text}; }
  .bs-close { color: ${G.muted}; font-size: 20px; }
  .bs-item { background: ${G.surface}; border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; }
  .bs-item-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
  .bs-match { font-size: 12px; font-weight: 600; color: ${G.text}; }
  .bs-remove { color: ${G.red}; font-size: 16px; line-height: 1; }
  .bs-pick { font-size: 11px; color: ${G.muted}; }
  .bs-odd { font-size: 13px; font-weight: 700; color: ${G.gold}; font-family: 'Orbitron', sans-serif; }
  .bs-stake-row { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
  .bs-stake-input { flex: 1; background: ${G.surface}; border: 1px solid ${G.cardBorder}; border-radius: 8px; padding: 10px 12px; color: ${G.text}; font-size: 15px; font-weight: 700; }
  .bs-stake-input:focus { outline: none; border-color: ${G.goldDim}; }
  .bs-summary { display: flex; justify-content: space-between; align-items: center; margin: 10px 0 12px; }
  .bs-summary-label { font-size: 12px; color: ${G.muted}; }
  .bs-summary-val { font-size: 14px; font-weight: 700; color: ${G.gold}; }
  .bs-place { width: 100%; padding: 13px; border-radius: 10px; background: ${G.gold}; color: ${G.dark}; font-size: 15px; font-weight: 800; letter-spacing: 0.5px; }
  .bs-place:disabled { background: ${G.surface}; color: ${G.muted}; cursor: not-allowed; }
  
  /* Deposit */
  .deposit-method { background: ${G.card}; border: 1px solid ${G.cardBorder}; border-radius: 12px; margin: 8px 12px; padding: 14px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: border-color .2s; }
  .deposit-method.selected { border-color: ${G.gold}; }
  .method-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; background: ${G.surface}; flex-shrink: 0; }
  .method-info .name { font-size: 13px; font-weight: 700; color: ${G.text}; }
  .method-info .detail { font-size: 11px; color: ${G.muted}; margin-top: 2px; }
  .amount-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 0 12px 12px; }
  .amt-btn { padding: 10px; border-radius: 10px; border: 1px solid ${G.cardBorder}; background: ${G.surface}; color: ${G.text}; font-size: 13px; font-weight: 700; text-align: center; transition: all .2s; }
  .amt-btn.selected { border-color: ${G.gold}; color: ${G.gold}; background: ${G.goldGlow}; }
  .deposit-info-box { margin: 0 12px 12px; background: ${G.goldGlow}; border: 1px solid ${G.goldDim}; border-radius: 12px; padding: 14px; }
  .deposit-info-box .title { font-size: 12px; font-weight: 700; color: ${G.gold}; margin-bottom: 8px; }
  .deposit-step { display: flex; gap: 8px; margin-bottom: 8px; }
  .deposit-step-num { width: 20px; height: 20px; border-radius: 50%; background: ${G.gold}; color: ${G.dark}; font-size: 10px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .deposit-step-text { font-size: 12px; color: ${G.text}; line-height: 1.5; }
  .deposit-step-text strong { color: ${G.gold}; }
  .submit-btn { display: block; width: calc(100% - 24px); margin: 0 12px 12px; padding: 14px; border-radius: 12px; background: ${G.gold}; color: ${G.dark}; font-size: 15px; font-weight: 800; text-align: center; letter-spacing: 0.5px; cursor: pointer; }
  
  /* Account */
  .avatar-row { display: flex; align-items: center; gap: 14px; margin: 12px; padding: 16px; background: ${G.card}; border: 1px solid ${G.cardBorder}; border-radius: 16px; }
  .avatar { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, ${G.goldDim}, ${G.gold}); display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
  .user-name { font-size: 16px; font-weight: 700; color: ${G.text}; }
  .user-phone { font-size: 12px; color: ${G.muted}; margin-top: 2px; }
  .user-id { font-size: 10px; color: ${G.goldDim}; margin-top: 2px; }
  .stat-row { display: flex; gap: 8px; padding: 0 12px 12px; }
  .stat-card { flex: 1; background: ${G.card}; border: 1px solid ${G.cardBorder}; border-radius: 12px; padding: 12px; text-align: center; }
  .stat-card .val { font-size: 16px; font-weight: 800; color: ${G.gold}; font-family: 'Orbitron', sans-serif; }
  .stat-card .lbl { font-size: 10px; color: ${G.muted}; margin-top: 3px; font-weight: 600; letter-spacing: 0.5px; }
  .menu-item { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid ${G.cardBorder}; }
  .menu-item:last-child { border-bottom: none; }
  .menu-left { display: flex; align-items: center; gap: 10px; }
  .menu-icon { width: 32px; height: 32px; border-radius: 8px; background: ${G.surface}; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .menu-label { font-size: 13px; font-weight: 600; color: ${G.text}; }
  .menu-chevron { color: ${G.muted}; font-size: 16px; }
  
  /* Login */
  .login-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 32px 24px; }
  .login-logo { font-family: 'Orbitron', sans-serif; font-size: 32px; font-weight: 900; color: ${G.gold}; text-shadow: 0 0 30px ${G.goldGlow}; text-align: center; margin-bottom: 6px; }
  .login-sub { font-size: 12px; color: ${G.muted}; letter-spacing: 2px; text-align: center; margin-bottom: 32px; }
  .login-card { width: 100%; background: ${G.card}; border: 1px solid ${G.cardBorder}; border-radius: 20px; padding: 24px; }
  .login-title { font-size: 18px; font-weight: 700; color: ${G.text}; margin-bottom: 6px; }
  .login-desc { font-size: 12px; color: ${G.muted}; margin-bottom: 20px; line-height: 1.5; }
  .login-btn { width: 100%; padding: 14px; border-radius: 12px; background: ${G.gold}; color: ${G.dark}; font-size: 15px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px; }
  .login-note { font-size: 11px; color: ${G.muted}; text-align: center; line-height: 1.5; }
  .login-demo { font-size: 12px; color: ${G.goldDim}; text-align: center; margin-top: 12px; cursor: pointer; text-decoration: underline; }
  
  /* Toast */
  .toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: ${G.card}; border: 1px solid ${G.cardBorder}; border-radius: 10px; padding: 10px 16px; font-size: 13px; font-weight: 600; z-index: 9999; white-space: nowrap; transition: opacity .3s; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
  .toast.win { border-color: ${G.green}; color: ${G.green}; }
  .toast.lose { border-color: ${G.red}; color: ${G.red}; }
  .toast.info { border-color: ${G.goldDim}; color: ${G.gold}; }
  
  /* Overlay */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 150; backdrop-filter: blur(2px); }
  
  /* Bet history */
  .bet-hist-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid ${G.cardBorder}; }
  .bet-hist-item:last-child { border-bottom: none; }
  .bet-hist-left .game { font-size: 13px; font-weight: 600; color: ${G.text}; }
  .bet-hist-left .date { font-size: 10px; color: ${G.muted}; margin-top: 2px; }
  .bet-hist-right { text-align: right; }
  .bet-hist-right .amt { font-size: 13px; font-weight: 700; }
  .bet-hist-right .amt.win { color: ${G.green}; }
  .bet-hist-right .amt.lose { color: ${G.red}; }
  .bet-hist-right .stake { font-size: 10px; color: ${G.muted}; }
  
  /* Input */
  .input-label { font-size: 11px; font-weight: 700; letter-spacing: 0.5px; color: ${G.muted}; margin-bottom: 6px; }
  .input-field { width: 100%; background: ${G.surface}; border: 1px solid ${G.cardBorder}; border-radius: 10px; padding: 11px 14px; color: ${G.text}; font-size: 14px; margin-bottom: 14px; }
  .input-field:focus { outline: none; border-color: ${G.goldDim}; }
  
  /* Shared bet btn */
  .bet-btn-row { display: flex; gap: 8px; align-items: center; padding: 0 12px 12px; }
  .bet-input { flex: 1; background: ${G.surface}; border: 1px solid ${G.cardBorder}; border-radius: 8px; padding: 9px 12px; color: ${G.text}; font-size: 14px; font-weight: 600; text-align: center; }
  .bet-input:focus { outline: none; border-color: ${G.goldDim}; }
  .place-bet-btn { padding: 9px 18px; border-radius: 8px; background: ${G.gold}; color: ${G.dark}; font-size: 13px; font-weight: 700; }
  .place-bet-btn:disabled { background: ${G.surface}; color: ${G.muted}; cursor: not-allowed; }
  
  /* Support btn */
  .support-btn { display: flex; align-items: center; gap: 8px; padding: 13px 16px; margin: 0 12px 12px; background: rgba(79,158,232,0.1); border: 1px solid rgba(79,158,232,0.3); border-radius: 12px; font-size: 13px; font-weight: 600; color: ${G.blue}; }
`;

// ── UTILITIES ─────────────────────────────────────────────────────────────────
const SLOT_SYMBOLS = ["🍒","🍋","🍊","🍇","⭐","7️⃣","💎","🔔"];
const DICE_FACES = ["⚀","⚁","⚂","⚃","⚄","⚅"];
const CARD_SUITS = ["♠","♥","♦","♣"];
const CARD_VALUES = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const cardColor = (s) => s === "♥" || s === "♦" ? "red" : "";
const cardVal = (v) => v === "A" ? 11 : ["J","Q","K"].includes(v) ? 10 : parseInt(v);
function handValue(hand) {
  let val = hand.reduce((a,c) => a + cardVal(c.value), 0);
  let aces = hand.filter(c => c.value === "A").length;
  while (val > 21 && aces-- > 0) val -= 10;
  return val;
}
function randCard() {
  return { value: CARD_VALUES[Math.floor(Math.random()*13)], suit: CARD_SUITS[Math.floor(Math.random()*4)] };
}
function shuffle(arr) { return [...arr].sort(()=>Math.random()-.5); }
function fmtEtb(n) { return `${n.toLocaleString()} ETB`; }
function fmtDate(ts) { return new Date(ts).toLocaleDateString("en-ET",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}); }

// ── FIREBASE MOCK (replace with real SDK in production) ───────────────────────
const FirebaseDB = {
  _store: {},
  getUser: (uid) => {
    const raw = localStorage.getItem(`mb_user_${uid}`);
    return raw ? JSON.parse(raw) : null;
  },
  saveUser: (uid, data) => {
    localStorage.setItem(`mb_user_${uid}`, JSON.stringify(data));
  },
  updateBalance: (uid, balance) => {
    const u = FirebaseDB.getUser(uid);
    if (u) { u.balance = balance; FirebaseDB.saveUser(uid, u); }
  },
  addBet: (uid, bet) => {
    const key = `mb_bets_${uid}`;
    const bets = JSON.parse(localStorage.getItem(key)||"[]");
    bets.unshift(bet);
    localStorage.setItem(key, JSON.stringify(bets.slice(0,50)));
  },
  getBets: (uid) => JSON.parse(localStorage.getItem(`mb_bets_${uid}`)||"[]"),
};

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function MelkamBet() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");
  const [betslip, setBetslip] = useState([]);
  const [bsOpen, setBsOpen] = useState(false);
  const [bsStake, setBsStake] = useState("100");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type="info") => {
    setToast({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  // Auto-login attempt via Telegram
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) {
        const uid = String(tgUser.id);
        let u = FirebaseDB.getUser(uid);
        if (!u) {
          u = { uid, name: tgUser.first_name || "Player", phone: null, balance: 500, joined: Date.now() };
          FirebaseDB.saveUser(uid, u);
        }
        setUser(u);
      }
    }
  }, []);

  const login = (phone, name) => {
    const uid = `demo_${Date.now()}`;
    const u = { uid, name: name || "Player", phone, balance: 500, joined: Date.now() };
    FirebaseDB.saveUser(uid, u);
    setUser(u);
    showToast("Welcome to Melkam Bet! 🎉");
  };

  const updateBalance = (delta) => {
    setUser(prev => {
      const nb = prev.balance + delta;
      FirebaseDB.updateBalance(prev.uid, nb);
      return { ...prev, balance: nb };
    });
  };

  const addToBetslip = (match, pick, odd) => {
    setBetslip(prev => {
      if (prev.find(b => b.matchId === match.id)) {
        return prev.map(b => b.matchId === match.id ? { ...b, pick, odd } : b);
      }
      if (prev.length >= 10) { showToast("Max 10 selections"); return prev; }
      return [...prev, { matchId: match.id, match: `${match.home} vs ${match.away}`, pick, odd, id: Date.now() }];
    });
    showToast(`${pick} added @ ${odd}`);
  };

  const removePick = (id) => setBetslip(p => p.filter(b => b.id !== id));

  const totalOdd = betslip.reduce((a, b) => a * b.odd, 1);
  const potWin = (parseFloat(bsStake) || 0) * totalOdd;
  const MIN_BET = 50;

  const placeBet = () => {
    const stake = parseFloat(bsStake);
    if (stake < MIN_BET) { showToast(`Min bet is ${MIN_BET} ETB`, "lose"); return; }
    if (stake > user.balance) { showToast("Insufficient balance", "lose"); return; }
    updateBalance(-stake);
    FirebaseDB.addBet(user.uid, { game: "Sports", pick: betslip.map(b=>b.pick).join(", "), stake, payout: potWin, won: null, date: Date.now() });
    showToast("Bet placed! Good luck 🤞", "info");
    setBetslip([]);
    setBsOpen(false);
  };

  if (!user) return <LoginPage onLogin={login} />;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <Header user={user} />
        <div className="page">
          {page === "home" && <HomePage setPage={setPage} user={user} updateBalance={updateBalance} addToBetslip={addToBetslip} showToast={showToast} />}
          {page === "sports" && <SportsPage addToBetslip={addToBetslip} betslip={betslip} showToast={showToast} />}
          {page === "casino" && <CasinoPage user={user} updateBalance={updateBalance} showToast={showToast} />}
          {page === "deposit" && <DepositPage user={user} updateBalance={updateBalance} showToast={showToast} />}
          {page === "account" && <AccountPage user={user} showToast={showToast} />}
        </div>
        <BottomNav page={page} setPage={setPage} />
      </div>

      {/* Betslip FAB */}
      {betslip.length > 0 && page === "sports" && (
        <div className="betslip-fab" onClick={() => setBsOpen(true)}>
          🎫
          <div className="bs-count">{betslip.length}</div>
        </div>
      )}

      {/* Betslip Drawer */}
      {bsOpen && <div className="overlay" onClick={() => setBsOpen(false)} />}
      <div className={`betslip-drawer ${bsOpen ? "" : "hidden"}`}>
        <div className="bs-header">
          <div className="bs-title">Bet Slip ({betslip.length})</div>
          <div className="bs-close" onClick={() => setBsOpen(false)}>✕</div>
        </div>
        {betslip.map(b => (
          <div key={b.id} className="bs-item">
            <div className="bs-item-top">
              <div>
                <div className="bs-match">{b.match}</div>
                <div className="bs-pick">{b.pick}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div className="bs-odd">{b.odd.toFixed(2)}</div>
                <div className="bs-remove" onClick={() => removePick(b.id)}>✕</div>
              </div>
            </div>
          </div>
        ))}
        <div className="bs-stake-row">
          <input className="bs-stake-input" type="number" placeholder="Stake (ETB)" value={bsStake} onChange={e => setBsStake(e.target.value)} />
        </div>
        <div className="bs-summary">
          <div>
            <div className="bs-summary-label">Total Odds</div>
            <div className="bs-summary-val">{totalOdd.toFixed(2)}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div className="bs-summary-label">Potential Win</div>
            <div className="bs-summary-val">{fmtEtb(Math.round(potWin))}</div>
          </div>
        </div>
        <button className="bs-place" disabled={betslip.length === 0 || (parseFloat(bsStake)||0) < MIN_BET} onClick={placeBet}>
          Place Bet — {fmtEtb(parseFloat(bsStake)||0)}
        </button>
        <div style={{height:8}} />
      </div>

      {/* Toast */}
      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const requestContact = () => {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.requestContact) {
      tg.requestContact(result => {
        if (result && result.contact) {
          onLogin(result.contact.phone_number, result.contact.first_name);
        }
      });
    } else {
      setLoading(false);
    }
  };

  const handleTelegramLogin = () => {
    setLoading(true);
    requestContact();
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <>
      <style>{css}</style>
      <div className="app" style={{justifyContent:"center"}}>
        <div className="login-wrap">
          <div className="login-logo">መልካም BET</div>
          <div className="login-sub">ETHIOPIA'S PREMIER BETTING</div>
          <div className="login-card">
            <div className="login-title">Create your account</div>
            <div className="login-desc">Login with your Telegram account — no password needed. We save your phone number securely.</div>
            <button className="login-btn" onClick={handleTelegramLogin} disabled={loading}>
              {loading ? "⏳ Waiting..." : "📱 Login with Telegram"}
            </button>
            <div className="login-note">By logging in you agree to our Terms of Service. Must be 18+ to bet. Gamble responsibly.</div>
            <div className="login-demo" onClick={() => onLogin("+251912345678", "Demo User")}>
              Try as Guest (Demo)
            </div>
          </div>
          <div style={{marginTop:16,display:"flex",gap:8,alignItems:"center"}}>
            <div style={{fontSize:11,color:G.muted}}>Need help?</div>
            <a href="https://t.me/melkambet_et" style={{fontSize:11,color:G.blue,fontWeight:600}}>@melkambet_et</a>
          </div>
        </div>
      </div>
    </>
  );
}

// ── HEADER ────────────────────────────────────────────────────────────────────
function Header({ user }) {
  return (
    <div className="header">
      <div className="logo">
        መልካም BET
        <span>ETHIOPIA</span>
      </div>
      <div className="bal-pill">
        <div className="label">BAL</div>
        <div className="amount">{(user.balance||0).toLocaleString()} ETB</div>
      </div>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id:"home", label:"Home", icon:"🏠" },
  { id:"sports", label:"Sports", icon:"⚽" },
  { id:"casino", label:"Casino", icon:"🎰" },
  { id:"deposit", label:"Deposit", icon:"💰" },
  { id:"account", label:"Account", icon:"👤" },
];
function BottomNav({ page, setPage }) {
  return (
    <div className="nav">
      {NAV_ITEMS.map(n => (
        <div key={n.id} className={`nav-btn ${page===n.id?"active":""}`} onClick={() => setPage(n.id)}>
          <span style={{fontSize:20}}>{n.icon}</span>
          <span>{n.label}</span>
          <div className="nav-indicator" />
        </div>
      ))}
    </div>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ setPage, user, updateBalance, addToBetslip, showToast }) {
  return (
    <div>
      <div className="hero">
        <div className="hero-tag">🔥 Welcome Back</div>
        <div className="hero-title">Your <span>Golden</span> Winning Streak Starts Here</div>
        <div className="hero-sub">Instant payouts • 50 ETB min • Telebirr / CBE</div>
        <div className="hero-btn" onClick={() => setPage("sports")}>Bet Now →</div>
      </div>

      <div className="section-title">Quick Play</div>
      <div className="games-grid">
        {[
          { icon:"✈️", name:"Aviator", tag:"Crash", page:"casino" },
          { icon:"🎰", name:"Slots", tag:"Instant", page:"casino" },
          { icon:"🎲", name:"Dice", tag:"Instant", page:"casino" },
          { icon:"🃏", name:"Blackjack", tag:"Cards", page:"casino" },
          { icon:"⚽", name:"Virtual", tag:"Football", page:"casino" },
          { icon:"🥅", name:"Penalty", tag:"Shootout", page:"casino" },
        ].map(g => (
          <div key={g.name} className="game-tile" onClick={() => setPage(g.page)}>
            <div className="icon">{g.icon}</div>
            <div className="name">{g.name}</div>
            <div className="tag">{g.tag}</div>
          </div>
        ))}
      </div>

      <div className="section-title">Live Now</div>
      <div className="card" style={{padding:"12px 14px",marginBottom:12}}>
        {[
          { home:"Man City", away:"Arsenal", t:"74'", score:"2-1" },
          { home:"PSG", away:"Bayern", t:"HT", score:"1-1" },
          { home:"Ethiopia", away:"Egypt", t:"31'", score:"0-0" },
        ].map((m,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom: i<2 ? `1px solid ${G.cardBorder}` : "none"}}>
            <div style={{flex:1,fontSize:12,fontWeight:600}}>{m.home}</div>
            <div style={{background:G.surface,borderRadius:6,padding:"4px 10px",textAlign:"center",minWidth:60}}>
              <div style={{fontSize:10,color:G.red,fontWeight:700}}>{m.t}</div>
              <div style={{fontSize:13,fontWeight:800,color:G.text}}>{m.score}</div>
            </div>
            <div style={{flex:1,fontSize:12,fontWeight:600,textAlign:"right"}}>{m.away}</div>
          </div>
        ))}
      </div>

      <div style={{height:16}} />
    </div>
  );
}

// ── SPORTS PAGE (The Odds API) ────────────────────────────────────────────────
const SPORTS = [
  { key:"soccer_epl", label:"EPL ⚽" },
  { key:"soccer_ethiopia_premier", label:"Ethiopia 🇪🇹" },
  { key:"basketball_nba", label:"NBA 🏀" },
  { key:"americanfootball_nfl", label:"NFL 🏈" },
  { key:"soccer_uefa_champs_league", label:"UCL ⭐" },
];
function SportsPage({ addToBetslip, betslip, showToast }) {
  const [sport, setSport] = useState(SPORTS[0].key);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({});

  useEffect(() => { fetchOdds(sport); }, [sport]);

  const fetchOdds = async (sportKey) => {
    setLoading(true);
    setMatches([]);
    try {
      // Using The Odds API free tier — user must add their own API key
      const API_KEY = "51d4c6ce7b8b5e527a0ae793e48c6e62"; // user replaces this
      const res = await fetch(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds/?apiKey=${API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const formatted = data.slice(0,8).map(g => {
        const bm = g.bookmakers?.[0];
        const mkt = bm?.markets?.find(m => m.key === "h2h");
        const outcomes = mkt?.outcomes || [];
        const homeOdd = outcomes.find(o => o.name === g.home_team)?.price || 1.9;
        const drawOdd = outcomes.find(o => o.name === "Draw")?.price || 3.2;
        const awayOdd = outcomes.find(o => o.name === g.away_team)?.price || 2.1;
        return { id:g.id, home:g.home_team, away:g.away_team, time: new Date(g.commence_time).toLocaleTimeString("en-ET",{hour:"2-digit",minute:"2-digit"}), homeOdd: parseFloat(homeOdd.toFixed(2)), drawOdd: parseFloat(drawOdd.toFixed(2)), awayOdd: parseFloat(awayOdd.toFixed(2)), league: g.sport_title };
      });
      setMatches(formatted);
    } catch {
      // Demo fallback when no API key or offline
      setMatches(getDemoMatches(sportKey));
    }
    setLoading(false);
  };

  const getDemoMatches = (key) => {
    const pools = {
      soccer_epl: [["Man City","Arsenal",1.8,3.5,4.2],["Liverpool","Chelsea",2.1,3.2,3.0],["Tottenham","Man Utd",2.4,3.1,2.8],["Newcastle","Everton",1.6,3.8,5.2]],
      soccer_ethiopia_premier: [["Saint George","Dedebit",1.5,4.0,6.0],["Fasil Kenema","Wolkite",2.0,3.3,3.1],["Dire Dawa","Hawassa",2.2,3.0,2.9]],
      basketball_nba: [["Lakers","Celtics",2.1,null,1.7],["Warriors","Nets",1.6,null,2.3],["Heat","Bucks",1.9,null,1.9]],
      americanfootball_nfl: [["Chiefs","Eagles",1.7,null,2.1],["Cowboys","Giants",1.5,null,2.5]],
      soccer_uefa_champs_league: [["Real Madrid","Barcelona",2.0,3.3,3.5],["Bayern","PSG",1.9,3.4,3.8],["Inter","Chelsea",2.1,3.2,3.1]],
    };
    return (pools[key]||pools.soccer_epl).map(([home,away,h,d,a],i)=>({
      id:`demo_${i}`, home, away, time:"20:00", homeOdd:h, drawOdd:d, awayOdd:a, league: SPORTS.find(s=>s.key===key)?.label.split(" ")[0]||"Football"
    }));
  };

  const handleOdd = (match, pick, odd) => {
    setSelected(prev => {
      const exists = prev[match.id] === pick;
      const next = { ...prev, [match.id]: exists ? null : pick };
      if (!exists) addToBetslip(match, pick, odd);
      return next;
    });
  };

  return (
    <div>
      <div className="sports-tabs">
        {SPORTS.map(s => (
          <div key={s.key} className={`sport-tab ${sport===s.key?"active":""}`} onClick={() => setSport(s.key)}>{s.label}</div>
        ))}
      </div>
      {loading && <div className="loading-pulse">Loading odds…</div>}
      {matches.map(m => (
        <div key={m.id} className="match-card">
          {m.live && <div className="live-badge">● LIVE</div>}
          <div className="match-league">{m.league}</div>
          <div className="match-teams">
            <div className="team-name">{m.home}</div>
            <div className="match-time">{m.time}</div>
            <div className="team-name away">{m.away}</div>
          </div>
          <div className="match-odds">
            <div className={`odd-btn ${selected[m.id]==="1"?"selected":""}`} onClick={() => handleOdd(m,"1",m.homeOdd)}>
              <span className="odd-label">1</span>
              <span className="odd-val">{m.homeOdd?.toFixed(2)}</span>
            </div>
            {m.drawOdd && (
              <div className={`odd-btn ${selected[m.id]==="X"?"selected":""}`} onClick={() => handleOdd(m,"X",m.drawOdd)}>
                <span className="odd-label">X</span>
const SPORTS = [
  { key:"soccer_epl", label:"EPL ⚽" },
  { key:"soccer_ethiopia_premier", label:"Ethiopia 🇪🇹" },
  { key:"soccer_uefa_champs_league", label:"UCL ⭐" },
  { key:"soccer_spain_la_liga", label:"LaLiga 🇪🇸" },
  { key:"soccer_italy_serie_a", label:"Serie A 🇮🇹" },
  { key:"soccer_germany_bundesliga", label:"Bundesliga 🇩🇪" },
  { key:"soccer_france_ligue_one", label:"Ligue 1 🇫🇷" },
  { key:"basketball_nba", label:"NBA 🏀" },
  { key:"americanfootball_nfl", label:"NFL 🏈" },
];

const MARKETS = [
  { key:"h2h", label:"1X2" },
  { key:"totals", label:"Over/Under" },
  { key:"btts", label:"Both Score" },
  { key:"double_chance", label:"Double Chance" },
];

function SportsPage({ addToBetslip, betslip, showToast }) {
  const [sport, setSport] = useState(SPORTS[0].key);
  const [market, setMarket] = useState("h2h");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState({});

  useEffect(() => { fetchOdds(sport, market); }, [sport, market]);

  const fetchOdds = async (sportKey, marketKey) => {
    setLoading(true);
    setMatches([]);
    try {
      const API_KEY = "51d4c6ce7b8b5e527a0ae793e48c6e62";
      const apiMarket = marketKey === "btts" ? "btts" : marketKey === "double_chance" ? "double_chance" : marketKey;
      const res = await fetch(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds/?apiKey=${API_KEY}&regions=eu&markets=${apiMarket}&oddsFormat=decimal`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const formatted = data.slice(0,10).map(g => {
        const bm = g.bookmakers?.[0];
        const mkt = bm?.markets?.[0];
        const outcomes = mkt?.outcomes || [];
        let odds = {};
        if (marketKey === "h2h") {
          odds.home = parseFloat((outcomes.find(o => o.name === g.home_team)?.price || 1.9).toFixed(2));
          odds.draw = outcomes.find(o => o.name === "Draw")?.price ? parseFloat(outcomes.find(o => o.name === "Draw").price.toFixed(2)) : null;
          odds.away = parseFloat((outcomes.find(o => o.name === g.away_team)?.price || 2.1).toFixed(2));
        } else if (marketKey === "totals") {
          const over = outcomes.find(o => o.name === "Over");
          const under = outcomes.find(o => o.name === "Under");
          odds.over = over ? parseFloat(over.price.toFixed(2)) : 1.85;
          odds.under = under ? parseFloat(under.price.toFixed(2)) : 1.95;
          odds.point = over?.point || 2.5;
        } else if (marketKey === "btts") {
          odds.yes = parseFloat((outcomes.find(o => o.name === "Yes")?.price || 1.75).toFixed(2));
          odds.no = parseFloat((outcomes.find(o => o.name === "No")?.price || 2.05).toFixed(2));
        } else if (marketKey === "double_chance") {
          odds.homeOrDraw = parseFloat((outcomes.find(o => o.name === "Home/Draw")?.price || 1.35).toFixed(2));
          odds.homeOrAway = parseFloat((outcomes.find(o => o.name === "Home/Away")?.price || 1.25).toFixed(2));
          odds.awayOrDraw = parseFloat((outcomes.find(o => o.name === "Away/Draw")?.price || 1.55).toFixed(2));
        }
        return {
          id: g.id,
          home: g.home_team,
          away: g.away_team,
          time: new Date(g.commence_time).toLocaleTimeString("en-ET",{hour:"2-digit",minute:"2-digit"}),
          league: g.sport_title,
          market: marketKey,
          ...odds
        };
      });
      setMatches(formatted);
    } catch {
      setMatches(getDemoMatches(sportKey, marketKey));
    }
    setLoading(false);
  };

  const getDemoMatches = (key, mkt) => {
    const teams = {
      soccer_epl: [["Man City","Arsenal"],["Liverpool","Chelsea"],["Tottenham","Man Utd"],["Newcastle","Everton"]],
      soccer_ethiopia_premier: [["Saint George","Dedebit"],["Fasil Kenema","Wolkite"],["Dire Dawa","Hawassa"]],
      soccer_spain_la_liga: [["Real Madrid","Barcelona"],["Atletico","Sevilla"],["Valencia","Villarreal"]],
      soccer_italy_serie_a: [["Inter","AC Milan"],["Juventus","Napoli"],["Roma","Lazio"]],
      soccer_germany_bundesliga: [["Bayern","Dortmund"],["Leipzig","Leverkusen"],["Frankfurt","Stuttgart"]],
      soccer_france_ligue_one: [["PSG","Marseille"],["Lyon","Monaco"],["Lille","Nice"]],
      soccer_uefa_champs_league: [["Real Madrid","Bayern"],["PSG","Arsenal"],["Inter","Chelsea"]],
      basketball_nba: [["Lakers","Celtics"],["Warriors","Nets"],["Heat","Bucks"]],
      americanfootball_nfl: [["Chiefs","Eagles"],["Cowboys","Giants"],["49ers","Ravens"]],
    };
    const pairs = teams[key] || teams.soccer_epl;
    return pairs.map(([home,away],i) => {
      const base = { id:`demo_${i}`, home, away, time:"20:00", league: SPORTS.find(s=>s.key===key)?.label.split(" ")[0]||"Football", market: mkt };
      if (mkt === "h2h") return { ...base, home:1.85, draw:3.20, away:2.10 };
      if (mkt === "totals") return { ...base, over:1.85, under:1.95, point:2.5 };
      if (mkt === "btts") return { ...base, yes:1.75, no:2.05 };
      if (mkt === "double_chance") return { ...base, homeOrDraw:1.35, homeOrAway:1.25, awayOrDraw:1.55 };
      return base;
    });
  };

  const handleOdd = (match, pick, odd) => {
    const key = `${match.id}_${pick}`;
    setSelected(prev => {
      const exists = prev[key];
      const next = { ...prev, [key]: !exists };
      if (!exists) addToBetslip(match, pick, odd);
      return next;
    });
  };

  const renderOdds = (m) => {
    if (m.market === "h2h") return (
      <div className="match-odds">
        <div className={`odd-btn ${selected[`${m.id}_1`]?"selected":""}`} onClick={() => handleOdd(m,"1",m.home)}>
          <span className="odd-label">1</span><span className="odd-val">{m.home?.toFixed(2)}</span>
        </div>
        {m.draw && <div className={`odd-btn ${selected[`${m.id}_X`]?"selected":""}`} onClick={() => handleOdd(m,"X",m.draw)}>
          <span className="odd-label">X</span><span className="odd-val">{m.draw?.toFixed(2)}</span>
        </div>}
        <div className={`odd-btn ${selected[`${m.id}_2`]?"selected":""}`} onClick={() => handleOdd(m,"2",m.away)}>
          <span className="odd-label">2</span><span className="odd-val">{m.away?.toFixed(2)}</span>
        </div>
      </div>
    );
    if (m.market === "totals") return (
      <div className="match-odds">
        <div className={`odd-btn ${selected[`${m.id}_over`]?"selected":""}`} onClick={() => handleOdd(m,`Over ${m.point}`,m.over)}>
          <span className="odd-label">OVER {m.point}</span><span className="odd-val">{m.over?.toFixed(2)}</span>
        </div>
        <div className={`odd-btn ${selected[`${m.id}_under`]?"selected":""}`} onClick={() => handleOdd(m,`Under ${m.point}`,m.under)}>
          <span className="odd-label">UNDER {m.point}</span><span className="odd-val">{m.under?.toFixed(2)}</span>
        </div>
      </div>
    );
    if (m.market === "btts") return (
      <div className="match-odds">
        <div className={`odd-btn ${selected[`${m.id}_yes`]?"selected":""}`} onClick={() => handleOdd(m,"BTTS Yes",m.yes)}>
          <span className="odd-label">YES</span><span className="odd-val">{m.yes?.toFixed(2)}</span>
        </div>
        <div className={`odd-btn ${selected[`${m.id}_no`]?"selected":""}`} onClick={() => handleOdd(m,"BTTS No",m.no)}>
          <span className="odd-label">NO</span><span className="odd-val">{m.no?.toFixed(2)}</span>
        </div>
      </div>
    );
    if (m.market === "double_chance") return (
      <div className="match-odds">
        <div className={`odd-btn ${selected[`${m.id}_hd`]?"selected":""}`} onClick={() => handleOdd(m,"1X",m.homeOrDraw)}>
          <span className="odd-label">1X</span><span className="odd-val">{m.homeOrDraw?.toFixed(2)}</span>
        </div>
        <div className={`odd-btn ${selected[`${m.id}_ha`]?"selected":""}`} onClick={() => handleOdd(m,"12",m.homeOrAway)}>
          <span className="odd-label">12</span><span className="odd-val">{m.homeOrAway?.toFixed(2)}</span>
        </div>
        <div className={`odd-btn ${selected[`${m.id}_ad`]?"selected":""}`} onClick={() => handleOdd(m,"X2",m.awayOrDraw)}>
          <span className="odd-label">X2</span><span className="odd-val">{m.awayOrDraw?.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="sports-tabs">
        {SPORTS.map(s => (
          <div key={s.key} className={`sport-tab ${sport===s.key?"active":""}`} onClick={() => setSport(s.key)}>{s.label}</div>
        ))}
      </div>
      <div className="sports-tabs" style={{paddingTop:8}}>
        {MARKETS.map(mk => (
          <div key={mk.key} className={`sport-tab ${market===mk.key?"active":""}`} onClick={() => setMarket(mk.key)}>{mk.label}</div>
        ))}
      </div>
      {loading && <div className="loading-pulse">Loading odds…</div>}
      {matches.map(m => (
        <div key={m.id} className="match-card">
          <div className="match-league">{m.league}</div>
          <div className="match-teams">
            <div className="team-name">{m.home}</div>
            <div className="match-time">{m.time}</div>
            <div className="team-name away">{m.away}</div>
          </div>
          {renderOdds(m)}
        </div>
      ))}
      {!loading && matches.length === 0 && (
        <div className="loading-pulse" style={{paddingTop:60}}>No matches right now</div>
      )}
      <div style={{height:80}} />
    </div>
  );
  }
}

// ── CASINO PAGE ───────────────────────────────────────────────────────────────
const CASINO_GAMES = [
  { id:"aviator", name:"Aviator", icon:"✈️", tag:"Crash" },
  { id:"slots", name:"Slots", icon:"🎰", tag:"Lucky 7s" },
  { id:"dice", name:"Dice Roll", icon:"🎲", tag:"Predict" },
  { id:"blackjack", name:"Blackjack", icon:"🃏", tag:"21" },
  { id:"virtual", name:"Virtual Football", icon:"⚽", tag:"V-League" },
  { id:"penalty", name:"Penalty Kick", icon:"🥅", tag:"Shootout" },
];

function CasinoPage({ user, updateBalance, showToast }) {
  const [activeGame, setActiveGame] = useState("aviator");

  return (
    <div>
      <div className="games-grid" style={{paddingTop:12}}>
        {CASINO_GAMES.map(g => (
          <div key={g.id} className={`game-tile ${activeGame===g.id?"active":""}`} onClick={() => setActiveGame(g.id)}>
            <div className="icon">{g.icon}</div>
            <div className="name">{g.name}</div>
            <div className="tag">{g.tag}</div>
          </div>
        ))}
      </div>

      {activeGame === "aviator" && <AviatorGame user={user} updateBalance={updateBalance} showToast={showToast} />}
      {activeGame === "slots" && <SlotsGame user={user} updateBalance={updateBalance} showToast={showToast} />}
      {activeGame === "dice" && <DiceGame user={user} updateBalance={updateBalance} showToast={showToast} />}
      {activeGame === "blackjack" && <BlackjackGame user={user} updateBalance={updateBalance} showToast={showToast} />}
      {activeGame === "virtual" && <VirtualFootball user={user} updateBalance={updateBalance} showToast={showToast} />}
      {activeGame === "penalty" && <PenaltyGame user={user} updateBalance={updateBalance} showToast={showToast} />}
      <div style={{height:20}} />
    </div>
  );
}

// ── AVIATOR / CRASH ───────────────────────────────────────────────────────────
function AviatorGame({ user, updateBalance, showToast }) {
  const [phase, setPhase] = useState("idle"); // idle | flying | crashed
  const [mult, setMult] = useState(1.00);
  const [stake, setStake] = useState("100");
  const [betActive, setBetActive] = useState(false);
  const [history, setHistory] = useState([2.14,1.03,5.67,1.45,12.3,1.01,3.22,8.8,1.78,2.01]);
  const [planePos, setPlanePos] = useState({ bottom:10, left:10 });
  const timerRef = useRef(null);
  const crashAt = useRef(1);

  const startFlight = () => {
    const s = parseFloat(stake);
    if (s < 50) { showToast("Min bet 50 ETB","lose"); return; }
    if (s > user.balance) { showToast("Insufficient balance","lose"); return; }
    // Generate crash point (house edge: ~3%)
    const r = Math.random();
    const crash = Math.max(1.01, (1/(r+0.03)).toFixed(2));
    crashAt.current = parseFloat(crash);
    updateBalance(-s);
    setBetActive(true);
    setPhase("flying");
    setMult(1.00);
    let cur = 1.00;
    let tick = 0;
    timerRef.current = setInterval(() => {
      tick++;
      cur = parseFloat((cur * 1.02).toFixed(2));
      setMult(cur);
      setPlanePos({ bottom: Math.min(10 + tick*2, 80), left: Math.min(10 + tick*1.5, 75) });
      if (cur >= crashAt.current) {
        clearInterval(timerRef.current);
        setPhase("crashed");
        setBetActive(false);
        setHistory(p => [parseFloat(crashAt.current.toFixed(2)), ...p.slice(0,9)]);
        showToast(`Crashed at ${crashAt.current.toFixed(2)}x 💥`, "lose");
        FirebaseDB.addBet(user.uid, { game:"Aviator", pick:`Crashed at ${crashAt.current}x`, stake:s, payout:0, won:false, date:Date.now() });
      }
    }, 120);
  };

  const cashout = () => {
    clearInterval(timerRef.current);
    const s = parseFloat(stake);
    const payout = Math.round(s * mult);
    updateBalance(payout);
    setBetActive(false);
    setPhase("idle");
    showToast(`Cashed out ${payout} ETB at ${mult}x! 🎉`, "win");
    FirebaseDB.addBet(user.uid, { game:"Aviator", pick:`Cashout ${mult}x`, stake:s, payout, won:true, date:Date.now() });
    setPlanePos({ bottom:10, left:10 });
    setMult(1.00);
  };

  const reset = () => { setPhase("idle"); setMult(1.00); setPlanePos({ bottom:10, left:10 }); };

  return (
    <div className="aviator-wrap">
      <div className="history-pills">
        {history.map((h,i) => (
          <div key={i} className={`history-pill ${h >= 2 ? "win":"lose"}`}>{h.toFixed(2)}x</div>
        ))}
      </div>
      <div className="aviator-sky">
        <div className="aviator-grid" />
        <div className={`crash-multiplier ${phase==="crashed"?"crashed":""}`}>{mult.toFixed(2)}x</div>
        {(phase==="flying"||phase==="crashed") && (
          <div className="plane" style={{ bottom:`${planePos.bottom}%`, left:`${planePos.left}%` }}>
            {phase==="crashed" ? "💥" : "✈️"}
          </div>
        )}
        {phase==="flying" && (
          <div className="trail" style={{ width:`${planePos.left}%`, bottom:`${planePos.bottom}%` }} />
        )}
      </div>
      <div className="avi-stats">
        <div className="avi-stat"><div className="val">×{mult.toFixed(2)}</div><div className="lbl">Current</div></div>
        <div className="avi-stat"><div className="val">{Math.round((parseFloat(stake)||0)*mult)} ETB</div><div className="lbl">Value</div></div>
        <div className="avi-stat"><div className="val">{phase==="flying"?"🔴 FLYING":phase==="crashed"?"💥 CRASHED":"🟢 READY"}</div><div className="lbl">Status</div></div>
      </div>
      <div className="aviator-controls">
        <input className="avi-input" type="number" value={stake} onChange={e=>setStake(e.target.value)} placeholder="ETB" disabled={phase==="flying"} />
        {phase === "idle" && <button className="avi-btn bet" onClick={startFlight}>BET</button>}
        {phase === "flying" && betActive && <button className="avi-btn cashout" onClick={cashout}>CASHOUT</button>}
        {phase === "crashed" && <button className="avi-btn bet" onClick={reset}>RETRY</button>}
      </div>
    </div>
  );
}

// ── SLOTS ─────────────────────────────────────────────────────────────────────
function SlotsGame({ user, updateBalance, showToast }) {
  const [reels, setReels] = useState(["🍒","🍋","🍊"]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [stake, setStake] = useState("50");

  const spin = () => {
    const s = parseFloat(stake);
    if (s < 50) { showToast("Min 50 ETB","lose"); return; }
    if (s > user.balance) { showToast("Insufficient balance","lose"); return; }
    updateBalance(-s);
    setSpinning(true);
    setResult(null);
    let ticks = 0;
    const iv = setInterval(() => {
      ticks++;
      setReels([SLOT_SYMBOLS[Math.floor(Math.random()*8)],SLOT_SYMBOLS[Math.floor(Math.random()*8)],SLOT_SYMBOLS[Math.floor(Math.random()*8)]]);
      if (ticks >= 16) {
        clearInterval(iv);
        // Final reels — house controlled probability
        const r1 = SLOT_SYMBOLS[Math.floor(Math.random()*8)];
        let r2, r3;
        const winChance = Math.random();
        if (winChance < 0.08) { r2 = r1; r3 = r1; } // jackpot 8%
        else if (winChance < 0.30) { r2 = r1; r3 = SLOT_SYMBOLS[Math.floor(Math.random()*8)]; } // pair 22%
        else { r2 = SLOT_SYMBOLS[Math.floor(Math.random()*8)]; r3 = SLOT_SYMBOLS[Math.floor(Math.random()*8)]; }
        const finalReels = [r1,r2,r3];
        setReels(finalReels);
        setSpinning(false);
        const allSame = finalReels.every(r => r === finalReels[0]);
        const twoPair = finalReels[0]===finalReels[1] || finalReels[1]===finalReels[2] || finalReels[0]===finalReels[2];
        let mult = 0, msg = "";
        if (allSame && finalReels[0] === "💎") { mult = 25; msg = "💎 DIAMOND JACKPOT! 25x"; }
        else if (allSame && finalReels[0] === "7️⃣") { mult = 15; msg = "🔥 LUCKY 7s! 15x"; }
        else if (allSame) { mult = 8; msg = "🎉 THREE OF A KIND! 8x"; }
        else if (twoPair) { mult = 2; msg = "✅ PAIR! 2x"; }
        else { msg = "❌ No match — try again!"; }
        if (mult > 0) {
          const payout = Math.round(s * mult);
          updateBalance(payout);
          showToast(`${msg} — Won ${payout} ETB`, "win");
          FirebaseDB.addBet(user.uid, { game:"Slots", pick:finalReels.join(" "), stake:s, payout, won:true, date:Date.now() });
          setResult({ type:"win", msg });
        } else {
          showToast("No match 😢", "lose");
          FirebaseDB.addBet(user.uid, { game:"Slots", pick:finalReels.join(" "), stake:s, payout:0, won:false, date:Date.now() });
          setResult({ type:"lose", msg });
        }
      }
    }, 80);
  };

  return (
    <div className="slots-wrap">
      <div className="slots-reels">
        {reels.map((r,i) => (
          <div key={i} className={`reel ${spinning?"spinning":""}`}>{r}</div>
        ))}
      </div>
      {result && <div className={`slots-result ${result.type}`}>{result.msg}</div>}
      <div className="bet-btn-row" style={{marginTop:12}}>
        <input className="bet-input" type="number" value={stake} onChange={e=>setStake(e.target.value)} placeholder="ETB" disabled={spinning} />
        <button className="place-bet-btn" onClick={spin} disabled={spinning}>{spinning?"...":"SPIN"}</button>
      </div>
    </div>
  );
}

// ── DICE ──────────────────────────────────────────────────────────────────────
function DiceGame({ user, updateBalance, showToast }) {
  const [dice, setDice] = useState([1,1]);
  const [rolling, setRolling] = useState(false);
  const [choice, setChoice] = useState("high"); // high / low / exact7
  const [stake, setStake] = useState("50");
  const [lastResult, setLastResult] = useState(null);

  const CHOICES = [
    { id:"high", label:"HIGH (8-12)", odds:1.9 },
    { id:"low", label:"LOW (2-6)", odds:1.9 },
    { id:"exact7", label:"LUCKY 7", odds:5.0 },
  ];

  const roll = () => {
    const s = parseFloat(stake);
    if (s < 50) { showToast("Min 50 ETB","lose"); return; }
    if (s > user.balance) { showToast("Insufficient balance","lose"); return; }
    updateBalance(-s);
    setRolling(true);
    setLastResult(null);
    let ticks = 0;
    const iv = setInterval(() => {
      ticks++;
      setDice([Math.ceil(Math.random()*6), Math.ceil(Math.random()*6)]);
      if (ticks >= 10) {
        clearInterval(iv);
        const d1 = Math.ceil(Math.random()*6), d2 = Math.ceil(Math.random()*6);
        const total = d1 + d2;
        setDice([d1,d2]);
        setRolling(false);
        const selected = CHOICES.find(c=>c.id===choice);
        const won = (choice==="high" && total>=8) || (choice==="low" && total<=6) || (choice==="exact7" && total===7);
        if (won) {
          const payout = Math.round(s * selected.odds);
          updateBalance(payout);
          showToast(`Total: ${total} — Won ${payout} ETB! 🎲`, "win");
          FirebaseDB.addBet(user.uid, { game:"Dice", pick:`${selected.label} (got ${total})`, stake:s, payout, won:true, date:Date.now() });
          setLastResult({ won:true, total, payout });
        } else {
          showToast(`Total: ${total} — Lost 😢`, "lose");
          FirebaseDB.addBet(user.uid, { game:"Dice", pick:`${selected.label} (got ${total})`, stake:s, payout:0, won:false, date:Date.now() });
          setLastResult({ won:false, total });
        }
      }
    }, 60);
  };

  return (
    <div className="dice-wrap">
      <div className="dice-display">
        {dice.map((d,i) => <div key={i} className={`die ${rolling?"rolling":""}`}>{DICE_FACES[d-1]}</div>)}
      </div>
      <div className="dice-total">{rolling?"?":dice[0]+dice[1]}</div>
      <div className="dice-target">{lastResult ? (lastResult.won ? `✅ Won ${lastResult.payout} ETB` : `❌ Lost (total was ${lastResult.total})`) : "Pick your bet type below"}</div>
      <div className="dice-options">
        {CHOICES.map(c => (
          <div key={c.id} className={`dice-opt ${choice===c.id?"selected":""}`} onClick={()=>setChoice(c.id)}>
            {c.label}
            <div style={{color:G.gold,fontSize:12,marginTop:2}}>×{c.odds}</div>
          </div>
        ))}
      </div>
      <div className="bet-btn-row">
        <input className="bet-input" type="number" value={stake} onChange={e=>setStake(e.target.value)} disabled={rolling} />
        <button className="place-bet-btn" onClick={roll} disabled={rolling}>{rolling?"...":"ROLL"}</button>
      </div>
    </div>
  );
}

// ── BLACKJACK ─────────────────────────────────────────────────────────────────
function BlackjackGame({ user, updateBalance, showToast }) {
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [phase, setPhase] = useState("idle"); // idle | playing | done
  const [status, setStatus] = useState("");
  const [stake, setStake] = useState("100");
  const [deck, setDeck] = useState([]);

  const newDeck = () => {
    const d = [];
    for (const s of CARD_SUITS) for (const v of CARD_VALUES) d.push({value:v, suit:s});
    return shuffle(d);
  };

  const deal = () => {
    const s = parseFloat(stake);
    if (s < 50) { showToast("Min 50 ETB","lose"); return; }
    if (s > user.balance) { showToast("Insufficient balance","lose"); return; }
    updateBalance(-s);
    const d = newDeck();
    const ph = [d.pop(), d.pop()];
    const dh = [d.pop(), d.pop()];
    setDeck(d);
    setPlayerHand(ph);
    setDealerHand(dh);
    setPhase("playing");
    setStatus("");
    if (handValue(ph) === 21) { finishGame(ph, dh, d, s); }
  };

  const hit = () => {
    const d = [...deck];
    const ph = [...playerHand, d.pop()];
    setDeck(d);
    setPlayerHand(ph);
    if (handValue(ph) > 21) { endGame("bust", ph, dealerHand, parseFloat(stake)); }
  };

  const stand = () => { dealerPlay(playerHand, [...dealerHand], [...deck], parseFloat(stake)); };

  const dealerPlay = (ph, dh, d, s) => {
    while (handValue(dh) < 17) dh.push(d.pop());
    setDealerHand(dh);
    const pv = handValue(ph), dv = handValue(dh);
    let outcome;
    if (dv > 21 || pv > dv) outcome = "win";
    else if (pv === dv) outcome = "push";
    else outcome = "lose";
    endGame(outcome, ph, dh, s);
  };

  const finishGame = (ph, dh, d, s) => { dealerPlay(ph, [...dh], [...d], s); };

  const endGame = (outcome, ph, dh, s) => {
    setPhase("done");
    const pv = handValue(ph), dv = handValue(dh);
    if (outcome === "bust") {
      setStatus("💥 Bust! Dealer wins");
      showToast("Bust! You went over 21","lose");
      FirebaseDB.addBet(user.uid, { game:"Blackjack", pick:`Bust (${pv})`, stake:s, payout:0, won:false, date:Date.now() });
    } else if (outcome === "win") {
      const mult = pv === 21 && ph.length === 2 ? 2.5 : 2;
      const payout = Math.round(s * mult);
      updateBalance(payout);
      setStatus(`🎉 You win! ${pv} vs ${dv}`);
      showToast(`Won ${payout} ETB!`, "win");
      FirebaseDB.addBet(user.uid, { game:"Blackjack", pick:`Won (${pv} vs ${dv})`, stake:s, payout, won:true, date:Date.now() });
    } else if (outcome === "push") {
      updateBalance(s);
      setStatus(`🤝 Push! ${pv} vs ${dv}`);
      showToast("Push — bet returned","info");
      FirebaseDB.addBet(user.uid, { game:"Blackjack", pick:`Push (${pv})`, stake:s, payout:s, won:null, date:Date.now() });
    } else {
      setStatus(`😢 Dealer wins ${dv} vs ${pv}`);
      showToast("Dealer wins","lose");
      FirebaseDB.addBet(user.uid, { game:"Blackjack", pick:`Lost (${pv} vs ${dv})`, stake:s, payout:0, won:false, date:Date.now() });
    }
  };

  const pv = handValue(playerHand), dv = handValue(dealerHand);

  return (
    <div className="cards-wrap">
      <div>
        <div className="card-area-label">Dealer {phase!=="idle" ? <span className="card-score">{phase==="done"?dv:"?"}</span> : ""}</div>
        <div className="cards-area">
          {dealerHand.map((c,i) => (
            <div key={i} className={`playing-card ${cardColor(c.suit)} ${i===1&&phase==="playing"?"face-down":""}`}>
              {i===1&&phase==="playing" ? "" : `${c.value}${c.suit}`}
            </div>
          ))}
          {phase==="idle" && <div style={{color:G.muted,fontSize:12}}>Deal to start</div>}
        </div>
      </div>
      <div style={{borderTop:`1px solid ${G.cardBorder}`,margin:"8px 0"}} />
      <div>
        <div className="card-area-label">You {playerHand.length > 0 ? <span className="card-score">{pv}</span> : ""}</div>
        <div className="cards-area">
          {playerHand.map((c,i) => (
            <div key={i} className={`playing-card ${cardColor(c.suit)}`}>{c.value}{c.suit}</div>
          ))}
        </div>
      </div>
      <div className={`cards-status ${phase==="done"?(status.includes("win")?"win":status.includes("Dealer")?"lose":"push"):""}`}>{status}</div>
      <div className="card-actions">
        {phase === "idle" && (
          <>
            <input className="bet-input" type="number" value={stake} onChange={e=>setStake(e.target.value)} style={{flex:1}} />
            <button className="card-btn deal" onClick={deal}>DEAL</button>
          </>
        )}
        {phase === "playing" && (
          <>
            <button className="card-btn hit" onClick={hit}>HIT</button>
            <button className="card-btn stand" onClick={stand}>STAND</button>
          </>
        )}
        {phase === "done" && (
          <button className="card-btn deal" style={{flex:1}} onClick={() => { setPhase("idle"); setPlayerHand([]); setDealerHand([]); setStatus(""); }}>NEW GAME</button>
        )}
      </div>
    </div>
  );
}

// ── VIRTUAL FOOTBALL ──────────────────────────────────────────────────────────
const VF_TEAMS = [
  ["Addis United","Harar City",1.8,3.5,4.2],
  ["Blue Nile FC","Rift Valley",2.1,3.2,3.0],
  ["Ethiopia Stars","Golden Lions",1.6,3.8,5.0],
  ["Lalibela FC","Axum Athletic",2.3,3.0,2.7],
];

function VirtualFootball({ user, updateBalance, showToast }) {
  const [match, setMatch] = useState(VF_TEAMS[0]);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState([0,0]);
  const [phase, setPhase] = useState("idle"); // idle | playing | done
  const [ballPos, setBallPos] = useState({ bottom:10, left:47 });
  const [minute, setMinute] = useState(0);
  const [stake, setStake] = useState("100");

  const startMatch = () => {
    const s = parseFloat(stake);
    if (!pick) { showToast("Select a prediction first","info"); return; }
    if (s < 50) { showToast("Min 50 ETB","lose"); return; }
    if (s > user.balance) { showToast("Insufficient balance","lose"); return; }
    updateBalance(-s);
    setPhase("playing");
    const final = [0,0];
    // Simulate match
    const m = Math.floor(Math.random()*4);
    const goals = Array.from({length:m},()=>({t:Math.floor(Math.random()*90)+1,side:Math.random()<0.5?0:1}));
    goals.forEach(g => { if(g.side===0) final[0]++; else final[1]++; });
    let min = 0;
    let scored = [0,0];
    const iv = setInterval(() => {
      min += 3;
      setMinute(min);
      const gs = goals.filter(g => g.t <= min && g.t > min-3);
      gs.forEach(g => { scored[g.side]++; setScore([...scored]); setBallPos({bottom:Math.random()*70+10,left:Math.random()*70+10}); });
      if (min >= 90) {
        clearInterval(iv);
        setScore([...final]);
        setPhase("done");
        const outcome = final[0] > final[1] ? "1" : final[0] < final[1] ? "2" : "X";
        const odds = pick==="1"?match[2]:pick==="X"?match[3]:match[4];
        const won = outcome === pick;
        if (won) {
          const payout = Math.round(s * odds);
          updateBalance(payout);
          showToast(`Match won! ${final[0]}-${final[1]} — Won ${payout} ETB 🎉`, "win");
          FirebaseDB.addBet(user.uid, { game:"Virtual Football", pick:`${match[0]} vs ${match[1]} (${pick})`, stake:s, payout, won:true, date:Date.now() });
        } else {
          showToast(`Match ended ${final[0]}-${final[1]} — Lost 😢`, "lose");
          FirebaseDB.addBet(user.uid, { game:"Virtual Football", pick:`${match[0]} vs ${match[1]} (${pick})`, stake:s, payout:0, won:false, date:Date.now() });
        }
      }
    }, 150);
  };

  const reset = () => {
    setPhase("idle"); setScore([0,0]); setMinute(0); setPick(null); setBallPos({bottom:10,left:47});
    setMatch(VF_TEAMS[Math.floor(Math.random()*VF_TEAMS.length)]);
  };

  return (
    <div className="vf-wrap">
      <div className="pitch">
        <div className="pitch-lines">
          <div className="pitch-center" />
          <div className="pitch-mid" />
          <div className="pitch-goal-l" />
          <div className="pitch-goal-r" />
        </div>
        <div className="ball" style={{ bottom:`${ballPos.bottom}%`, left:`${ballPos.left}%` }}>⚽</div>
      </div>
      <div className="vf-score">
        <div className="vf-team"><div className="name">{match[0]}</div><div className="score">{score[0]}</div></div>
        <div className="vf-vs">{phase==="playing"?`${minute}'`:"VS"}</div>
        <div className="vf-team"><div className="name">{match[1]}</div><div className="score">{score[1]}</div></div>
      </div>
      {phase === "idle" && (
        <>
          <div className="vf-bets">
            {[["1",match[0],match[2]],["X","Draw",match[3]],["2",match[1],match[4]]].map(([k,label,odd])=>(
              <div key={k} className={`vf-bet-btn ${pick===k?"selected":""}`} onClick={()=>setPick(k)}>
                <div>{label}</div>
                <span className="odds">{odd?.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="bet-btn-row">
            <input className="bet-input" type="number" value={stake} onChange={e=>setStake(e.target.value)} />
            <button className="place-bet-btn" onClick={startMatch} disabled={!pick}>PLAY</button>
          </div>
        </>
      )}
      {phase === "playing" && <div style={{textAlign:"center",padding:"8px",color:G.muted,fontSize:12}}>⏱ Match in progress…</div>}
      {phase === "done" && (
        <div style={{textAlign:"center",padding:"12px 0"}}>
          <div style={{fontSize:12,color:G.muted,marginBottom:8}}>Final Score</div>
          <button className="place-bet-btn" style={{padding:"9px 24px"}} onClick={reset}>NEW MATCH</button>
        </div>
      )}
    </div>
  );
}

// ── PENALTY SHOOTOUT ──────────────────────────────────────────────────────────
function PenaltyGame({ user, updateBalance, showToast }) {
  const [hovered, setHovered] = useState(null);
  const [results, setResults] = useState([]);
  const [scored, setScored] = useState(0);
  const [total, setTotal] = useState(0);
  const [phase, setPhase] = useState("pick"); // pick | result | done
  const [stake, setStake] = useState("50");
  const [lastZone, setLastZone] = useState(null);
  const [resultZone, setResultZone] = useState(null);

  const kick = (zone) => {
    const s = parseFloat(stake);
    if (s < 50) { showToast("Min 50 ETB","lose"); return; }
    if (s > user.balance) { showToast("Insufficient balance","lose"); return; }
    updateBalance(-s);
    setLastZone(zone);
    setPhase("result");
    // Goalkeeper saves randomly — harder at edges
    const centerZones = [1,4]; // middle zones easier to score
    const saveChance = centerZones.includes(zone) ? 0.3 : 0.5;
    const scored = Math.random() > saveChance;
    setResultZone({ zone, scored });
    const newTotal = total + 1;
    const newScored = scored ? scored_count + 1 : scored_count;
    if (scored) {
      const payout = Math.round(s * 1.8);
      updateBalance(payout);
      showToast(`GOAL! ⚽ Won ${payout} ETB`, "win");
      FirebaseDB.addBet(user.uid, { game:"Penalty Kick", pick:`Zone ${zone+1}`, stake:s, payout, won:true, date:Date.now() });
      setScored(p => p+1);
    } else {
      showToast("Saved! 🧤 Missed", "lose");
      FirebaseDB.addBet(user.uid, { game:"Penalty Kick", pick:`Zone ${zone+1}`, stake:s, payout:0, won:false, date:Date.now() });
    }
    setTotal(p => p+1);
    setTimeout(() => { setPhase("pick"); setResultZone(null); }, 1500);
  };

  // track score
  let scored_count = scored;

  return (
    <div className="penalty-wrap">
      <div className="penalty-score">
        Scored: <span>{scored}</span> / <span>{total}</span> kicks
      </div>
      <div className="goal-net">
        {[0,1,2,3,4,5].map(zone => (
          <div key={zone}
            className={`goal-zone ${hovered===zone?"hovered":""} ${resultZone?.zone===zone?(resultZone.scored?"scored":"saved"):""}`}
            onMouseEnter={()=>setHovered(zone)} onMouseLeave={()=>setHovered(null)}
            onClick={() => phase==="pick" && kick(zone)}
          >
            {resultZone?.zone === zone ? (resultZone.scored ? "⚽":"🧤") : ""}
          </div>
        ))}
      </div>
      <div className="penalty-status" style={{color:resultZone?.scored ? G.green : resultZone ? G.red : G.muted}}>
        {phase==="pick" ? "Tap a zone to shoot" : resultZone?.scored ? "GOAL! 🎉" : "SAVED! 🧤"}
      </div>
      <div className="bet-btn-row" style={{marginTop:10}}>
        <input className="bet-input" type="number" value={stake} onChange={e=>setStake(e.target.value)} />
        <div style={{fontSize:12,color:G.muted,textAlign:"center",flex:1}}>×1.8 per goal</div>
      </div>
    </div>
  );
}

// ── DEPOSIT PAGE ──────────────────────────────────────────────────────────────
function DepositPage({ user, updateBalance, showToast }) {
  const [method, setMethod] = useState("telebirr");
  const [amount, setAmount] = useState("500");
  const AMOUNTS = ["100","200","500","1000","2000","5000"];
  const METHODS = [
    { id:"telebirr", icon:"📱", name:"Telebirr", detail:"Send to: 0928 33 692" },
    { id:"cbe", icon:"🏦", name:"CBE Birr", detail:"Account: 0928 33 692" },
  ];

  const handleDeposit = () => {
    showToast(`Follow the steps below to complete your deposit`, "info");
  };

  return (
    <div>
      <div className="section-title">Payment Method</div>
      {METHODS.map(m => (
        <div key={m.id} className={`deposit-method ${method===m.id?"selected":""}`} onClick={()=>setMethod(m.id)}>
          <div className="method-icon">{m.icon}</div>
          <div className="method-info">
            <div className="name">{m.name}</div>
            <div className="detail">{m.detail}</div>
          </div>
          {method===m.id && <div style={{marginLeft:"auto",color:G.gold,fontSize:18}}>✓</div>}
        </div>
      ))}

      <div className="section-title">Amount (ETB)</div>
      <div className="amount-grid">
        {AMOUNTS.map(a => (
          <div key={a} className={`amt-btn ${amount===a?"selected":""}`} onClick={()=>setAmount(a)}>{parseInt(a).toLocaleString()}</div>
        ))}
      </div>

      <div style={{padding:"0 12px 12px"}}>
        <div className="input-label">CUSTOM AMOUNT</div>
        <input className="input-field" type="number" placeholder="Enter amount" value={amount} onChange={e=>setAmount(e.target.value)} />
      </div>

      <div className="deposit-info-box">
        <div className="title">📲 How to Deposit via {method === "telebirr" ? "Telebirr" : "CBE Birr"}</div>
        {method === "telebirr" ? (
          <>
            <div className="deposit-step"><div className="deposit-step-num">1</div><div className="deposit-step-text">Open the <strong>Telebirr app</strong> on your phone</div></div>
            <div className="deposit-step"><div className="deposit-step-num">2</div><div className="deposit-step-text">Send <strong>{parseInt(amount||0).toLocaleString()} ETB</strong> to <strong>0928 33 692</strong></div></div>
            <div className="deposit-step"><div className="deposit-step-num">3</div><div className="deposit-step-text">Use your <strong>Telegram username</strong> as the reference / memo</div></div>
            <div className="deposit-step"><div className="deposit-step-num">4</div><div className="deposit-step-text">Screenshot the confirmation and send to <strong>@melkambet_et</strong></div></div>
          </>
        ) : (
          <>
            <div className="deposit-step"><div className="deposit-step-num">1</div><div className="deposit-step-text">Open <strong>CBE Birr app</strong> or visit any CBE branch</div></div>
            <div className="deposit-step"><div className="deposit-step-num">2</div><div className="deposit-step-text">Transfer <strong>{parseInt(amount||0).toLocaleString()} ETB</strong> to account <strong>0928 33 692</strong></div></div>
            <div className="deposit-step"><div className="deposit-step-num">3</div><div className="deposit-step-text">Add your <strong>Telegram username</strong> in the description</div></div>
            <div className="deposit-step"><div className="deposit-step-num">4</div><div className="deposit-step-text">Send receipt to <strong>@melkambet_et</strong> on Telegram</div></div>
          </>
        )}
      </div>

      <button className="submit-btn" onClick={handleDeposit}>I've Made the Transfer →</button>

      <a href="https://t.me/melkambet_et" className="support-btn" style={{display:"flex",alignItems:"center",gap:8,padding:"13px 16px",margin:"0 12px 12px",background:"rgba(79,158,232,0.1)",border:"1px solid rgba(79,158,232,0.3)",borderRadius:12,fontSize:13,fontWeight:600,color:G.blue,textDecoration:"none"}}>
        💬 Contact Support on Telegram
      </a>
      <div style={{height:20}} />
    </div>
  );
}

// ── ACCOUNT PAGE ──────────────────────────────────────────────────────────────
function AccountPage({ user, showToast }) {
  const bets = FirebaseDB.getBets(user.uid);
  const wins = bets.filter(b => b.won === true).length;
  const totalWon = bets.filter(b=>b.won).reduce((a,b)=>a+b.payout,0);

  return (
    <div>
      <div className="avatar-row">
        <div className="avatar">👤</div>
        <div>
          <div className="user-name">{user.name}</div>
          <div className="user-phone">{user.phone || "No phone linked"}</div>
          <div className="user-id">ID: {user.uid?.slice(0,12)}</div>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat-card"><div className="val">{bets.length}</div><div className="lbl">Total Bets</div></div>
        <div className="stat-card"><div className="val">{wins}</div><div className="lbl">Wins</div></div>
        <div className="stat-card"><div className="val">{(user.balance||0).toLocaleString()}</div><div className="lbl">Balance ETB</div></div>
      </div>

      <div className="section-title">Bet History</div>
      <div className="card" style={{marginBottom:12}}>
        {bets.length === 0 && <div style={{padding:"20px",textAlign:"center",color:G.muted,fontSize:13}}>No bets yet — place your first bet!</div>}
        {bets.slice(0,15).map((b,i) => (
          <div key={i} className="bet-hist-item">
            <div className="bet-hist-left">
              <div className="game">{b.game}</div>
              <div className="date">{fmtDate(b.date)}</div>
            </div>
            <div className="bet-hist-right">
              <div className={`amt ${b.won===true?"win":"lose"}`}>
                {b.won===true ? `+${b.payout.toLocaleString()}`:b.won===false?`-${b.stake.toLocaleString()}`:"Pending"} ETB
              </div>
              <div className="stake">Stake: {b.stake?.toLocaleString()} ETB</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title">Settings</div>
      <div className="card">
        {[
          { icon:"📋", label:"Terms & Conditions" },
          { icon:"🔒", label:"Responsible Gambling" },
          { icon:"📞", label:"Support: @melkambet_et" },
          { icon:"⭐", label:"Rate Melkam Bet" },
        ].map((item,i)=>(
          <div key={i} className="menu-item">
            <div className="menu-left">
              <div className="menu-icon">{item.icon}</div>
              <div className="menu-label">{item.label}</div>
            </div>
            <div className="menu-chevron">›</div>
          </div>
        ))}
      </div>
      <div style={{height:20}} />
    </div>
  );
}
