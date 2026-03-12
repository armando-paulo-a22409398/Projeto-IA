import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { BARCODE_DB, CATEGORIES } from '../data/mockData';
import styles from './ScannerPage.module.css';

export default function ScannerPage({ onAdd, showToast }) {
  const [phase, setPhase] = useState('idle'); // idle | requesting | scanning | found | manual
  const [barcodeInput, setBarcodeInput] = useState('');
  const [found, setFound] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [form, setForm] = useState({
    name: '', category: '', quantity: 1, expiration_date: '', emoji: '📦',
  });

  const videoRef  = useRef(null);
  const readerRef = useRef(null);
  const streamRef = useRef(null);

  // ── Cleanup camera ───────────────────────────────────────────────────────
  const stopCamera = useCallback(() => {
    if (readerRef.current) {
      try { readerRef.current.reset(); } catch {}
      readerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  // ── Handle decoded barcode ───────────────────────────────────────────────
  const handleDecode = useCallback((code) => {
    stopCamera();
    const clean = code.trim();
    setBarcodeInput(clean);

    const product = BARCODE_DB[clean];
    if (product) {
      setFound(product);
      setForm(f => ({ ...f, name: product.name, category: product.category, emoji: product.emoji }));
      setPhase('found');
      showToast('Produto encontrado!', 'success');
    } else {
      setFound(null);
      setPhase('manual');
      showToast(`Código ${clean} não está na base de dados. Preenche manualmente.`, 'warn');
    }
  }, [stopCamera, showToast]);

  // ── Start camera ─────────────────────────────────────────────────────────
  const startScanner = async () => {
    setCameraError(null);
    setPhase('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      streamRef.current = stream;
      setPhase('scanning');

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      reader.decodeFromStream(stream, videoRef.current, (result, err) => {
        if (result) {
          handleDecode(result.getText());
        }
        if (err && !(err instanceof NotFoundException)) {
          console.warn('Scanner err:', err);
        }
      });

    } catch (err) {
      stopCamera();
      setPhase('idle');
      if (err.name === 'NotAllowedError') {
        setCameraError('Acesso à câmara negado. Permite o acesso nas definições do browser.');
      } else if (err.name === 'NotFoundError') {
        setCameraError('Nenhuma câmara encontrada neste dispositivo.');
      } else {
        setCameraError(`Erro ao aceder à câmara: ${err.message}`);
      }
    }
  };

  // ── Manual lookup ────────────────────────────────────────────────────────
  const handleManualLookup = () => {
    const code = barcodeInput.trim();
    if (!code) return;
    const product = BARCODE_DB[code];
    if (product) {
      setFound(product);
      setForm(f => ({ ...f, name: product.name, category: product.category, emoji: product.emoji }));
      setPhase('found');
      showToast('Produto encontrado!', 'success');
    } else {
      setFound(null);
      setPhase('manual');
      showToast('Produto não encontrado. Preenche manualmente.', 'warn');
    }
  };

  // ── Save ─────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!form.name.trim())     { showToast('Indica o nome do produto!', 'error');  return; }
    if (!form.expiration_date) { showToast('Indica a data de validade!', 'error'); return; }

    onAdd({ ...form, barcode: barcodeInput, quantity: Number(form.quantity) || 1 });
    setPhase('idle');
    setBarcodeInput('');
    setFound(null);
    setCameraError(null);
    setForm({ name: '', category: '', quantity: 1, expiration_date: '', emoji: '📦' });
    showToast('✅ Produto adicionado à despensa!', 'success');
  };

  // ── Cancel ───────────────────────────────────────────────────────────────
  const handleCancel = () => {
    stopCamera();
    setPhase('idle');
    setFound(null);
    setCameraError(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.logo}>despensa<span>.</span>em<span>dia</span></div>
      </div>

      <div className={styles.content}>
        <div className={styles.pageTitle}>Digitalizar produto</div>
        <div className={styles.pageSub}>Aponta a câmara ao código de barras do produto</div>

        {/* ── Frame ── */}
        <div className={styles.scannerBox}>
          <div className={[
            styles.frame,
            phase === 'scanning'   ? styles.scanning   : '',
            phase === 'found'      ? styles.frameDone  : '',
            phase === 'requesting' ? styles.requesting : '',
          ].join(' ')}>

            {/* Video — always in DOM so ref is stable */}
            <video
              ref={videoRef}
              className={`${styles.video} ${phase === 'scanning' ? styles.videoVisible : ''}`}
              playsInline
              muted
            />

            {/* Idle */}
            {phase === 'idle' && (
              <div className={styles.overlay}>
                <span className={styles.bigIcon}>📷</span>
                <span className={styles.overlayText}>Câmara inactiva</span>
              </div>
            )}

            {/* Requesting */}
            {phase === 'requesting' && (
              <div className={styles.overlay}>
                <div className={styles.spinner} />
                <span className={styles.overlayText}>A pedir acesso à câmara...</span>
              </div>
            )}

            {/* Scanning corners + line */}
            {phase === 'scanning' && (
              <>
                <div className={`${styles.corner} ${styles.cTL}`} />
                <div className={`${styles.corner} ${styles.cTR}`} />
                <div className={`${styles.corner} ${styles.cBL}`} />
                <div className={`${styles.corner} ${styles.cBR}`} />
                <div className={styles.scanLine} />
              </>
            )}

            {/* Found / manual */}
            {(phase === 'found' || phase === 'manual') && (
              <div className={styles.overlay}>
                <span className={styles.bigIcon} style={{ fontSize: 72 }}>{form.emoji}</span>
              </div>
            )}
          </div>

          {/* Status text under frame */}
          {phase === 'scanning' && (
            <div className={styles.scanStatus}>
              <span className={styles.pulseDot} />
              A detectar código de barras...
            </div>
          )}
          {phase === 'found' && (
            <div className={styles.foundBadge}>✓ {found?.name}</div>
          )}
          {phase === 'requesting' && (
            <div className={styles.scanStatus}>A aguardar permissão...</div>
          )}
        </div>

        {/* ── Error ── */}
        {cameraError && (
          <div className={styles.errorBanner}>
            <span>⚠️</span>
            <span>{cameraError}</span>
          </div>
        )}

        {/* ── Buttons ── */}
        {phase === 'idle' && (
          <button className={styles.scanBtn} onClick={startScanner}>
            📷 &nbsp; Activar Câmara
          </button>
        )}
        {phase === 'scanning' && (
          <button className={`${styles.scanBtn} ${styles.cancelBtn}`} onClick={handleCancel}>
            ✕ &nbsp; Parar câmara
          </button>
        )}

        {/* ── Manual input ── */}
        {(phase === 'idle' || phase === 'found' || phase === 'manual') && (
          <div className={styles.manualRow}>
            <input
              className={styles.barcodeInput}
              placeholder="Ou introduz o código manualmente..."
              value={barcodeInput}
              onChange={e => setBarcodeInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleManualLookup()}
            />
            <button className={styles.lookupBtn} onClick={handleManualLookup}>
              Procurar
            </button>
          </div>
        )}

        {/* ── Demo hint ── */}
        {phase === 'idle' && (
          <div className={styles.hint}>
            💡 Sem produto físico? Experimenta estes códigos de demo:<br />
            <span className={styles.hintCodes}>
              {Object.keys(BARCODE_DB).slice(0, 4).join('  ·  ')}
            </span>
          </div>
        )}

        {/* ── Form ── */}
        {(phase === 'found' || phase === 'manual') && (
          <div className={styles.form}>
            <div className={styles.formHeader}>
              <span className={styles.formEmoji}>{form.emoji}</span>
              <div>
                <div className={styles.formTitle}>
                  {found ? 'Confirma os dados' : 'Adicionar manualmente'}
                </div>
                {barcodeInput && (
                  <div className={styles.formCode}>Cód: {barcodeInput}</div>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Nome do produto *</label>
              <input
                className={styles.fieldInput}
                placeholder="Ex: Leite Mimosa"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              />
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Categoria</label>
                <select
                  className={styles.fieldInput}
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  <option value="">Seleccionar...</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Quantidade *</label>
                <input
                  className={styles.fieldInput}
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Data de validade *</label>
              <input
                className={styles.fieldInput}
                type="date"
                value={form.expiration_date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setForm(f => ({ ...f, expiration_date: e.target.value }))}
              />
            </div>

            <div className={styles.formActions}>
              <button className={styles.cancelSmall} onClick={handleCancel}>Cancelar</button>
              <button className={styles.saveBtn} onClick={handleSave}>
                Guardar na Despensa →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
