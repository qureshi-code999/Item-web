// =============================================================
//  ✅ MASTER SOURCE FILE — SAHIL TRADERS WEBSITE
//  Filename : INDEX.JSX
//  Purpose  : Ye ORIGINAL source file hai. Sirf isi file ko edit karo.
//  Build    : Edit karne ke baad compile_jsx.ps1 chalao jo
//             INDEX.JSX → app.js generate karta hai.
//  WARNING  : app.js ko KABHI directly edit mat karo — woh
//             auto-generated file hai aur overwrite ho jaati hai.
// =============================================================
import React, { useState, useMemo, useEffect, useRef } from "react";
function getTranslationValue(dictionary, key) {
      return key.split(".").reduce((value, part) => value?.[part], dictionary) || "";
    }
        function tr(language, en, ro, ur) {
      if (language === "ur") return ur;
      if (language === "ro") return (ro !== undefined && ro !== null) ? ro : en;
      return en;
    }
    function triggerHaptic(type = 'light') {
      try {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          if (type === 'light') navigator.vibrate(15);
          else if (type === 'medium') navigator.vibrate(35);
          else if (type === 'success') navigator.vibrate([25, 45, 25]);
          else if (type === 'error') navigator.vibrate([40, 40, 40]);
        }
      } catch (e) {}
    }
    function buildWhatsAppUrl(phoneNumber, message) {
      const cleanPhone = String(phoneNumber || '923368945775').replace(/[^0-9]/g, '');
      const encodedText = encodeURIComponent(message || '');
      const isMobile = typeof navigator !== 'undefined' && (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()));
      if (isMobile) {
        return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
      } else {
        return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
      }
    }

    function saveInvoiceAsImage(order, language) {
      triggerHaptic('success');
      const canvas = document.createElement('canvas');
      const scale = 2;
      const width = 640;
      const items = order.items || [];
      let dynamicRowsHeight = 0;
      items.forEach(it => {
        dynamicRowsHeight += 44;
        if (it.variant) dynamicRowsHeight += 18;
        if (it.extraPercent > 0) dynamicRowsHeight += 24;
      });
      const totalBulkSaved = order.totalSavings || items.reduce((acc, it) => acc + (it.extraSavings || 0), 0);
      const totalBlockHeight = totalBulkSaved > 0 ? 140 : 115;
      const height = Math.max(680, 130 + 95 + 40 + dynamicRowsHeight + totalBlockHeight + 110);
      
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(16, 16, width - 32, height - 32);

      ctx.fillStyle = '#0f172a';
      ctx.font = '900 22px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
      ctx.fillText('SAHIL TRADERS', 36, 52);

      ctx.fillStyle = '#64748b';
      ctx.font = '600 10.5px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
      ctx.fillText('WHOLESALE & RETAIL STORE • KARACHI', 36, 70);

      ctx.fillStyle = '#475569';
      ctx.font = '600 11px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
      ctx.fillText('📞 0336-8945775', 36, 88);

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(width - 165, 34, 130, 24, 6);
      else ctx.rect(width - 165, 34, 130, 24);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 10.5px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OFFICIAL INVOICE', width - 100, 50);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#0f172a';
      ctx.font = '800 13px system-ui, sans-serif';
      ctx.fillText('#ST-' + (order.id || ''), width - 36, 76);
      ctx.fillStyle = '#64748b';
      ctx.font = '500 10.5px system-ui, sans-serif';
      ctx.fillText(order.dateText || new Date().toLocaleDateString(), width - 36, 92);
      ctx.textAlign = 'left';

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(36, 110);
      ctx.lineTo(width - 36, 110);
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(36, 122, width - 72, 70, 8);
      else ctx.rect(36, 122, width - 72, 70);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '700 9.5px system-ui, sans-serif';
      ctx.fillText('CUSTOMER DETAILS', 50, 140);
      ctx.fillStyle = '#0f172a';
      ctx.font = '800 13px system-ui, sans-serif';
      ctx.fillText(order.customer?.name || 'Walk-in Customer', 50, 158);
      ctx.fillStyle = '#64748b';
      ctx.font = '600 11px system-ui, sans-serif';
      ctx.fillText(order.customer?.phone || '', 50, 174);

      ctx.fillStyle = '#64748b';
      ctx.font = '700 9.5px system-ui, sans-serif';
      ctx.fillText('DELIVERY DESTINATION', width / 2 + 10, 140);
      ctx.fillStyle = '#0f172a';
      ctx.font = '800 12.5px system-ui, sans-serif';
      ctx.fillText(order.deliveryMethod === 'pickup' ? '🏬 Store Pickup (BS Mart Karachi)' : '🚚 Home Delivery', width / 2 + 10, 158);
      ctx.fillStyle = '#64748b';
      ctx.font = '500 10.5px system-ui, sans-serif';
      const addr = order.customer?.address || (order.deliveryMethod === 'pickup' ? 'BS Mart Karachi Store' : '');
      ctx.fillText(addr.length > 32 ? addr.substring(0, 32) + '...' : addr, width / 2 + 10, 174);

      let curY = 205;
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(36, curY, width - 72, 28);
      ctx.fillStyle = '#475569';
      ctx.font = '800 10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('#', 50, curY + 18);
      ctx.textAlign = 'left';
      ctx.fillText('ITEM DESCRIPTION', 72, curY + 18);
      ctx.textAlign = 'center';
      ctx.fillText('QTY', width - 195, curY + 18);
      ctx.textAlign = 'right';
      ctx.fillText('UNIT PRICE', width - 110, curY + 18);
      ctx.fillText('TOTAL', width - 46, curY + 18);
      ctx.textAlign = 'left';

      curY += 28;
      items.forEach((it, idx) => {
        const rowStartY = curY;
        ctx.fillStyle = '#64748b';
        ctx.font = '600 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText((idx + 1).toString(), 50, curY + 20);

        ctx.textAlign = 'left';
        ctx.fillStyle = '#0f172a';
        ctx.font = '700 12px system-ui, sans-serif';
        const nameText = (it.name || '').length > 36 ? (it.name || '').substring(0, 34) + '...' : (it.name || '');
        ctx.fillText(nameText, 72, curY + 20);
        curY += 22;

        if (it.variant) {
          ctx.fillStyle = '#b45309';
          ctx.font = '700 10px system-ui, sans-serif';
          ctx.fillText('🎨 Shade: ' + it.variant, 72, curY + 13);
          curY += 16;
        }

        if (it.extraPercent > 0) {
          ctx.fillStyle = '#f0fdf4';
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(72, curY + 2, 260, 18, 4);
          else ctx.rect(72, curY + 2, 260, 18);
          ctx.fill();
          ctx.strokeStyle = '#bbf7d0';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = '#15803d';
          ctx.font = '800 9.5px system-ui, sans-serif';
          ctx.fillText('🎁 Bulk Discount (' + it.extraPercent + '% OFF): Saved Rs ' + Number(it.extraSavings || 0).toLocaleString(), 78, curY + 14);
          curY += 22;
        }

        ctx.textAlign = 'center';
        ctx.fillStyle = '#0f172a';
        ctx.font = '800 12px system-ui, sans-serif';
        ctx.fillText((it.qty || 1).toString(), width - 195, rowStartY + 20);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#0f172a';
        ctx.font = '600 12px system-ui, sans-serif';
        ctx.fillText('Rs ' + Number(it.price || 0).toLocaleString(), width - 110, rowStartY + 20);
        if (it.extraPercent > 0) {
          ctx.fillStyle = '#16a34a';
          ctx.font = '700 9.5px system-ui, sans-serif';
          ctx.fillText('(Rs ' + Math.round(it.total / (it.qty || 1)).toLocaleString() + '/pc)', width - 110, rowStartY + 33);
        }

        ctx.fillStyle = '#0f172a';
        ctx.font = '800 12.5px system-ui, sans-serif';
        ctx.fillText('Rs ' + Number(it.total || (it.qty * it.price)).toLocaleString(), width - 46, rowStartY + 20);
        ctx.textAlign = 'left';

        curY += 6;
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(36, curY);
        ctx.lineTo(width - 36, curY);
        ctx.stroke();
        curY += 6;
      });

      curY += 10;
      const totalsLeft = width - 290;
      
      ctx.fillStyle = '#64748b';
      ctx.font = '600 12px system-ui, sans-serif';
      ctx.fillText('Subtotal:', totalsLeft, curY + 14);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 12px system-ui, sans-serif';
      ctx.fillText('Rs ' + Number(order.subtotal || 0).toLocaleString(), width - 46, curY + 14);
      ctx.textAlign = 'left';
      curY += 22;

      if (totalBulkSaved > 0) {
        ctx.fillStyle = '#15803d';
        ctx.font = '800 12px system-ui, sans-serif';
        ctx.fillText('🎁 Total Bulk Saved:', totalsLeft, curY + 14);
        ctx.textAlign = 'right';
        ctx.fillText('-Rs ' + Number(totalBulkSaved).toLocaleString(), width - 46, curY + 14);
        ctx.textAlign = 'left';
        curY += 22;
      }

      ctx.fillStyle = '#64748b';
      ctx.font = '600 12px system-ui, sans-serif';
      ctx.fillText('Delivery Fee:', totalsLeft, curY + 14);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 12px system-ui, sans-serif';
      ctx.fillText(order.deliveryFee === 0 ? 'FREE' : 'Rs ' + order.deliveryFee, width - 46, curY + 14);
      ctx.textAlign = 'left';
      curY += 22;

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(totalsLeft, curY + 4);
      ctx.lineTo(width - 46, curY + 4);
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.font = '900 13px system-ui, sans-serif';
      ctx.fillText('Total Payable:', totalsLeft, curY + 22);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#16a34a';
      ctx.font = '900 16px system-ui, sans-serif';
      ctx.fillText('Rs ' + Number(order.grandTotal || 0).toLocaleString(), width - 46, curY + 22);
      ctx.textAlign = 'left';
      curY += 40;

      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(36, curY);
      ctx.lineTo(width - 36, curY);
      ctx.stroke();
      ctx.setLineDash([]);

      curY += 22;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 11.5px system-ui, sans-serif';
      ctx.fillText('❤️ Thank you for choosing Sahil Traders!', width / 2, curY);
      curY += 18;
      ctx.fillStyle = '#64748b';
      ctx.font = '500 10.5px system-ui, sans-serif';
      ctx.fillText('For exchanges or inquiries, WhatsApp us at +92 336 8945775', width / 2, curY);

      canvas.toBlob(async function(blob) {
        if (!blob) return;
        const fileName = `Sahil_Traders_Invoice_#ST-${order.id}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `Sahil Traders Invoice #${order.id}`,
              text: 'Official Invoice - Sahil Traders Karachi'
            });
            return;
          } catch(e) {}
        }

        const link = document.createElement('a');
        link.download = fileName;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, 'image/png');
    }

    function generatePDFReceipt(order, language) {
      triggerHaptic('success');
      const totalBulkSaved = order.totalSavings || (order.items || []).reduce((acc, it) => acc + (it.extraSavings || 0), 0);
      const itemsRows = (order.items || []).map((item, idx) => {
        const itemExtraSavings = Number(item.extraSavings || 0);
        const itemExtraPercent = Number(item.extraPercent || 0);
        const variantText = item.variant ? `<div style="font-size: 11px; color: #b45309; font-weight: 700; margin-top: 2px;">🎨 Shade/Colour: ${item.variant}</div>` : '';
        const discountBadge = itemExtraPercent > 0 ? `
          <div style="font-size: 11px; color: #15803d; font-weight: 700; margin-top: 3px; display: inline-flex; align-items: center; gap: 4px; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 2px 6px; border-radius: 4px;">
            🎁 Bulk Discount (${itemExtraPercent}% OFF): Saved Rs ${itemExtraSavings.toLocaleString()}
          </div>
        ` : '';

        return `
        <tr>
          <td style="padding: 10px 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-align: center; color: #64748b; vertical-align: top;">${idx + 1}</td>
          <td style="padding: 10px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 600; color: #0f172a; vertical-align: top;">
            <div>${item.name}</div>
            ${variantText}
            ${discountBadge}
          </td>
          <td style="padding: 10px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: center; color: #0f172a; vertical-align: top; font-weight: 700;">${item.qty || 1}</td>
          <td style="padding: 10px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; text-align: right; color: #0f172a; vertical-align: top;">
            <div>Rs ${Number(item.price || 0).toLocaleString()}</div>
            ${itemExtraPercent > 0 ? `<div style="font-size: 10.5px; color: #16a34a; font-weight: 700;">(Effective: Rs ${Math.round(item.total / (item.qty || 1)).toLocaleString()}/pc)</div>` : ''}
          </td>
          <td style="padding: 10px 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; font-weight: 700; text-align: right; color: #0f172a; vertical-align: top;">
            Rs ${Number(item.total || (item.qty * item.price) || 0).toLocaleString()}
          </td>
        </tr>
      `;
      }).join('');

      const orderJsonEscaped = JSON.stringify(order).replace(/</g, '\\u003c');

      const printHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice #${order.id} - Sahil Traders</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; background: #f8fafc; margin: 0; padding: 16px; }
            .invoice-card { max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 18px; }
            .brand-title { font-size: 22px; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; color: #0f172a; margin: 0; }
            .brand-sub { font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-top: 3px; }
            .inv-badge { background: #0f172a; color: #fff; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; font-size: 12px; background: #f8fafc; padding: 12px 14px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .meta-label { color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; }
            .meta-val { color: #0f172a; font-weight: 700; margin-top: 2px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
            th { background: #f1f5f9; padding: 8px 10px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; text-align: left; }
            .totals { margin-left: auto; width: 280px; font-size: 13px; }
            .totals-row { display: flex; justify-content: space-between; padding: 4px 0; color: #64748b; }
            .totals-row.grand { font-size: 16px; font-weight: 900; color: #0f172a; border-top: 2px solid #0f172a; padding-top: 8px; margin-top: 6px; }
            .footer { text-align: center; margin-top: 22px; padding-top: 14px; border-top: 1px dashed #cbd5e1; font-size: 11px; color: #64748b; }
            .action-btn-container { display: flex; gap: 10px; max-width: 620px; margin: 16px auto 0; flex-wrap: wrap; }
            .save-gallery-btn { flex: 1; min-width: 180px; padding: 13px 16px; background: linear-gradient(135deg, #059669, #0d9488); color: #ffffff; border: none; border-radius: 10px; font-weight: 900; font-size: 13.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 14px rgba(5,150,105,0.35); transition: transform 0.15s; }
            .save-gallery-btn:active { transform: scale(0.98); }
            .print-btn { flex: 1; min-width: 160px; padding: 13px 16px; background: #0f172a; color: #ffffff; border: none; border-radius: 10px; font-weight: 800; font-size: 13.5px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(15,23,42,0.2); }
            .print-btn:active { transform: scale(0.98); }
            @media print { .action-btn-container { display: none; } body { padding: 0; background: #fff; } .invoice-card { border: none; box-shadow: none; padding: 0; } }
          </style>
        </head>
        <body>
          <div class="invoice-card">
            <div class="header">
              <div>
                <h1 class="brand-title">Sahil Traders</h1>
                <div class="brand-sub">Wholesale & Retail Store • Karachi</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">📞 0336-8945775</div>
              </div>
              <div style="text-align: right;">
                <span class="inv-badge">OFFICIAL INVOICE</span>
                <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 6px;">#ST-${order.id}</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 2px;">${order.dateText || new Date().toLocaleDateString()}</div>
              </div>
            </div>

            <div class="meta-grid">
              <div>
                <div class="meta-label">Customer Details</div>
                <div class="meta-val">${order.customer?.name || 'Walk-in Customer'}</div>
                <div style="color: #64748b; font-size: 11px;">${order.customer?.phone || ''}</div>
              </div>
              <div>
                <div class="meta-label">Delivery Destination</div>
                <div class="meta-val">${order.deliveryMethod === 'pickup' ? '🏬 Store Pickup (BS Mart Karachi)' : '🚚 Home Delivery'}</div>
                <div style="color: #64748b; font-size: 11px;">${order.customer?.address || 'BS Mart Karachi Store'}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 25px; text-align: center;">#</th>
                  <th>Item Description</th>
                  <th style="width: 45px; text-align: center;">Qty</th>
                  <th style="width: 100px; text-align: right;">Unit Price</th>
                  <th style="width: 85px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span>Rs ${Number(order.subtotal || 0).toLocaleString()}</span>
              </div>
              ${totalBulkSaved > 0 ? `
              <div class="totals-row" style="color: #15803d; font-weight: 700;">
                <span>🎁 Total Bulk Saved:</span>
                <span>-Rs ${Number(totalBulkSaved).toLocaleString()}</span>
              </div>
              ` : ''}
              <div class="totals-row">
                <span>Delivery Fee:</span>
                <span>${order.deliveryFee === 0 ? 'FREE' : `Rs ${order.deliveryFee}`}</span>
              </div>
              <div class="totals-row grand">
                <span>Total Payable:</span>
                <span style="color: #16a34a;">Rs ${Number(order.grandTotal || 0).toLocaleString()}</span>
              </div>
            </div>

            <div class="footer">
              <div>❤️ <strong>Thank you for choosing Sahil Traders!</strong></div>
              <div style="margin-top: 4px;">For exchanges or inquiries, WhatsApp us at <strong>+92 336 8945775</strong></div>
            </div>
          </div>

          <div class="action-btn-container">
            <button class="save-gallery-btn" onclick="saveToGallery()">
              <span>📸</span>
              <span>Save to Gallery (تصویر محفوظ کریں)</span>
            </button>
            <button class="print-btn" onclick="window.print()">
              <span>🖨️</span>
              <span>Print / Save as PDF</span>
            </button>
          </div>

          <script>
            const orderData = ${orderJsonEscaped};
            window.saveToGallery = async function() {
              const btn = document.querySelector('.save-gallery-btn');
              if (btn) btn.innerHTML = '<span>⏳</span><span>Saving to Gallery...</span>';

              try {
                const canvas = document.createElement('canvas');
                const scale = 2;
                const width = 640;
                const items = orderData.items || [];
                let dynamicRowsHeight = 0;
                items.forEach(it => {
                  dynamicRowsHeight += 44;
                  if (it.variant) dynamicRowsHeight += 18;
                  if (it.extraPercent > 0) dynamicRowsHeight += 24;
                });
                const totalBulkSaved = orderData.totalSavings || items.reduce((acc, it) => acc + (it.extraSavings || 0), 0);
                const totalBlockHeight = totalBulkSaved > 0 ? 140 : 115;
                const height = Math.max(680, 130 + 95 + 40 + dynamicRowsHeight + totalBlockHeight + 110);
                
                canvas.width = width * scale;
                canvas.height = height * scale;
                const ctx = canvas.getContext('2d');
                ctx.scale(scale, scale);

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);

                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 1;
                ctx.strokeRect(16, 16, width - 32, height - 32);

                ctx.fillStyle = '#0f172a';
                ctx.font = '900 22px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
                ctx.fillText('SAHIL TRADERS', 36, 52);

                ctx.fillStyle = '#64748b';
                ctx.font = '600 10.5px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
                ctx.fillText('WHOLESALE & RETAIL STORE • KARACHI', 36, 70);

                ctx.fillStyle = '#475569';
                ctx.font = '600 11px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
                ctx.fillText('📞 0336-8945775', 36, 88);

                ctx.fillStyle = '#0f172a';
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(width - 165, 34, 130, 24, 6);
                else ctx.rect(width - 165, 34, 130, 24);
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.font = '800 10.5px system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('OFFICIAL INVOICE', width - 100, 50);

                ctx.textAlign = 'right';
                ctx.fillStyle = '#0f172a';
                ctx.font = '800 13px system-ui, sans-serif';
                ctx.fillText('#ST-' + (orderData.id || ''), width - 36, 76);
                ctx.fillStyle = '#64748b';
                ctx.font = '500 10.5px system-ui, sans-serif';
                ctx.fillText(orderData.dateText || new Date().toLocaleDateString(), width - 36, 92);
                ctx.textAlign = 'left';

                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(36, 110);
                ctx.lineTo(width - 36, 110);
                ctx.stroke();

                ctx.fillStyle = '#f8fafc';
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(36, 122, width - 72, 70, 8);
                else ctx.rect(36, 122, width - 72, 70);
                ctx.fill();
                ctx.strokeStyle = '#e2e8f0';
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = '#64748b';
                ctx.font = '700 9.5px system-ui, sans-serif';
                ctx.fillText('CUSTOMER DETAILS', 50, 140);
                ctx.fillStyle = '#0f172a';
                ctx.font = '800 13px system-ui, sans-serif';
                ctx.fillText(orderData.customer?.name || 'Walk-in Customer', 50, 158);
                ctx.fillStyle = '#64748b';
                ctx.font = '600 11px system-ui, sans-serif';
                ctx.fillText(orderData.customer?.phone || '', 50, 174);

                ctx.fillStyle = '#64748b';
                ctx.font = '700 9.5px system-ui, sans-serif';
                ctx.fillText('DELIVERY DESTINATION', width / 2 + 10, 140);
                ctx.fillStyle = '#0f172a';
                ctx.font = '800 12.5px system-ui, sans-serif';
                ctx.fillText(orderData.deliveryMethod === 'pickup' ? '🏬 Store Pickup (BS Mart Karachi)' : '🚚 Home Delivery', width / 2 + 10, 158);
                ctx.fillStyle = '#64748b';
                ctx.font = '500 10.5px system-ui, sans-serif';
                const addr = orderData.customer?.address || (orderData.deliveryMethod === 'pickup' ? 'BS Mart Karachi Store' : '');
                ctx.fillText(addr.length > 32 ? addr.substring(0, 32) + '...' : addr, width / 2 + 10, 174);

                let curY = 205;
                ctx.fillStyle = '#f1f5f9';
                ctx.fillRect(36, curY, width - 72, 28);
                ctx.fillStyle = '#475569';
                ctx.font = '800 10px system-ui, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('#', 50, curY + 18);
                ctx.textAlign = 'left';
                ctx.fillText('ITEM DESCRIPTION', 72, curY + 18);
                ctx.textAlign = 'center';
                ctx.fillText('QTY', width - 195, curY + 18);
                ctx.textAlign = 'right';
                ctx.fillText('UNIT PRICE', width - 110, curY + 18);
                ctx.fillText('TOTAL', width - 46, curY + 18);
                ctx.textAlign = 'left';

                curY += 28;
                items.forEach((it, idx) => {
                  const rowStartY = curY;
                  ctx.fillStyle = '#64748b';
                  ctx.font = '600 11px system-ui, sans-serif';
                  ctx.textAlign = 'center';
                  ctx.fillText((idx + 1).toString(), 50, curY + 20);

                  ctx.textAlign = 'left';
                  ctx.fillStyle = '#0f172a';
                  ctx.font = '700 12px system-ui, sans-serif';
                  const nameText = (it.name || '').length > 36 ? (it.name || '').substring(0, 34) + '...' : (it.name || '');
                  ctx.fillText(nameText, 72, curY + 20);
                  curY += 22;

                  if (it.variant) {
                    ctx.fillStyle = '#b45309';
                    ctx.font = '700 10px system-ui, sans-serif';
                    ctx.fillText('🎨 Shade: ' + it.variant, 72, curY + 13);
                    curY += 16;
                  }

                  if (it.extraPercent > 0) {
                    ctx.fillStyle = '#f0fdf4';
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(72, curY + 2, 260, 18, 4);
                    else ctx.rect(72, curY + 2, 260, 18);
                    ctx.fill();
                    ctx.strokeStyle = '#bbf7d0';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.fillStyle = '#15803d';
                    ctx.font = '800 9.5px system-ui, sans-serif';
                    ctx.fillText('🎁 Bulk Discount (' + it.extraPercent + '% OFF): Saved Rs ' + Number(it.extraSavings || 0).toLocaleString(), 78, curY + 14);
                    curY += 22;
                  }

                  ctx.textAlign = 'center';
                  ctx.fillStyle = '#0f172a';
                  ctx.font = '800 12px system-ui, sans-serif';
                  ctx.fillText((it.qty || 1).toString(), width - 195, rowStartY + 20);

                  ctx.textAlign = 'right';
                  ctx.fillStyle = '#0f172a';
                  ctx.font = '600 12px system-ui, sans-serif';
                  ctx.fillText('Rs ' + Number(it.price || 0).toLocaleString(), width - 110, rowStartY + 20);
                  if (it.extraPercent > 0) {
                    ctx.fillStyle = '#16a34a';
                    ctx.font = '700 9.5px system-ui, sans-serif';
                    ctx.fillText('(Rs ' + Math.round(it.total / (it.qty || 1)).toLocaleString() + '/pc)', width - 110, rowStartY + 33);
                  }

                  ctx.fillStyle = '#0f172a';
                  ctx.font = '800 12.5px system-ui, sans-serif';
                  ctx.fillText('Rs ' + Number(it.total || (it.qty * it.price)).toLocaleString(), width - 46, rowStartY + 20);
                  ctx.textAlign = 'left';

                  curY += 6;
                  ctx.strokeStyle = '#e2e8f0';
                  ctx.lineWidth = 1;
                  ctx.beginPath();
                  ctx.moveTo(36, curY);
                  ctx.lineTo(width - 36, curY);
                  ctx.stroke();
                  curY += 6;
                });

                curY += 10;
                const totalsLeft = width - 290;
                
                ctx.fillStyle = '#64748b';
                ctx.font = '600 12px system-ui, sans-serif';
                ctx.fillText('Subtotal:', totalsLeft, curY + 14);
                ctx.textAlign = 'right';
                ctx.fillStyle = '#0f172a';
                ctx.font = '700 12px system-ui, sans-serif';
                ctx.fillText('Rs ' + Number(orderData.subtotal || 0).toLocaleString(), width - 46, curY + 14);
                ctx.textAlign = 'left';
                curY += 22;

                if (totalBulkSaved > 0) {
                  ctx.fillStyle = '#15803d';
                  ctx.font = '800 12px system-ui, sans-serif';
                  ctx.fillText('🎁 Total Bulk Saved:', totalsLeft, curY + 14);
                  ctx.textAlign = 'right';
                  ctx.fillText('-Rs ' + Number(totalBulkSaved).toLocaleString(), width - 46, curY + 14);
                  ctx.textAlign = 'left';
                  curY += 22;
                }

                ctx.fillStyle = '#64748b';
                ctx.font = '600 12px system-ui, sans-serif';
                ctx.fillText('Delivery Fee:', totalsLeft, curY + 14);
                ctx.textAlign = 'right';
                ctx.fillStyle = '#0f172a';
                ctx.font = '700 12px system-ui, sans-serif';
                ctx.fillText(orderData.deliveryFee === 0 ? 'FREE' : 'Rs ' + orderData.deliveryFee, width - 46, curY + 14);
                ctx.textAlign = 'left';
                curY += 22;

                ctx.strokeStyle = '#0f172a';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(totalsLeft, curY + 4);
                ctx.lineTo(width - 46, curY + 4);
                ctx.stroke();

                ctx.fillStyle = '#0f172a';
                ctx.font = '900 13px system-ui, sans-serif';
                ctx.fillText('Total Payable:', totalsLeft, curY + 22);
                ctx.textAlign = 'right';
                ctx.fillStyle = '#16a34a';
                ctx.font = '900 16px system-ui, sans-serif';
                ctx.fillText('Rs ' + Number(orderData.grandTotal || 0).toLocaleString(), width - 46, curY + 22);
                ctx.textAlign = 'left';
                curY += 40;

                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(36, curY);
                ctx.lineTo(width - 36, curY);
                ctx.stroke();
                ctx.setLineDash([]);

                curY += 22;
                ctx.textAlign = 'center';
                ctx.fillStyle = '#0f172a';
                ctx.font = '700 11.5px system-ui, sans-serif';
                ctx.fillText('❤️ Thank you for choosing Sahil Traders!', width / 2, curY);
                curY += 18;
                ctx.fillStyle = '#64748b';
                ctx.font = '500 10.5px system-ui, sans-serif';
                ctx.fillText('For exchanges or inquiries, WhatsApp us at +92 336 8945775', width / 2, curY);

                canvas.toBlob(async function(blob) {
                  if (!blob) return;
                  const fileName = 'Sahil_Traders_Invoice_#ST-' + (orderData.id || '') + '.png';
                  const file = new File([blob], fileName, { type: 'image/png' });

                  if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                      await navigator.share({
                        files: [file],
                        title: 'Sahil Traders Invoice #' + (orderData.id || ''),
                        text: 'Official Invoice - Sahil Traders Karachi'
                      });
                      if (btn) btn.innerHTML = '<span>✅</span><span>Shared / Saved!</span>';
                      setTimeout(() => { if (btn) btn.innerHTML = '<span>📸</span><span>Save to Gallery (تصویر محفوظ کریں)</span>'; }, 3000);
                      return;
                    } catch(e) {}
                  }

                  const link = document.createElement('a');
                  link.download = fileName;
                  link.href = URL.createObjectURL(blob);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  if (btn) btn.innerHTML = '<span>✅</span><span>Saved to Gallery / Photos!</span>';
                  setTimeout(() => { if (btn) btn.innerHTML = '<span>📸</span><span>Save to Gallery (تصویر محفوظ کریں)</span>'; }, 3000);
                }, 'image/png');

              } catch(err) {
                alert('Error saving image: ' + err.message);
                if (btn) btn.innerHTML = '<span>📸</span><span>Save to Gallery (تصویر محفوظ کریں)</span>';
              }
            };
          </script>
        </body>
        </html>
      `;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(printHtml);
        printWindow.document.close();
      }
    }
    function getImgUrl(path) {
      if (!path) return '';
      if (path.startsWith('http://') || path.startsWith('https://')) return path;
      return `https://sahiltraders.vercel.app/${path}`;
    }
    function translate(dictionary, key, params = {}) {
      let value = getTranslationValue(dictionary, key);
      if (!value) value = key;
      return Object.entries(params).reduce((result, [token, replacement]) => {
        return result.replace(new RegExp(`\\{${token}\\}`, "g"), replacement);
      }, value);
    }
    function translateItemNameToUrdu(text) {
      if (!text) return "";
      let result = text.toUpperCase();
      // Pre-process common units and pricing patterns
      result = result.replace(/(\d+)\s*ML/gi, "$1 \u0627\u06cc\u0645 \u0627\u06cc\u064c");
      result = result.replace(/(\d+)\s*G/gi, "$1 \u06af\u0631\u0627\u0645");
      result = result.replace(/(\d+)\s*KG/gi, "$1 \u06a9\u0644\u0648");
      result = result.replace(/RS\.?\s*(\d+)/gi, "\u0631\u0648\u067e\u06d2 $1");
      result = result.replace(/RP\.?\s*(\d+)/gi, "\u0631\u0648\u067e\u06d2 $1");
      result = result.replace(/(\d+)\s*INCH/gi, "$1 \u0627\u0646\u0686");
      result = result.replace(/(\d+)\s*PCS/gi, "$1 \u0639\u062f\u062f");
      const wordMap = {
        // Brands
        "PEARS": "\u067e\u06cc\u0626\u0631\u0632",
        "PONDS": "\u067e\u0648\u0646\u0686\u0632",
        "SAFEGUARD": "\u0633\u06cc\u0641 \u06af\u0627\u0631\u0686",
        "SAFE GUARD": "\u0633\u06cc\u0641 \u06af\u0627\u0631\u0686",
        "DETTOL": "\u0686\u06cc\u067e\u0648\u0644",
        "DETOL": "\u0686\u06cc\u067e\u0648\u0644",
        "LIFEBUOY": "\u0644\u0627\u0626\u0641 \u0628\u0648\u0627\u0626\u06d2",
        "LUX": "\u0644\u06a9\u0633",
        "MEDORA": "\u0645\u06cc\u0686\u0648\u0631\u0627",
        "OLIVIA": "\u0627\u0648\u0644\u06cc\u0648\u06cc\u0627",
        "TIBET": "\u062a\u0628\u062a",
        "CAPRI": "\u06a9\u06cc\u067e\u0631\u06cc",
        "MECLAY": "\u0645\u06cc\u06a9\u0644\u06d2",
        "GARNIER": "\u06af\u0627\u0631\u0646\u06cc\u0626\u0631",
        "VEET": "\u0648\u06cc\u067e",
        "FAIR & LOVELY": "\u0641\u06cc\u0626\u0631 \u0627\u06cc\u0646\u0686 \u0644\u0648\u0644\u06cc",
        "FAIR AND LOVELY": "\u0641\u06cc\u0626\u0631 \u0627\u06cc\u0646\u0686 \u0644\u0648\u0644\u06cc",
        "GOLDEN PEARL": "\u06af\u0648\u0644\u0686\u0646 \u067e\u0631\u0644",
        "BIO AMLA": "\u0628\u0627\u0626\u06cc\u0648 \u0622\u0645\u0644\u06c1",
        "SUNSILK": "\u0633\u0646 \u0633\u0644\u06a9",
        "PANTENE": "\u067e\u06cc\u0646\u067e\u06cc\u0646",
        "DOVE": "\u0686\u0648",
        "SENSODYNE": "\u0633\u0646\u0633\u0648\u0686\u0627\u0626\u0646",
        "COLGATE": "\u06a9\u0648\u0644\u06af\u06cc\u067e",
        "DENTONIC": "\u0686\u06cc\u0646\u067e\u0648\u0646\u06a9",
        "CLOSE UP": "\u06a9\u0644\u0648\u0632 \u0627\u067e",
        "GILLETTE": "\u062c\u0644\u06cc\u067e",
        "LEMON MAX": "\u0644\u06cc\u0645\u0646 \u0645\u06cc\u06a9\u0633",
        "ARIEL": "\u0627\u06cc\u0631\u06cc\u0644",
        "SURF EXCEL": "\u0633\u0631\u0641 \u0627\u06cc\u06a9\u0633\u0644",
        "BONUS": "\u0628\u0648\u0646\u0633",
        "EXPRESS": "\u0627\u06cc\u06a9\u0633\u067e\u0631\u06cc\u0633",
        "BRITE": "\u0628\u0631\u0627\u0626\u067e",
        "VIM": "\u0648\u0650\u0645",
        "HARPIC": "\u06c1\u0627\u0631\u067e\u06a9",
        "JOHNSONS": "\u062c\u0627\u0646\u0633\u0646\u0632",
        "JOHNSON'S": "\u062c\u0627\u0646\u0633\u0646\u0632",
        "ROSE PETAL": "\u0631\u0648\u0632 \u067e\u06cc\u067e\u0644",
        "LIPTON": "\u0644\u067e\u067e\u0646",
        "TAPAL": "\u067c\u0627\u067e\u0644",
        "NESTLE": "\u0646\u06cc\u0633\u0644\u06d2",
        "EVERYDAY": "\u0627\u06cc\u0648\u0631\u06cc \u0686\u06d2",
        // Product Types / Keywords
        "SOAP": "\u0635\u0627\u0628\u0646",
        "SHAMPOO": "\u0634\u06cc\u0645\u067e\u0648",
        "CREAM": "\u06a9\u0631\u06cc\u0645",
        "LOTION": "\u0644\u0648\u0634\u0646",
        "FACE WASH": "\u0641\u06cc\u0633 \u0648\u0627\u0634",
        "FACEWASH": "\u0641\u06cc\u0633 \u0648\u0627\u0634",
        "TOOTHPASTE": "\u067c\u0648\u062a\u06be \u067e\u06cc\u0633\u067c",
        "HAIR OIL": "\u0628\u0627\u0644\u0648\u06ba \u06a9\u0627 \u062a\u06cc\u0644",
        "OIL": "\u062a\u06cc\u0644",
        "HAIR": "\u0628\u0627\u0644",
        "DEO": "\u0628\u0627\u0686\u06cc \u0627\u0633\u067e\u0631\u06d2 / \u067e\u0627\u0624\u0681\u0631",
        "TALCUM": "\u067c\u0627\u0644\u06a9\u0645",
        "POWDER": "\u067e\u0627\u0624\u0681\u0631",
        "PERFUME": "\u067e\u0631\u0641\u06cc\u0648\u0645",
        "SPRAY": "\u0627\u0633\u067e\u0631\u06d2",
        "DETERGENT": "\u0633\u0631\u0641",
        "BABY": "\u0628\u06cc\u0628\u06cc",
        "CARE": "\u06a9\u06cc\u0626\u0631",
        "SHAVING": "\u0634\u06cc\u0648\u0646\u06af",
        "BLADE": "\u0628\u0644\u06cc\u0686",
        "RAZOR": "\u0631\u06cc\u0622\u0631",
        "PAD": "\u067e\u06cc\u0686",
        "PADS": "\u067e\u06cc\u0686\u0632",
        "PACK": "\u067e\u06cc\u06a9",
        "PACKET": "\u067e\u06cc\u06a9\u067e",
        "TUBE": "\u067c\u06cc\u0648\u0628",
        "BOX": "\u0686\u0628\u06c1",
        "BOTTLE": "\u0628\u0648\u062a\u0644",
        "SMALL": "\u0686\u06be\u0648\u067f\u0627",
        "MEDIUM": "\u062f\u0631\u0645\u06cc\u0627\u0646\u06c1",
        "LARGE": "\u0628\u0686\u0627",
        "WITH": "\u06a9\u06d2 \u0633\u0627\u062a\u06be",
        "FOR": "\u06a9\u06d2 \u0644\u06cc\u06d2",
        "AND": "\u0627\u0648\u0631"
      };
      let words = result.split(/(\s+|,|\(|\)|\/|&)/);
      let translatedWords = words.map(w => {
        let trimmed = w.trim().toUpperCase();
        if (wordMap[trimmed]) {
          return wordMap[trimmed];
        }
        return w;
      });
      let textAfterWordReplacements = translatedWords.join("");
      // Transliterate all remaining A-Z letters and 0-9 digits into Urdu script
      const translitMap = {
        'A': '\u0627', 'B': '\u0628', 'C': '\u06a9', 'D': '\u0686', 'E': '\u06cc', 'F': '\u0641', 'G': '\u06af', 'H': '\u06c1', 'I': '\u0622\u0626\u06cc', 'J': '\u062c', 'K': '\u06a9', 'L': '\u0644', 'M': '\u0645', 'N': '\u0646', 'O': '\u0648', 'P': '\u067e', 'Q': '\u0642', 'R': '\u0631', 'S': '\u0633', 'T': '\u067c', 'U': '\u06cc\u0648', 'V': '\u0648', 'W': '\u0648', 'X': '\u0627\u06cc\u06a9\u0633', 'Y': '\u0648\u0627\u0626\u06d2', 'Z': '\u0632\u06cc\u0686',
        '0': '\u06f0', '1': '\u06f1', '2': '\u06f2', '3': '\u06f3', '4': '\u06f4', '5': '\u06f5', '6': '\u06f6', '7': '\u06f7', '8': '\u06f8', '9': '\u06f9'
      };
      let finalResult = Array.from(textAfterWordReplacements).map(char => {
        let upperChar = char.toUpperCase();
        return translitMap[upperChar] || char;
      }).join("");
      return finalResult.replace(/\s+/g, " ").trim();
    }
    function toTitleCase(str) {
      if (!str) return "";
      return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }
    function getProductPricing(product) {
      if (!product) return { hasDiscount: false, retailPrice: 0, sellingPrice: 0, savings: 0, discountPercent: 0, isAutoMarket: false };
      const sellingPrice = Number(product.price) || 0;
      let retailPrice = Number(product.retailPrice) || 0;
      let isAutoMarket = false;
      
      if (!retailPrice && product.name) {
        const match = product.name.match(/(?:RS|RP|Rs|Rp)[\.,:\s]*(\d+)/i);
        if (match && match[1]) {
          const parsed = parseInt(match[1], 10);
          if (!isNaN(parsed)) {
            retailPrice = parsed;
          }
        }
      }
      
      // AUTO ESTIMATED MARKET PRICE — Category-specific inverse-scaled markup
      if (!retailPrice && sellingPrice > 0) {
        isAutoMarket = true;
        const idNum = Number(product.id) || 1;
        const catId = product.categoryId || '';
        let markupPercent;

        if (catId === 'sports') {
          // Sports & Toys & Birthday: 25% to 38%, INVERSE — cheap = higher %, expensive = lower %
          // Price range roughly Rs 20 to Rs 1500 for sports items
          // Higher price → lower markup (approaching 25%), Lower price → higher markup (approaching 38%)
          const priceClamp = Math.max(20, Math.min(sellingPrice, 1500));
          const ratio = (priceClamp - 20) / (1500 - 20); // 0 (cheap) to 1 (expensive)
          const baseMarkup = 38 - Math.round(ratio * 13); // 38% → 25%
          const jitter = (idNum * 17 + 7) % 3; // 0, 1, or 2 for natural variation
          markupPercent = baseMarkup + jitter;
          markupPercent = Math.max(25, Math.min(38, markupPercent));

        } else if (catId === 'stationary') {
          // Stationary & Tapes: 25% to 39%, INVERSE — cheap = higher %, expensive = lower %
          // Price range roughly Rs 10 to Rs 600 for stationary items
          const priceClamp = Math.max(10, Math.min(sellingPrice, 600));
          const ratio = (priceClamp - 10) / (600 - 10); // 0 (cheap) to 1 (expensive)
          const baseMarkup = 39 - Math.round(ratio * 14); // 39% → 25%
          const jitter = (idNum * 23 + 11) % 3; // 0, 1, or 2 variation
          markupPercent = baseMarkup + jitter;
          markupPercent = Math.max(25, Math.min(39, markupPercent));

        } else {
          // All other categories: 14% to 26% varied by product ID
          markupPercent = 14 + ((idNum * 37 + 13) % 13); // 14% to 26%
        }

        const rawMarket = sellingPrice * (1 + markupPercent / 100);
        if (sellingPrice < 50) {
          retailPrice = Math.ceil(rawMarket / 5) * 5;
        } else if (sellingPrice < 200) {
          retailPrice = Math.ceil(rawMarket / 10) * 10;
        } else if (sellingPrice < 1000) {
          retailPrice = Math.ceil(rawMarket / 10) * 10;
        } else {
          retailPrice = Math.ceil(rawMarket / 50) * 50;
        }
        if (retailPrice <= sellingPrice) {
          retailPrice = sellingPrice + 10;
        }
      }
      
      if (retailPrice > sellingPrice && sellingPrice > 0) {
        const savings = retailPrice - sellingPrice;
        const discountPercent = Math.round((savings / retailPrice) * 100);
        return {
          hasDiscount: true,
          retailPrice,
          sellingPrice,
          savings,
          discountPercent,
          isAutoMarket
        };
      }
      
      return {
        hasDiscount: false,
        retailPrice: 0,
        sellingPrice,
        savings: 0,
        discountPercent: 0,
        isAutoMarket: false
      };
    }
    // --- Wholesale Bulk Quantity Discount Tiers ---
    function getBulkDiscountTier(qty) {
      const q = Math.max(0, Number(qty) || 0);
      if (q >= 60) return { percent: 3.2, label: '3.2% Extra Bulk Discount' };
      if (q >= 48) return { percent: 2.8, label: '2.8% Extra Bulk Discount' };
      if (q >= 36) return { percent: 2.2, label: '2.2% Extra Bulk Discount' };
      if (q >= 24) return { percent: 1.8, label: '1.8% Extra Bulk Discount' };
      if (q >= 12) return { percent: 1.2, label: '1.2% Extra Bulk Discount' };
      if (q >= 6) return { percent: 0.6, label: '0.6% Extra Bulk Discount' };
      return { percent: 0, label: '' };
    }
    function calculateBulkPricing(sellingPrice, qty) {
      const q = Math.max(1, Number(qty) || 1);
      const sp = Number(sellingPrice) || 0;
      const baseTotal = sp * q;
      const tier = getBulkDiscountTier(q);
      const extraPercent = tier.percent;
      const extraSavings = extraPercent > 0 ? Math.round(baseTotal * (extraPercent / 100)) : 0;
      const finalTotal = baseTotal - extraSavings;
      const effectiveUnitPrice = q > 0 ? Math.round(finalTotal / q) : sp;

      return {
        qty: q,
        baseTotal,
        extraPercent,
        extraSavings,
        finalTotal,
        effectiveUnitPrice,
        tierLabel: tier.label
      };
    }
    function getProductDisplayName(product, language) {
      if (!product) return "";
      if (language === "ur" && product.nameUrdu) {
        return product.nameUrdu;
      }
      let name = product.name || "";
      // Clean off trailing price tags like RS,250 or RP,400 for neat display
      name = name.replace(/\s*\(?\b(?:RS|RP|Rs|Rp)[\.,:\s]*\d+\)?\s*$/i, "").trim();
      return toTitleCase(name);
    }
    // --- Lucide Icons Replacements (SVG Components) ---
    function Search({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      );
    }
    function ChevronDown({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      );
    }
    function ShoppingBag({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      );
    }
    function ImageOff({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M21 21H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3m4 0h9a2 2 0 0 1 2 2v12"></path>
          <circle cx="9.5" cy="9.5" r="1.5"></circle>
        </svg>
      );
    }
    function X({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      );
    }
    function Store({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      );
    }
    function Clock({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      );
    }
    function EditIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      );
    }
    function TrashIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      );
    }
    function PlusIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      );
    }
    function ShampooIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 21a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v11z" />
          <path d="M12 2v6" />
          <path d="M9 5h6" />
          <path d="M10 13h4" />
          <path d="M10 17h4" />
        </svg>
      );
    }
    function SoapIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="12" rx="3" />
          <circle cx="7" cy="12" r="1" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="14" cy="14" r="1" />
          <circle cx="17" cy="11" r="2" />
        </svg>
      );
    }
    function FaceWashIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12l-2 15H8L6 3z" />
          <path d="M9 18h6v3H9z" />
          <path d="M8 8h8" />
          <path d="M10 12h4" />
        </svg>
      );
    }
    function CreamIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 9h14v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9z" />
          <rect x="4" y="5" width="16" height="4" rx="1" />
          <path d="M5 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 4 2" />
        </svg>
      );
    }
    function RazorIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8v13" />
          <rect x="6" y="3" width="12" height="5" rx="1.5" />
          <line x1="8" y1="5" x2="16" y2="5" />
          <line x1="8" y1="6.5" x2="16" y2="6.5" />
          <line x1="11" y1="12" x2="13" y2="12" />
          <line x1="11" y1="15" x2="13" y2="15" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      );
    }
    function PerfumeIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <rect x="10" y="7" width="4" height="3" />
          <path d="M12 3v4" />
          <path d="M9 3h6" />
          <path d="M5 5c-1-1-2-1-3 0" />
          <path d="M19 5c1-1 2-1 3 0" />
        </svg>
      );
    }
    // --- Product Categories and Data ---
    var DEFAULT_CATEGORIES = [
      { id: "soaps",        name: "Soaps" },
      { id: "shampoo",      name: "Shampoo & Conditioners" },
      { id: "creams",       name: "Creams & Lotions & Bleach" },
      { id: "stationary",   name: "Stationary & Tapes" },
      { id: "sports",       name: "Sports & Toys" },
      { id: "shaving",      name: "Shaving & Razers & Blades" },
      { id: "haircolour",   name: "Hair Colors & Care & Oils" },
      { id: "condemn",      name: "Condoms" },
      { id: "lock",         name: "Locks & Cells & Lighters" },
      { id: "general",      name: "General Items & Others" },
      { id: "babycare",     name: "Baby Care & Powders" },
      { id: "mosquito",     name: "Anti- Mosquitoes" },
      { id: "personalcare", name: "Personal Care" },
      { id: "fragnances",   name: "Fragnances & Roll on" },
      { id: "toothpasteandbrush", name: "Dental Cares" },
      { id: "facewash",     name: "Face Wash & Body Washes" }
    ];
    function getGlobalCategories() {
      return (typeof window !== 'undefined' && Array.isArray(window.CATEGORIES) && window.CATEGORIES.length > 0)
        ? window.CATEGORIES
        : DEFAULT_CATEGORIES;
    }
    var CATEGORIES = DEFAULT_CATEGORIES;
    var SWATCH_GRADIENTS = [
      "from-amber-400 to-orange-500",
      "from-violet-500 to-purple-600",
      "from-emerald-400 to-teal-600",
      "from-rose-400 to-pink-600",
      "from-sky-400 to-blue-600",
      "from-fuchsia-400 to-purple-600",
      "from-teal-400 to-cyan-600",
      "from-indigo-400 to-violet-600",
    ];
    var PRODUCTS = [
      { id: 1, name: "7 HERBAL OIL 100ML RS,250", price: 220, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 2, name: "7 HERBAL OIL 200ML RP,400", price: 369, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 3, name: "7 HERBAL OIL 50ML RS,170", price: 155, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 5, name: "AL RASHIEED OIL 100ML SASSO", price: 480, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 6, name: "ALOE VERA GEL TUBE (LARGE)", price: 140, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "A" },
      { id: 7, name: "ALOE VERA GEL TUBE 160ml (MEDIUM) 160ML", price: 99, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "A" },
      { id: 8, name: "ALOE VERA GEL TUBE (SMALL) 80ML", price: 70, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "A" },
      { id: 14, name: "SNOW FALL SPRAY (LARGE)", price: 180, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 15, name: "SNOW FALL SPRAY SMALL", price: 120, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 16, name: "SNOW FALL SPRAY SMALL (KIWI)", price: 140, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 17, name: "BAJAJ ALMOND OIL 100ml", price: 950, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 18, name: "BALL ADIDAS", price: 100, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 21, name: "BALL CA GOOD QUALITY (NON ORIGINAL)", price: 120, categoryId: "sports", categoryName: "Sports & Toys & Birthday" , filterName: "CA" },
      { id: 22, name: "BALL CA GOOD QUALITY (ORIGINAL)", price: 250, categoryId: "sports", categoryName: "Sports & Toys & Birthday" , filterName: "CA" },
      { id: 23, name: "BALL FINE (ORIGINAL)", price: 170, categoryId: "sports", categoryName: "Sports & Toys & Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
      { id: 26, name: "BALL PEN MAX (BLACK)", price: 30, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 27, name: "BALL PEN MAX (BLUE)", price: 30, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 28, name: "BALL PEN MAX (RED)", price: 30, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 29, name: "BALL PEN PEN (SKY) BLACK", price: 15, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 30, name: "BALL PEN PEN (SKY) BLUE", price: 15, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 31, name: "BALL PEN PEN (SKY) RED", price: 15, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 32, name: "BALL PEN PIANO YELLOW BLUE CAP", price: 15, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 33, name: "BALL PEN PICASSO BLUE", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 34, name: "BALL PEN PICASSO RED", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 37, name: "BALL POINT PEN SIGNATURE (BLACK)", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 38, name: "BALL POINT PEN SIGNATURE (BLUE)", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 46, name: "BANYAN (# 38)", price: 165, categoryId: "general", categoryName: "General Items & Others" },
      { id: 47, name: "BANYAN (# 40)", price: 175, categoryId: "general", categoryName: "General Items & Others" },
      { id: 48, name: "BANYAN (# 42)", price: 185, categoryId: "general", categoryName: "General Items & Others" },
      { id: 49, name: "BANYAN (# 44)" ,price: 195, categoryId: "general", categoryName: "General Items & Others" },
      { id: 50, name: "BANYAN CHILD  30# GOOD QUALITY", price: 80, categoryId: "general", categoryName: "General Items & Others" },
      { id: 51, name: "BIO AMLA HAIR OIL 100ml RS,280", price: 190, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 52, name: "BIO AMLA HAIR OIL 200ml FARVAL ORIGINAL RS,475", price: 380, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 53, name: "BIO AMLA HAIR OIL 50ml FARVAL ORIGINAL RS,160", price: 140, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 54, name: "BIRTHDAY CANDLE 0 TO 9 NUMBERS", price: 50, categoryId: "sports", categoryName: "Sports & Toys & Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 59, name: "BLACK COBRA SPRAY 300ML", price: 420, categoryId: "mosquito", categoryName: "Anti- Mosquitoes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
      { id: 60, name: "HUDA BEAUTY MASK SACHET", price: 50, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 61, name: "BLADE 7 O CLOCK GREEN", price: 80, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
      { id: 62, name: "BLADE TREET (BLACK)", price: 70, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 64, name: "BLADE TREET (PLATINUM)", price: 90, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 65, name: "BODY RAZOR TINKLE (DOUBLE PACK SAFETY)", price: 190, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 66, name: "BODY RAZOR TWINKLE LADIES (EYEBROW)", price: 75, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
      { id: 67, name: "BODY SPRAY (INDO) MIX", price: 240, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 68, name: "BODY SPRAY AXE (CHOCOLATE)", price: 690, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
      { id: 69, name: "BODY SPRAY AXE (MIX)", price: 690, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 70, name: "BODY SPRAY BOLD (MIX) OLD SLIM", price: 690, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
      { id: 71, name: "BODY SPRAY BRUT (GREEN)", price: 790, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 72, name: "BODY SPRAY CHI CHI (BLUE) FOR MEN", price: 690, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 73, name: "BODY SPRAY CHI CHI (CRAZY GIRL)", price: 690, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 75, name: "BODY SPRAY CHI CHI (PINK) WOMEN", price: 690, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 76, name: "BODY SPRAY CHI CHI (SOLID)", price: 690, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
      { id: 77, name: "BODY SPRAY DUNHILL DESIRE (BLACK)", price: 640, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 78, name: "BODY SPRAY DUNHILL DESIRE (BLUE)", price: 640, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 79, name: "BODY SPRAY DUNHILL DESIRE (RED)", price: 640, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 81, name: "BODY SPRAY EVERY ONE", price: 590, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
      { id: 82, name: "BODY SPRAY FERRARI (MIX)", price: 390, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 83, name: "BODY SPRAY FOGG (BLACK) MARCO (PK)", price: 949, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 84, name: "BODY SPRAY FOGG (DARK BLUE) ROYAL", price: 949, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 85, name: "BODY SPRAY FOGG (GREEN) VICTOR", price: 949, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 86, name: "BODY SPRAY FOGG (LIGHT,BLUE) IMPERIAL", price: 949, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 87, name: "BODY SPRAY FOGG (LIGHT,GREEN) MAJESTIC", price: 949, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 88, name: "BODY SPRAY FOGG (MEHROON) MONARCH", price: 949, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 89, name: "BODY SPRAY FOGG (PURPLE) PARADISE", price: 949, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 90, name: "BODY SPRAY FOGG (RED) NAPOLEON", price: 949, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 91, name: "BODY SPRAY FOGG MASTER (WHITE) OAK", price: 949, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 92, name: "BODY SPRAY FOGG SMALL (MINI)", price: 190, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
      { id: 93, name: "BODY SPRAY HAVOC GERMANY (GOLD)", price: 980, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 94, name: "BODY SPRAY HAVOC GERMANY (SILVER)", price: 980, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
      { id: 95, name: "BODY SPRAY J. (OUD)", price:749, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 96, name: "BODY SPRAY J. (ZARAR)", price: 749, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 97, name: "BODY SPRAY JANAN", price: 749, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 98, name: "BODY SPRAY LUMANI", price: 830, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 99, name: "BODY SPRAY LUMANI DO IT", price: 830, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 100, name: "BODY SPRAY MARKHOR (MIX) RP,625", price: 690, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 101, name: "BODY SPRAY MARQUIS (MEHROON)", price: 699, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 102, name: "BODY SPRAY ONE MAN SHOW (BLACK)", price: 790, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 105, name: "BODY SPRAY PURE BLACK", price: 590, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
      { id: 106, name: "BODY SPRAY RASSASI BLUE LADY", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 107, name: "BODY SPRAY RASSASI BLUE MEN", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 110, name: "BODY SPRAY RASSASI EMOTION (MEN)", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 111, name: "BODY SPRAY RASSASI EMOTION (WOMEN)", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 113, name: "BODY SPRAY RASSASI HOPE (MEN)", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 117, name: "BODY SPRAY RASSASI ROMANCE (MEN)", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 118, name: "BODY SPRAY RASSASI ROMANCE (WOMEN)", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 119, name: "BODY SPRAY RASSASI ROYAL BLACK", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 120, name: "BODY SPRAY RASSASI ROYAL BLUE", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 121, name: "BODY SPRAY RASSASI ROYAL PINK (W,M)", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 122, name: "BODY SPRAY RASSASI SECRET", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 123, name: "BODY SPRAY RASSASI TWINKLE", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 124, name: "BODY SPRAY SHALIS (MEN)", price: 890, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 125, name: "BODY SPRAY SHALIS (WOMEN)", price: 890, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 127, name: "BODY SPRAY SHE (MIX)", price: 490, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 130, name: "BODY SPRAY UDV (LARGE) BLACK (SILVER)", price: 880, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 133, name: "BRUSH CHILD CHOFN (CAR)", price: 110, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 134, name: "BRUSH COBOR", price: 60, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 135, name: "BRUSH COLGATE (WITH CAP) IMP", price: 120, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 136, name: "BRUSH HAIR (CHAMCHA)", price: 175, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
      { id: 137, name: "BRUSH HAIR (THAPA) GOOD QUALITY", price: 195, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
      { id: 139, name: "BRUSH ORAL-B (WITH CAP)", price: 150, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 140, name: "BRUSH SENSODYNE (STAND+CAP) SOFT", price: 170, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 141, name: "BRUSH SHAVING (GOOD QUALITY)", price: 190, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
      { id: 142, name: "BRUSH SUREE PLASTIC PACKING SINGLE (NYLON TAR) BLACK", price: 120, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 143, name: "BRUSH SUREE PLASTIC PACKING SINGLE (NYLON TAR) WHITE", price: 120, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 144, name: "BRUSH TYR HANDLE", price: 70, categoryId: "general", categoryName: "General Items & Others" },
      { id: 145, name: "BRUSH TYR SADA", price: 70, categoryId: "general", categoryName: "General Items & Others" },
      { id: 146, name: "BRYLCREEM (MEDIUM) (ORIGINAL) RED", price: 580, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 148, name: "BUTTERFLY PAD ALWAYS DARK BLUE RS,480", price: 430, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 151, name: "BUTTERFLY PAD ALWAYS ULTRA (EXTRA LONG) RP,230", price: 210, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 152, name: "BUTTERFLY PAD ALWAYS ULTRA (LONG) RP,230", price: 210, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 153, name: "BUTTERFLY PAD MAXI THICK (EXTRA LONG 8PCS) RP,340", price: 310, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 154, name: "BUTTERFLY PAD MAXI THICK (LONG 9PCS) RP,340", price: 310, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 155, name: "CELL CAMELION LONGER LASTING AA", price: 50, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 156, name: "CELL DOUBLE CHARGER AA", price: 30, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 157, name: "CELL DOUBLE CHARGER AAA", price: 30, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 158, name: "CELL POWER PLUS AA", price: 30, categoryId: "lock", categoryName: "Locks & Cells & Lighters", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 159, name: "CELL TOSHIBA AA (BLACK)", price: 35, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 161, name: "CELL TOSHIBA AA (RED)", price: 35, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 162, name: "CELL TOSHIBA AAA (BLACK)", price: 35, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 163, name: "CELL TOSHIBA AAA (RED)", price: 35, categoryId: "lock", categoryName: "Locks & Cells & Lighters", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 165, name: "CELL TOSHIBA SIZE (D)", price: 140, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 167, name: "CHEERY POLISH (BLACK) LARGE RS,650", price: 590, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 168, name: "CHEERY POLISH (BLACK) SMALL RS,325", price: 300, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 169, name: "CHEERY POLISH (BROWN) LARGE RS,650", price: 590, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 170, name: "CHEERY POLISH (BROWN) SMALL RS,325", price: 300, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 171, name: "COBRA INSIST KILLER SPRAY 300ml", price: 0, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 172, name: "COBRA INSIST KILLER SPRAY 400ml", price: 0, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 173, name: "COBRA INSIST KILLER SPRAY 500ml", price: 0, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 174, name: "COBRA INSIST KILLER SPRAY 600ml", price: 0, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 175, name: "COFFEE SACHET (60 PCS)", price: 40, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 177, name: "COLOUR BLACK ROSE # 43", price: 190, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 178, name: "COLOUR BLACK ROSE 45 # RS,220", price: 190, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 183, name: "COLOUR GARNIER (ALL COLOURS) RS,1099", price: 899, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 184, name: "COLOUR GARNIER SACHET (NATURAL BLACK) RS,199", price: 185, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 187, name: "COLOUR GODREJ SACHET (DARK,BROWN)", price: 70, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 188, name: "COLOUR GODREJ SACHET (NATURAL BROWN)", price: 70, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 189, name: "COLOUR HELLO HAIR (# 03 DARK BROWN)", price: 250, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 190, name: "COLOUR JUST FOR MEN (DARK BROWN ) HAIR", price: 1849, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 191, name: "COLOUR JUST FOR MEN (BLACK) BEARD", price: 1849, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 192, name: "COLOUR KALA KOLA HAIR # 02 LARGE (M,BROWN)", price: 190, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 206, name: "COLOUR OLIVIA (ALL COLOURS) RS,300", price: 260, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 207, name: "COLOUR POLY (# 43) RS,320", price: 290, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 208, name: "COLOUR PRIMA HAIR (# 43 BROWN) RS,80", price: 60, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 209, name: "COLOUR PRIMA HAIR (# 45 BLACK) RS,80", price: 60, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 219, name: "COLOUR REVLON REGULAR (ALL COLOURS) (LARGE)", price: 790, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 221, name: "COLOUR SAMSOLE (# 43 DARK BROWN) SMALL RS,160", price: 145, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 222, name: "COLOUR SAMSOLE (# 45) BLACK SMALL RS,160", price: 145, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 223, name: "COLOUR SAMSOLE (# 43) DARK BROWN LARGE RS,300", price: 260, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 224, name: "COLOUR SAMSOLE (# 45) BLACK LARGE RS,300", price: 260, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 225, name: "COLOUR WAJEE TUBE ( # 43 DARK BROWN) RS,70", price: 0, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 226, name: "COLOUR WAJEE TUBE ( # 45 BLACK) RS,70", price: 0, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 227, name: "COMBS ANTI LICE HANDLE LARGE", price: 80, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 228, name: "COMBS ANTI LICE HANDLE MEDIUM", price: 80, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 229, name: "COMBS CASET", price: 10, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 231, name: "COMBS NEELAM", price: 20, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 233, name: "COMBS SAIRA", price: 10, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 234, name: "CONDOM DO (RED)", price: 190, categoryId: "condemn", categoryName: "Condoms" },
      { id: 235, name: "CONDOM DO BLACK", price: 190, categoryId: "condemn", categoryName: "Condoms" },
      { id: 236, name: "CONDOM DUREX 3 IN 1 DIBI", price: 0, categoryId: "condemn", categoryName: "Condoms" },
      { id: 237, name: "CONDOM HAPPY LIFE (3 IN 1)", price: 70, categoryId: "condemn", categoryName: "Condoms" },
      { id: 238, name: "CONDOM JOSH (BLUE) DELAY", price: 100, categoryId: "condemn", categoryName: "Condoms", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 239, name: "CONDOM KLIMAX (ECSTASY) ORIGINAL IMP", price: 190, categoryId: "condemn", categoryName: "Condoms" },
      { id: 240, name: "CONDOM NIGHT RIDER", price: 30, categoryId: "condemn", categoryName: "Condoms" },
      { id: 242, name: "CONDOM SATHI (MENTHOL)", price: 90, categoryId: "condemn", categoryName: "Condoms" },
      { id: 243, name: "CONDOM SATHI (RED)", price: 80, categoryId: "condemn", categoryName: "Condoms" },
      { id: 244, name: "CONDOM SATHI BOX RS,90", price: 80, categoryId: "condemn", categoryName: "Condoms", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 245, name: "CONDOM TOUCH (BLUE) PACK 3 IN 1", price: 149, categoryId: "condemn", categoryName: "Condoms", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 246, name: "CONDOM TOUCH (GREEN) 3IN 1", price: 90, categoryId: "condemn", categoryName: "Condoms", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 247, name: "CONDOM TOUCH (RED)", price: 100, categoryId: "condemn", categoryName: "Condoms" },
      { id: 249, name: "CONDITIONER LOREAL (BLACK) RS,550", price: 499, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 250, name: "CONDITIONER LOREAL (DREAM LONG) RS,550", price: 510, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 251, name: "CONDITIONER LOREAL (GOLDEN) RS,550", price: 510, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 252, name: "CONDITIONER LOREAL (HYALURON MOISTURE) BLUE RS,620", price: 570, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 254, name: "CONDITIONER LOREAL (RED) RS,550", price: 510, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 255, name: "CONDITIONER LOREAL (WHITE) RS,540", price: 510, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 256, name: "CONDITIONER MECLAY (BLACK)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 257, name: "CONDITIONER MECLAY (GOLDEN)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 258, name: "CONDITIONER MECLAY (ORANGE)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 259, name: "CONDITIONER MECLAY (PINK)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 261, name: "CONDITIONER MECLAY (PP)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 262, name: "CONDITIONER MECLAY (RED)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 263, name: "CONDITIONER MECLAY (WHITE)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 265, name: "CONDITIONER SUNSILK (COMPANY) BLACK RS,530", price: 490, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 266, name: "CONDITIONER TRESEMME (IMP) 175ml KERATIN", price: 500, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 267, name: "CONDITIONER TRESEMME 400ml (MIX)", price: 840, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 269, name: "COTTON BUD DIBI 100 PIECESS (WOOD)", price: 80, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 270, name: "COTTON BUD (PACKET) PLASTIC", price: 30, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 271, name: "COTTON BUD (PACKET) WOOD", price: 30, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 272, name: "COTTON BUD (PKT) WOOD (100 PIECES) TOP TIP", price: 90, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 273, name: "COTTON BUD DIBI (PLASTIC) 100 PIECESS TOP TIP", price: 120, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 274, name: "COTTON BUD DIBI (WOOD) 100 PIECESS BLUE TOP TIP", price: 120, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 278, name: "CREAM AJOOBA", price: 340, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 279, name: "CREAM ARCHI PERL THAILAND", price: 130, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 280, name: "CREAM ARENA (HAND & FOOT) RS,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 281, name: "CREAM ARINA GOLD RS,350", price: 295, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 282, name: "CREAM ARINA GOLD (MEN) RP,350", price: 295, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 284, name: "CREAM B N B BEAUTY", price: 590, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 285, name: "CREAM BAREERA GOLD RS,375", price: 295, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 286, name: "CREAM BIO COS RP,375", price: 299, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 287, name: "CREAM BLASSO BLEACH (BOX) RS,40", price: 35, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 288, name: "CREAM BLASSO BLEACH 25g", price: 80, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 289, name: "CREAM CARE BLEACH (BOX) ALOE VERA (ORIGINAL) RS,40", price: 35, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 290, name: "CREAM CHARISMA HAND & FOOT", price: 395, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 291, name: "CREAM DEEP HEAT 70G TUBE", price: 790, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 292, name: "CREAM DUE WHITENING RS,350", price: 295, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 293, name: "CREAM EU JAR (LARGE) RS,350", price: 300, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 295, name: "CREAM EU JAR (MEDIUM) RS,220", price: 200, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 296, name: "CREAM EU TUBE (LARGE) RS,250", price: 220, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 297, name: "CREAM EU TUBE (SMALL) RS,160", price: 145, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 298, name: "CREAM EU TUBE 75g (MEDIUM) RS,320", price: 290, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 299, name: "CREAM FACE FRESH (LARGE) RS,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 300, name: "CREAM FACE FRESH CLEANSER (LARGE)", price: 360, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 301, name: "CREAM FACE FRESH GOLD (LARGE) RS,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 302, name: "CREAM FAIR & HANDSOME (LARGE)", price: 390, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 303, name: "CREAM FAIR & HANDSOME (SMALL)", price: 280, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 304, name: "CREAM FAIR MENZ (LARGE) RS,250", price: 230, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 305, name: "CREAM FAIZA BEAUTY SMALL RS,375", price: 320, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 306, name: "CREAM GLUPATONE", price: 350, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 307, name: "CREAM GLUTA WHITE", price: 390, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 310, name: "CREAM GOLDEN PEARL RS,360", price: 290, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 311, name: "CREAM GORI RS,550", price: 420, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 312, name: "CREAM JHALAK RS,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 314, name: "CREAM M BETNOVATE RP,180.62", price: 175, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 315, name: "CREAM M DERMO VATE RP,199.06", price: 194, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 316, name: "CREAM M ITCH GUARD 25g", price: 150, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 317, name: "CREAM M MOOV 25g", price: 120, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 318, name: "CREAM NEW GOLDEN STAR RP,400", price: 330, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 319, name: "CREAM NIVEA (BLUE) 60ml", price: 470, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 320, name: "CREAM NIVEA SOFT 100ml", price: 690, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 321, name: "CREAM NIVEA SOFT 50ML", price: 380, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 322, name: "CREAM NO MARKS RS,350", price: 320, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 323, name: "CREAM OLIVIA BLEACH HERBAL RS,70", price: 65, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 324, name: "CREAM OLIVIA BLEACH RS,80", price: 70, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 325, name: "CREAM PARLEY BEAUTY BLACK RS 400", price: 330, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 326, name: "CREAM PARLEY BLEACH SACHET BLACK RS,70", price: 60, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 327, name: "CREAM PARLEY URGENT FACIAL SACHET", price: 60, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 329, name: "CREAM PONDS BB (MEDIUM) 18g", price: 840, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 330, name: "CREAM PONDS BB (SMALL) 9g", price: 490, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 331, name: "CREAM PONDS JAR LARGE COMPANY RS,450", price: 430, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 332, name: "CREAM ROOP SINGHAR", price: 340, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 333, name: "CREAM KELLY PEARL", price: 130, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 334, name: "CREAM MENA FACIAL", price: 130, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 335, name: "CREAM YOKO WHITENING", price: 130, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 336, name: "CREAM SANDAL RP,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 337, name: "CREAM SEVEN HERBAL UBTAN RS,170", price: 160, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 338, name: "CREAM SEVEN HERBAL UBTAN RS,260", price: 240, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 339, name: "CREAM SHAVING ADMIRAL", price: 200, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 340, name: "CREAM SHAVING DIPLOMAT RS,200", price: 190, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 341, name: "CREAM SHAVING JOLLY", price: 180, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 342, name: "CREAM SHAVING TOUCH ME RS,230", price: 210, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 343, name: "CREAM SHEESHA BEAUTY CREAM RP,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 344, name: "CREAM SIA GOLD RP,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 347, name: "CREAM SUDO 125GM (ORIGINAL)", price: 1550, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 348, name: "CREAM SUDO 60GM (ORIGINAL)", price: 1150, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 349, name: "CREAM TIBET COLD (LARGE) RS,250", price: 235, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 350, name: "CREAM TIBET COLD (SMALL) RS,180", price: 170, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 351, name: "CREAM TIBET SNOW RS,230", price: 220, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 352, name: "CREAM WHITE GOLD (BLACK) RS,400", price: 290, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 353, name: "CREAM WHITE GOLD (ORANGE) RS,400", price: 290, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 354, name: "CREAM WHITE GOLD (PAPIYA) RS,400", price: 290, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 355, name: "DABUR AMLA HAIR OIL (DUBAI) 100ml RS,360", price: 330, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "D" },
      { id: 356, name: "DABUR AMLA HAIR OIL (DUBAI) 300ML RS,880", price: 795, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "D" },
      { id: 357, name: "DABUR AMLA HAIR OIL (DUBAI) 50ml RS,180", price: 170, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "D" },
      { id: 358, name: "DABUR RED PASTE (LARGE)", price: 430, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 359, name: "DABUR RED PASTE (SMALL)", price: 235, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "D" },
      { id: 360, name: "DENTONIC POWDER BOX (MEDIUM)", price: 75, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "D" },
      { id: 362, name: "DETTOL PANI 50ML (SMALL) RP,250", price: 220, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "D" },
      { id: 363, name: "DOLLAR GEL PEN (BLACK)", price: 40, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 364, name: "DOLLAR GEL PEN (BLUE)", price: 40, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 365, name: "DOLLAR GEL PEN (GREEN)", price: 40, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 366, name: "DOLLAR GEL PEN (RED)", price: 40, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 367, name: "DOLLAR PEN (CLIPPER) BLACK", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 368, name: "DOLLAR PEN (CLIPPER) BLUE", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "D" },
      { id: 370, name: "DOLLAR PEN (CLIPPER) RED", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 371, name: "DOLLAR POINTER (BLACK)", price: 30, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 372, name: "DOLLAR POINTER (BLUE)", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 373, name: "DOOZ SPRAY 14000", price: 1150, categoryId: "condemn", categoryName: "Condoms" },
      { id: 374, name: "DUREX TESTER SMALL", price: 50, categoryId: "condemn", categoryName: "Condoms" },
      { id: 375, name: "DORCO RAZOR", price: 190, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "D" },
      { id: 377, name: "DUREX LUBE LARGE", price: 1050, categoryId: "condemn", categoryName: "Condoms" },
      { id: 378, name: "DUREX LUBE SMALL", price: 890, categoryId: "condemn", categoryName: "Condoms" },
      { id: 379, name: "ELFY JIMSA BOTTLE 20GM", price: 140, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "E" },
      { id: 380, name: "ELFY JIMSA BOX", price: 25, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "E" },
      { id: 381, name: "EMAMI 7 OILS IN ONE 100ML", price: 430, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 382, name: "EMAMI 7 OILS IN ONE 200ML", price: 730, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 383, name: "EMERGENCY LIGHT (LARGE)", price: 1200, categoryId: "general", categoryName: "General Items & Others" },
      { id: 384, name: "EMERGENCY LIGHT (MEDIUM)", price: 850, categoryId: "general", categoryName: "General Items & Others" },
      { id: 385, name: "EMERGENCY LIGHT (SMALL)", price: 650, categoryId: "general", categoryName: "General Items & Others" },
      { id: 386, name: "ENGLISH PRICKLY HEAT CREAM LARGE RS,270", price: 240, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "E" },
      { id: 387, name: "ERASER ORO", price: 10, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 397, name: "F & L BB CREAM 18g (MEDIUM) IMP", price: 590, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 398, name: "F & L BB CREAM 9g (SMALL) IMP", price: 350, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 399, name: "F & L M,V FACE WASH (SMALL) COMPANY RS.199", price: 190, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
      { id: 400, name: "F & L M,V JAR RP,450", price: 395, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 403, name: "F & L M,V TUBE (SMALL) GLOW RS,170", price: 160, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 404, name: "F & L M V FACE WASH (LARGE) COMPANY RS,380", price: 190, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 407, name: "FACE WASH ACNI-PLUS", price: 490, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 411, name: "FACE WASH B N B BRIGHTENING RICE", price: 640, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 412, name: "FACE WASH B N B CLEANSER", price: 640, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 414, name: "FACE WASH CLEAN & CLEAR (SMALL)", price: 299, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 415, name: "FACE WASH DOVE (LARGE) (BLUE)", price: 590, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 416, name: "FACE WASH DOVE (LARGE) (GREEN)", price: 590, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 417, name: "FACE WASH DOVE (LARGE) (PINK)", price: 0, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 418, name: "FACE WASH FAIR MENZ (MIX) RP,210", price: 195, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 419, name: "FACE WASH GARNIER ( LARGE)  ACNO FIGHT RP,949", price: 835, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 420, name: "FACE WASH GARNIER (LARGE)  OIL CLEAR RS,949", price: 835, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 421, name: "FACE WASH GARNIER (LARGE)  POWER WHITE RS,949", price: 835, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 422, name: "FACE WASH GARNIER (LARGE) SAKURE WHITE", price: 690, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 423, name: "FACE WASH GARNIER (LARGE) TURBO LIGHT WHITE+OIL CONTROL", price: 890, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 424, name: "FACE WASH GARNIER (LARGE) WOMEN (NEEM) PURE ACTIVE RS,649", price: 590, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 425, name: "FACE WASH GARNIER (LARGE) WOMEN (VITAMIN C) RP,619", price: 570, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 426, name: "FACE WASH GARNIER (SMALL)  ACNO FIGHT RS,519", price: 470, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 427, name: "FACE WASH GARNIER (SMALL) OIL CLEAR RS,519", price: 470, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 428, name: "FACE WASH GARNIER (SMALL) POWER WHITE RS,519", price: 470, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 429, name: "FACE WASH GARNIER (SMALL) WOMEN (NEEM) RS,369", price: 340, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 430, name: "FACE WASH GARNIER (SMALL) WOMEN VITAMIN C RS,369", price: 340, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 431, name: "FACE WASH GOLDEN PEARL (ACNO CLEAR)", price: 230, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 432, name: "FACE WASH GOLDEN PEARL (OIL & CONTROL)", price: 230, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 433, name: "FACE WASH GOLDEN PEARL (FLAWLESS SKIN)", price: 230, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 434, name: "FACE WASH GOLDEN PEARL (LIGHT & GLOW)", price: 230, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 435, name: "FACE WASH GOLDEN PEARL (GREEN) HERBAL", price: 230, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 436, name: "FACE WASH GOLDEN PEARL (TEA & TREE) ", price: 230, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 437, name: "FACE WASH GOLDEN PEARL (WHITE & BEAUTY)", price: 230, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 438, name: "FACE WASH GOLDEN PEARL (MEN)", price: 230, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 439, name: "FACE WASH GOLDEN PEARL (OIL CONTROL) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 440, name: "FACE WASH GOLDEN PEARL (FLAWLESS SKIN) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 441, name: "FACE WASH GOLDEN PEARL (LIGHT & GLOW) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 442, name: "FACE WASH GOLDEN PEARL (VITAMIN C) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 443, name: "FACE WASH GOLDEN PEARL (WHITE BEAUTY) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 444, name: "FACE WASH GOLDEN PEARL (DAILY FOAMING) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 445, name: "FACE WASH GOLDEN PEARL (HERBAL) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 446, name: "FACE WASH GOLDEN PEARL (WHITE BEAUTY) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 447, name: "FACE WASH GOLDEN PEARL (MEN) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 448, name: "FACE WASH HIMALAYA (LARGE) NEEM DUBAI RS,510" , price: 460, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 449, name: "FACE WASH HIMALAYA (SMALL) DUBAI RS,310", price: 280, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 450, name: "FACE WASH JHALAK" , price: 180, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 451, name: "FACE WASH JUNSUI LARGE (BLACK)", price: 570, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 452, name: "FACE WASH JUNSUI LARGE (ICE COOL)", price: 570, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 453, name: "FACE WASH JUNSUI LARGE (GREEN) NEEM", price: 570, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 455, name: "FACE WASH JUNSUI LARGE (L,GREEN COOL)", price: 570, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 456, name: "FACE WASH JUNSUI LARGE (PINK)", price: 570, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 457, name: "FACE WASH JUNSUI LARGE (RED) PIMPLE FIGHTING", price: 570, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 458, name: "FACE WASH JUNSUI LARGE ORANGE", price: 570, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 459, name: "FACE WASH MEC (ALOE VERA)", price: 390, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 460, name: "FACE WASH MEC (BLACK CHARCOAL)", price: 390, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 461, name: "FACE WASH MEC (PINK)", price: 390, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
      { id: 462, name: "FACE WASH MEC (ACNE CLEAN)", price: 390, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 463, name: "FACE WASH MEC (RICE BRIGHTENING)", price: 390, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 464, name: "FACE WASH MEC (LEMON)", price: 390, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 466, name: "FACE WASH PARLEY BLACK RS,300", price: 270, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 467, name: "FACE WASH PONDS (IMP) ACNE SOLUTION", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 468, name: "FACE WASH PONDS (IMP) ACNE SOLUTION (SMALL)", price: 270, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
      { id: 469, name: "FACE WASH PONDS (IMP) BLACK (ACTIVATED CHARCOAL) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 470, name: "FACE WASH PONDS (IMP) BLACK (ACTIVATED CHARCOAL) SMALL", price: 270, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 471, name: "FACE WASH PONDS (IMP) FLAWLESS WHITE", price: 590, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 472, name: "FACE WASH PONDS (IMP) SUN DULLNESS (SCRUB)", price: 460, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 473, name: "FACE WASH PONDS (IMP) WHITE BEAUTY (PINK)", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 474, name: "FACE WASH PONDS (IMP) WHITE BEAUTY (SMALL)", price: 270, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 475, name: "FACE WASH PONDS LARGE (COMPANY) BLACK RP,490", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 476, name: "FACE WASH PONDS LARGE (COMPANY) PINK RP,490", price: 450, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 477, name: "FACE WASH PONDS SMALL (COMPANY) BLACK RP,300", price: 270, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 478, name: "FACE WASH PONDS SMALL (COMPANY) PINK RS,300", price: 270, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 479, name: "FACE WASH PONDS MEN IMP (ACNE SOLUTION) LARGE", price: 590, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 480, name: "FACE WASH PONDS MEN IMP (ENERGY CHARGE) LARGE", price: 590, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 481, name: "FACE WASH PONDS MEN IMP (LIGHTNING OIL CLEAR) LARGE", price: 590, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 482, name: "FACE WASH PONDS MEN IMP (POLLUTION OUT) LARGE", price: 590, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 483, name: "FACE WASH PONDS MEN IMP (POWER CLEAR) LARGE", price: 590, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 484, name: "FACE WASH PONDS MEN IMP (WHITE BOOST) LARGE", price: 590, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 485, name: "FACE WASH RIVAJ LEMON (LARGE)", price: 310, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 486, name: "FACE WASH RIVAJ NEEM (LARGE)", price: 310, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 487, name: "FACE WASH SAEED GHANI VITAMIN C", price: 490, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 488, name: "FACE WASH SYED GHANI CHARCOAL", price: 490, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 489, name: "FACE WASH SYED GHANI GOAT MILK", price: 490, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 490, name: "FACE WASH RIVAJ LEMON (SMALL)", price: 175, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 491, name: "FACE WASH RIVAJ NEEM (SMALL)", price: 175, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 492, name: "FACE WASH Y,C (LARGE) COCUMBER", price: 470, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
      { id: 493, name: "FACE WASH Y,C (LARGE) NEEM GREEN", price: 470, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 494, name: "FACE WASH Y,C (LARGE) YELLOW LEMON", price: 470, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 495, name: "FACE WASH Y,C (LARGE) COW MILK EXTRACT", price: 470, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 496, name: "FACE WASH Y,C (SMALL) COW MILK EXTRACT", price: 320, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 497, name: "FACE WASH Y,C (SMALL) COCUMBER", price: 320, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 499, name: "FACE WASH Y,C (SMALL) NEEM GREEN", price: 320, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 500, name: "FACE WASH Y,C (SMALL) YELLOW LEMON", price: 320, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
      { id: 502, name: "FEEDER (LARGE NIPPLE) LARGE", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 503, name: "FEEDER (LARGE NIPPLE) MEDIUM", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 504, name: "FEEDER GLASS LARGE", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 505, name: "FEEDER GLASS MEDIUM", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 506, name: "FEEDER GLASS SMALL", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 507, name: "FEEDER MINI TREE (LARGE)", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 508, name: "FEEDER MINI TREE (MEDIUM)", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 509, name: "FEEDER MINI TREE (SMALL)", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 510, name: "FEEDER PP (IMP) HANDLE LARGE", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 511, name: "FEEDER PP (IMP) HANDLE MEDIUM", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 512, name: "FEEDER PURE LOVE COLOR (LARGE)", price: 280, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
      { id: 513, name: "FORHANS HAIR TONIC 100ML (BLUE) RS,320", price: 310, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "F" },
      { id: 514, name: "FORHANS HAIR TONIC 100ML (RED) RS,320", price: 310, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 515, name: "FORHANS HAIR TONIC 200ml (RED) RP,550", price: 520, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 516, name: "GATS BY GEL (MEDIUM) MIX", price: 490, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 519, name: "4ME FOAM (LARGE) MIX", price: 380, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 520, name: "GILLETTE BLUE 2 PLUS", price: 140, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "G" },
      { id: 521, name: "GILLETTE FOAM 200ml (GREEN)", price: 860, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "G" },
      { id: 522, name: "GILLETTE FOAM 200ml (BLUE)", price: 860, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 523, name: "GILLETTE FOAM 200ml (RED)", price: 860, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "G" },
      { id: 524, name: "GILLETTE FOAMY (50gm) SMALL (MIX)", price: 445, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 525, name: "GILLETTE GEL (LARGE) MIX", price: 940, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "G" },
      { id: 526, name: "GILLETTE GEL (Small) MIX", price: 640, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "G" },
      { id: 528, name: "GOLDEN PEARL SKIN POLISHING", price: 160, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 529, name: "GOLDEN PEARL URGENT FACIAL", price: 50, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "G" },
      { id: 530, name: "GOLDEN PEARL URGENT FACIAL (FRUIT)", price: 50, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 534, name: "HAPPY BIRTHDAY SPELLING", price: 220, categoryId: "sports", categoryName: "Sports & Toys & Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "H" },
      { id: 535, name: "HASHMI SORMA RS,200", price: 190, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "H" },
      { id: 536, name: "HIGHLIGHTER", price: 70, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 537, name: "HUDA BEAUTY BLACK MASK SACHET", price: 50, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 538, name: "HUSSAIN MANJAN BOX (MEDIUM) RS,80", price: 75, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "H" },
      { id: 539, name: "INK BOTTLE DOLLAR (SMALL) BLACK", price: 60, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 540, name: "INK BOTTLE DOLLAR (SMALL) BLUE", price: 50, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "I" },
      { id: 541, name: "INK PEN DOLLAR", price: 70, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 542, name: "INK PEN PIANO CRYSTAL", price: 70, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 543, name: "INK REMOVER MARKER (ORO)", price: 40, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "I" },
      { id: 544, name: "INK REMOVER WHITENER", price: 70, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "I" },
      { id: 545, name: "J BABY BATH 200ML TOP TO TOE", price: 549, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 548, name: "J BABY LINER", price: 50, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 549, name: "J BABY LOTION 100ml (IMP)", price: 490, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 550, name: "J BABY LOTION 200ml (IMP)", price: 690, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 551, name: "J BABY OIL 125ml (IMP)", price: 650, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "J" },
      { id: 552, name: "J BABY OIL 200ml (IMP)", price: 840, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 553, name: "J BABY OIL 50ml (IMP)", price: 320, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "J" },
      { id: 554, name: "J BABY PERFUME COLOGNE", price: 690, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 555, name: "J BABY PETROLEUM GEL (PINK) SMALL", price: 490, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 556, name: "J BABY PETROLEUM GEL (BLUE) SMALL", price: 490, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "J" },
      { id: 557, name: "J BABY POWDER 100g (MIX)", price: 590, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 558, name: "J BABY POWDER 200g (MIX)", price: 590, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 559, name: "J BABY SHAMPOO 100ml (COMPANY)", price: 320, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "J" },
      { id: 560, name: "J BABY SHAMPOO 200ml (COMPANY)", price: 590, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "J" },
      { id: 561, name: "J BABY SHAMPOO 300ml (COMPANY)", price: 750, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 562, name: "J BABY SHAMPOO 750ml (COMPANY) (PUMP)", price: 1780, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 563, name: "J BABY SOAP 100g GREEN", price: 240, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 564, name: "J BABY SOAP 100g PINK", price: 240, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "J" },
      { id: 565, name: "J BABY SOAP 100g WHITE", price: 240, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "J" },
      { id: 566, name: "J BABY TOP-TO-TOE 100ML", price: 350, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 567, name: "J BABY WIPES (LARGE 84 PIECES) GOOD QUALITY", price: 240, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 569, name: "KALA KOLA HAIR TONIC (LARGE) RS,500", price: 460, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 570, name: "KALA KOLA HAIR TONIC (SMALL) RS,300", price: 270, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 571, name: "KEHKSHAN MAHNDI (BLACK) RS,80", price: 70, categoryId: "general", categoryName: "General Items & Others" },
      { id: 572, name: "KEUNE COLOUR (ALL COLOURS)", price: 0, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 573, name: "KEUNE POWDER (ALL COLOURS)", price: 0, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 576, name: "KING COIL BLAKI (LARGE)", price: 110, categoryId: "mosquito", categoryName: "Anti- Mosquitoes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "K" },
      { id: 577, name: "KING COIL GREEN (LARGE)", price: 110, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 578, name: "KING MAAT", price: 7, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 579, name: "KING MACHINE SET", price: 560, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 580, name: "KING MOSPEL", price: 130, categoryId: "mosquito", categoryName: "Anti- Mosquitoes", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "K" },
      { id: 581, name: "KING RAT BOOK", price: 180, categoryId: "mosquito", categoryName: "Anti- Mosquitoes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "K" },
      { id: 582, name: "KING REFILL", price: 240, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 583, name: "KINGTOX SPRAY 300ml (SMALL)", price: 440, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 584, name: "KINGTOX SPRAY 400ml (MEDIUM)", price: 540, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 585, name: "KINGTOX SPRAY 600 (LARGE)", price: 740, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 587, name: "KIWI POLISH LIQUID (BLACK) RS,450", price: 430, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "K" },
      { id: 588, name: "KIWI POLISH LIQUID (BROWN) RS,450", price: 430, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "K" },
      { id: 589, name: "KOHE NOOR OIL (CHANBALI) RP,350", price: 335, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "K" },
      { id: 592, name: "LASTIK BAREEK CHILD", price: 20, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
      { id: 595, name: "LASTIK CHORDA LADIES ROLL (SMALL)", price: 80, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 596, name: "LASTIK CHORDA WHITE (LARGE)", price: 25, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 599, name: "LIGHTER (ARCO GARARRI)", price: 40, categoryId: "lock", categoryName: "Locks & Cells & Lighters", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
      { id: 600, name: "LIGHTER (HEATER)", price: 30, categoryId: "lock", categoryName: "Locks & Cells & Lighters", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 601, name: "LIGHTER (SADA TIK)", price: 25, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 603, name: "LIGHTER CHOLAH (PUZZO)", price: 199, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 604, name: "LIGHTER CHOLAH (REFILL)", price: 199, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 605, name: "LIGHTER CHOLAH FULL STEEL GUN", price: 0, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 606, name: "LIGHTER CIGARETTE GAS REFILL (RED)", price: 199, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 607, name: "LIGHTER ELECTRIC ARC (USB TYPE C)", price: 400, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 608, name: "LIP OIL", price: 40, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 609, name: "LOCK BLACK 20mm", price: 70, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 610, name: "LOCK BLACK 25mm", price: 80, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 611, name: "LOCK BLACK 32mm", price: 140, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 612, name: "LOCK BLACK 38mm", price: 160, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 613, name: "LOCK BLACK 50mm", price: 260, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 614, name: "LOCK BLACK 63mm", price: 340, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 615, name: "LOCK FRONT KEY (LARGE) GOOD QUALITY", price: 680, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 616, name: "LOCK FRONT KEY (MEDIUM)", price: 520, categoryId: "lock", categoryName: "Locks & Cells & Lighters" },
      { id: 617, name: "LOCK SILVER 40MM (WOHU)", price: 360, categoryId: "lock", categoryName: "Locks & Cells & Lighters", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "L" },
      { id: 618, name: "LOCK SILVER 50MM (WOHU)", price: 440, categoryId: "lock", categoryName: "Locks & Cells & Lighters", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
      { id: 619, name: "LOCK SILVER 60MM (WOHU)", price: 540, categoryId: "lock", categoryName: "Locks & Cells & Lighters", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
      { id: 620, name: "LOCK SILVER 70MM (WOHU)", price: 580, categoryId: "lock", categoryName: "Locks & Cells & Lighters", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "L" },
      { id: 621, name: "LOTION CARE (SMALL) RS,250", price: 230, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 622, name: "LOTION ENCHANTEUR 100ML (SMALL)", price: 460, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 623, name: "LOTION MOTHER CARE 115ML RS,450", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 624, name: "LOTION MOTHER CARE 60ML RS,150", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 625, name: "LOTION NEXTON 125ML RP,499", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 626, name: "LOTION NEXTON 65ML RP,299", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 627, name: "LOTION NIVEA 100ML SMALL (MIX)", price: 509, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 628, name: "LOTION NIVEA 200ML (MIX)", price: 889, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 629, name: "LOTION NIVEA 400ML (MIX)", price: 1800, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 630, name: "LOTION OLIVIA 110ml RS,220 (MOISTURIZING)", price: 180, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 631, name: "LOTION OLIVIA 110ml RS,220 (HONEY)", price: 180, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 632, name: "LOTION OLIVIA 220ml RS,310 (MOISTURIZING)", price: 280, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 633, name: "LOTION OLIVIA 220ml RS,310 (HONEY)", price: 280, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 634, name: "LOTION PONDS 100ml HONEY RS,350", price: 330, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 635, name: "LOTION PONDS 100ML RS,350", price: 330, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 636, name: "LOTION PONDS 200ml RP,600", price: 555, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 637, name: "LOTION PONDS 65ml RS,240", price: 229, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 638, name: "LOTION PONDS WHITE BEAUTY 150ml CLEANSING MILK", price: 499, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 639, name: "LOTION SKIN WHITE (VITAMIN C) RS,320", price: 280, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 640, name: "LOTION SKIN WHITE HONEY GOAT MILK RS,320", price: 280, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 641, name: "LOTION VASELINE 100ML (IMP) COCA B", price: 339, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 642, name: "LOTION VASELINE 100ML (IMP) GREEN", price: 339, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "L" },
      { id: 643, name: "LOTION VASELINE 100ml (IMP) PINK", price: 339, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 644, name: "LOTION VASELINE 100ML (IMP) WHITE", price: 339, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
      { id: 645, name: "LOTION VASELINE 100ML (IMP) YELLOW", price: 339, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
      { id: 646, name: "LOTION VASELINE 200ml (IMP) WHITE", price: 699, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 647, name: "LOTION VASELINE 200ML (IMP) COCO", price: 699, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 648, name: "LOTION VASELINE 200ML (IMP) PINK", price: 699, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "L" },
      { id: 649, name: "LOTION VASELINE 200ml (IMP) GREEN", price: 699, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 650, name: "LUBNA'S WONDER WAX (LARGE)", price: 250, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 651, name: "LUBNA'S WONDER WAX (SMALL)", price: 189, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 652, name: "LUDE POLISH (BLACK) ORIGINAL", price: 99, categoryId: "general", categoryName: "General Items & Others" },
      { id: 653, name: "LUDE POLISH (BROWN) ORIGINAL", price: 99, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
      { id: 654, name: "LUDO (CARPET)", price: 449, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 655, name: "LUDO (LARGE) ", price: 199, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 656, name: "LUDO (XL) (GOOD QUALITY)", price: 289, categoryId: "sports", categoryName: "Sports & Toys & Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 657, name: "LUDO (LARGE) WOOD GOOD QUALITY", price: 489, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 658, name: "LUDO (MEDIUM)", price: 144, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 659, name: "LUDO (MEDIUM) WOOD GOOD QUALITY", price: 429, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 660, name: "LUDO (SMALL)", price: 89, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 661, name: "LUDO (SMALL) WOOD GOOD QUALITY", price: 299, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 662, name: "LUDO DANA CRYSTAL", price: 10, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 663, name: "LUDO DANA MILKY", price: 10, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 664, name: "LUX BODY WASH SOFT TOUCH (BLUE) (IMP)", price: 430, categoryId: "facewash", categoryName: "Face Wash & Body Washes" },
      { id: 665, name: "LUX BODY WASH SOFT TOUCH (PINK) (IMP)", price: 430, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "L" },
      { id: 666, name: "LUX BODY WASH SOFT TOUCH (PURPLE) (IMP)", price: 430, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "L" },
      { id: 667, name: "MAGIC DEPOXI BOX (SMALL)", price: 71, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "M" },
      { id: 668, name: "MARKER 604 (BLACK)", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
      { id: 669, name: "MARKER 604 (BLUE)", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "M" },
      { id: 670, name: "MARKER MERCURY (BLUE)", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "M" },
      { id: 671, name: "MARKER MERCURY (BLACK)", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "M" },
      { id: 672, name: "MARKER BOARD INK", price: 89, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 673, name: "MARKER BLACK BOARD (BLACK)", price: 69, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "M" },
      { id: 674, name: "MARKER BLACK BOARD (BLUE)", price: 69, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
      { id: 675, name: "MARKER PERMANENT (BLACK) DEER", price: 69, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "M" },
      { id: 676, name: "MARKER PERMANENT (BLUE) DEER", price: 69, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 677, name: "MARKER SADA (BLACK)", price: 15, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "M" },
      { id: 678, name: "MARKER SADA (BLUE)", price: 15, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "M" },
      { id: 679, name: "MARKER SADA DOLLAR (BLUE)", price: 21, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 681, name: "MEHNDI ARAQ", price: 30, categoryId: "general", categoryName: "General Items & Others" },
      { id: 682, name: "MEHNDI CONE", price: 40, categoryId: "general", categoryName: "General Items & Others" },
      { id: 683, name: "MEHNDI CONE SINGHAR", price: 50, categoryId: "general", categoryName: "General Items & Others" },
      { id: 684, name: "CAT FOOD (FLUFFY)", price: 830, categoryId: "general", categoryName: "General Items & Others" },
      { id: 685, name: "METRO +7 AGAER BATTI (LARGE)", price: 120, categoryId: "general", categoryName: "General Items & Others" },
      { id: 686, name: "METRO AGHER BATTI (SMALL)", price: 50, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "M" },
      { id: 687, name: "MIRROR DOUBLE SIDED (LARGE)", price: 240, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "M" },
      { id: 688, name: "MIRROR DOUBLE SIDED (MEDIUM)", price: 189, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
      { id: 689, name: "MIRROR DOUBLE SIDED (SMALL)", price: 129, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "M" },
      { id: 690, name: "MOOV SPRAY", price: 849, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "M" },
      { id: 691, name: "MORTEIN COIL LARGE", price: 0, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 692, name: "MORTEIN MACHINE RP,560", price: 0, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 693, name: "MORTEIN REFILLL (30 NIGHT)", price: 239, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 694, name: "MORTEIN REFILLL (60 NIGHT)", price: 439, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 695, name: "MORTEIN SPRAY 300ML", price: 529, categoryId: "mosquito", categoryName: "Anti- Mosquitoes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "M" },
      { id: 696, name: "MORTEIN SPRAY 375ML", price: 699, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 697, name: "MORTEIN SPRAY 600ML LARGE", price: 899, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 698, name: "MOSPEL RS,350", price: 319, categoryId: "mosquito", categoryName: "Anti- Mosquitoes", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
      { id: 700, name: "MOTHER CARE OIL 125ML RP,480", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 701, name: "MOTHER CARE OIL 65ML", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 702, name: "MOUTH WASH COLGATE 250ML (IMP) MIX", price: 489, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 703, name: "MOUTH WASH LISTERINE (MIX)", price: 489, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 704, name: "MOUTH WASH ORAL-B", price: 489, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 705, name: "MOUTH WASH SENSODYNE (MIX)", price: 539, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 706, name: "MULTANI MUTTI JAR", price: 80, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 708, name: "MUNDIAL OLIVE OIL 175ML", price: 579, categoryId: "general", categoryName: "General Items & Others" },
      { id: 709, name: "NAIL CUTTER 555 (LARGE)", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 710, name: "NAIL CUTTER AKAI (JAPANI ORIGINAL) (LARGE) JAPANI", price: 799, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 711, name: "NAIL CUTTER AKAI (JAPANI ORIGINAL) (MEDIUM) JAPANI", price: 749, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 712, name: "NAIL CUTTER MINI", price: 60, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 713, name: "NAIL CUTTER V9 (GOOD QUALITY)", price: 149, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "N" },
      { id: 714, name: "NALKI (MIX)", price: 70, categoryId: "general", categoryName: "General Items & Others" },
      { id: 715, name: "NAIR HAIR REMOVAL SPRAY (MIX)", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 716, name: "NALKI (BLACK)", price: 15, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "N" },
      { id: 717, name: "NALKI (WHITE)", price: 15, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "N" },
      { id: 718, name: "NEXTON BABY COLOGNE BLUE", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 719, name: "NEXTON BABY KIT MEDIUM", price: 1800, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 720, name: "NEXTON BABY KIT SMALL", price: 999, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 721, name: "NEXTON BABY LOTION 125ML RP,525", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 722, name: "NEXTON BABY LOTION 250ML", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 723, name: "NEXTON BABY LOTION 65ML RP,315", price: 299, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 724, name: "NEXTON BABY POWDER 100g RP,275 (MIX)", price: 249, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 725, name: "NEXTON BABY POWDER 200g RP,430 (MIX)", price: 399, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 726, name: "NEXTON BABY SHAMPOO 125ML RP,399", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 727, name: "NEXTON BABY SHAMPOO 250ML RP,699", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 728, name: "NEXTON BABY SHAMPOO 500ML RP,999", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 729, name: "NEXTON BABY SHAMPOO 65ML RP,260", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 730, name: "NEXTON BABY SHAMPOO PUMP", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 731, name: "NEXTON BABY SOAP RP,225", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 732, name: "NEXTON OIL 125ML RP,470", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 733, name: "NEXTON WIPES", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 734, name: "NIPLE PP SMALL", price: 29, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 735, name: "NIPPLE PP LARGE", price: 49, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 736, name: "NITRO HAIR WAX (MIX)", price:420, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 737, name: "NOVA GOLD HAIR SPRAY (LARGE)", price: 595, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 738, name: "NOVA GOLD HAIR SPRAY (SMALL) (COPY)", price: 375, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "N" },
      { id: 753, name: "PAPER COPY (ALL TYPES)", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 754, name: "PARACHUTE COCONUT OIL (LARGE) ORIGINAL", price: 989, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 755, name: "PARACHUTE COCONUT OIL (LARGE) HEMANI", price: 889, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 756, name: "PARACHUTE COCONUT OIL (MEDIUM) HEMANI", price: 489, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 757, name: "PARACHUTE COCONUT OIL (MEDIUM) ORIGINAL", price: 589, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 758, name: "PARACHUTE COCONUT OIL (SMALL) HEMANI", price: 269, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 759, name: "PARACHUTE COCONUT OIL (SMALL) ORIGINAL", price: 299, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 760, name: "PARTY PACK TISSUE ROSE PETAL (PINK) RP,250", price: 229, categoryId: "general", categoryName: "General Items & Others" },
      { id: 761, name: "PARTY PACK TISSUE ROSE PETAL (WHITE) RP,275", price:249, categoryId: "general", categoryName: "General Items & Others" },
      { id: 762, name: "PARTY POPPER (MEDIUM)", price: 129, categoryId: "sports", categoryName: "Sports & Toys & Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 763, name: "PARTY POPPER (SMALL)", price: 89, categoryId: "sports", categoryName: "Sports & Toys & Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 764, name: "PASTE CHILD (ABC) RS,180 (MIX)", price: 169, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 765, name: "PASTE CHILD KODOMO (MIX)", price: 199, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 766, name: "PASTE CLOSE UP (IMP) LARGE GREEN", price: 399, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 767, name: "PASTE CLOSE UP (IMP) LARGE RED", price: 399, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 768, name: "PASTE CLOSE UP (IMP) XL BLUE (ICY WHITE)", price: 449, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 769, name: "PASTE CLOSE UP (SMALL) GREEN", price: 199, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 770, name: "PASTE CLOSE UP (SMALL) RED", price: 199, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 771, name: "PASTE COLGATE 100g HERBAL RS,220", price: 205, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 772, name: "PASTE COLGATE 100g SADA RS,230", price: 214, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 773, name: "PASTE COLGATE 125G MAX FRESH (GREEN) RS,325", price: 310, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 774, name: "PASTE COLGATE 125g MAX FRESH (BLUE) RS,325", price:310, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 775, name: "PASTE COLGATE 125G MAX FRESH (RED) RS,325", price: 310, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 776, name: "PASTE COLGATE 150g HERBAL RS,330", price: 309, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 777, name: "PASTE COLGATE 200g HERBAL RS,420", price: 397, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 778, name: "PASTE COLGATE 200g SADA RS,430", price: 405, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 779, name: "PASTE COLGATE 20g HERBAL RS,50", price: 46, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 780, name: "PASTE COLGATE 20g SADA RS,50", price: 46, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 781, name: "PASTE COLGATE 40g SADA RS,75", price: 69, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 782, name: "PASTE COLGATE 45g HERBAL RS,75", price: 69, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 783, name: "PASTE COLGATE 75g HERBAL RS,180", price: 169, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 784, name: "PASTE COLGATE 75g SADA RS,190", price: 179, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 785, name: "PASTE COLGATE 75g MAX FRESH RS,220 (GREEN)", price: 209, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 786, name: "PASTE COLGATE 75g MAX FRESH RS,220 (RED)", price: 209, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 787, name: "PASTE COLGATE 75g MAX FRESH RS,220 (BLUE)", price: 209, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 788, name: "PASTE DOCTOR RS,110", price: 96, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 789, name: "PASTE DOCTOR RS,220", price: 199, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 790, name: "PASTE ENGLISH SMALL RS,140", price: 125, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 791, name: "PASTE FORHANS (LARGE) RS,300", price: 285, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 792, name: "PASTE FORHANS (SMALL) RS,180", price: 169, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 793, name: "PASTE MEDICAM 35GM RS,120", price: 109, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 794, name: "PASTE MEDICAM 65GM RS,250", price: 224, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 795, name: "PASTE MEDICAM 90GM RS,320", price: 289, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 796, name: "PASTE PARODONTAX 50g RS,250", price: 235, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 797, name: "PASTE PARODONTAX 100g RS,400", price: 375, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 798, name: "PASTE SENSODYNE 100g (FLUORIDE) RS,450", price: 429, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 799, name: "PASTE SENSODYNE 100g (ORIGINAL) RS,450", price: 429, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 800, name: "PASTE SENSODYNE 100g (RAPID ACTION) RS,545", price: 519, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 801, name: "PASTE SENSODYNE 30g (COMPLETE PROTECTION +) RS,165", price: 155, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 802, name: "PASTE SENSODYNE 30g (RAPID ACTION) RS,165", price: 154, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 804, name: "PASTE SENSODYNE 70g (FLUORIDE) RS,380", price: 354, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 805, name: "PASTE SENSODYNE 70g (ORIGINAL) RS,380", price: 354, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 806, name: "PASTE SENSODYNE 70g (RAPID ACTION) RS,420", price: 399, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 807, name: "PASTE SPARKLE RS,105", price: 99, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 808, name: "PASTE SPARKLE RS,180", price: 170, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 809, name: "PEN (BLUE SIGNATURE) BLACK", price: 17, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 810, name: "PEN (BLUE SIGNATURE) BLUE", price: 17, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 811, name: "PEN DOLLAR SP 10", price: 70, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 812, name: "PEN PIANO (BLACK) GRIPPER 0.8MM", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 813, name: "PEN PIANO (BLUE) GRIPPER 0.8MM", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 814, name: "PEN PIANO (RED) GRIPPER 0.8MM", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 815, name: "PEN PIANO OLD YELLOW", price: 17, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 816, name: "PENCIL GOLDFISH", price: 19, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 817, name: "PENCIL MY DOLLAR", price: 19, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 818, name: "PENCIL ORO", price: 19, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 819, name: "PERFUME ALISHA (GOLD)", price: 1590, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 820, name: "PERFUME ALISHA (NAVY)", price: 1590, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 821, name: "PERFUME ALISHA (ROSE)", price: 1590, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 822, name: "PERFUME ASEEL", price: 1790, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 823, name: "PERFUME DELYCIA (MEDIUM) BEAUTY RS,650", price: 619, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 824, name: "PERFUME DELYCIA (MEDIUM) CHECK RS,650", price: 619, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 825, name: "PERFUME DELYCIA (SMALL) BEAUTY RS,350", price: 325, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
      { id: 826, name: "PERFUME DELYCIA (SMALL) CHECK RS,350", price: 325, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 827, name: "PERFUME DELYCIA (SMALL) FEELING RS,350", price: 325, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 828, name: "PERFUME DO IT", price: 1790, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 829, name: "PERFUME EVERY ONE", price: 1690, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 830, name: "PERFUME FOR EVER", price: 790, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 831, name: "PERFUME GAMBIT", price: 790, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 832, name: "PERFUME HAVOC (DUBAI) GOLDEN", price: 2140, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 833, name: "PERFUME HAVOC (DUBAI) SILVER", price: 2140, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 835, name: "PERFUME MEDORA (MEDIUM) BLUE RS,650", price: 619, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 836, name: "PERFUME MEDORA (MEDIUM) GREEN RS,650", price: 619, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 837, name: "PERFUME MEDORA (SMALL) BLUE RS,350", price: 325, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 838, name: "PERFUME MEDORA (SMALL) GREEN RS,350", price: 325, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
      { id: 839, name: "PERFUME MEDORA (SMALL) RED RS,350", price: 325, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 840, name: "PERFUME MEDORA (MEDIUM) RED RS,650", price: 325, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 841, name: "PERFUME MUTUAL LOVE (GOLD)", price: 390, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 842, name: "PERFUME MUTUAL LOVE (PINK)", price: 390, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 843, name: "PERFUME MUTUAL LOVE (RED)", price: 390, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 844, name: "PERFUME ONE MAN SHOW", price: 2340, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
      { id: 845, name: "PERFUME PENCIL (MEN + W,M)", price: 140, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 846, name: "PERFUME RASSASI BLUE LADY", price: 2440, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 847, name: "PERFUME RASSASI ROMANCE (WOMAN)", price: 2480, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 848, name: "PERFUME RASSASI SECRET", price: 2530, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 849, name: "PERFUME ROYAL MARRIAGE", price: 2480, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 850, name: "PERFUME SHALIS MEN (LARGE)", price: 3650, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 851, name: "PERFUME SHALIS MEN (SMALL)", price: 2690, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 852, name: "PERFUME SHALIS WOMEN (LARGE)", price: 3650, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 853, name: "PERFUME SHALIS WOMEN (SMALL)", price: 2690, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 854, name: "POWDER BERG (LARGE) RS,380", price: 349, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 855, name: "POWDER BERG (SMALL) RS,220", price: 180, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 856, name: "POWDER BLACK BEAUTY (LARGE) RS,450", price: 410, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 857, name: "POWDER BLACK BEAUTY (SMALL) RP,220", price: 195, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 858, name: "POWDER BLACK CAT (LARGE) RS,480", price: 430, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 859, name: "POWDER BLACK CAT (SMALL) RS,250", price: 210, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 861, name: "POWDER COOL COOL RS,210", price: 170, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 862, name: "POWDER DENTONIC BOX 100GM (MEDIUM) RS,75", price: 0, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 863, name: "POWDER DENTONIC BOX 200GM (LARGE) RS,130", price: 0, categoryId: "toothpasteandbrush", categoryName: "Dental Cares" },
      { id: 864, name: "POWDER EDEN ROCK (LARGE) RS,310", price: 260, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 865, name: "POWDER EDEN ROCK (SMALL) RS,210", price: 180, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 866, name: "POWDER ENCHANTEUR 125g (PURPLE)", price: 479, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 867, name: "POWDER ENCHANTEUR 125g (PINK)", price: 479, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 868, name: "POWDER ENCHANTEUR 125g (ROSE)", price: 479, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 869, name: "POWDER ENCHANTEUR 125g (YELLOW)", price: 479, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 870, name: "POWDER ENGLISH PRICKLY HEAT LARGE", price: 390, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 871, name: "POWDER ENGLISH PRICKLY HEAT SMALL", price: 239, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 872, name: "POWDER MEDORA (LARGE) (JOY) RS,480", price: 440, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 873, name: "POWDER MEDORA (SMALL) (JOY) RS,230", price: 210, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 874, name: "POWDER MEDORA (SMALL) (MIX) RS,230", price: 210, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 875, name: "POWDER MOTHER CARE GO-RASH 150g SMALL RS,400", price: 360, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 876, name: "POWDER MOTHER CARE GO-RASH 250g LARGE RS,550", price: 499, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 877, name: "POWDER TIBET (LARGE) RS,580", price: 540, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 878, name: "POWDER TIBET (SMALL) RS,190", price: 179, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 881, name:  "RAZOR DARCO", price: 199, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 882, name: "RAZOR FEMINA PINK", price: 40, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 883, name: "RAZOR TREET HYGIENE", price: 45, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "R" },
      { id: 884, name: "RAZOR TRIM", price: 59, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "R" },
      { id: 904, name: "REGISTER (ALL TYPES)", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 905, name: "RACKET (SET) (EXCELLENT QUALITY)", price: 2250, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 906, name: "RACKET (SET) (NORMAL QUALITY)", price: 999, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 907, name: "RACKET (SET) (MEDIUM QUALITY)", price: 1450, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 908, name: "ROLL ON FA (AQUA)", price: 449, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 909, name: "ROLL ON ENCHANTEUR (MIX) WOMEN", price: 499, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 910, name: "ROLL ON FA (GREEN)", price: 449, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "R" },
      { id: 911, name: "ROLL ON FA (PINK)", price: 449, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 912, name: "ROLL ON FA (MYSTIC MOMENT)", price: 449, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "R" },
      { id: 913, name: "ROLL ON FA (SPORT)", price: 449, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "R" },
      { id: 914, name: "ROLL ON NIVEA (MEN)", price: 499, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 915, name: "ROLL ON NIVEA (WOMEN)", price: 499, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "R" },
      { id: 917, name: "ROLL ON YARDLEY MIX", price: 499, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 918, name: "ROOM SPRAY  DO IT", price: 239, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 919, name: "ROOM SPRAY (FRESH FRAGRANCE) MIX", price: 269, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 920, name: "ROOM SPRAY (IMP) DARHAM", price: 650, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "R" },
      { id: 921, name: "ROOM SPRAY (HOUSE CARE) MIX", price: 279, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "R" },
      { id: 922, name: "ROOM SPRAY (FREY) MIX", price: 299, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 923, name: "ROOM SPRAY NEW (GOOD MORNING) MIX", price: 239, categoryId: "fragnances", categoryName: "Fragnances & Roll on" },
      { id: 926, name: "ROSE PETAL TISSUE ROLL MAXOB", price: 119, categoryId: "general", categoryName: "General Items & Others" },
      { id: 927, name: "SABALON SPRAY (PK) LARGE", price: 419, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 928, name: "SABALON SPRAY (PK) SMALL", price: 299, categoryId: "fragnances", categoryName: "Fragnances & Roll on", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 929, name: "SAFETY BOX UNIVERSAL RS,10", price: 10, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 930, name: "SAFETY PIN (LARGE)", price: 30, categoryId: "general", categoryName: "General Items & Others" },
      { id: 931, name: "SAFETY PIN (MEDIUM)", price: 20, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 932, name: "SAMAD BOND BOX (SMALL)", price: 130, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 933, name: "SAVOLI OIL 100ml", price: 590, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 934, name: "SCALE ORO LARGE", price: 59, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 935, name: "SCALE ORO SMALL", price: 35, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 936, name: "SCISSOR STEEL LARGE", price: 439, categoryId: "general", categoryName: "General Items & Others" },
      { id: 937, name: "SCISSOR STEEL MEDIUM", price: 329, categoryId: "general", categoryName: "General Items & Others" },
      { id: 938, name: "SCISSOR STEEL MINI", price: 129, categoryId: "general", categoryName: "General Items & Others" },
      { id: 939, name: "SCISSOR STEEL SMALL", price: 109, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 940, name: "SERUM UJOOBA", price: 89, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 941, name: "SERUM BIO COSS", price: 89, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 942, name: "SERUM DERMA PLUS", price: 89, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 944, name: "SERUM FAIZA (LARGE)", price: 109, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 945, name: "SERUM GOLDEN PEARL (GOLDEN)", price: 105, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 946, name: "SERUM JHALAK", price: 89, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 947, name: "SERUM SANDAL", price: 89, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 948, name: "SET WET GEL (MIX)", price: 419, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 949, name: "SHAMPOO BIO AMLA FARVAL ORIGINAL RS,700", price: 599, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 950, name: "SHAMPOO BIO AMLA FARVEL ORIGINAL RS,340", price: 295, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 951, name: "SHAMPOO BIO AMLA FARVEL ORIGINAL RS,500", price: 430, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 952, name: "SHAMPOO BIO AMLA FARVEL ORIGINAL RS,180", price: 145, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 953, name: "SHAMPOO CLEAR 200ml  (MEN) BLUE RS,499", price: 479, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 955, name: "SHAMPOO CLEAR 400ml (MEN) BLUE RS,830", price: 789, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 958, name: "SHAMPOO DOVE 175ml (GOLDEN) DAILY MOISTURE RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 959, name: "SHAMPOO DOVE 175ML (HAIR FALL) RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 960, name: "SHAMPOO DOVE 175ml (INTENSIVE REPAIR) RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 961, name: "SHAMPOO DOVE 175ml (LIGHT BLUE) RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 962, name: "SHAMPOO DOVE 400ml (INTENSIVE REPAIR) RS,940", price: 495, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 964, name: "SHAMPOO ENGLISH ANTI LICE (LARGE) RS,370", price: 350, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 965, name: "SHAMPOO ENGLISH ANTI LICE (MEDIUM) RS,240", price: 225, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 966, name: "SHAMPOO ENGLISH ANTI LICE (SMALL) RS,170", price: 159, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 971, name: "SHAMPOO LIFEBUOY 100ml (GREEN) RS,200", price: 189, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 972, name: "SHAMPOO LIFEBUOY 100ml (ONION) RP,200", price: 189, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 973, name: "SHAMPOO LIFEBUOY 200ml (GREEN) RS,320", price: 299, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 974, name: "SHAMPOO LIFEBUOY 200ml (ONION) RS,320", price: 299, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 975, name: "SHAMPOO LIFEBUOY 200ml (YELLOW) RS,320", price: 299, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 976, name: "SHAMPOO LIFEBUOY 200ml (RETHA AMLA) RS,320", price: 299, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 977, name: "SHAMPOO LIFEBUOY 400ml (GREEN) RS,620", price: 589, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 978, name: "SHAMPOO LOREAL LARGE (HYALURON MOISTURE) RS,930", price: 849,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 979, name: "SHAMPOO LOREAL LARGE (HYALURON PURE) RS,930", price: 849,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 980, name: "SHAMPOO LOREAL LARGE (GLYCOLIC EXTRA GLOSS) RS,1050" ,price: 949,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 981, name: "SHAMPOO LOREAL LARGE (TOTAL REPAIR 5) RS,930", price: 849, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 982, name: "SHAMPOO LOREAL LARGE (EXTRA-ORDINARY OIL) RP,930" , price: 849, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 983, name: "SHAMPOO LOREAL LARGE (COLOR VIBRANCY) RS,930" , price: 849, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 984, name: "SHAMPOO LOREAL LARGE (DREAM LONG) RS,930", price: 849, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 985, name: "SHAMPOO LOREAL LARGE (FALL RESIST 3D) RS,930", price: 849,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 986, name: "SHAMPOO LOREAL MEDIUM (HYALURON MOISTURE) RS,600", price: 559, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 987, name: "SHAMPOO LOREAL MEDIUM (HYALURON PURE) RS,530", price: 489,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 988, name: "SHAMPOO LOREAL MEDIUM (GLYCOLIC EXTRA GLOSS) RS,530", price: 489, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 989, name: "SHAMPOO LOREAL MEDIUM (TOTAL REPAIR 5) RS,530", price: 489,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 990, name: "SHAMPOO LOREAL MEDIUM (EXTRA-ORDINARY OIL) RS,530", price: 489, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 991, name: "SHAMPOO LOREAL MEDIUM (COLOR VIBRANCY) RS,530", price: 489, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 992, name: "SHAMPOO LOREAL MEDIUM (DREAM LONG) RS,530", price: 489, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 993, name: "SHAMPOO LOREAL MEDIUM (FALL RESIST 3D) RS,530", price: 489,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 994, name: "SHAMPOO MECLAY MEDIUM (PINK)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 995, name: "SHAMPOO MECLAY MEDIUM (PURPLE)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 996, name: "SHAMPOO MECLAY MEDIUM (DARK BLUE)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 997, name: "SHAMPOO MECLAY MEDIUM (GREEN)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 998, name: "SHAMPOO MECLAY MEDIUM (BLACK)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 999, name: "SHAMPOO MECLAY MEDIUM (RED)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 1000, name: "SHAMPOO MECLAY MEDIUM (ORANGE)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1001, name: "SHAMPOO MECLAY MEDIUM (GOLDEN) ", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 1002, name: "SHAMPOO MECLAY MEDIUM (WHITE)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1003, name: "SHAMPOO MECLAY LARGE (PINK)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1004, name: "SHAMPOO MECLAY LARGE (PURPLE)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1005, name: "SHAMPOO MECLAY LARGE (DARK BLUE)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1006, name: "SHAMPOO MECLAY LARGE (GREEN)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1007, name: "SHAMPOO MECLAY LARGE (BLACK)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1008, name: "SHAMPOO MECLAY LARGE (RED)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1009, name: "SHAMPOO MECLAY LARGE (ORANGE)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1010, name: "SHAMPOO MECLAY LARGE (GOLDEN)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1011, name: "SHAMPOO MECLAY LARGE (WHITE)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1012, name: "SHAMPOO PALMOLIVE (LARGE) (GREEN) HEALTHY & SMOOTH RS,700", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1013, name: "SHAMPOO PALMOLIVE (LARGE) (PINK) INTENSIVE MOISTURE RS,700", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1014, name: "SHAMPOO PALMOLIVE (LARGE) (WHITE) BRILLIANT SHINE RS,700", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1015, name: "SHAMPOO PALMOLIVE (MEDIUM) (WHITE) BRILLIANT SHINE RS,330", price: 379, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1016, name: "SHAMPOO PALMOLIVE (MEDIUM) (GREEN) HEALTHY & SMOOTH RS,330", price: 379, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1017, name: "SHAMPOO PALMOLIVE (MEDIUM) (PINK) INTENSIVE MOISTURE RS,330", price: 379, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1034, name: "SHAMPOO REVLON COLOUR SACHET 30#", price: 70, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1035, name: "SHAMPOO SUNSILK (IMP) LARGE (BLACK) BLACK SHINE", price: 889, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1036, name: "SHAMPOO SUNSILK (IMP) LARGE (BLUE) ANTI DANDRUFF", price: 889, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1037, name: "SHAMPOO SUNSILK (IMP) LARGE (GOLDEN) H,F SOLUTION", price: 889, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1038, name: "SHAMPOO SUNSILK (IMP) MEDIUM (GREEN)", price: 439, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1040, name: "SHAMPOO SUNSILK (IMP) MEDIUM (BLACK)", price: 439, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1041, name: "SHAMPOO SUNSILK 100ml (BLACK) BLACK SHINE RS,190", price: 179, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1042, name: "SHAMPOO SUNSILK 200ml (BLACK) BLACK SHINE RS,499", price: 479, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 1043, name: "SHAMPOO SUNSILK 200ml (GOLDEN) H,F SOLUTION RS,499", price: 479, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1044, name: "SHAMPOO SUNSILK 200ml (PINK) THICK & LONG RS,449", price: 479, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1045, name: "SHAMPOO SUNSILK 400ml (PINK) THICK & LONG RS,799", price: 769, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1046, name: "SHAMPOO SUNSILK 400ml (GOLDEN) SOFT & SMOOTH", price: 769, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1047, name: "SHAMPOO TRESEMME (IMP) 170ml (BLACK)", price: 520, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1048, name: "SHAMPOO TRESEMME (IMP) 170ml (GREEN)", price: 520, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1049, name: "SHAMPOO TRESEMME (IMP) 170ml (RED)", price: 520, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1051, name: "SHAMPOO TRESEMME 400ml (GREEN)", price: 885, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1052, name: "SHAMPOO TRESEMME 400ml (BLACK)", price: 885, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1053, name: "SHAMPOO TRESEMME 400ml (RED)", price: 885, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1054, name: "SHAMPOO VATIKA DUBAI LARGE (BLACK) RP,720", price: 659, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1055, name: "SHAMPOO VATIKA DUBAI LARGE (OLIVE) RS,720", price: 659, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1056, name: "SHAMPOO VATIKA DUBAI LARGE (COCO,N) BLUE RS,720", price: 659, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1057, name: "SHAMPOO VATIKA DUBAI LARGE (CACTUS) RS,720", price: 659, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1058, name: "SHAMPOO VATIKA DUBAI MEDIUM (ALMOND & HONEY) RS,435", price: 399, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1059, name: "SHAMPOO VATIKA DUBAI MEDIUM (OLIVE) RS,435", price: 399, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1060, name: "SHAMPOO VATIKA DUBAI MEDIUM (CACTUS) RS,435", price: 399, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1061, name: "SHAMPOO VATIKA DUBAI MEDIUM (BLACK) RS,435", price: 399, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1062, name: "SHARPENER ORO RS,10", price: 9, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1063, name: "SHUTTLECOCK (PAR WALI) GOOD QUALITY", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1064, name: "SHUTTLECOCK (PAR WALI) EXCELLENT QUALITY", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1065, name: "SHUTTLECOCK (PLASTIC) EXCELLENT QUALITY", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1066, name: "SHUTTLECOCK (PLASTIC) GOOD QUALITY", price: 85, categoryId: "sports", categoryName: "Sports & Toys & Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1067, name: "SHIELD CHOOSNI (3 MONTH)", price: 90, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 1068, name: "SHIELD CHOOSNI (6 MONTH)", price: 90, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 1075, name: "SHIELD NIPPLE BOX", price: 80, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
      { id: 1076, name: "SOAP CAPRI (FAMILY PACK) 135g (YELLOW)", price: 130, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1081, name: "SOAP CAPRI (3 IN 1) YELLOW RS,390", price: 350, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1083, name: "SOAP DETTOL JUMBO COMPANY RS,150 (COOL)", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1084, name: "SOAP DETTOL JUMBO COMPANY RS,150 (GREEN)", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1086, name: "SOAP DETTOL MEDIUM COMPANY (COOL) RS,140", price: 129 ,categoryId: "soaps", categoryName: "Soaps" },
      { id: 1087, name: "SOAP DETTOL SMALL COMPANY (COOL)", price: 129, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1088, name: "SOAP DOVE LARGE WHITE (IMP)", price: 449, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1089, name: "SOAP DOVE LARGE PINK (IMP)", price: 449, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
      { id: 1090, name: "SOAP DOVE SMALL WHITE (IMP)", price: 0, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1091, name: "SOAP DOVE SMALL PINK (IMP)", price: 0, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 1092, name: "SOAP FAIZA (NEEM)", price: 110, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1093, name: "SOAP FAIZA (PP)", price: 110, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1094, name: "SOAP GOLDEN PEARL (BLUE)", price: 125, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1095, name: "SOAP GOLDEN PEARL (PINK)", price: 125, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1096, name: "SOAP GOLDEN PEARL (YELLOW)", price: 125, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 1097, name: "SOAP IMPERIAL 175gm LARGE", price: 390, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1098, name: "SOAP IMPERIAL LEATHER SMALL", price: 239, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1099, name: "SOAP LIFEBUOY (LARGE) GREEN RS,125", price: 119, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1100, name: "SOAP LIFEBUOY (MEDIUM) (BLUE) RS,95", price: 90 ,categoryId: "soaps", categoryName: "Soaps" },
      { id: 1101, name: "SOAP LIFEBUOY (XL) BLUE RS,125", price: 119, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1102, name: "SOAP LIFEBUOY (XL) GREEN RS,125", price: 119, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1103, name: "SOAP PALMOLIVE (LARGE) RS,150 BLACK", price: 139 ,categoryId: "soaps", categoryName: "Soaps" },
      { id: 1104, name: "SOAP PALMOLIVE (LARGE) RS,150 ORANGE", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1105, name: "SOAP PALMOLIVE (LARGE) RS,150 YELLOW", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1109, name: "SOAP PEARS (BLUE)", price: 399, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1110, name: "SOAP PEARS (GREEN)", price: 399, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1111, name: "SOAP PEARS (ORANGE)", price: 399, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1112, name: "SOAP SKIN WHITE (BLUE) RS,150", price: 129, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 1113, name: "SOAP SKIN WHITE (GREEN) RS,150", price: 129, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1114, name: "SOAP SKIN WHITE (PINK) RS,150", price: 129, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1115, name: "SOAP TIBET (LARGE FAMILY SIZE) RS,109", price: 104, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1116, name: "SOAP TIBET (MEDIUM BATH SIZE) RS,89", price: 85, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1117, name: "SOAP TIBET (SMALL STANDARD SIZE) RS,70", price: 66, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1118, name: "SOFT TOUCH WONDER WAX LARGE GREEN", price: 249, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 1119, name: "SOFT TOUCH WONDER WAX LARGE LEMON", price: 249, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1120, name: "SOFT TOUCH WONDER WAX SMALL GREEN", price: 209, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1121, name: "SOFT TOUCH WONDER WAX SMALL LEMON", price: 209, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1122, name: "STUD SPRAY 10000", price: 1350, categoryId: "condemn", categoryName: "Condoms" },
      { id: 1130, name: "SUNBLOCK RIVAJ (LARGE) RP,630", price: 579, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1131, name: "SUNBLOCK RIVAJ SPF 60 (SMALL) RP,300", price: 260, categoryId: "facewash", categoryName: "Face Wash & Body Washes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1132, name: "TOY AUTO CAR", price: 50, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1133, name: "TOY AUTO CAR METAL", price: 379,categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1134, name: "TOY BALL FOAM", price: 60, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1135, name: "TOY BARREL O SLIME (MELON) KHARBOZA", price: 40, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1136, name: "TOY BARREL O SLIME JAR LARGE 200g", price: 99, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1137, name: "TOY BLOCKS GAME", price: 240,categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1138, name: "TOY BUBBLE CARTOON FACE (EX QUALITY)", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1139, name: "TOY BUBBLE CARTOON FACE (GOOD QUALITY)", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1140, name: "TOY BUBBLE FEEDER", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1141, name: "TOY BUBBLE FEEDER EX QUALITY", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1142, name: "TOY BUBBLE SURAHI WALA (EX LONG)", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1143, name: "TOY BUBBLE SURAHI WALA (EX QUALITY)", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1144, name: "TOY BUBBLE WITH FAN", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1145, name: "TOY CAR JUMPING LARGE PIECE 18 (DORAEMON)", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1146, name: "TOY CAR JUMPING LARGE PIECE 18", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1147, name: "TOY CAR JUMPING MEDIUM  (JEEP ) EX QUALITY", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1148, name: "TOY CHORDI GAME", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1149, name: "TOY CLAY LARGE", price: 85, categoryId: "sports", categoryName: "Sports & Toys & Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
      { id: 1150, name: "TOY LASER LIGHT GUN", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1151, name: "TOY LIGHTING BALL", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1152, name: "TOY POP UP PATAKA (YELLOW)", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1153, name: "TOY TORCH LIGHT (SMALL) (#H 299)", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1154, name: "TOY WATER GUN", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1155, name: "TOY YOYO DORI LIGHT WALA (GOOD QUALITY)", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1156, name: "TAPE DOUBLE 2 INCH", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1157, name: "TAPE DOUBLE SIDED (1 INCH)", price: 65, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "T" },
      { id: 1158, name: "TAPE DOUBLE SIDED (1 INCH)", price: 63, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "T" },
      { id: 1159, name: "TAPE DOUBLE SIDED (1 INCH) TRANSPARENT", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1160, name: "TAPE KAGHAZ (0.5 INCH) HALF INCH 12 PIECES", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1161, name: "TAPE KAGHAZ 1 INCH", price: 65, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
      { id: 1162, name: "TAPE KAGHAZ 2 INCH", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1163, name: "TAPE OSAKA (BLACK)", price: 45, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "T" },
      { id: 1164, name: "TAPE OSAKA (BLACK) FULL LENGTH", price: 59, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1165, name: "TAPE OSAKA (RED)", price: 45, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "T" },
      { id: 1166, name: "TAPE OSAKA (RED) FULL LENGTH", price:59, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1167, name: "TAPE OSAKA (WHITE)", price: 45, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "T" },
      { id: 1168, name: "TAPE OSAKA (WHITE) FULL LENGTH", price: 59, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1169, name: "TAPE PACKING BROWN (2 INCH)", price: 95, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "T" },
      { id: 1170, name: "TAPE PACKING BROWN (2 INCH) 45 METER", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1171, name: "TAPE PACKING BROWN (2 INCH) 65 METER", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1172, name: "TAPE PACKING BROWN (2 INCH) SHORT LENGTH (SMALL)", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1173, name: "TAPE TRANSPARENT (0.5 INCH) EX QUALITY", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1174, name: "TAPE TRANSPARENT (1 INCH)", price: 55, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
      { id: 1175, name: "TAPE TRANSPARENT (1 INCH) FULL LENGTH", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1176, name: "TAPE TRANSPARENT (2 INCH)", price: 95, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "T" },
      { id: 1177, name: "TAPE TRANSPARENT (2 INCH) (MOTI)", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1178, name: "TAPE TRANSPARENT RS,10", price: 85, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "T" },
      { id: 1179, name: "TASH REGAL", price:180,categoryId: "sports", categoryName: "Sports & Toys & Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "T" },
      { id: 1180, name: "TIGER INSECT SPRAY 300ML (SMALL)", price: 0, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 1181, name: "TIGER INSECT SPRAY 400ML (MEDIUM)", price: 0, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 1182, name: "TIGER INSECT SPRAY 600ML (LARGE)", price: 0, categoryId: "mosquito", categoryName: "Anti- Mosquitoes" },
      { id: 1183, name: "TOOTH PICK DENTAL FLOSS", price: 59, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "T" },
      { id: 1184, name: "TOOTH PICK LARGE", price: 89, categoryId: "toothpasteandbrush", categoryName: "Dental Cares", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "T" },
      { id: 1185, name: "TOYS MIX", price: 0, categoryId: "sports", categoryName: "Sports & Toys & Birthday" },
      { id: 1186, name: "TRUST PAD LARGE (ORANGE) R,P 190", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1187, name: "TRUST PAD LARGE (PURPLE) RS,340", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1188, name: "TRUST PAD LARGE (PINK) RS,220", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1189, name: "TRUST PAD LARGE (YELLOW) RS,290", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1190, name: "TUSAR GENTS", price: 80, categoryId: "general", categoryName: "General Items & Others" },
      { id: 1191, name: "TUSAR LADIES", price: 80, categoryId: "general", categoryName: "General Items & Others" },
      { id: 1192, name: "TUSBHI (LED)", price: 135, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "T" },
      { id: 1193, name: "TUSBHI (LED) GREEN", price:135, categoryId: "general", categoryName: "General Items & Others" },
      { id: 1194, name: "TUSBHI (LED) PATA", price: 115,categoryId: "general", categoryName: "General Items & Others" },
      { id: 1195, name: "TUSBHI (SADA)", price: 59, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
      { id: 1196, name: "UHU PATA", price: 49, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "U" },
      { id: 1197, name: "UHU TUBE (# 11)", price: 110,categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1198, name: "UHU TUBE (# 12)", price: 165,categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1199, name: "UHU TUBE (# 13)", price: 275,categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1200, name: "UNDERWEAR LADIES  BLACK & SKIN (LARGE) GOOD QUALITY (# 520)", price: 200,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1201, name: "UNDERWEAR LADIES  BLACK & SKIN (MEDIUM) GOOD QUALITY (# 320)", price: 200,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1202, name: "UNDERWEAR LADIES  BLACK & SKIN (SMALL) GOOD QUALITY (# 120)", price: 200,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1203, name: "UNDERWEAR LADIES  BLACK & SKIN (X,L) GOOD QUALITY (# 620)", price: 200,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1204, name: "VASELINE HAIR TONIC 100ml (NON ORIGINAL)", price: 199, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
      { id: 1205, name: "VASELINE HAIR TONIC 100ml (ORIGINAL)", price: 499,categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 1206, name: "VASELINE HAIR TONIC 200ml (NON ORIGINAL)", price: 299,categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 1207, name: "VASELINE HAIR TONIC 200ml (ORIGINAL)", price: 899,categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 1208, name: "VASELINE PETROLEUM (IMP) 250ML S,A (MIX)", price: 899,categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 1209, name: "VASELINE PETROLEUM (IMP) 100ml S,A (MIX)", price: 399, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1210, name: "VASELINE PETROLEUM (IMP) 50ml", price: 259,categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 1211, name: "VASELINE PETROLEUM (IMP) 50ml S,A (BLUE,ORIGINAL)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "V" },
      { id: 1212, name: "VASELINE PETROLEUM (IMP) 50ml S,A (GREEN,ALOE FRESH)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "V" },
      { id: 1213, name: "VASELINE PETROLEUM (IMP) 50ml S,A (MIX)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "V" },
      { id: 1214, name: "VASELINE PETROLEUM (IMP) 50ml S,A (PINK,BABY)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "V" },
      { id: 1215, name: "VASELINE PETROLEUM (IMP) 50ml S,A (VITAMIN E)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "V" },
      { id: 1216, name: "VASELINE TIBET RS,130", price: 119, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1217, name: "VASELINE THERAPY PINK", price: 0, categoryId: "creams", categoryName: "Creams & Lotions & Bleach" },
      { id: 1218, name: "VATIKA HAIR OIL 100ml (ALMOND) COMPANY RS,370", price:339, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 1219, name: "VATIKA HAIR OIL 100ml (CACTUS) COMPANY RP,350", price: 319,categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 1220, name: "VATIKA HAIR OIL 100ml (Coconut)", price: 319, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1221, name: "VATIKA HAIR OIL 100ML (GARLIC) COMPANY RP,350", price: 319,categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 1222, name: "VATIKA HAIR OIL 100ml (OLIVE)", price: 319, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "V" },
      { id: 1223, name: "VATIKA HAIR OIL 200ml (ALMOND) RS,640", price:599, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 1224, name: "VATIKA HAIR OIL 200ml (CACTUS)", price: 599, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "V" },
      { id: 1225, name: "VATIKA HAIR OIL 200ml (Coconut)", price: 599,categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 1226, name: "VATIKA HAIR OIL 200ml (GARLIC)", price: 599,categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 1227, name: "VATIKA HAIR OIL 200ml (OLIVE)", price: 599, categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
      { id: 1228, name: "VATIKA HAIR OIL 200ml (ONION)", price: 599,categoryId: "haircolour", categoryName: "Hair Colors & Care & Oils" },
      { id: 1229, name: "VEET JAR LARGE (BLUE) RS,595", price: 559,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1230, name: "VEET JAR LARGE (GREEN) RS,595", price:559, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1231, name: "VEET JAR LARGE (MIX) RS,595", price: 559, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "V" },
      { id: 1232, name: "VEET JAR LARGE (PINK) RS,595", price: 559,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1233, name: "VEET JAR SMALL (GREEN) RS,300", price:269, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1234, name: "VEET JAR SMALL (PINK) RS,300", price:269, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1235, name: "VEET JAR SMALL 40G (MIX) RS,300", price: 269, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "V" },
      { id: 1236, name: "VEET STRIPS (BLUE)", price: 349,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1237, name: "VEET STRIPS (GREEN)", price: 349,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1238, name: "VEET STRIPS (PINK)", price: 349,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1239, name: "VEET TUBE LARGE (BLUE) FULL SIZE", price: 799,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1240, name: "VEET TUBE LARGE (IMP) GREEN", price: 699,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1241, name: "VEET TUBE MEDIUM (BLUE) RS,495", price: 459,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1242, name: "VEET TUBE MEDIUM (GREEN) RS,495", price: 459,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1243, name: "VEET TUBE MEDIUM 50G (MIX)", price: 459, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "V" },
      { id: 1244, name: "VEET TUBE SMALL 25G (MIX) RS,250", price: 229, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1245, name: "VENEEZIA WAX (JAR)", price: 499, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1246, name: "VENEEZIA WAX (LARGE) RS,280", price: 249, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
      { id: 1247, name: "VENEEZIA WAX (SMALL) RP,220", price: 195, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "V" },
      { id: 1248, name: "VENEEZIA WAX PARLOR SIZE", price:599, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1249, name: "VITAMIN (E) CAPSULES (FACIAL ESSENCE)", price: 5, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1250, name: "VITAMIN CAPSULE LARGE WHITE", price: 8, categoryId: "creams", categoryName: "Creams & Lotions & Bleach", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
      { id: 1251, name: "WASH ROOM TIKI (GOOD QUALITY) FRESH", price: 150, categoryId: "general", categoryName: "General Items & Others" },
      { id: 1252, name: "WASH ROOM TIKI (SASTI)", price: 70, categoryId: "general", categoryName: "General Items & Others" },
      { id: 1253, name: "WAX PATI", price: 80, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1254, name: "WAX PATI BUKRAM", price: 90, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "W" },
      { id: 1255, name: "WAX PATI BUKRAM", price: 90, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "W" },
      { id: 1256, name: "WHITE ROSE H,R JAR (LARGE) RS,280", price: 239, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1257, name: "WHITE ROSE H,R JAR (MEDIUM) RS,220", price: 199, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1258, name: "WHITE ROSE H,R JAR (SMALL) RS,190", price: 169, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1259, name: "WIPES CHINA BABY", price: 99, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 1260, name: "WIPES JEEP CAMERA", price: 169, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 1261, name: "WIPES NEXTON", price: 0, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 1262, name: "WIPES PAMPER (NON ORIGINAL)", price: 249, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "W" },
      { id: 1263, name: "WIPES SOFT CREME (MIX)", price: 129, categoryId: "babycare", categoryName: "Baby Care & Powders", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "W" },
      { id: 1264, name: "WIPES SOFT-CREAM (BLUE)", price: 129, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 1265, name: "WIPES SOFT-CREAM (WHITE)", price: 129, categoryId: "babycare", categoryName: "Baby Care & Powders" },
      { id: 1266, name: "ZERO MOSQUITO SACHET BOX RS,10", price: 8, categoryId: "mosquito", categoryName: "Anti- Mosquitoes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "Z" },
      { id: 1267, name: "NATIONAL SALT RS,60", price: 58, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "N" },
      { id: 1268, name: "LAHORI NAMAK RS,35", price: 29, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "L" },
      { id: 1269, name: "LEMON MAX LONG BAR RS,100", price: 95, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 1270, name: "LEMON MAX BAR SMALL RS,35", price: 34, categoryId: "general", categoryName: "General Items & Others", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "L" },
    ];
    var PAGE_SIZE = 10;
    const RECENT_LIMIT = 15;
    const BRAND_STOP_WORDS = new Set([
      "SOAP","SOAPS","SHAMPOO","CONDITIONER","CREAM","LOTION","POWDER","SPRAY","BODY","FACE","WASH","TOOTH","PASTE","BRUSH","RAZOR","BLADE","OIL","HAIR","COLOUR","COLOR","BALL","PEN","TOY","TAPE","CELL","LOCK","CANDLE","PAD","WIPES","PERFUME","PERFUMES","DEO","DEODORANT","TALCUM","ROOM","FRESHNER","FRESHENER","ROLL","ON","AIR","LARGE","MEDIUM","SMALL","SACHET","PACK","PCS","PIECE","SIZE","FULL","HALF","MIX","ALL","GOOD","QUALITY","ORIGINAL","NON","IMP","PK","RS","RP","ML","G","GM","KG","INCH","BLACK","WHITE","BLUE","GREEN","RED","PINK","YELLOW","GOLDEN","BROWN","ORANGE","PURPLE","DARK","LIGHT"
    ]);
    const BRAND_PHRASES = [
      "BIO AMLA","BLACK ROSE","AL RASHIEED","JUST FOR MEN","ONE MAN SHOW","WHITE ROSE","SOFT CREME","SOFT CREAM","SKIN WHITE","CHI CHI","7 HERBAL","BODY SHOP"
    ];
    function getProductBrand(name) {
      const clean = String(name || "")
        .toUpperCase()
        .replace(/[#(),.&/+_-]/g, " ")
        .replace(/\b\d+\s*(ML|G|GM|KG|PCS|PC|INCH|METER)\b/g, " ")
        .replace(/\b(RS|RP)\s*\d+\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const phrase = BRAND_PHRASES.find(p => clean.includes(p));
      if (phrase) return phrase.split(" ").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
      const words = clean.split(" ").filter(w => w && !BRAND_STOP_WORDS.has(w) && !/^\d+$/.test(w));
      if (!words.length) return "";
      const first = words[0];
      if (/^\d+[A-Z]*$/.test(first) && words[1]) return `${first} ${words[1].charAt(0)}${words[1].slice(1).toLowerCase()}`;
      return first.charAt(0) + first.slice(1).toLowerCase();
    }
    function getProductFilterName(product) {
      const custom = product && product.filterName ? String(product.filterName).trim() : "";
      if (custom === "__none__") return "";
      return custom || getProductBrand(product && product.name);
    }
    function getBrandFilters(items) {
      const counts = new Map();
      items.forEach(p => {
        const brand = getProductFilterName(p);
        if (brand) counts.set(brand, (counts.get(brand) || 0) + 1);
      });
      return Array.from(counts.entries())
        .filter(([, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 18)
        .map(([name, count]) => ({ name, count }));
    }
    function matchProductTokens(product, query) {
      if (!query || !product) return 0;
      const cleanQuery = query.trim().toLowerCase();
      if (!cleanQuery) return 0;
      const tokens = cleanQuery.split(/\s+/).filter(Boolean);
      if (tokens.length === 0) return 0;
      const name = (product.name || "").toLowerCase();
      const nameUrdu = (product.nameUrdu || "").toLowerCase();
      const catName = (product.categoryName || "").toLowerCase();
      const catId = (product.categoryId || "").toLowerCase();
      const brand = (getProductFilterName(product) || "").toLowerCase();
      // Full concatenated searchable text
      const fullText = `${name} ${nameUrdu} ${catName} ${catId} ${brand}`;
      // Punctuation-stripped version (replaces commas, brackets, hyphens, colons with spaces)
      const cleanText = fullText.replace(/[^a-z0-9\u0600-\u06FF\s]/gi, " ");
      // Every single token must match somewhere in fullText or cleanText
      const allTokensMatch = tokens.every(t => cleanText.includes(t) || fullText.includes(t));
      if (!allTokensMatch) return 0;
      // Calculate relevance score
      let score = 10;
      if (name === cleanQuery) {
        score += 100; // Exact full match
      } else if (name.startsWith(cleanQuery)) {
        score += 80;  // Starts with full query
      } else if (name.includes(cleanQuery)) {
        score += 60;  // Contains full query consecutively
      } else {
        score += 40;  // All tokens present (out-of-order / partial word)
      }
      // Bonus if matched inside the product name specifically
      const cleanNameOnly = name.replace(/[^a-z0-9\u0600-\u06FF\s]/gi, " ");
      const inName = tokens.every(t => name.includes(t) || cleanNameOnly.includes(t));
      if (inName) score += 20;
      return score;
    }
function AboutUsModal({ isOpen, onClose, language }) {
  if (!isOpen) return null;
  const [modalLang, setModalLang] = React.useState('ro');
  const isUrdu = modalLang === 'ur';
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-in relative"
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-6 pb-6 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold w-9 h-9 flex items-center justify-center rounded-full bg-white/10 transition-colors cursor-pointer"
          >
            ×
          </button>
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center">
            <img 
              src="images/sahil-traders-logo.png" 
              alt="Sahil Traders Logo" 
              loading="lazy" 
              decoding="async" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h2 className="text-2xl font-black tracking-wider uppercase text-amber-400 font-poppins">Sahil Traders</h2>
          <p className="text-xs text-gray-300 font-medium mt-1 tracking-widest uppercase">
            {tr(modalLang, 'Trusted Wholesale & Retail Store — Est. 2021, Karachi', 'Karachi ka Qabil-e-Aitemad Wholesale Store — Qayam Shuda 2021', 'کراچی کا قابلِ اعتماد ہول سیل و پرچون اسٹور — قائم شدہ 2021')}
          </p>
          {/* Language Switcher Tabs */}
          <div className="flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setModalLang('ro')}
              className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                modalLang === 'ro' ? 'bg-amber-400 text-gray-950 shadow-md scale-105' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              🇵🇰 Roman Urdu
            </button>
            <button
              type="button"
              onClick={() => setModalLang('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                modalLang === 'en' ? 'bg-amber-400 text-gray-950 shadow-md scale-105' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              🇬🇧 English
            </button>
            <button
              type="button"
              onClick={() => setModalLang('ur')}
              className={`px-3 py-1 rounded-full text-xs font-bold font-urdu transition-all cursor-pointer ${
                modalLang === 'ur' ? 'bg-amber-400 text-gray-950 shadow-md scale-105' : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              اردو
            </button>
          </div>
        </div>
        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-gray-800 text-sm leading-relaxed">
          {/* Top Price Fluctuation Disclaimer */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-950 space-y-1">
            <div className="flex items-center gap-2 font-black text-xs text-red-900 uppercase tracking-wide">
              ⚠️ {tr(modalLang, 'Important Notice — Please Read!', 'Zaroori Ailaan — Lazmi Parhein!', 'قیمتوں اور اسٹاک سے متعلق ضروری اعلان')}
            </div>
            <p className={isUrdu ? 'font-urdu text-right text-xs leading-loose text-red-950 font-bold' : 'text-xs text-red-950 leading-relaxed font-semibold'}>
              {tr(modalLang,
                'We have thousands of different items — so some prices may go slightly up or down depending on the market. But we promise you: our prices will always be the cheapest you can find anywhere!',
                'Hamare paas hazaron qisam ki cheezein hain — is wajah se kuch cheezon ka rate market ke hisab se kam ya ziada ho sakta hai. Lekin hamara wada hai ke hamara rate hamesha sabse sasta hoga!',
                'ہمارے پاس ہزاروں قسم کی چیزیں ہیں — اس وجہ سے کچھ چیزوں کا ریٹ مارکیٹ کے حساب سے کم یا زیادہ ہو سکتا ہے۔ لیکن ہم آپ سے وعدہ کرتے ہیں کہ ہمارا ریٹ ہمیشہ سب سے سستا ہوگا!'
              )}
            </p>
          </div>
          {/* Story Card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-amber-950 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-base mb-2 text-amber-900">
              <span className="text-xl">🏬</span>
              <span>{tr(modalLang, 'Our Story Since 2021', 'Hamari Kahani (Our Story)', 'ہماری کہانی (Our Story)')}</span>
            </div>
            <p className={isUrdu ? 'font-urdu text-right text-sm leading-loose' : 'text-xs sm:text-sm text-gray-700 leading-normal'}>
              {tr(modalLang,
                'Established in 2021 in Karachi, Sahil Traders brings direct wholesale prices to customers on 4,000+ daily essentials and branded products, even if you are buying just 1 item.',
                'Sahil Traders ka aaghaz 2021 mein Karachi se wholesale business ke tor par hua. Hamara maqsad har customer ko 4,000+ products direct wholesale rates par faraham karna hai, chahe aap 1 item hi kyun na le rahe hon.',
                'ساحل ٹریڈرز کا آغاز 2021 میں کراچی سے ہول سیل بزنس کے طور پر ہوا۔ ہمارا مقصد تمام گاہکوں کو 4,000+ مصنوعات براہِ راست ہول سیل ریٹس پر فراہم کرنا ہے، چاہے وہ 1 آئٹم ہی کیوں نہ خرید رہے ہوں۔'
              )}
            </p>
          </div>
          {/* Guaranteed Lowest Price Highlight Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-4 shadow-lg border-2 border-amber-300">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fde047', color: '#451a03', fontWeight: 900, fontSize: 10, padding: '3px 10px', borderRadius: 999, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
              🔥 {tr(modalLang, 'Guaranteed Lowest Rates', 'Sabse Munfarid Baat — Shartiya Kam Rate', 'سب سے منفرد بات — شرطیہ')}
            </div>
            <div className="flex items-center gap-2.5 mb-2 font-black text-base">
              <span className="text-2xl">⚡</span>
              <span className="tracking-wide">{tr(modalLang, 'Lower Rates Than Any Supermart', 'Pakistan ke Baray se Baray Supermart se Sasta!', 'پاکستان کے بڑے سے بڑے سپر مارٹ سے سستا!')}</span>
            </div>
            <p className={isUrdu ? 'font-urdu text-right text-xs sm:text-sm font-semibold leading-relaxed text-amber-50' : 'text-xs sm:text-sm font-medium leading-relaxed text-amber-50'}>
              {tr(modalLang,
                'Over 90% of our product prices are strictly lower than any big supermart across Pakistan — Guaranteed! This unique commitment to direct wholesale pricing and huge variety is the core reason why we started Sahil Traders.',
                'Hamare 90% se ziada products ke rates Pakistan ke baray se baray supermart se bhi kam hote hain — Shartiya! Yahi hamari sabse bari khasiyat hai. Itni ziada variety aur itni kam qeemat aapko aur kahin nahi milegi!',
                'ہمارے 90% سے زائد پروڈکٹس کے ریٹس پاکستان کے بڑے سے بڑے سپر مارٹ سے بھی کم ہوتے ہیں — شرطیہ! یہی ہماری سب سے بڑی خصوصیت اور منفرد بات ہے جس کی وجہ سے ہم نے یہ کام شروع کیا۔ اتنی زیادہ ورائٹی اور اتنی کم قیمت آپ کو اور کہیں نہیں ملے گی!'
              )}
            </p>
          </div>
          {/* Leadership & Co-Founders Card */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-800 rounded-2xl p-4 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2 font-black text-sm text-amber-400 uppercase tracking-wider border-b border-gray-800 pb-2">
              <span>🤝</span>
              <span>{tr(modalLang, 'Leadership & Partnership', 'Qayadat aur Partnership', 'قیادت اور پارٹنرشپ (Leadership & Partnership)')}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Shop Owner Card (Muhammad Zubair Moin) */}
              <div className="bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-amber-400 text-gray-950 font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                  🏬
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase text-amber-300 tracking-wider">
                    {tr(modalLang, 'Shop Owner (Elder Brother)', 'Dukan ke Malik (Barray Bhai)', 'دکان کے مالکان (بڑے بھائی)')}
                  </div>
                  <div className="font-black text-sm text-white">
                    Muhammad Zubair Moin
                  </div>
                  <div className="text-[11px] text-gray-300 font-medium">
                    {tr(modalLang, 'Owner — BS Mart', 'Owner — BS Mart', 'آنر BS Mart')}
                  </div>
                </div>
              </div>
              {/* Website Creator & Co-Founder Card (Muhammad Sahil Saleem) */}
              <div className="bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-yellow-400 text-gray-950 font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                  👨‍💻
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase text-yellow-300 tracking-wider">
                    {tr(modalLang, 'Website Creator & Partner', 'Website Creator aur Partner', 'ویب سائٹ میکر اور پارٹنر')}
                  </div>
                  <div className="font-black text-sm text-white">
                    Muhammad Sahil Saleem
                  </div>
                  <div className="text-[11px] text-gray-300 font-medium">
                    {tr(modalLang, 'Founder & Developer', 'Founder aur Developer', 'بانی و ڈیولپر')}
                  </div>
                </div>
              </div>
            </div>
            <p className={isUrdu ? 'font-urdu text-right text-xs text-amber-200/90 pt-1 leading-relaxed' : 'text-xs text-amber-200/90 pt-1 leading-relaxed'}>
              {tr(modalLang,
                '💡 This complete business setup is jointly managed by both brothers, Muhammad Zubair Moin (Owner, BS Mart) & Muhammad Sahil Saleem.',
                '💡 Ye pura business setup dono bhai Muhammad Zubair Moin (Owner, BS Mart) aur Muhammad Sahil Saleem mil kar chala rahe hain.',
                '💡 یہ تمام تر سیٹ اپ اور بزنس محمد زبیر معین (مالک BS Mart) اور محمد ساحل سلیم دونوں بھائی مل کر مشترکہ طور پر چلا رہے ہیں۔'
              )}
            </p>
          </div>
          {/* Physical Shop Info Card (BS Mart) */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                <span className="text-lg">🏬</span>
                <span>{tr(modalLang, 'Visit Our Physical Shop (BS Mart)', 'Hamari Dukan par Tashreef Layein (BS Mart)', 'ہماری فزیکل دکان (BS Mart)')}</span>
              </div>
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {tr(modalLang, 'BS Mart', 'BS Mart', 'BS مارٹ')}
              </span>
            </div>
            <p className={isUrdu ? 'font-urdu text-right text-xs sm:text-sm text-emerald-900 leading-relaxed font-semibold' : 'text-xs sm:text-sm text-emerald-900 leading-relaxed font-semibold'}>
              {tr(modalLang,
                'Visit our physical shop BS Mart! Almost all items listed on this website are available in person at our store. (Note: Due to high demand or market shortage, certain items may temporarily be out of stock, but we restock continuously!)',
                'Aap hamari physical dukan BS Mart par bhi aa sakte hain! Website ki taqreeban tamam cheezein dukan par dastyab hain. (Note: Market shortage ki wajah se kuch cheezein temporary out of stock ho sakti hain, lekin hum daily restock karte hain!)',
                'ہے۔ ویب سائٹ پر موجود تقریباً تمام تر مصنوعات آپ کو ہماری دکان (BS Mart) پر بھی مل جائیں گی۔ (نوٹ: شارٹیج یا زیادہ ڈیمانڈ کی صورت میں شاید کچھ پروڈکٹس عارضی طور پر دکان پر اسٹاک میں نہ ہوں، لیکن ہم مسلسل ری اسٹاک کرتے ہیں!)'
              )}
            </p>
          </div>
          {/* 4 Highlights Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center">
              <div className="text-2xl mb-1">📦</div>
              <div className="font-black text-gray-900 text-sm">4,000+</div>
              <div className="text-[11px] text-gray-600 font-medium mt-0.5">{tr(modalLang, 'Total Products', 'Variety', 'مصنوعات کی ورائٹی')}</div>
            </div>
            <div className="bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center">
              <div className="text-2xl mb-1">🏷️</div>
              <div className="font-black text-gray-900 text-sm">{tr(modalLang, 'Wholesale Rates', 'Wholesale Rates', 'ہول سیل ریٹس')}</div>
              <div className="text-[11px] text-gray-600 font-medium mt-0.5">{tr(modalLang, 'For Everyone', 'Sab Customers ke Liye', 'عام گاہکوں کے لیے')}</div>
            </div>
            <div className="bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center">
              <div className="text-2xl mb-1">💯</div>
              <div className="font-black text-gray-900 text-sm">100% Original</div>
              <div className="text-[11px] text-gray-600 font-medium mt-0.5">{tr(modalLang, 'Genuine Brands', 'Asli Brands', 'اصلی برانڈز')}</div>
            </div>
            <div className="bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center">
              <div className="text-2xl mb-1">🚚</div>
              <div className="font-black text-gray-900 text-sm">{tr(modalLang, 'Fast Delivery', 'Fast Delivery', 'فاسٹ ڈیلیوری')}</div>
              <div className="text-[11px] text-gray-600 font-medium mt-0.5">{tr(modalLang, 'All Over Karachi', 'Poore Karachi Mein', 'پورے کراچی میں')}</div>
            </div>
          </div>
          {/* Business Hours Card */}
          <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 text-purple-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-purple-900">
              <span className="text-lg">⏰</span>
              <span>{tr(modalLang, 'Store Business Hours', 'Dukan ke Auqat (Timings)', 'اوقاتِ کار (Business Hours)')}</span>
            </div>
            <div className="bg-white/90 border border-purple-100 rounded-xl p-3 text-xs flex justify-between items-center shadow-xs">
              <div>
                <div className="font-bold text-gray-900">{tr(modalLang, 'Monday to Saturday:', 'Peer ta Hafta (Mon to Sat):', 'پیر تا ہفتہ (Monday to Saturday):')}</div>
                <div className="text-purple-700 font-extrabold text-sm mt-0.5">{tr(modalLang, '8:00 AM – 11:30 PM', 'Subha 8:00 se Raat 11:30 tak', 'صبح 8:00 بجے سے رات 11:30 بجے تک')}</div>
              </div>
              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-200 uppercase">
                {tr(modalLang, 'Open', 'Khula Hai', 'کھلا ہے')}
              </span>
            </div>
          </div>
          {/* Features List */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-emerald-950 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
              <span>✨</span>
              <span>{tr(modalLang, 'Why Customers Trust Us', 'Khandani Aitemad aur Khasiyat', 'ہماری خصوصیات (Why Choose Us)')}</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-emerald-900">
              <li>{tr(modalLang, 'Family business serving with trust since 2021', '2021 se khandani aitemad ke sath khidmat', '2021 سے خاندانی اعتماد کے ساتھ خدمت')}</li>
              <li>{tr(modalLang, 'Free delivery on orders above Rs. 2,000', 'Rs. 2,000 se ziada par muft delivery', 'Rs. 2,000 سے زائد پر مفت شپنگ (Free Delivery)')}</li>
              <li>{tr(modalLang, 'Same-day return & exchange policy', 'Usi din tabdeeli aur wapsi ki sahulat (Same-Day Return)', 'اسی دن تبدیلی اور واپسی کی سہولت (Same-day Return)')}</li>
              <li>{tr(modalLang, 'Direct WhatsApp customer support', 'Direct WhatsApp par fori support', 'براہِ راست واٹس ایپ پر فوری سپورٹ')}</li>
            </ul>
          </div>
          {/* Google Maps Exact Plus Code Location Card */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-sm text-blue-950">
                <span className="text-lg">📍</span>
                <span>{tr(modalLang, 'Store Address & Exact Location', 'Dukan ka Pura Pata aur Map', 'دکان کا مکمل پتہ اور نقشہ')}</span>
              </div>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=R4C4%2BRV6%2C+Safaid+White+Masjid+Rd%2C+Allah+Wala+Town+Sector+H+Korangi%2C+Karachi%2C+Pakistan" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1 text-decoration-none"
              >
                {tr(modalLang, 'Open Map ↗', 'Map Kholein ↗', 'نقشہ کھولیں ↗')}
              </a>
            </div>
            <div className="bg-white/90 border border-blue-100 rounded-xl p-3 text-xs text-gray-800 font-medium leading-relaxed flex items-start gap-2 shadow-xs">
              <span className="text-blue-600 font-bold shrink-0 mt-0.5 text-sm">🏬</span>
              <div>
                <div className="font-bold text-gray-900">Sahil Traders (Wholesale & Retail)</div>
                <div className="text-gray-600 mt-0.5">
                  {tr(modalLang, 'R4C4+RV6, Safaid White Masjid Rd, Allah Wala Town Sector H Korangi, Karachi, Pakistan', 'R4C4+RV6, Safaid White Masjid Rd, Allah Wala Town Sector H Korangi, Karachi, Pakistan', 'R4C4+RV6، سفید مسجد روڈ، اللہ والا ٹاؤن سیکٹر ایچ، کورنگی، کراچی، پاکستان')}
                </div>
              </div>
            </div>
            <div className="w-full h-48 sm:h-52 rounded-xl overflow-hidden border border-blue-200 shadow-inner relative bg-gray-100">
              <iframe
                title="Sahil Traders Google Map Location"
                src="https://maps.google.com/maps?q=R4C4%2BRV6%2C+Safaid+White+Masjid+Rd%2C+Allah+Wala+Town+Sector+H+Korangi%2C+Karachi%2C+Pakistan&t=&z=17&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen={true}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
          <a
            href={`https://wa.me/${(window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber) || '923368945775'}?text=${encodeURIComponent(tr(modalLang, 'Hi Sahil Traders! I have an inquiry about your store.', 'Salam Sahil Traders! Mujhe aapke store ke baare mein maloomat chahiye.', 'سلام! میں ساحل ٹریڈرز کے بارے میں معلومات حاصل کرنا چاہتا ہوں۔'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs tracking-wider uppercase text-center transition-colors flex items-center justify-center gap-2 text-decoration-none"
          >
            <span>💬</span>
            <span>{tr(modalLang, 'Chat on WhatsApp', 'WhatsApp par Rabta Karein', 'واٹس ایپ پر رابطہ کریں')}</span>
          </a>
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            {tr(modalLang, 'Close', 'Band Karein', 'بند کریں')}
          </button>
        </div>
      </div>
    </div>
  );
}
function ReturnPolicyModal({ isOpen, onClose, language }) {
  if (!isOpen) return null;
  const isUrdu = language === 'ur';
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-in relative"
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-emerald-900 via-teal-900 to-gray-900 text-white p-6 pb-7 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/15 border border-white/20 p-2 shadow-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-emerald-300 font-poppins">
            {tr(language, 'Return & Exchange Policy', 'Wapsi aur Tabdeeli ki Policy', 'واپسی اور تبدیلی کی پالیسی')}
          </h2>
          <p className="text-xs text-emerald-100/90 font-semibold mt-1 tracking-wide">
            {tr(language, '100% Guaranteed Customer Protection & Care', 'Sahil Traders — 100% Tasalli aur Guarantee', 'ساحل ٹریڈرز - 100% تسلی اور ضمانت')}
          </p>
        </div>
        {/* Scroll Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-gray-800 text-sm leading-relaxed">
          {/* Main Guarantee Banner */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-emerald-950 shadow-sm space-y-1.5">
            <div className="flex items-center gap-2 font-black text-sm text-emerald-900">
              <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{tr(language, 'What Happens If Product Is Damaged or Faulty?', 'Agar koi cheez kharab ya leak nikle to kya hoga?', 'اگر پروڈکٹ خراب یا لیک نکلے تو کیا ہوگا؟')}</span>
            </div>
            <p className={isUrdu ? 'font-urdu text-right text-xs leading-loose text-emerald-950 font-bold' : 'text-xs text-emerald-950 leading-relaxed font-semibold'}>
              {tr(language,
                'If any product received by you turns out to be damaged, leaked, expired, or incorrect - DO NOT WORRY AT ALL! We will immediately issue a 100% Free Replacement or Full Money Refund without any hassle.',
                'Agar aapko mosool hone wali koi bhi cheez kharab, leak, expired ya ghalat nikle to pareshan bilkul na hon! Hum bina kisi behas ke nayi cheez tabdeel (Replace) kar ke denge ya 100% paise wapas (Refund) karenge!',
                'اگر آپ کو موصول ہونے والی کوئی بھی چیز خراب، لیک، ایکسپائر یا غلط نکلے تو پریشان بالکل نہ ہوں! ہم بنا کسی بحث کے آپ کو نئی چیز تبدیل (Replace) کر کے دیں گے یا آپ کے مکمل پیسے واپس (100% Money Refund) کریں گے!'
              )}
            </p>
          </div>
          {/* 4 Points Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Point 1: Same-Day Return */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-black text-gray-900">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{tr(language, 'Same-Day Return & Exchange', 'Usi Din (Same Day) ki Sahulat', 'اسی دن (Same Day) کی سہولت')}</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                {tr(language,
                  'You can claim return or exchange on the same day of delivery.',
                  'Order mosool hone ke usi din (Same Day) aap fori claim kar sakte hain.',
                  'آرڈر موصول ہونے کے اسی دن (Same Day) آپ فوری کلیم کر سکتے ہیں।'
                )}
              </p>
            </div>
            {/* Point 2: Zero Delivery Fee */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-black text-gray-900">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.215-9.124l-2.005-2.005A2.25 2.25 0 0015.682 6H13.5m0 0V3.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v10.875" /></svg>
                <span>{tr(language, 'Free Pickup & Delivery', 'Muft Tabdeeli Delivery', 'مفت تبدیلی ڈلیوری')}</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                {tr(language,
                  'If the issue is from our side, exchange delivery charges will be 100% FREE.',
                  'Agar masla hamari taraf se ho to tabdeeli ke delivery charges 100% FREE honge!',
                  'اگر مسئلہ ہماری طرف سے ہو تو تبدیلی کے ڈلیوری چارجز صفر (مفت) ہوں گے!'
                )}
              </p>
            </div>
            {/* Point 3: Store Exchange */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-black text-gray-900">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H21m-4.5 0H12m-9 0h4.5m0 0V9a2.25 2.25 0 012.25-2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44.505.75.958.75h3.423a.75.75 0 00.75-.75V6.75A2.25 2.25 0 0017.25 4.5h-10.5A2.25 2.25 0 004.5 6.75V21" /></svg>
                <span>{tr(language, 'In-Store Exchange', 'Dukan par Direct Tabdeeli', 'دکان پر براہِ راست تبدیلی')}</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                {tr(language,
                  'You can also visit BS Mart (Korangi, Karachi) for immediate in-person exchange.',
                  'Hamari physical shop BS Mart (Korangi, Karachi) aakar bhi fori tabdeel karwa sakte hain.',
                  'ہماری فزیکل شاپ BS Mart (کورنگی، کراچی) آکر بھی تبدیل کروا سکتے ہیں'
                )}
              </p>
            </div>
            {/* Point 4: Money Refund */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center gap-2 font-black text-gray-900">
                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{tr(language, 'Instant Refund Option', 'Fori Refund Sahulat', 'فوری ری فنڈ (Refund)')}</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                {tr(language,
                  'Get 100% money back sent to your EasyPaisa, JazzCash, or Bank account.',
                  'Agar aap tabdeel nahi karna chahte to aapke paise EasyPaisa / JazzCash / Bank mein wapas kar diye jayenge.',
                  'اگر آپ تبدیل نہیں کرنا چاہتے تو آپ کے پیسے EasyPaisa / JazzCash / Bank میں واپس کر دیے جائیں گے'
                )}
              </p>
            </div>
          </div>
          {/* 3 Step Claim Guide */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-sm text-blue-950">
              <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>
              <span>{tr(language, 'Easy 3-Step Claim Process:', 'Claim Karne Ka Aasan Tareeqa (3 Steps):', 'کلیم کرنے کا آسان طریقہ (How to Claim):')}</span>
            </div>
            <div className="space-y-2 text-xs text-blue-900 font-medium">
              <div className="flex items-start gap-2.5 bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5">1</span>
                <div>
                  <span className="font-bold text-gray-900">{tr(language, 'Send Photo/Video on WhatsApp:', 'Kharab Cheez ki Photo Bhejein:', 'واپسی یا تبدیلی کی تصویر بھیجیں:')}</span>
                  <p className="text-[11px] text-gray-600 mt-0.5">{tr(language, 'Take a quick photo or video of the damaged item & WhatsApp to 03368945775.', 'Kharab ya leak cheez ki tasveer hamare WhatsApp (03368945775) par bhejein.', 'خراب یا لیک شدہ چیز کی تصویر ہمارے واپس ایپ (03368945775) پر بھیجیں')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5">2</span>
                <div>
                  <span className="font-bold text-gray-900">{tr(language, 'Instant Verification:', 'Fori Tasdeeq:', 'فوری تصدیق:')}</span>
                  <p className="text-[11px] text-gray-600 mt-0.5">{tr(language, 'Our customer support team will verify & approve your claim instantly.', 'Hamari team 10 minute ke andar apka claim approve karegi.', 'ہماری ٹیم 10 منٹ کے اندر آپ کا کلیم منظور کرے گی')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 bg-white/80 p-2.5 rounded-xl border border-blue-100">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5">3</span>
                <div>
                  <span className="font-bold text-gray-900">{tr(language, 'Replacement / Refund Sent:', 'Tabdeeli ya Refund:', 'تبدیلی یا ری فنڈ:')}</span>
                  <p className="text-[11px] text-gray-600 mt-0.5">{tr(language, 'Our rider will replace the item at your doorstep or send your money refund.', 'Rider nayi cheez de kar purani le jayega ya paise refund honge.', 'رائڈر نئی چیز دے کر پرانی لے جائے گا یا پیسے ری فنڈ ہوں گے')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 shrink-0">
          <a
            href={`https://wa.me/${(window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber) || '923368945775'}?text=${encodeURIComponent(tr(language, 'Hi Sahil Traders! I want to claim a return/exchange for my order.', 'Salam Sahil Traders! Mujhe apne order ka return/exchange claim karna hai.', 'سلام! میں اپنے آرڈر کی واپسی یا تبدیلی کا کلیم کرنا چاہتا ہوں۔'))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs tracking-wider uppercase text-center transition-colors flex items-center justify-center gap-2 text-decoration-none"
          >
            <span>💬</span>
            <span>{tr(language, 'WhatsApp Claim', 'WhatsApp par Claim Karein', 'واٹس ایپ پر کلیم کریں')}</span>
          </a>
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            {tr(language, 'Close', 'Band Karein', 'بند کریں')}
          </button>
        </div>
      </div>
    </div>
  );
}

function WelcomeDisclaimerModal({ isOpen, onClose, onOpenAbout, language }) {
  if (!isOpen) return null;
  const [modalLang, setModalLang] = React.useState('ro');
  const isUrdu = modalLang === 'ur';
  return (
    <div 
      className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-amber-400 animate-scale-in relative p-6 text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg">
          👋
        </div>
        <h3 className="text-xl font-black text-gray-900 tracking-wide">
          {tr(modalLang, 'Assalam U alaikum!', 'Assalam-o-Alaikum!', 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ')}
        </h3>
        <h4 className="text-lg font-extrabold text-amber-600 mt-1 font-poppins">
          {tr(modalLang, 'Welcome to Sahil Traders', 'Sahil Traders mein Khush Amdeed', 'ساحل ٹریڈرز میں خوش آمدید')}
        </h4>
        <div className="my-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950">
          <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-amber-900 mb-1.5">
            📢 {tr(modalLang, 'Important Notice', 'Zaroori Guzarish / Ailaan', 'ضروری گزارش / اعلان')}
          </div>
          <p className={isUrdu ? 'font-urdu text-right text-xs leading-loose' : 'text-xs text-gray-700 leading-normal text-center'}>
            {tr(modalLang,
              'We kindly request you to please read our "About Us" section at least once so you get all the essential information and shop with complete clarity.',
              'Hamari aapse guzarish hai ke ek baar hamara "About Us" section lazmi parh lein, taake aapko tamam zaroori aur ahem maloomat mil sakein aur shopping mein koi masla na aaye.',
              'ہماری آپ سے گزارش ہے کہ ایک بار ہمارا "About Us (ہماری معلومات)" سیکشن لازمی پڑھ لیں، تاکہ آپ کو تمام ضروری اور اہم معلومات مل سکیں اور خریداری میں کوئی مسئلہ پیش نہ آئے۔'
            )}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onOpenAbout();
              onClose();
            }}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            📖 {tr(modalLang, 'Read About Us', 'Hamare Baare Mein Parhein (About Us)', 'ہماری معلومات پڑھیں (Read About Us)')}
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2.5 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
          >
            {tr(modalLang, 'Understood, Continue', 'Theek Hai, Aage Barhein', 'ٹھیک ہے، آگے بڑھیں')}
          </button>
        </div>
      </div>
    </div>
  );
}

function ParchiOrderModal({ open, onClose, language, saveOrderHistory }) {
  if (!open) return null;
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedOrderId, setSubmittedOrderId] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      triggerHaptic('medium');
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhoto(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert(tr(language, 'Please enter your name.', 'Apna naam darj karein.', 'براہ کرم اپنا نام درج کریں۔'));
      return;
    }
    if (!phone.trim()) {
      alert(tr(language, 'Please enter your WhatsApp phone number.', 'Apna WhatsApp number darj karein.', 'براہ کرم اپنا واٹس ایپ نمبر درج کریں۔'));
      return;
    }
    if (!photo) {
      alert(tr(language, 'Please upload or capture a photo of your slip.', 'Parchi ki photo upload ya capture karein.', 'براہ کرم پرچی کی تصویر لیں۔'));
      return;
    }

    triggerHaptic('success');
    const orderId = Math.floor(100000 + Math.random() * 900000);
    setSubmittedOrderId(orderId);
    const now = new Date();
    const dateText = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const orderRecord = {
      id: orderId,
      dateText: dateText,
      deliveryMethod: deliveryMethod,
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: deliveryMethod === 'home' ? address.trim() : 'BS Mart Store Pickup Karachi'
      },
      items: [
        {
          id: 'parchi-slip',
          name: `📸 Parchi Slip Order (${notes ? notes.substring(0, 30) : 'Handwritten List'})`,
          qty: 1,
          price: 0,
          total: 0
        }
      ],
      subtotal: 0,
      deliveryFee: deliveryMethod === 'home' ? 150 : 0,
      grandTotal: 0,
      isParchi: true,
      notes: notes.trim()
    };

    if (typeof saveOrderHistory === 'function') {
      saveOrderHistory(orderRecord);
    }

    const waText = `*Salam Sahil Traders!* 📸\n*Mene Parchi (Handwritten Slip) Order diya hai.*\n\n🔢 *Order Ref:* #${orderId}\n👤 *Customer:* ${name.trim()}\n📞 *WhatsApp:* ${phone.trim()}\n🚚 *Method:* ${deliveryMethod === 'pickup' ? 'Store Pickup (BS Mart Karachi)' : 'Home Delivery'}\n📍 *Address:* ${deliveryMethod === 'home' ? address.trim() : 'Store Pickup'}\n${notes.trim() ? `📝 *Notes:* ${notes.trim()}\n` : ''}\n_(Parchi ki photo chat mein send ki ja rahi hai)_`;

    // Try direct native Web Share with photo file (opens WhatsApp with actual photo attached on mobile)
    let sharedWithFile = false;
    if (photoFile && navigator.canShare && navigator.canShare({ files: [photoFile] })) {
      try {
        await navigator.share({
          files: [photoFile],
          title: `Sahil Traders Parchi Order #${orderId}`,
          text: waText
        });
        sharedWithFile = true;
      } catch (err) {
        // User cancelled share sheet or share failed
      }
    }

    if (!sharedWithFile) {
      const waUrl = buildWhatsAppUrl('923368945775', waText);
      window.open(waUrl, '_blank');
    }

    setSubmitted(true);
  };

  const handleOpenWhatsAppDirect = () => {
    const waText = `*Salam Sahil Traders!* 📸\n*Parchi Order Ref:* #${submittedOrderId || 'ST'}\n👤 *Customer:* ${name.trim()}\n📞 *Phone:* ${phone.trim()}\n🚚 *Method:* ${deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'}\n📍 *Address:* ${deliveryMethod === 'home' ? address.trim() : 'Store Pickup'}`;
    const waUrl = buildWhatsAppUrl('923368945775', waText);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-in relative flex flex-col" style={{ maxHeight: '92vh' }} onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xl">📸</span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                {tr(language, 'Parchi / Photo Order', 'Parchi / Photo Order', 'پرچی / فوٹو آرڈر')}
              </h3>
              <p className="text-[10px] text-emerald-100 font-medium">
                {tr(language, 'Upload written slip & order in 5 seconds', 'Haath se likhi list upload karein aur 5 sec mein order bhein', 'ہاتھ سے لکھی پرچی بھیجیں')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {submitted ? (
            <div className="text-center py-4 space-y-3.5">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
                ✓
              </div>
              <h4 className="font-black text-base sm:text-lg text-gray-900 leading-tight">
                {tr(language, 'Parchi Order Registered! 🎉', 'Parchi Order Darj Ho Gaya! 🎉', 'پرچی آرڈر درج ہو گیا!')}
              </h4>
              
              {/* Photo Preview in Success Screen */}
              {photo && (
                <div className="w-28 h-28 mx-auto rounded-2xl border-2 border-emerald-400 overflow-hidden bg-gray-50 shadow-sm flex items-center justify-center p-1">
                  <img src={photo} alt="Slip" className="w-full h-full object-contain rounded-xl" />
                </div>
              )}

              {/* Photo Attachment Guidance Notice */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs text-amber-900 space-y-1 shadow-2xs">
                <p className="font-black flex items-center gap-1.5 text-amber-950">
                  <span>💡</span>
                  <span>{tr(language, 'WhatsApp Photo Reminder', 'Zaroori Baat (Photo Attach Karein)', 'ضروری نوٹ: تصویر منسلک کریں')}</span>
                </p>
                <p className="leading-relaxed text-[11px] text-amber-900/90">
                  {tr(
                    language,
                    'WhatsApp chat is now open! Please tap the Attach (📎) or Camera icon in WhatsApp to send this slip photo so we can prepare your order.',
                    'WhatsApp chat khul chuki hai! WhatsApp mein Attach (📎) ya Camera button daba kar yeh parchi ki photo lazmi send kar dein.',
                    'واٹس ایپ چیٹ کھل چکی ہے۔ واٹس ایپ میں اٹیچ (📎) کے بٹن سے پرچی کی تصویر بھیج دیں۔'
                  )}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleOpenWhatsAppDirect}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>💬</span>
                  <span>{tr(language, 'Open WhatsApp Chat Again', 'WhatsApp Chat Dobara Kholein', 'دوبارہ واٹس ایپ کھولیں')}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl uppercase tracking-wider cursor-pointer"
                >
                  {tr(language, 'Continue Shopping', 'Kharidari Jari Rakhein', 'خریداری جاری رکھیں')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-extrabold text-gray-800 mb-1.5 uppercase tracking-wider">
                  {tr(language, '1. Take or Upload Photo of Slip *', '1. Parchi ki Photo Khainchein ya Select Karein *', '1. پرچی کی تصویر لیں یا اپلوڈ کریں *')}
                </label>
                {photo ? (
                  <div className="relative rounded-2xl border-2 border-emerald-500 overflow-hidden bg-gray-50 h-48 flex items-center justify-center group shadow-sm">
                    <img src={photo} alt="Parchi Slip Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-md cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <span>🗑️</span>
                      <span>{tr(language, 'Remove / Retake', 'Dobara Lein', 'دوبارہ لیں')}</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Option 1: Live Camera */}
                    <label className="border-2 border-dashed border-emerald-400 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50/70 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 shadow-2xs group">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl mb-2 shadow-sm group-hover:scale-110 transition-transform">
                        📷
                      </div>
                      <span className="text-xs font-black text-gray-900 leading-tight">
                        {tr(language, 'Take Photo', 'Camera Se Khainchein', 'کیمرہ سے تصویر لیں')}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-semibold mt-1">
                        {tr(language, 'Open Camera', 'Live Camera', 'لائیو کیمرہ')}
                      </span>
                    </label>

                    {/* Option 2: Mobile Gallery / Files */}
                    <label className="border-2 border-dashed border-teal-400 hover:border-teal-600 bg-teal-50/40 hover:bg-teal-50/70 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-95 shadow-2xs group">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center text-xl mb-2 shadow-sm group-hover:scale-110 transition-transform">
                        🖼️
                      </div>
                      <span className="text-xs font-black text-gray-900 leading-tight">
                        {tr(language, 'Upload Gallery', 'Gallery Se Chunin', 'گیلری سے منتخب کریں')}
                      </span>
                      <span className="text-[10px] text-teal-800 font-semibold mt-1">
                        {tr(language, 'Phone Photos', 'Mobile Gallery', 'موبائل گیلری')}
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    {tr(language, 'Your Name *', 'Apka Naam *', 'آپ کا نام *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ali Khan"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    {tr(language, 'WhatsApp Phone *', 'WhatsApp Number *', 'واٹس ایپ نمبر *')}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0336-XXXXXXX"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  {tr(language, 'Delivery Option', 'Delivery Ka Tareeqa', 'ڈلیوری کا طریقہ')}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('home')}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      deliveryMethod === 'home'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 bg-white text-gray-600'
                    }`}
                  >
                    <span>🚚</span>
                    <span>{tr(language, 'Home Delivery', 'Home Delivery', 'ہوم ڈلیوری')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      deliveryMethod === 'pickup'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 bg-white text-gray-600'
                    }`}
                  >
                    <span>🏬</span>
                    <span>{tr(language, 'Store Pickup', 'Store Pickup', 'اسٹور پک اپ')}</span>
                  </button>
                </div>
              </div>

              {deliveryMethod === 'home' && (
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    {tr(language, 'Delivery Address in Karachi', 'Karachi Ka Pura Pata', 'کراچی کا پتہ')}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Area, Street, Shop / House #"
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  {tr(language, 'Special Instructions / Notes (Optional)', 'Koi Khaas Baat (Optional)', 'اضافی ہدایات (اختیاری)')}
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Bhai 2 peti Lux aur 1 carton Surf bhej dena..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all active:scale-95 cursor-pointer mt-2"
              >
                <span>💬</span>
                <span>{tr(language, 'Submit & Send on WhatsApp', 'Parchi Order WhatsApp Par Bhejein', 'پرچی آرڈر واٹس ایپ پر بھیجیں')}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function WishlistDrawer({ open, onClose, wishlist, products, onAddToCart, onRemoveWishlist, language, langData }) {
  if (!open) return null;
  const wishlistedProducts = useMemo(() => {
    if (!products || !wishlist) return [];
    return products.filter(p => wishlist.includes(p.id));
  }, [products, wishlist]);

  const handleAddAll = () => {
    triggerHaptic('success');
    wishlistedProducts.forEach(p => {
      onAddToCart(p);
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-gray-200 animate-slide-left relative"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xl text-rose-600">❤️</span>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 leading-tight">
                {tr(language, 'My Wishlist (Favorites)', 'Meri Pasandeeda Ashya', 'میری پسندیدہ اشیاء')}
              </h3>
              <p className="text-[11px] text-gray-500">
                {wishlistedProducts.length} {tr(language, 'saved items', 'items save hain', 'اشیاء محفوظ ہیں')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center text-3xl mx-auto">
                🤍
              </div>
              <h4 className="font-black text-gray-900 text-base">
                {tr(language, 'Your wishlist is empty', 'Wishlist abhi khali hai', 'آپ کی وش لسٹ خالی ہے')}
              </h4>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                {tr(language, 'Tap the heart icon on any product to save it here for quick repeat orders.', 'Kisi bhi product par dil (heart) daba kar save karein.', 'پروڈکٹ پر دل کے نشان کو دبا کر محفوظ کریں۔')}
              </p>
            </div>
          ) : (
            wishlistedProducts.map(product => {
              const pricing = getProductPricing(product);
              const hasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id];
              const imgSrc = hasFile ? getImgUrl(`images/${product.id}.${window.PRODUCT_IMAGE_MAP[product.id]}`) : null;
              return (
                <div key={product.id} className="flex items-center gap-3 p-2.5 rounded-2xl border border-gray-100 hover:border-gray-300 bg-white transition-all shadow-2xs">
                  <div className="w-14 h-14 bg-gray-50 rounded-xl p-1 flex items-center justify-center shrink-0">
                    {hasFile ? (
                      <img src={imgSrc} alt={product.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center font-bold text-gray-700 text-sm">
                        {product.initial || 'P'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-gray-900 truncate">
                      {getProductDisplayName(product, language)}
                    </h5>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="font-black text-xs text-gray-950">
                        Rs. {pricing.sellingPrice.toLocaleString()}
                      </span>
                      {pricing.hasDiscount && (
                        <span className="text-[10px] text-gray-400 line-through">
                          Rs. {pricing.retailPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('medium');
                        onAddToCart(product);
                      }}
                      className="px-2.5 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
                    >
                      + Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light');
                        if (onRemoveWishlist) onRemoveWishlist(product);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg cursor-pointer transition-colors"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {wishlistedProducts.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-2">
            <button
              type="button"
              onClick={handleAddAll}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>🛒</span>
              <span>{tr(language, 'Add All to Cart', 'Saari Ashya Cart Mein Daalein', 'تمام اشیاء کارٹ میں شامل کریں')} ({wishlistedProducts.length})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetailModal({ product, open, onClose, onAddToCart, products, langData, language, onSelectProduct, isWishlisted, onToggleWishlist }) {
  if (!open || !product) return null;
  const isUrdu = language === 'ur';
  const [modalQty, setModalQty] = React.useState(1);
  const pricing = useMemo(() => getProductPricing(product), [product]);
  const bulkPricing = useMemo(() => calculateBulkPricing(pricing.sellingPrice, modalQty), [pricing.sellingPrice, modalQty]);
  // Find 4-6 Related Products from the same category (excluding current product)
  const relatedProducts = useMemo(() => {
    if (!product || !products) return [];
    const sameCat = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id);
    if (sameCat.length >= 4) return sameCat.slice(0, 6);
    
    // Fallback: items with same brand or general items
    const brand = getProductFilterName(product);
    const sameBrand = products.filter(p => p.id !== product.id && getProductFilterName(p) === brand);
    const combined = Array.from(new Set([...sameCat, ...sameBrand]));
    return combined.slice(0, 6);
  }, [product, products]);
  const hasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id];
  const imageSrc = hasFile ? getImgUrl(`images/${product.id}.${window.PRODUCT_IMAGE_MAP[product.id]}`) : null;
  const handleDirectWhatsAppOrder = () => {
    const pName = getProductDisplayName(product, language);
    let discountInfo = '';
    if (bulkPricing.extraPercent > 0) {
      discountInfo += `\n🎁 *Bulk Volume Discount (${bulkPricing.extraPercent}%):* -Rs ${bulkPricing.extraSavings.toLocaleString()}`;
    }
    if (pricing.hasDiscount) {
      discountInfo += `\n🏷️ *Retail:* ~Rs ${(pricing.retailPrice * modalQty).toLocaleString()}~ (Total Savings: Rs ${((pricing.savings * modalQty) + bulkPricing.extraSavings).toLocaleString()})`;
    }
    const msg = `Assalam U Alaikum Sahil Traders!\nI want to order this item directly:\n\n📦 *Product:* ${pName}\n🔢 *Quantity:* ${modalQty}\n💰 *Price:* *Rs ${bulkPricing.finalTotal.toLocaleString()}*${discountInfo}\n\nPlease confirm my order.`;
    window.open(`https://wa.me/923368945775?text=${encodeURIComponent(msg)}`, '_blank');
  };
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-in relative flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest uppercase text-gray-500 font-poppins">
              {tr(language, 'Product Details & Info', 'Product ki Mukammal Tafseel', 'پروڈکٹ کی مکمل تفصیلات')}
            </span>
            {pricing.hasDiscount ? (
              <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1">
                <span>🔥</span>
                <span>{pricing.discountPercent}% {tr(language, 'OFF', 'OFF', 'رعایت')}</span>
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
                {tr(language, 'Wholesale Rate', 'Behtareen Wholesale Rate', 'بہترین ہول سیل ریٹ')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleWishlist && onToggleWishlist(product)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isWishlisted
                  ? 'bg-rose-50 border border-rose-200 text-rose-600 scale-105 shadow-2xs'
                  : 'bg-white border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-200'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <svg className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isWishlisted ? '0' : '2'} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-black hover:text-white text-gray-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* Main Product Info Card */}
          <div className="flex flex-col gap-3 bg-gradient-to-br from-gray-50 to-amber-50/30 p-4 rounded-2xl border border-gray-200 shadow-xs">
            {/* Top Row: Image on Left, Title + Wholesale Selling Price on Right */}
            <div className="flex flex-col sm:flex-row gap-3.5 items-center sm:items-start">
              {/* Image */}
              <div className="w-36 h-36 sm:w-40 sm:h-40 shrink-0 bg-white rounded-2xl p-2.5 border border-gray-200 flex items-center justify-center shadow-sm relative group overflow-hidden">
                {pricing.hasDiscount && (
                  <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1 uppercase tracking-wider">
                    <span>🔥</span>
                    <span>{pricing.discountPercent}% OFF</span>
                  </span>
                )}
                {hasFile ? (
                  <img 
                    src={imageSrc} 
                    alt={product.name} 
                    loading="lazy" 
                    decoding="async" 
                    className="w-full h-full object-contain" 
                  />
                ) : (
                  <div className={`w-full h-full rounded-xl bg-gradient-to-br ${product.gradient || 'from-amber-400 to-amber-600'} flex items-center justify-center text-white text-4xl font-black`}>
                    {product.initial || 'P'}
                  </div>
                )}
                {!pricing.hasDiscount && (
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                    Original
                  </span>
                )}
              </div>
              {/* Right Side: Name, In-Stock Tag & Wholesale Price Card */}
              <div className="flex-1 space-y-2 text-center sm:text-left w-full">
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start items-center">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                    {tr(language, '✓ In Stock', '✓ Stock mein Dastyab Hai', '✓ اسٹاک میں دستیاب')}
                  </span>
                  {product.categoryName && (
                    <span className="bg-gray-200 text-gray-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      {product.categoryName}
                    </span>
                  )}
                </div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 leading-snug">
                  {getProductDisplayName(product, language)}
                </h3>
                {/* Wholesale Selling Price Card (side by side with image) */}
                {pricing.hasDiscount ? (
                  <div className="space-y-1.5 bg-gradient-to-r from-emerald-50/70 via-white to-red-50/50 p-2.5 sm:p-3 rounded-2xl border border-emerald-200/80 shadow-2xs text-left">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                          {tr(language, 'Wholesale Selling Price', 'Hamari Wholesale Qeemat', 'ہماری ہول سیل قیمت')}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-black text-gray-950">
                            Rs. {pricing.sellingPrice.toLocaleString()}
                          </span>
                          <span className="text-sm sm:text-base text-gray-400 line-through font-bold">
                            Rs. {pricing.retailPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <span className="inline-block bg-red-600 text-white text-xs sm:text-sm font-black px-2.5 py-1 rounded-xl shadow-xs">
                        {pricing.discountPercent}% OFF
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100/90 px-2 py-1 rounded-lg border border-emerald-300">
                      <svg className="w-3.5 h-3.5 text-emerald-700 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>
                        {tr(language,
                          `You Save: Rs. ${pricing.savings.toLocaleString()} per item`,
                          `Apki Bachat: Rs. ${pricing.savings.toLocaleString()} fi item`,
                          `آپ کی بچت: Rs. ${pricing.savings.toLocaleString()} فی آئٹم`
                        )}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline justify-center sm:justify-start gap-2">
                    <span className="text-2xl font-black text-black">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {tr(language, 'Cheaper than Supermarts', 'Supermarket se Sasta', 'سپر مارکیٹ سے سستا')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Below Top Row: Full-width Quantity Controls, Bulk Chips, Live Total & Savings */}
            <div className="space-y-2.5 pt-2 border-t border-gray-200/80 w-full">
                {/* Stepper on Left, Wholesale Dropdown on Right */}
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs shrink-0">
                    <button 
                      type="button"
                      onClick={() => setModalQty(q => Math.max(1, q - 1))}
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-base flex items-center justify-center cursor-pointer transition-colors"
                      title="Minus 1"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={modalQty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setModalQty(isNaN(val) || val < 1 ? 1 : val);
                      }}
                      className="w-12 text-center font-black text-sm text-black border-none focus:outline-hidden py-0.5"
                    />
                    <button 
                      type="button"
                      onClick={() => setModalQty(q => q + 1)}
                      className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-base flex items-center justify-center cursor-pointer transition-colors"
                      title="Plus 1"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <select
                      value={[6, 12, 24, 36, 48, 60].includes(modalQty) ? modalQty : "custom"}
                      onChange={(e) => {
                        if (e.target.value !== "custom") {
                          setModalQty(Number(e.target.value));
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-300 hover:border-slate-800 text-slate-900 font-extrabold text-xs rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-black cursor-pointer shadow-2xs transition-colors truncate"
                    >
                      <option value="custom">📦 {tr(language, 'Wholesale Packs', 'Wholesale Pack Chunain', 'ہول سیل پیک')}</option>
                      <option value="6">6 Pcs (Half Dozen - Extra 0.6% OFF)</option>
                      <option value="12">12 Pcs (1 Dozen - Extra 1.2% OFF)</option>
                      <option value="24">24 Pcs (2 Dozen - Extra 1.8% OFF)</option>
                      <option value="36">36 Pcs (3 Dozen - Extra 2.2% OFF)</option>
                      <option value="48">48 Pcs (4 Dozen - Extra 2.8% OFF)</option>
                      <option value="60">60 Pcs (5 Dozen - Extra 3.2% OFF)</option>
                    </select>
                  </div>
                </div>

                {/* Bulk Discount Tier Info Strip */}
                <div style={{ background: 'linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%)', border: '1px solid #6ee7b7', borderRadius: 12, padding: '7px 10px' }}>
                  <span style={{ fontSize: 9, fontWeight: 900, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 5 }}>🎁 Bulk Extra Discount</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 3 }}>
                    {[
                      { qty: 6,  pct: 0.6 },
                      { qty: 12, pct: 1.2 },
                      { qty: 24, pct: 1.8 },
                      { qty: 36, pct: 2.2 },
                      { qty: 48, pct: 2.8 },
                      { qty: 60, pct: 3.2 },
                    ].map(({ qty: q, pct }) => {
                      const isCurrent = getBulkDiscountTier(modalQty).percent === pct && modalQty >= q;
                      return (
                        <button
                          key={q}
                          type="button"
                          onClick={() => setModalQty(q)}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '3px 2px', borderRadius: 8,
                            border: isCurrent ? '2px solid #059669' : '1px solid #a7f3d0',
                            background: isCurrent ? '#059669' : '#ffffff',
                            cursor: 'pointer', transition: 'all 0.15s',
                            boxShadow: isCurrent ? '0 2px 6px rgba(5,150,105,0.3)' : 'none'
                          }}
                        >
                          <span style={{ fontSize: 11, fontWeight: 900, color: isCurrent ? '#ffffff' : '#111827', lineHeight: 1.2 }}>{q}</span>
                          <span style={{ fontSize: 8.5, fontWeight: 800, color: isCurrent ? '#bbf7d0' : '#059669', lineHeight: 1.3 }}>+{pct}%</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Total / Subtotal Calculation with Bulk Discount */}
                <div className={`border rounded-xl px-3 py-2 shadow-2xs ${
                  bulkPricing.extraPercent > 0 
                    ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300' 
                    : 'bg-amber-50/70 border-amber-200/80'
                }`}>
                  {/* Top row: total label + price */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: (pricing.hasDiscount || bulkPricing.extraPercent > 0) ? 6 : 0 }}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">
                          {tr(language, 'Total for', 'Kul Qeemat Baraye', 'کل قیمت برائے')} {modalQty} {modalQty > 1 ? tr(language, 'items', 'cheezein', 'اشیاء') : tr(language, 'item', 'cheez', 'چیز')}:
                        </span>
                        {bulkPricing.extraPercent > 0 && (
                          <span className="bg-emerald-600 text-white text-[9.5px] font-black px-1.5 py-0.2 rounded-md uppercase">
                            🔥 +{bulkPricing.extraPercent}% OFF
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-black text-gray-950 font-poppins">
                          Rs. {bulkPricing.finalTotal.toLocaleString()}
                        </span>
                        {bulkPricing.extraPercent > 0 && (
                          <span className="text-xs text-gray-400 line-through font-bold">
                            Rs. {bulkPricing.baseTotal.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Savings breakdown: show per-line */}
                  {(pricing.hasDiscount || bulkPricing.extraPercent > 0) && (() => {
                    const itemSaving = pricing.savings * modalQty;
                    const bulkSaving = bulkPricing.extraSavings;
                    const totalSaving = itemSaving + bulkSaving;
                    return (
                      <div style={{ borderTop: '1px dashed #6ee7b7', paddingTop: 6, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {pricing.hasDiscount && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 9.5, color: '#065f46', fontWeight: 700 }}>
                              🏷️ Item Discount ({pricing.discountPercent}% OFF × {modalQty})
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 900, color: '#065f46', background: '#d1fae5', borderRadius: 5, padding: '1px 6px' }}>
                              -Rs. {itemSaving.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {bulkSaving > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 9.5, color: '#065f46', fontWeight: 700 }}>
                              🎁 Bulk Discount (+{bulkPricing.extraPercent}% for {modalQty} pcs)
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 900, color: '#065f46', background: '#d1fae5', borderRadius: 5, padding: '1px 6px' }}>
                              -Rs. {bulkSaving.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #6ee7b7', paddingTop: 4, marginTop: 2 }}>
                          <span style={{ fontSize: 10, color: '#065f46', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            💰 {tr(language, 'Total Savings', 'Kul Bachat', 'کل بچت')}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 900, color: '#ffffff', background: '#059669', borderRadius: 7, padding: '2px 8px', boxShadow: '0 2px 6px rgba(5,150,105,0.3)' }}>
                            Rs. {totalSaving.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => { 
                    onAddToCart(product, null, modalQty); 
                    onClose(); 
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🛒</span>
                  <span>{translate(langData, "addToCart")} ({modalQty})</span>
                </button>
                
                <button
                  onClick={handleDirectWhatsAppOrder}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>💬</span>
                  <span>{tr(language, 'Buy on WhatsApp', 'WhatsApp par Order Karein', 'واٹس ایپ پر آرڈر کریں')}</span>
                </button>
              </div>
            </div>
          </div>
          {/* Product Highlights & Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2">
              <span className="text-lg">💯</span>
              <div>
                <div className="font-bold text-gray-900">{tr(language, '100% Original', '100% Asli Item', '100% اصلی آئٹم')}</div>
                <div className="text-[10px] text-gray-500">{tr(language, 'Guaranteed Quality', 'Guaranteed Mayaar', 'گارنٹی شدہ معیار')}</div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2">
              <span className="text-lg">🚚</span>
              <div>
                <div className="font-bold text-gray-900">{tr(language, 'Home Delivery', 'Home Delivery', 'ہوم ڈیلیوری')}</div>
                <div className="text-[10px] text-gray-500">{tr(language, 'Free on Rs 2000+', 'Rs. 2000+ par Muft', 'Rs. 2000+ پر مفت')}</div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2">
              <span className="text-lg">🏬</span>
              <div>
                <div className="font-bold text-gray-900">{tr(language, 'Store Pickup', 'Dukan se Pickup', 'دکان سے پک اپ')}</div>
                <div className="text-[10px] text-gray-500">{tr(language, 'BS Mart Shop Karachi', 'BS Mart Dukan Karachi', 'BS Mart دکان سے لیں')}</div>
              </div>
            </div>
          </div>
          {/* Related Products Section ("Ye Bhi Dekhein / یہ بھی دیکھیں") */}
          {relatedProducts.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm text-gray-900 uppercase tracking-wider">
                  <span className="text-amber-500 text-base">✨</span>
                  <span>{tr(language, 'You May Also Like', 'Ye Bhi Dekhein (Related Products)', 'یہ بھی دیکھیں (Related Products)')}</span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  {relatedProducts.length} {tr(language, 'items', 'cheezein', 'مصنوعات')}
                </span>
              </div>
              {/* Related Products Mini Horizontal Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {relatedProducts.map(rel => {
                  const relPricing = getProductPricing(rel);
                  const relHasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[rel.id];
                  const relImgSrc = relHasFile ? getImgUrl(`images/${rel.id}.${window.PRODUCT_IMAGE_MAP[rel.id]}`) : null;
                  return (
                    <div 
                      key={rel.id}
                      onClick={() => onSelectProduct && onSelectProduct(rel)}
                      className="bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-2.5 flex flex-col justify-between transition-all cursor-pointer group shadow-xs hover:shadow-md relative overflow-hidden"
                    >
                      {relPricing.hasDiscount && (
                        <span className="absolute top-1.5 left-1.5 z-10 bg-red-600 text-white text-[8.5px] font-black px-1.5 py-0.5 rounded shadow-2xs uppercase">
                          {relPricing.discountPercent}% OFF
                        </span>
                      )}
                      <div className="h-20 w-full bg-gray-50 rounded-xl p-1 mb-2 flex items-center justify-center overflow-hidden">
                        {relHasFile ? (
                          <img 
                            src={relImgSrc} 
                            alt={rel.name} 
                            loading="lazy" 
                            decoding="async" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${rel.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white text-xs font-bold`}>
                            {rel.initial || 'P'}
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight mb-1 group-hover:text-black">
                        {getProductDisplayName(rel, language)}
                      </p>
                      <div className="flex items-center justify-between gap-1 mt-auto pt-1 border-t border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-xs font-extrabold text-black">
                            Rs.{relPricing.sellingPrice.toLocaleString()}
                          </span>
                          {relPricing.hasDiscount && (
                            <span className="text-[9.5px] text-gray-400 line-through font-semibold">
                              Rs.{relPricing.retailPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(rel);
                          }}
                          className="w-6 h-6 rounded-lg bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center transition-colors cursor-pointer shrink-0"
                          title="Quick Add to Cart"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
          <button 
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            {tr(language, 'Close', 'Band Karein', 'بند کریں')}
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Variant Selection Modal (for Hair Colour Shades and options)
// -----------------------------------------------------------------------------
function VariantSelectionModal({ product, open, onClose, onConfirm, language, langData }) {
  if (!open || !product) return null;
  const config = (window.PRODUCT_VARIANTS && window.PRODUCT_VARIANTS[product.id]) || {
    title: "Select Option",
    options: []
  };
  const [selectedOption, setSelectedOption] = useState(() => config.options[0] || "");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (config.options && config.options.length > 0) {
      setSelectedOption(config.options[0]);
    }
    setQty(1);
  }, [product]);

  const ext = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            {ext ? (
              <img
                src={getImgUrl(`images/${product.id}.${ext}`)}
                alt=""
                className="w-12 h-12 rounded-xl object-contain bg-white border border-gray-200 p-1 shrink-0"
              />
            ) : (
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center shrink-0 text-slate-800 font-bold text-lg`}>
                {product.initial || 'P'}
              </div>
            )}
            <div>
              <h3 className="font-black text-slate-900 text-sm sm:text-base leading-snug">
                {toTitleCase(product.name)}
              </h3>
              <p className="text-xs font-extrabold text-emerald-600 mt-0.5">
                Rs {product.price.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors shrink-0 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Instructions */}
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">🎨</span>
            <div>
              <p className="text-xs font-black text-amber-900">
                {tr(language, 'Select Hair Colour Shade', 'Colour Shade / Number Chunain:', '\u06a9\u0644\u0631 \u0634\u06cc\u0688 \u0645\u0646\u062a\u062e\u0628 \u06a9\u0631\u06cc\u06ba:')}
              </p>
              <p className="text-[10.5px] font-bold text-amber-700">
                {tr(language, 'Choose your preferred shade number before adding to cart', 'Cart mein add karne se pehle apna pasandida colour number select karein', '\u06a9\u0627\u0631\u067c \u0645\u06cc\u06ba \u0634\u0627\u0645\u0644 \u06a9\u0631\u0646\u06d2 \u0633\u06d2 \u067e\u06c1\u0644\u06d2 \u0627\u067e\u0646\u0627 \u06a9\u0644\u0631 \u0646\u0645\u0628\u0631 \u0645\u0646\u062a\u062e\u0628 \u06a9\u0631\u06cc\u06ba')}
              </p>
            </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {config.options.map((opt) => {
            const isSelected = selectedOption === opt;
            const spaceIdx = opt.indexOf(' ');
            const num = spaceIdx > -1 ? opt.substring(0, spaceIdx) : '';
            const label = spaceIdx > -1 ? opt.substring(spaceIdx + 1) : opt;

            return (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedOption(opt)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    isSelected ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {num || '•'}
                  </span>
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-950 font-black' : 'text-slate-700'}`}>
                    {label}
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 bg-white'
                }`}>
                  {isSelected && <span className="text-[10px] font-bold">✓</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer with Qty and Add to Cart */}
        <div className="p-4 border-t border-gray-100 bg-white space-y-2.5">
          {/* Quick Wholesale Pack Chips */}
          <div className="flex items-center justify-between gap-1 text-xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {tr(language, 'Wholesale Packs:', 'Bulk Packs:', 'ہول سیل پیک:')}
            </span>
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              {[6, 12, 24, 36, 48, 60].map(qOpt => (
                <button
                  key={qOpt}
                  type="button"
                  onClick={() => setQty(qOpt)}
                  className={`text-[11px] font-black px-2.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                    qty === qOpt ? 'bg-black text-white border-black shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {qOpt}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0">
              <button
                type="button"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-lg bg-white text-slate-800 font-black text-sm flex items-center justify-center hover:bg-slate-200 shadow-2xs cursor-pointer"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setQty(isNaN(val) || val < 1 ? 1 : val);
                }}
                className="w-8 text-center font-black text-xs text-slate-900 bg-transparent border-none focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => setQty(q => q + 1)}
                className="w-7 h-7 rounded-lg bg-white text-slate-800 font-black text-sm flex items-center justify-center hover:bg-slate-200 shadow-2xs cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!selectedOption) return;
                onConfirm(product, selectedOption, qty);
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-black hover:bg-emerald-700 text-white font-black text-xs sm:text-sm tracking-wide uppercase shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>+ {translate(langData, "addToCart")} ({qty})</span>
              <span className="opacity-75 font-normal text-[11px]">({selectedOption})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SORT_OPTIONS = [
  { id: 'default', label: 'Default Order', labelUrdu: 'عام ترتیب (Default)', icon: '⚡' },
  { id: 'price_asc', label: 'Price: Low to High', labelUrdu: 'قیمت: کم سے زیادہ (Low to High)', icon: '📈' },
  { id: 'price_desc', label: 'Price: High to Low', labelUrdu: 'قیمت: زیادہ سے کم (High to Low)', icon: '📉' },
  { id: 'popularity', label: 'Popularity / Featured', labelUrdu: 'مقبول ترین (Featured)', icon: '⭐' },
  { id: 'name_asc', label: 'Name: A to Z', labelUrdu: 'نام: A سے Z (A-Z)', icon: '🔤' },
];

export default function SahilTraders() {
  const products = (typeof window !== 'undefined' && Array.isArray(window.PRODUCTS) && window.PRODUCTS.length > 0) ? window.PRODUCTS : PRODUCTS;
  const [aboutOpen, setAboutOpen] = useState(false);
  const [returnPolicyOpen, setReturnPolicyOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [welcomeOpen, setWelcomeOpen] = useState(() => {
    try {
      return !sessionStorage.getItem("sahil_traders_welcome_seen");
    } catch (e) {
      return true;
    }
  });
      const [showSplash, setShowSplash] = useState(true);
      const [fadeSplash, setFadeSplash] = useState(false);
      const [searchTerm, setSearchTerm] = useState("");
      const [activeCategory, setActiveCategory] = useState("all");
      const [selectedCategory, setSelectedCategory] = useState(null); // null = show category home
      const [selectedBrand, setSelectedBrand] = useState("all");
      const [sortBy, setSortBy] = useState("default");
      const [sortModalOpen, setSortModalOpen] = useState(false);
      const [variantModalProduct, setVariantModalProduct] = useState(null);
      const [filterMenuOpen, setFilterMenuOpen] = useState(false);
      const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
      const [catMenuOpen, setCatMenuOpen] = useState(false);
      const [suggestOpen, setSuggestOpen] = useState(false);
      const [recentSearches, setRecentSearches] = useState([]);
      const searchBoxRef = useRef(null);
      const searchInputRef = useRef(null);
      const [cartNotice, setCartNotice] = useState(false);
      const cartNoticeTimerRef = useRef(null);
      // -----------------------------------------------------------------------------
      // Persistent Cart State via localStorage (reloads/refreshes won't lose items!)
      const [cart, setCart] = useState(() => {
        try {
          const saved = localStorage.getItem("sahil_traders_cart");
          return saved ? JSON.parse(saved) : [];
        } catch (e) {
          return [];
        }
      });
      const [cartOpen, setCartOpen] = useState(false);
      const [checkoutOpen, setCheckoutOpen] = useState(false);
      const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
      const [activeTab, setActiveTab] = useState('home');
      const [isListening, setIsListening] = useState(false);
      const [wishlistOpen, setWishlistOpen] = useState(false);
      const [parchiModalOpen, setParchiModalOpen] = useState(false);
      const [wishlist, setWishlist] = useState(() => {
        try {
          const saved = localStorage.getItem("sahil_traders_wishlist");
          return saved ? JSON.parse(saved) : [];
        } catch (e) {
          return [];
        }
      });
      useEffect(() => {
        try {
          localStorage.setItem("sahil_traders_wishlist", JSON.stringify(wishlist));
        } catch (e) {}
      }, [wishlist]);
      function toggleWishlist(product) {
        triggerHaptic('medium');
        setWishlist(prev => {
          const exists = prev.some(id => id === product.id);
          if (exists) {
            return prev.filter(id => id !== product.id);
          } else {
            return [...prev, product.id];
          }
        });
      }
      const [orderHistory, setOrderHistory] = useState(() => {
        try {
          const saved = localStorage.getItem("sahil_traders_order_history");
          return saved ? JSON.parse(saved) : [];
        } catch (e) {
          return [];
        }
      });
      const [exitModalOpen, setExitModalOpen] = useState(false);
      const [selectedProduct, setSelectedProduct] = useState(null);
      function selectProductWithHash(product) {
        setSelectedProduct(product);
      }
      const isSearching = searchTerm.trim() !== "";
      const backStateRef = useRef({});
      const allowRealBackRef = useRef(false);
      const restoreBackGuardRef = useRef(() => {});
      const appHistoryReadyRef = useRef(false);
      const restoringHistoryRef = useRef(false);
      const lastHistoryKeyRef = useRef("");
      const appHistoryDepthRef = useRef(0);
      const lastSearchActiveRef = useRef(false);
      useEffect(() => {
        try {
          localStorage.setItem("sahil_traders_cart", JSON.stringify(cart));
        } catch (e) {}
      }, [cart]);

      // Auto-scroll to absolute top of page whenever category or brand selection changes
      useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, [selectedCategory, activeCategory, selectedBrand]);
      function persistCartSnapshot(nextCart) {
        try {
          if (!nextCart || nextCart.length === 0) {
            localStorage.removeItem("sahil_traders_cart");
          } else {
            localStorage.setItem("sahil_traders_cart", JSON.stringify(nextCart));
          }
        } catch (e) {}
      }
      useEffect(() => {
        return () => {
          if (cartNoticeTimerRef.current) clearTimeout(cartNoticeTimerRef.current);
        };
      }, []);
      function showCartNotice() {
        if (cartNoticeTimerRef.current) clearTimeout(cartNoticeTimerRef.current);
        setCartNotice(true);
        cartNoticeTimerRef.current = setTimeout(() => setCartNotice(false), 1100);
      }

      // ══════════ ANDROID HARDWARE / SWIPE BACK BUTTON STEP-BY-STEP HANDLER ══════════
      const lastBackPressRef = useRef(0);
      const [backToastVisible, setBackToastVisible] = useState(false);
      const backToastTimerRef = useRef(null);

      useEffect(() => {
        window.handleAppBackButton = () => {
          // 1. If Exit Modal is open, close it
          if (exitModalOpen) {
            setExitModalOpen(false);
            return;
          }
          // 2. If Sort Modal or Filter Menu is open, close it
          if (sortModalOpen) {
            setSortModalOpen(false);
            return;
          }
          if (filterMenuOpen) {
            setFilterMenuOpen(false);
            return;
          }
          // 3. If Product Details modal is open, close it
          if (selectedProduct) {
            setSelectedProduct(null);
            return;
          }
          // 3. If Checkout modal is open, close it
          if (checkoutOpen) {
            setCheckoutOpen(false);
            return;
          }
          // 4. If Cart is open, close it
          if (cartOpen) {
            setCartOpen(false);
            return;
          }
          // 5. If Parchi modal is open, close it
          if (parchiModalOpen) {
            setParchiModalOpen(false);
            return;
          }
          // 6. If Order History is open, close it
          if (orderHistoryOpen) {
            setOrderHistoryOpen(false);
            return;
          }
          // 7. If Wishlist is open, close it
          if (wishlistOpen) {
            setWishlistOpen(false);
            return;
          }
          // 8. If Mobile Menu / Account Drawer is open, close it
          if (mobileMenuOpen) {
            setMobileMenuOpen(false);
            return;
          }
          if (accountDrawerOpen) {
            setAccountDrawerOpen(false);
            return;
          }
          // 9. If on Account / Me tab, switch back to Home tab
          if (activeTab === 'account') {
            setActiveTab('home');
            return;
          }
          // 10. If searching, clear search query
          if (searchTerm && searchTerm.trim() !== '') {
            setSearchTerm('');
            return;
          }
          // 11. If inside a category (viewing products), go back to Category Home
          if (selectedCategory || (activeCategory && activeCategory !== 'all')) {
            setSelectedCategory(null);
            setActiveCategory('all');
            return;
          }
          // 12. If at Root Home: Double-press back within 2 seconds to exit app safely
          const now = Date.now();
          if (now - lastBackPressRef.current < 2000) {
            if (window.AndroidBridge && window.AndroidBridge.exitApp) {
              window.AndroidBridge.exitApp();
            } else if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
              window.Capacitor.Plugins.App.exitApp();
            }
          } else {
            lastBackPressRef.current = now;
            setBackToastVisible(true);
            if (backToastTimerRef.current) clearTimeout(backToastTimerRef.current);
            backToastTimerRef.current = setTimeout(() => setBackToastVisible(false), 2000);
          }
        };
      }, [
        exitModalOpen, selectedProduct, checkoutOpen, cartOpen,
        parchiModalOpen, orderHistoryOpen, wishlistOpen,
        mobileMenuOpen, accountDrawerOpen, activeTab,
        searchTerm, selectedCategory, activeCategory, language
      ]);

      useEffect(() => {
        backStateRef.current = {
          checkoutOpen,
          cartOpen,
          exitModalOpen,
          selectedCategory,
          selectedBrand,
          searchTerm,
          isSearching,
          activeCategory
        };
      }, [checkoutOpen, cartOpen, exitModalOpen, selectedCategory, selectedBrand, searchTerm, isSearching, activeCategory]);
      // App Back Button Controller: browser/device Back restores the previous store screen first.
      useEffect(() => {
        const getSnapshot = (state) => ({
          checkoutOpen: !!state.checkoutOpen,
          cartOpen: !!state.cartOpen,
          selectedCategory: state.selectedCategory || null,
          selectedBrand: state.selectedBrand || "all",
          searchTerm: state.searchTerm || "",
          activeCategory: state.activeCategory || "all"
        });
        const keyOf = (snapshot) => JSON.stringify(snapshot);
        const pushCurrentAppState = (replace, force) => {
          if (allowRealBackRef.current) return;
          try {
            const snapshot = getSnapshot(backStateRef.current || {});
            const key = keyOf(snapshot);
            if (!force && !replace && key === lastHistoryKeyRef.current) return;
            const entry = { page: 'sahil-app-state', sahilApp: true, snapshot };
            if (replace) window.history.replaceState(entry, '', window.location.href);
            else {
              window.history.pushState(entry, '', window.location.href);
              appHistoryDepthRef.current += 1;
            }
            lastHistoryKeyRef.current = key;
          } catch(e) {}
        };
        restoreBackGuardRef.current = (replace, force) => pushCurrentAppState(!!replace, !!force);
        const exitStore = () => {
          allowRealBackRef.current = true;
          setExitModalOpen(false);
          const steps = Math.max(2, appHistoryDepthRef.current + 1);
          try {
            window.history.go(-steps);
          } catch(e) {}
          setTimeout(() => {
            try { window.location.replace('about:blank'); } catch(e) {}
          }, 900);
        };
        window.sahilExitStore = exitStore;
        const restoreSnapshot = (snapshot) => {
          restoringHistoryRef.current = true;
          setExitModalOpen(false);
          setFilterMenuOpen(false);
          setSuggestOpen(false);
          setCheckoutOpen(!!snapshot.checkoutOpen);
          setCartOpen(!!snapshot.cartOpen);
          setSearchTerm(snapshot.searchTerm || "");
          setSelectedCategory(snapshot.selectedCategory || null);
          setSelectedBrand(snapshot.selectedBrand || "all");
          setActiveCategory(snapshot.activeCategory || "all");
          setTimeout(() => { restoringHistoryRef.current = false; }, 0);
        };
        try {
          window.history.replaceState({ page: 'sahil-back-base' }, '', window.location.href);
          pushCurrentAppState(false);
          appHistoryReadyRef.current = true;
        } catch(e) {}
        const handlePopState = (event) => {
          if (allowRealBackRef.current) return;
          if (event && event.preventDefault) event.preventDefault();
          if (event.state && event.state.sahilApp && event.state.snapshot) {
            lastHistoryKeyRef.current = keyOf(event.state.snapshot);
            restoreSnapshot(event.state.snapshot);
            return;
          }
          pushCurrentAppState(false, true);
          setExitModalOpen(true);
        };
        const handlePageShow = () => {
          allowRealBackRef.current = false;
          pushCurrentAppState(false, true);
        };
        window.addEventListener('popstate', handlePopState);
        window.addEventListener('pageshow', handlePageShow);
        return () => {
          window.removeEventListener('popstate', handlePopState);
          window.removeEventListener('pageshow', handlePageShow);
          if (window.sahilExitStore === exitStore) delete window.sahilExitStore;
        };
      }, []);
      useEffect(() => {
        if (!appHistoryReadyRef.current || restoringHistoryRef.current || exitModalOpen) return;
        const searchingNow = searchTerm.trim() !== "";
        const replaceSearchTyping = searchingNow && lastSearchActiveRef.current;
        lastSearchActiveRef.current = searchingNow;
        const timer = setTimeout(() => restoreBackGuardRef.current(replaceSearchTyping, false), 0);
        return () => clearTimeout(timer);
      }, [checkoutOpen, cartOpen, selectedCategory, selectedBrand, searchTerm, activeCategory, exitModalOpen]);
      const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
      const cartTotal = cart.reduce((sum, i) => sum + calculateBulkPricing(i.product.price, i.qty).finalTotal, 0);
      const cartBulkSavings = cart.reduce((sum, i) => sum + calculateBulkPricing(i.product.price, i.qty).extraSavings, 0);
      function addToCart(product, variant = null, qtyToAdd = 1, sourceElement = null) {
        triggerHaptic('medium');
        if (window.PRODUCT_VARIANTS && window.PRODUCT_VARIANTS[product.id] && !variant) {
          setVariantModalProduct(product);
          return;
        }
        setCart(prev => {
          const existing = prev.find(i => i.product.id === product.id && (i.variant || null) === (variant || null));
          let next;
          if (existing) {
            next = prev.map(i => (i.product.id === product.id && (i.variant || null) === (variant || null)) ? { ...i, qty: i.qty + qtyToAdd } : i);
          } else {
            next = [...prev, { product, qty: qtyToAdd, variant: variant || null }];
          }
          persistCartSnapshot(next);
          return next;
        });
        showCartNotice();
        if (sourceElement) {
          flyProductToCart(product, sourceElement);
        }
      }
      function flyProductToCart(product, sourceElement) {
        const cartBtn = document.getElementById('cart-btn') || document.getElementById('cart-btn-mobile');
        if (!cartBtn || !sourceElement) return;
        const sourceCard = sourceElement.closest('.product-card');
        const sourceImage = sourceCard?.querySelector('.product-card-main-img');
        const sourceRect = (sourceImage || sourceElement).getBoundingClientRect();
        const cartRect = cartBtn.getBoundingClientRect();
        const startX = sourceRect.right - Math.min(12, sourceRect.width * 0.12);
        const startY = sourceRect.top + sourceRect.height / 2;
        const endX = cartRect.left + cartRect.width / 2;
        const endY = cartRect.top + cartRect.height / 2;
        const flyerSize = 58;
        const flyer = document.createElement('div');
        const ext = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id];
        Object.assign(flyer.style, {
          position: 'fixed',
          left: `${startX - flyerSize / 2}px`,
          top: `${startY - flyerSize / 2}px`,
          width: `${flyerSize}px`,
          height: `${flyerSize}px`,
          zIndex: '9999',
          pointerEvents: 'none',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 12px 28px rgba(0,0,0,0.3)',
          border: '2px solid #10b981',
          background: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform, opacity'
        });
        if (ext) {
          const img = document.createElement('img');
          img.src = getImgUrl(`images/${product.id}.${ext}`);
          img.alt = product.name;
          Object.assign(img.style, {
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            background: '#ffffff'
          });
          flyer.appendChild(img);
        } else {
          const fallback = document.createElement('div');
          fallback.innerText = product.initial || 'S';
          Object.assign(fallback.style, {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            color: '#ffffff',
            background: '#0f172a'
          });
          flyer.appendChild(fallback);
        }
        document.body.appendChild(flyer);
        const dx = endX - startX;
        const dy = endY - startY;
        const keyframes = [
          { transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)', opacity: 1 },
          { transform: `translate3d(${dx * 0.55}px, ${dy * 0.45 - 60}px, 0) scale(0.75) rotate(180deg)`, opacity: 0.95, offset: 0.55 },
          { transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.18) rotate(360deg)`, opacity: 0 }
        ];
        const timing = {
          duration: 720,
          easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)',
          fill: 'forwards'
        };
        const finish = () => {
          flyer.remove();
          if (cartBtn.animate) {
            cartBtn.animate([
              { transform: 'scale(1)' },
              { transform: 'scale(1.12)' },
              { transform: 'scale(1)' }
            ], { duration: 340, easing: 'ease-out' });
          }
        };
        if (flyer.animate) {
          const animation = flyer.animate(keyframes, timing);
          animation.onfinish = finish;
          animation.oncancel = finish;
        } else {
          flyer.style.transition = 'transform 0.9s ease, opacity 0.9s ease';
          requestAnimationFrame(() => {
            flyer.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(0.12) rotate(900deg)`;
            flyer.style.opacity = '0';
          });
          setTimeout(finish, 2920);
        }
      }
      function updateQty(productId, delta, variant = null) {
        triggerHaptic('light');
        setCart(prev => {
          const updated = prev.map(i =>
            (i.product.id === productId && (i.variant || null) === (variant || null)) ? { ...i, qty: Math.max(0, i.qty + delta) } : i
          ).filter(i => i.qty > 0);
          persistCartSnapshot(updated);
          return updated;
        });
      }
      function removeFromCart(productId, variant = null) {
        triggerHaptic('light');
        setCart(prev => {
          const updated = prev.filter(i => !(i.product.id === productId && (i.variant || null) === (variant || null)));
          persistCartSnapshot(updated);
          return updated;
        });
      }
      function clearCart() {
        triggerHaptic('light');
        setCart([]);
        try {
          localStorage.removeItem("sahil_traders_cart");
        } catch (e) {}
      }
      function saveOrderHistory(order) {
        if (!order) return;
        setOrderHistory(prev => {
          const next = [order, ...prev].slice(0, 50);
          try {
            localStorage.setItem("sahil_traders_order_history", JSON.stringify(next));
          } catch (e) {}
          return next;
        });
      }
      function clearOrderHistory() {
        triggerHaptic('light');
        setOrderHistory([]);
        try {
          localStorage.removeItem("sahil_traders_order_history");
        } catch (e) {}
      }
      function handleVoiceSearch() {
        triggerHaptic('medium');
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
          try {
            const rec = new SpeechRec();
            rec.lang = language === 'ur' ? 'ur-PK' : (language === 'ro' ? 'ur-PK' : 'en-US');
            rec.interimResults = false;
            rec.maxAlternatives = 1;

            rec.onstart = () => {
              setIsListening(true);
            };
            rec.onresult = (event) => {
              const transcript = event.results && event.results[0] && event.results[0][0] && event.results[0][0].transcript;
              if (transcript) {
                triggerHaptic('success');
                setSearchTerm(transcript);
                setSuggestOpen(true);
                if (searchInputRef.current) {
                  searchInputRef.current.focus();
                }
              }
            };
            rec.onerror = (err) => {
              setIsListening(false);
              if (searchInputRef.current) {
                searchInputRef.current.focus();
                setSuggestOpen(true);
              }
            };
            rec.onend = () => {
              setIsListening(false);
            };
            rec.start();
            return;
          } catch (e) {
            setIsListening(false);
          }
        }
        
        // Fallback for Android WebView where SpeechRecognition is not bundled:
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          setSuggestOpen(true);
        }
        alert(tr(
          language,
          '🎙️ Voice Search Active! Please speak using the Microphone 🎤 on your keyboard.',
          '🎙️ Voice Search: Apne mobile keyboard ke Mic 🎤 button se bol kar search karein.',
          '🎙️ وائس سرچ: موبائل کی بورڈ کے مائیک 🎤 سے بول کر سرچ کریں۔'
        ));
      }
      function handleReorder(items) {
        triggerHaptic('success');
        if (!items || items.length === 0) return;
        setCart(prev => {
          let next = [...prev];
          items.forEach(item => {
            const existing = next.find(i => i.product?.id === item.id);
            if (existing) {
              existing.qty += (item.qty || 1);
            } else {
              const fullProduct = products.find(p => p.id === item.id) || {
                id: item.id,
                name: item.name,
                price: item.price,
                categoryId: item.categoryId || 'soaps',
                hasImage: !!item.imageExt
              };
              next.push({
                product: fullProduct,
                qty: item.qty || 1,
                variant: item.variant || null
              });
            }
          });
          persistCartSnapshot(next);
          return next;
        });
        setOrderHistoryOpen(false);
        setCartOpen(true);
      }
      // -----------------------------------------------------------------------------
      // -----------------------------------------------------------------------------
      function handleGoBack() {
        setFilterMenuOpen(false);
        if (selectedBrand !== "all") {
          setSelectedBrand("all");
          return;
        }
        setSearchTerm("");
        setSelectedCategory(null);
        setSelectedBrand("all");
        setActiveCategory("all");
      }
      function handleSelectProductFromCart(product) {
        setCartOpen(false);
        if (product) {
          setSelectedProduct(product);
        }
      }
      // -----------------------------------------------------------------------------
      const langData = useMemo(() => {
        return window.TRANSLATIONS?.[language] || window.TRANSLATIONS?.en || {};
      }, [language]);
      // Memoized 18 random floating product silhouettes (raw line-art vector outlines)
      const floatingSilhouettes = useMemo(() => {
        const types = [ShampooIcon, SoapIcon, FaceWashIcon, CreamIcon, RazorIcon, PerfumeIcon];
        return Array.from({ length: 18 }).map((_, idx) => {
          const Icon = types[idx % types.length];
          const left = Math.random() * 90 + 5; // 5% to 95%
          const top = Math.random() * 90 + 5;  // 5% to 95%
          const scale = 0.4 + Math.random() * 0.7; // size variety
          const opacity = 0.05 + Math.random() * 0.07; // very faint, barely visible (0.05–0.12)
          const duration = 20 + Math.random() * 25; // 20s to 45s
          const delay = -Math.random() * 25;
          const animType = Math.floor(Math.random() * 4) + 1; // float-drift-1 to 4
          return {
            id: idx,
            Icon,
            left,
            top,
            scale,
            opacity,
            duration,
            delay,
            animType,
          };
        });
      }, []);
      // Intelligent Asset & Image Preloader during Intro Animation
      useEffect(() => {
        if (!showSplash) return;
        // Preload first 40 product images from Vercel CDN (fastest possible, cloud-cached)
        const imageMap = window.PRODUCT_IMAGE_MAP || {};
        const eagerIds = Object.keys(imageMap).slice(0, 40);
        eagerIds.forEach((id, i) => {
          const ext = imageMap[id] || 'png';
          const img = new Image();
          // Stagger start slightly so we don't DDoS burst 40 at once
          setTimeout(() => {
            img.src = `https://sahiltraders.vercel.app/images/${id}.${ext}`;
          }, i * 30);
        });
        // +700ms added to both timers (total: 3200ms fade, 3900ms remove)
        const fadeTimer = setTimeout(() => {
          setFadeSplash(true);
        }, 3200);
        const removeTimer = setTimeout(() => {
          setShowSplash(false);
        }, 3900);
        return () => {
          clearTimeout(fadeTimer);
          clearTimeout(removeTimer);
        };
      }, [showSplash]);
      useEffect(() => {
        function handleClickOutside(e) {
          if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
            setSuggestOpen(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);
      useEffect(() => {
        setSelectedBrand("all");
        setFilterMenuOpen(false);
        setVisibleCount(24);
      }, [selectedCategory, searchTerm]);
      // Automatic background image pre-caching to user phone internal storage
      useEffect(() => {
        if (typeof window !== 'undefined' && window.PRODUCT_IMAGE_MAP) {
          const timer = setTimeout(() => {
            const ids = Object.keys(window.PRODUCT_IMAGE_MAP);
            let idx = 0;
            const preloadBatch = () => {
              if (idx >= ids.length) return;
              const batch = ids.slice(idx, idx + 6);
              idx += 6;
              batch.forEach(id => {
                const ext = window.PRODUCT_IMAGE_MAP[id];
                const img = new Image();
                img.src = `https://sahiltraders.vercel.app/images/${id}.${ext}`;
              });
              if (idx < ids.length) {
                if ('requestIdleCallback' in window) {
                  window.requestIdleCallback(preloadBatch, { timeout: 2000 });
                } else {
                  setTimeout(preloadBatch, 400);
                }
              }
            };
            preloadBatch();
          }, 1500);
          return () => clearTimeout(timer);
        }
      }, []);
      const baseFiltered = useMemo(() => {
        const term = searchTerm.trim();
        if (term === "") {
          if (selectedCategory) return products.filter(p => p.categoryId === selectedCategory);
          return products;
        }
        const scored = [];
        for (let i = 0; i < products.length; i++) {
          const p = products[i];
          const score = matchProductTokens(p, term);
          if (score > 0) {
            scored.push({ product: p, score });
          }
        }
        scored.sort((a, b) => b.score - a.score);
        return scored.map(item => item.product);
      }, [products, selectedCategory, searchTerm]);
      const brandFilters = useMemo(() => {
        if (!selectedCategory || isSearching) return [];
        return getBrandFilters(baseFiltered);
      }, [baseFiltered, selectedCategory, isSearching]);
      const filtered = useMemo(() => {
        if (!selectedCategory || isSearching || selectedBrand === "all") return baseFiltered;
        return baseFiltered.filter(p => getProductFilterName(p) === selectedBrand);
      }, [baseFiltered, selectedCategory, isSearching, selectedBrand]);
      const sortedProducts = useMemo(() => {
        const list = [...filtered];
        if (sortBy === "price_asc") {
          return list.sort((a, b) => {
            if (a.price === 0) return 1;
            if (b.price === 0) return -1;
            return a.price - b.price;
          });
        } else if (sortBy === "price_desc") {
          return list.sort((a, b) => b.price - a.price);
        } else if (sortBy === "popularity") {
          if (isSearching) {
            return list;
          }
          return list.sort((a, b) => {
            const aHasImg = (window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[a.id]) || a.hasImage ? 1 : 0;
            const bHasImg = (window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[b.id]) || b.hasImage ? 1 : 0;
            if (aHasImg !== bHasImg) return bHasImg - aHasImg;
            return a.id - b.id;
          });
        } else if (sortBy === "name_asc") {
          return list.sort((a, b) => a.name.localeCompare(b.name));
        }
        return list;
      }, [filtered, sortBy, isSearching]);
      const suggestions = useMemo(() => {
        const term = searchTerm.trim();
        if (term === "") return [];
        const scored = [];
        for (let i = 0; i < products.length; i++) {
          const p = products[i];
          const score = matchProductTokens(p, term);
          if (score > 0) {
            scored.push({ product: p, score });
          }
        }
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, 6).map(item => item.product);
      }, [products, searchTerm]);
      function recordSearch(product) {
        if (!product) return;
        setRecentSearches((prev) => {
          const withoutDup = prev.filter((p) => p.id !== product.id);
          return [product, ...withoutDup].slice(0, RECENT_LIMIT);
        });
      }
      function handleSuggestionClick(product) {
        setSearchTerm(product.name);
        setSuggestOpen(false);
        recordSearch(product);
      }
      function handleSearchKeyDown(e) {
        if (e.key === "Enter" && suggestions.length > 0) {
          recordSearch(suggestions[0]);
          setSuggestOpen(false);
        }
      }
      // Show search results if searching, else show category home or products
      const showCategoryHome = !isSearching && !selectedCategory;
      const categoriesList = getGlobalCategories();
      const selectedCategoryName = selectedCategory
        ? (langData.categories?.[selectedCategory] || categoriesList.find(c => c.id === selectedCategory)?.name || selectedCategory)
        : null;
      return (
        <div className="min-h-screen relative text-gray-900 overflow-x-hidden" style={{ fontFamily: language === 'ur' ? "'Noto Sans Urdu', 'Inter', sans-serif" : "'Inter', system-ui, sans-serif" }}>
          {/* 🌟 Luxury Brand Splash Intro */}
          {showSplash && (
            <div
              className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-700 select-none overflow-hidden ${
                fadeSplash ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
              }`}
              style={{
                background: 'radial-gradient(ellipse at center, #0f172a 0%, #090d16 60%, #030712 100%)',
              }}
            >
              {/* Luminous Ambient Light Spheres */}
              <div className="absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full bg-emerald-500/15 luxury-aura pointer-events-none -translate-y-8" />
              <div className="absolute w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] rounded-full bg-amber-500/10 luxury-aura pointer-events-none translate-y-12" style={{ animationDelay: '2s' }} />

              {/* Skip Intro Button */}
              <button
                onClick={() => {
                  setFadeSplash(true);
                  setTimeout(() => setShowSplash(false), 400);
                }}
                className="absolute top-6 right-6 z-30 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer backdrop-blur-md flex items-center gap-1.5 shadow-lg"
              >
                <span>{translate(langData, "skipIntro")}</span>
                <svg className="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>

              {/* Central Content Card */}
              <div className="relative flex flex-col items-center px-6 z-10 max-w-sm text-center">
                {/* Glassmorphic Glowing Logo Container */}
                <div className="luxury-logo-box">
                  <div className="luxury-float relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4 flex items-center justify-center shadow-2xl shadow-emerald-950/60">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-transparent to-amber-500/20 pointer-events-none" />
                    <img
                      src="images/sahil-traders-logo.png"
                      alt="Sahil Traders"
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>
                </div>

                {/* Brand Name with Radiant Typography */}
                <div className="luxury-text-anim-1 mt-6">
                  <h1
                    className="text-3xl sm:text-4xl font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 drop-shadow-sm"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Sahil Traders
                  </h1>
                </div>

                {/* Subtitle Pill Badge */}
                <div className="luxury-text-anim-2 mt-3">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-extrabold tracking-[0.15em] text-emerald-400 uppercase">
                      Wholesale & Retail Pakistan
                    </span>
                  </div>
                </div>

                {/* 🎯 Unique Aesthetic Segment Loader */}
                <div className="luxury-text-anim-3 mt-8 flex flex-col items-center gap-3">
                  {/* Segmented bar loader — 8 glowing blocks */}
                  <div className="flex items-center gap-[5px]">
                    {[0,1,2,3,4,5,6,7].map(i => (
                      <div
                        key={i}
                        className="splash-segment-bar"
                        style={{ animationDelay: `${i * 0.18}s` }}
                      />
                    ))}
                  </div>
                  {/* Shimmer text with live dot cycle */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 tracking-[0.18em] uppercase">Loading</span>
                    <span className="splash-dots-anim text-emerald-400 font-extrabold text-[14px] leading-none" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Background — Pure Clean White */}
          <div className="fixed inset-0 -z-10 bg-white" />
          
          {/* ━━━ TOP INFO BAR & HEADER (Hidden on Account/Me view) ━━━ */}
          {activeTab !== 'account' && (
            <>
              {/* ━━━ TOP INFO BAR ━━━ */}
              <div style={{ background: 'linear-gradient(90deg, #08101a 0%, #0b1828 50%, #08101a 100%)', borderBottom: '1px solid rgba(16,185,129,0.18)' }} className="text-white text-[10.5px] font-medium py-1.5 px-3 sm:px-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 overflow-hidden w-full justify-center sm:justify-start">
                    <span style={{ color: '#f59e0b', fontWeight: 700, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>⏰</span>
                      <span>{tr(language, 'Delivery Timing: 10:00 AM – 8:00 PM (Mon – Sat)', 'Delivery Timing: 10:00 AM – 8:00 PM (Peer ta Hafta)', 'ڈیلیوری کے اوقات: صبح 10 تا رات 8 (پیر تا ہفتہ)')}</span>
                    </span>
                    <span className="hidden sm:inline" style={{ color: 'rgba(255,255,255,0.25)' }}>|</span>
                    <div className="hidden sm:flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      <span>📍 {tr(language, 'Karachi Only', 'Sirf Karachi', 'صرف کراچی')}</span>
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                      <span style={{ color: '#10b981' }}>🚚 {tr(language, 'Free Shipping on Rs 2000+', 'Rs 2000+ par Free Delivery', 'Rs 2000+ پر مفت ڈیلیوری')}</span>
                      <span style={{ color: 'rgba(255,255,255,0.2)' }}>•</span>
                      <span>💬 {tr(language, 'WhatsApp Orders Active', 'WhatsApp Orders Active', 'واٹس ایپ آرڈرز جاری')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ━━━ PREMIUM MAIN HEADER (Responsive 2-Row Mobile, 1-Row Desktop) ━━━ */}
              <header className="sticky top-0 z-30 backdrop-blur-xl" style={{ background: 'linear-gradient(135deg, #09131e 0%, #0d1a2d 50%, #08111c 100%)', borderBottom: '1px solid rgba(16,185,129,0.22)', boxShadow: '0 4px 24px rgba(0,0,0,0.35)' }}>
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
                  
                  {/* ── TOP ROW: Logo & Actions ── */}
                  <div className="flex items-center justify-between gap-3">

                    {/* ── LOGO (Visible with text on both mobile & desktop) ── */}
                    <div className="flex items-center gap-2.5 shrink-0 cursor-pointer" onClick={() => { setActiveTab('home'); setSelectedCategory(null); setSearchTerm(''); setActiveCategory('all'); }}>
                      <div className="relative">
                        <div style={{ position: 'absolute', inset: '-2px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', opacity: 0.5, filter: 'blur(5px)' }} />
                        <img
                          src="images/sahil-traders-logo.png"
                          alt="Sahil Traders"
                          style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '10px', position: 'relative', background: 'rgba(255,255,255,0.06)', padding: '2px', border: '1px solid rgba(16,185,129,0.4)' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: '15px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#ffffff', lineHeight: 1.1 }}>
                          Sahil Traders
                        </div>
                        <div style={{ fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#10b981', marginTop: '1px' }}>
                          Wholesale &amp; Retail
                        </div>
                      </div>
                    </div>

                    {/* ── DESKTOP CENTER SEARCH BAR (Hidden on Mobile) ── */}
                    <div className="hidden sm:block flex-1 relative max-w-xl mx-2" ref={searchBoxRef}>
                      <div className="relative flex items-center">
                        <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(255,255,255,0.35)', pointerEvents: 'none' }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"/>
                        </svg>
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchTerm}
                          onChange={(e) => { setSearchTerm(e.target.value); setSuggestOpen(true); }}
                          onKeyDown={handleSearchKeyDown}
                          placeholder={isListening ? tr(language, "🎙️ Listening... Speak now...", "🎙️ Sun raha hoon...", "🎙️ سن رہا ہوں...") : translate(langData, "searchPlaceholder")}
                          style={{
                            width: '100%',
                            background: isListening ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.07)',
                            border: isListening ? '1.5px solid #10b981' : '1.5px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            paddingLeft: '42px',
                            paddingRight: searchTerm ? '72px' : '42px',
                            paddingTop: '10px',
                            paddingBottom: '10px',
                            fontSize: '13px',
                            color: '#ffffff',
                            outline: 'none',
                            transition: 'all 0.2s',
                            caretColor: '#10b981',
                          }}
                          className="search-input"
                          onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.18)'; e.target.style.background = 'rgba(255,255,255,0.10)'; }}
                          onBlur={e => { e.target.style.borderColor = isListening ? '#10b981' : 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; e.target.style.background = isListening ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.07)'; }}
                        />
                        <div style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {searchTerm && (
                            <button type="button" onClick={() => { triggerHaptic('light'); setSearchTerm(''); }} style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '6px', padding: '3px 6px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }} title="Clear">✕</button>
                          )}
                          <button
                            type="button"
                            onClick={handleVoiceSearch}
                            title={tr(language, "Voice Search", "Voice Search", "آواز سے تلاش")}
                            style={{ background: isListening ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)', border: isListening ? '1.5px solid #10b981' : '1.5px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <svg style={{ width: '14px', height: '14px', color: isListening ? '#10b981' : 'rgba(255,255,255,0.45)' }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      {/* Desktop Suggestions */}
                      {suggestOpen && suggestions.length > 0 && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: '#0d1528', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 16px 48px rgba(0,0,0,0.6)', zIndex: 50, overflow: 'hidden', maxHeight: '320px', overflowY: 'auto' }}>
                          {recentSearches.length > 0 && !searchTerm && (
                            <div style={{ padding: '8px 14px 4px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Recent</div>
                          )}
                          {suggestions.slice(0, 8).map((product) => (
                            <button
                              key={product.id}
                              type="button"
                              onMouseDown={() => handleSuggestionClick(product)}
                              style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `linear-gradient(135deg, ${product.gradient?.replace('from-','').replace(' to-',', ') || '#10b981, #059669'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: 'white', flexShrink: 0 }}>{product.initial || product.name[0]}</div>
                              <div>
                                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#ffffff', lineHeight: 1.3 }}>{product.name}</div>
                                <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>Rs. {product.price}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* ── DESKTOP ACTION BUTTONS ── */}
                    <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '7px 8px', fontSize: '11.5px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', cursor: 'pointer', outline: 'none' }}
                      >
                        <option value="en" style={{background:'#0d1528', color:'#fff'}}>EN</option>
                        <option value="ro" style={{background:'#0d1528', color:'#fff'}}>RO</option>
                        <option value="ur" style={{background:'#0d1528', color:'#fff'}}>اردو</option>
                      </select>

                      <button onClick={() => setReturnPolicyOpen(true)} title={tr(language,'Return Policy','Wapsi Policy','واپسی پالیسی')} style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.09)', borderRadius: '10px', padding: '7px 11px', fontSize: '11.5px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s', whiteSpace: 'nowrap' }} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.12)';e.currentTarget.style.color='#fff';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='rgba(255,255,255,0.7)';}}>
                        <svg style={{width:'14px',height:'14px',color:'#10b981'}} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                        <span>{tr(language,'Policy','Policy','پالیسی')}</span>
                      </button>

                      <button onClick={() => setAboutOpen(true)} title={tr(language,'About Us','Hamare Baare Mein','ہمارے بارے میں')} style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.09)', borderRadius: '10px', padding: '7px 11px', fontSize: '11.5px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s', whiteSpace: 'nowrap' }} onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.12)';e.currentTarget.style.color='#fff';}} onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='rgba(255,255,255,0.7)';}}>
                        <svg style={{width:'14px',height:'14px'}} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>
                        <span>{tr(language,'About','About','ہمارے بارے')}</span>
                      </button>

                      <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />

                      <button
                        onClick={() => { triggerHaptic('medium'); setParchiModalOpen(true); }}
                        title="Handwritten Slip Photo Order"
                        style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', border: 'none', borderRadius: '10px', padding: '7px 13px', fontSize: '11.5px', fontWeight: 800, color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 3px 14px rgba(16,185,129,0.4)', transition: 'all 0.18s', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}
                        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.boxShadow='0 6px 20px rgba(16,185,129,0.55)';}}
                        onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 3px 14px rgba(16,185,129,0.4)';}}
                      >
                        <span>📸</span>
                        <span>{tr(language, 'Parchi Order', 'Parchi Order', 'پرچی آرڈر')}</span>
                      </button>

                      <button
                        onClick={() => { triggerHaptic('light'); setWishlistOpen(true); }}
                        title={tr(language,'Wishlist','Wishlist','پسندیدہ')}
                        style={{ position: 'relative', background: 'rgba(255,255,255,0.06)', border: wishlist.length > 0 ? '1.5px solid rgba(225,29,72,0.5)' : '1.5px solid rgba(255,255,255,0.09)', borderRadius: '10px', padding: '7px 11px', fontSize: '12px', fontWeight: 700, color: '#fb7185', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s', whiteSpace: 'nowrap' }}
                        onMouseEnter={e=>{e.currentTarget.style.background='rgba(225,29,72,0.12)';}}
                        onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';}}
                      >
                        <svg style={{width:'15px',height:'15px',fill:'#fb7185'}} viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"/></svg>
                        <span>{tr(language,'Wishlist','Wishlist','پسندیدہ')}</span>
                        {wishlist.length > 0 && (
                          <span style={{ position: 'absolute', top: '-8px', right: '-8px', minWidth: '18px', height: '18px', borderRadius: '9px', background: '#e11d48', color: '#fff', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #0a1020' }}>
                            {wishlist.length}
                          </span>
                        )}
                      </button>

                      <button
                        onClick={() => setOrderHistoryOpen(true)}
                        title={tr(language,'Order History','Orders','آرڈر ہسٹری')}
                        style={{ position: 'relative', background: 'rgba(255,255,255,0.06)', border: orderHistory.length > 0 ? '1.5px solid rgba(16,185,129,0.4)' : '1.5px solid rgba(255,255,255,0.09)', borderRadius: '10px', padding: '7px 11px', fontSize: '11.5px', fontWeight: 600, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.18s', whiteSpace: 'nowrap' }}
                        onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.12)';e.currentTarget.style.color='#fff';}}
                        onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.06)';e.currentTarget.style.color='rgba(255,255,255,0.7)';}}
                      >
                        <svg style={{width:'15px',height:'15px'}} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        <span>{tr(language,'Orders','Orders','آرڈرز')}</span>
                        {orderHistory.length > 0 && (
                          <span style={{ position: 'absolute', top: '-8px', right: '-8px', minWidth: '18px', height: '18px', borderRadius: '9px', background: '#10b981', color: '#fff', fontSize: '10px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #0a1020' }}>
                            {orderHistory.length}
                          </span>
                        )}
                      </button>

                      <button
                        id="cart-btn"
                        onClick={() => setCartOpen(true)}
                        style={{ position: 'relative', background: cartCount > 0 ? 'linear-gradient(135deg, #ffffff, #f1f5f9)' : 'rgba(255,255,255,0.07)', border: cartCount > 0 ? '1.5px solid rgba(255,255,255,0.8)' : '1.5px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '7px 13px', fontSize: '12px', fontWeight: 800, color: cartCount > 0 ? '#0a1020' : 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.18s', boxShadow: cartCount > 0 ? '0 3px 14px rgba(255,255,255,0.15)' : 'none', whiteSpace: 'nowrap' }}
                        onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-1px)';}}
                        onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';}}
                      >
                        <svg style={{width:'16px',height:'16px'}} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
                        </svg>
                        <span>{tr(language, 'Cart', 'Cart', '\u06a9\u0627\u0631\u0679')}</span>
                        {cartCount > 0 && (
                          <span style={{ position: 'absolute', top: '-8px', right: '-8px', minWidth: '20px', height: '20px', borderRadius: '10px', background: '#e11d48', color: '#fff', fontSize: '10.5px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #0a1020' }}>
                            {cartCount}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* ── MOBILE ROW 1 RIGHT ACTION (Clean direct WhatsApp Support link) ── */}
                    <div className="flex sm:hidden items-center gap-1.5 shrink-0">
                      <a
                        href="https://wa.me/923368945775"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: 'rgba(37,211,102,0.14)',
                          border: '1px solid rgba(37,211,102,0.35)',
                          borderRadius: '8px',
                          padding: '5px 9px',
                          fontSize: '11px',
                          fontWeight: 800,
                          color: '#25d366',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          textDecoration: 'none',
                          boxShadow: '0 2px 8px rgba(37,211,102,0.2)'
                        }}
                      >
                        <span>💬</span>
                        <span>WhatsApp</span>
                      </a>
                    </div>

                  </div>

                  {/* ── ROW 2 (MOBILE ONLY): Clean Modern Search Bar ── */}
                  <div className="block sm:hidden mt-2 relative">
                    <div className="relative flex items-center">
                      <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'rgba(255,255,255,0.45)', pointerEvents: 'none' }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"/>
                      </svg>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setSuggestOpen(true); }}
                        onKeyDown={handleSearchKeyDown}
                        placeholder={isListening ? tr(language, "🎙️ Listening... Speak now...", "🎙️ Sun raha hoon...", "🎙️ سن رہا ہوں...") : translate(langData, "searchPlaceholder")}
                        style={{
                          width: '100%',
                          background: isListening ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.10)',
                          border: isListening ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.16)',
                          borderRadius: '10px',
                          paddingLeft: '36px',
                          paddingRight: searchTerm ? '64px' : '36px',
                          paddingTop: '8px',
                          paddingBottom: '8px',
                          fontSize: '12px',
                          color: '#ffffff',
                          outline: 'none',
                          transition: 'all 0.2s',
                          caretColor: '#10b981',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.background = 'rgba(255,255,255,0.14)'; e.target.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.2)'; }}
                        onBlur={e => { e.target.style.borderColor = isListening ? '#10b981' : 'rgba(255,255,255,0.16)'; e.target.style.background = isListening ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none'; }}
                      />
                      <div style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        {searchTerm && (
                          <button type="button" onClick={() => { triggerHaptic('light'); setSearchTerm(''); }} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', padding: '2px 5px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }} title="Clear">✕</button>
                        )}
                        <button
                          type="button"
                          onClick={handleVoiceSearch}
                          title={tr(language, "Voice Search", "Voice Search", "آواز سے تلاش")}
                          style={{ background: isListening ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)', border: isListening ? '1.5px solid #10b981' : '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <svg style={{ width: '12px', height: '12px', color: isListening ? '#10b981' : 'rgba(255,255,255,0.6)' }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/* Mobile Suggestions Dropdown */}
                    {suggestOpen && suggestions.length > 0 && (
                      <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#09131e', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: '10px', boxShadow: '0 16px 48px rgba(0,0,0,0.7)', zIndex: 50, overflow: 'hidden', maxHeight: '280px', overflowY: 'auto' }}>
                        {recentSearches.length > 0 && !searchTerm && (
                          <div style={{ padding: '7px 12px 3px', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Recent</div>
                        )}
                        {suggestions.slice(0, 8).map((product) => (
                          <button
                            key={product.id}
                            type="button"
                            onMouseDown={() => handleSuggestionClick(product)}
                            style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '9px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                          >
                            <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: `linear-gradient(135deg, ${product.gradient?.replace('from-','').replace(' to-',', ') || '#10b981, #059669'})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: 'white', flexShrink: 0 }}>{product.initial || product.name[0]}</div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                              <div style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>Rs. {product.price}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </header>
            </>
          )}
          <main className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-6 main-content-area" style={{ paddingBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))', paddingTop: activeTab === 'account' ? 'calc(10px + env(safe-area-inset-top, 0px))' : undefined }}>
            {activeTab === 'account' ? (
              /* ══════════ FULL-PAGE GLOSSY WHITE & BLACK "ME / ACCOUNT" VIEW ══════════ */
              <div className="max-w-2xl mx-auto space-y-4 animate-fade-in pb-8">
                
                {/* 1. TOP BAR WITH BACK BUTTON */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <button
                    onClick={() => { triggerHaptic('light'); setActiveTab('home'); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '6px 12px', fontSize: '11.5px', fontWeight: 800, color: '#0f172a', cursor: 'pointer' }}
                  >
                    <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    <span>{tr(language, 'Back to Shop', 'Wapis Shop', 'واپس شاپ')}</span>
                  </button>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {tr(language, 'My Account', 'Mera Account', 'میرا اکاؤنٹ')}
                  </div>
                  <div style={{ width: '32px' }} />
                </div>

                {/* 2. PROFILE & STORE CARD (Glossy White + Emerald Accents) */}
                <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', borderRadius: '20px', border: '1.5px solid #dcfce7', padding: '16px 18px', boxShadow: '0 4px 16px rgba(16,185,129,0.07)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 14px rgba(16,185,129,0.3)', flexShrink: 0 }}>
                      🛍️
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a', fontFamily: "'Poppins', sans-serif" }}>Sahil Traders Customer</span>
                        <span style={{ fontSize: '9px', fontWeight: 800, background: '#dcfce7', color: '#166534', padding: '2px 7px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>✓ Verified Buyer</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                        {tr(language, 'Wholesale & Retail Buyer • Karachi, Pakistan', 'Wholesale & Retail Customer • Karachi', 'تھوک و پرچون کسٹمر • کراچی')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. QUICK STATS (3 Glossy Colorful Metric Cards) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {/* Orders */}
                  <button
                    onClick={() => { triggerHaptic('light'); setOrderHistoryOpen(true); }}
                    style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '14px 8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.15s' }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '2px' }}>📦</div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#10b981' }}>{orderHistory.length}</div>
                    <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{tr(language, 'Orders', 'Orders', 'آرڈرز')}</div>
                    <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>{tr(language, 'Receipts', 'Receipts', 'رسیدیں')}</div>
                  </button>

                  {/* Wishlist */}
                  <button
                    onClick={() => { triggerHaptic('light'); setWishlistOpen(true); }}
                    style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '14px 8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.15s' }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '2px' }}>❤️</div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#f43f5e' }}>{wishlist.length}</div>
                    <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{tr(language, 'Wishlist', 'Pasandida', 'پسندیدہ')}</div>
                    <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>{tr(language, 'Saved', 'Saved', 'محفوظ')}</div>
                  </button>

                  {/* Cart */}
                  <button
                    onClick={() => { triggerHaptic('medium'); setCartOpen(true); }}
                    style={{ background: '#ffffff', borderRadius: '16px', border: '1.5px solid #e2e8f0', padding: '14px 8px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'all 0.15s' }}
                  >
                    <div style={{ fontSize: '20px', marginBottom: '2px' }}>🛒</div>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#3b82f6' }}>{cartCount}</div>
                    <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>{tr(language, 'Cart', 'Cart', 'کارٹ')}</div>
                    <div style={{ fontSize: '9px', color: '#94a3b8', fontWeight: 600 }}>{tr(language, 'In Bag', 'Items', 'اشیاء')}</div>
                  </button>
                </div>

                {/* 4. FEATURED ACTION CARDS (Colorful Glossy Gradients) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                  {/* Parchi Slip Order */}
                  <div
                    onClick={() => { triggerHaptic('medium'); setParchiModalOpen(true); }}
                    style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', borderRadius: '18px', padding: '14px 16px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                        📸
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 900 }}>{tr(language, 'Parchi / Photo Order', 'Parchi ya Photo Order', 'پرچی / فوٹو آرڈر')}</div>
                        <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.9)', marginTop: '2px' }}>
                          {tr(language, 'Upload slip photo for instant order', 'Handwritten slip ki photo upload karen', 'ہاتھ کی پرچی کی تصویر سے فوری آرڈر')}
                        </div>
                      </div>
                    </div>
                    <span style={{ background: '#ffffff', color: '#059669', fontSize: '10.5px', fontWeight: 900, padding: '6px 12px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                      {tr(language, 'Upload', 'Bhejen', 'بھیجیں')}
                    </span>
                  </div>

                  {/* WhatsApp Support */}
                  <a
                    href="https://wa.me/923368945775"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)', borderRadius: '18px', padding: '14px 16px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', cursor: 'pointer', textDecoration: 'none', boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                        💬
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 900 }}>WhatsApp Helpline &amp; Orders</div>
                        <div style={{ fontSize: '10.5px', color: 'rgba(255,255,255,0.9)', marginTop: '2px' }}>
                          0336-8945775 • {tr(language, 'Direct Chat with Store', 'Store se Direct Rabta', 'دکان سے براہ راست رابطہ')}
                        </div>
                      </div>
                    </div>
                    <span style={{ background: '#ffffff', color: '#128C7E', fontSize: '10.5px', fontWeight: 900, padding: '6px 12px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                      {tr(language, 'Chat', 'Chat', 'چیٹ')}
                    </span>
                  </a>

                  {/* Phone Call */}
                  <a
                    href="tel:03368945775"
                    style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '18px', padding: '14px 16px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', cursor: 'pointer', textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                        📞
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 900 }}>{tr(language, 'Call Official Helpline', 'Helpline par Call Karen', 'ہیلپ لائن پر کال کریں')}</div>
                        <div style={{ fontSize: '10.5px', color: '#38bdf8', fontWeight: 800, marginTop: '2px' }}>
                          0336-8945775 (10:00 AM – 8:00 PM)
                        </div>
                      </div>
                    </div>
                    <span style={{ background: '#38bdf8', color: '#0f172a', fontSize: '10.5px', fontWeight: 900, padding: '6px 12px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                      {tr(language, 'Call Now', 'Call Karen', 'کال کریں')}
                    </span>
                  </a>

                </div>

                {/* 5. LANGUAGE SELECTOR (Glossy White Card) */}
                <div style={{ background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <span>🌐</span>
                    <span>{tr(language, 'Select App Language', 'Zaban Muntakhab Karen', 'ایپ کی زبان منتخب کریں')}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {[
                      ['en', '🇬🇧 English'],
                      ['ro', '🇵🇰 Roman'],
                      ['ur', '🇵🇰 اردو']
                    ].map(([code, label]) => (
                      <button
                        key={code}
                        onClick={() => { setLanguage(code); triggerHaptic('light'); }}
                        style={{
                          padding: '8px 4px',
                          borderRadius: '10px',
                          border: language === code ? '2px solid #10b981' : '1.5px solid #e2e8f0',
                          background: language === code ? '#f0fdf4' : '#f8fafc',
                          color: language === code ? '#166534' : '#475569',
                          fontSize: '11.5px',
                          fontWeight: language === code ? 900 : 700,
                          cursor: 'pointer',
                          boxShadow: language === code ? '0 2px 6px rgba(16,185,129,0.12)' : 'none',
                          transition: 'all 0.15s'
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. STORE POLICIES & INFO (Glossy White Cards) */}
                <div style={{ background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0', padding: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  {/* Return Policy */}
                  <button
                    onClick={() => { triggerHaptic('light'); setReturnPolicyOpen(true); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'transparent', border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                      🛡️
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>{tr(language, 'Return & Exchange Policy', 'Wapsi Policy', 'واپسی اور تبدیلی کی پالیسی')}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>{tr(language, '7-day easy returns & exchange guarantee', '7 din me asan wapsi guarantee', '7 دن میں آسان واپسی کی گارنٹی')}</div>
                    </div>
                    <span style={{ fontSize: '16px', color: '#94a3b8' }}>›</span>
                  </button>

                  {/* About Store */}
                  <button
                    onClick={() => { triggerHaptic('light'); setAboutOpen(true); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
                      ℹ️
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>{tr(language, 'About Sahil Traders', 'Sahil Traders ke Baare Mein', 'ساحل ٹریڈرز کے بارے میں')}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '1px' }}>{tr(language, 'Owners, wholesale history & store info', 'Malikan aur dukan ki maloomat', 'مالکان اور دکان کی تفصیلات')}</div>
                    </div>
                    <span style={{ fontSize: '16px', color: '#94a3b8' }}>›</span>
                  </button>
                </div>

                {/* 7. STORE DETAILS & LOCATION */}
                <div style={{ background: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0', padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <span>🏬</span>
                    <span>{tr(language, 'Store Details & Location', 'Dukan ki Location aur Timings', 'دکان کا پتہ اور اوقات')}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                      <span>📍</span>
                      <span style={{ fontWeight: 600 }}>BS Mart, Karachi, Sindh, Pakistan</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 700 }}>
                      <span>⏰</span>
                      <span>10:00 AM – 8:00 PM (Monday to Saturday)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontWeight: 700 }}>
                      <span>📞</span>
                      <span>Official Helpline: 0336-8945775</span>
                    </div>
                  </div>
                </div>

                {/* FOOTER APP INFO */}
                <div style={{ textAlign: 'center', padding: '6px 0 16px' }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748b' }}>Sahil Traders Official App v9.4</div>
                  <div style={{ fontSize: '9.5px', color: '#94a3b8', marginTop: '2px' }}>Sahil Saleem &amp; Muhammad Zubair Moin • Karachi 🇵🇰</div>
                </div>

              </div>
            ) : showCategoryHome ? (
              <CategoryHome
                products={products}
                onSelectCategory={setSelectedCategory}
                langData={langData}
                language={language}
              />
            ) : (
              <>
                {/* Back button + Right-aligned Category Title Banner */}
                <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  {(selectedCategory || isSearching || activeCategory !== "all") && (
                    <button
                      onClick={handleGoBack}
                      className="flex items-center gap-1.5 border px-3 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-sm cursor-pointer shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.12), rgba(255,255,255,0.95))',
                        borderColor: 'rgba(0,0,0,0.12)',
                        color: '#111111'
                      }}
                    >
                      <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                      <span>{translate(langData, "backBtn") || "BACK"}</span>
                    </button>
                  )}
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                    <h2 style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111111', fontFamily: "'Poppins', sans-serif" }}>
                      {isSearching ? `Search: "${searchTerm}"` : selectedCategoryName}
                    </h2>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#111111', background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 12, padding: '1px 8px', whiteSpace: 'nowrap' }}>
                      {filtered.length} {translate(langData, "itemsLabel")}
                    </span>
                  </div>
                </div>
                {/* Controls Bar: Filter & Sort */}
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  {/* Modern Sort Button */}
                  <button
                    onClick={() => { triggerHaptic('light'); setSortModalOpen(true); }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: '#ffffff', border: '1.5px solid #059669',
                      borderRadius: 999, padding: '7px 14px',
                      cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      transition: 'all 0.15s'
                    }}
                  >
                    <svg style={{ width: 14, height: 14, color: '#059669' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-6L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                    </svg>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: '#0f172a' }}>
                      {SORT_OPTIONS.find(o => o.id === sortBy)?.[language === 'ur' ? 'labelUrdu' : 'label'] || 'Sort'}
                    </span>
                    <svg style={{ width: 12, height: 12, color: '#64748b' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {/* Sort Options Modal (Modern Bottom Sheet) */}
                  {sortModalOpen && (
                    <>
                      <div
                        onClick={() => setSortModalOpen(false)}
                        style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}
                      />
                      <div
                        style={{
                          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 95,
                          background: '#ffffff', borderRadius: '24px 24px 0 0',
                          padding: '16px 20px 32px',
                          boxShadow: '0 -10px 40px rgba(0,0,0,0.25)',
                          maxWidth: 480, margin: '0 auto',
                          animation: 'imgFadeIn 0.2s ease-out'
                        }}
                      >
                        <div style={{ width: 36, height: 4, background: '#cbd5e1', borderRadius: 2, margin: '0 auto 14px' }} />
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
                          <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>⚡</span>
                            <span>{tr(language, 'Sort Products By', 'Sort Products By', 'ترتیب منتخب کریں')}</span>
                          </div>
                          <button
                            onClick={() => setSortModalOpen(false)}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', fontSize: 13, fontWeight: 900 }}
                          >
                            ✕
                          </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {SORT_OPTIONS.map((opt) => {
                            const isSelected = sortBy === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => {
                                  triggerHaptic('light');
                                  setSortBy(opt.id);
                                  setSortModalOpen(false);
                                }}
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: '12px 14px', borderRadius: 14,
                                  background: isSelected ? '#ecfdf5' : '#f8fafc',
                                  border: isSelected ? '1.5px solid #10b981' : '1.5px solid #f1f5f9',
                                  cursor: 'pointer', transition: 'all 0.15s'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                  <span style={{ fontSize: 16 }}>{opt.icon}</span>
                                  <span style={{ fontSize: 13, fontWeight: isSelected ? 800 : 600, color: isSelected ? '#065f46' : '#1e293b' }}>
                                    {language === 'ur' ? opt.labelUrdu : opt.label}
                                  </span>
                                </div>
                                {isSelected ? (
                                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#10b981', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900 }}>
                                    ✓
                                  </span>
                                ) : (
                                  <span style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #cbd5e1' }} />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}

                  {brandFilters.length > 1 && (
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <button
                        onClick={() => { triggerHaptic('light'); setFilterMenuOpen(v => !v); }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: selectedBrand !== "all" ? '1.5px solid #059669' : '1px solid #111111', background: selectedBrand !== "all" ? '#059669' : '#ffffff', color: selectedBrand !== "all" ? '#ffffff' : '#111111', borderRadius: 999, padding: '7px 14px', fontSize: 12, fontWeight: 900, letterSpacing: '0.04em', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                      >
                        <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M6 12h10M10 19h4" /></svg>
                        <span>Filter</span>
                        {selectedBrand !== "all" && (
                          <span style={{ fontSize: 11, background: '#ffffff', color: '#059669', borderRadius: 999, padding: '1px 8px', fontWeight: 800, letterSpacing: 0, textTransform: 'none' }}>
                            {selectedBrand}
                          </span>
                        )}
                      </button>
                      {selectedBrand !== "all" && (
                        <button
                          onClick={() => { setSelectedBrand("all"); setFilterMenuOpen(false); }}
                          title="Clear Brand Filter"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 999, padding: '7px 11px', fontSize: 11, fontWeight: 800, cursor: 'pointer' }}
                        >
                          <span>✕</span>
                          <span>Reset</span>
                        </button>
                      )}
                    {filterMenuOpen && (
                      <>
                        <div onClick={() => setFilterMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }} />
                        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 95, maxWidth: 480, margin: '0 auto', background: '#ffffff', borderRadius: '24px 24px 0 0', padding: '16px 20px 32px', boxShadow: '0 -10px 40px rgba(0,0,0,0.25)', animation: 'imgFadeIn 0.2s ease-out' }}>
                          <div style={{ width: 36, height: 4, background: '#cbd5e1', borderRadius: 2, margin: '0 auto 14px' }} />
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ fontSize: 14, fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span>🏷️</span>
                              <span>{tr(language, 'Filter by Brand', 'Filter by Brand', 'برانڈ فلٹر')}</span>
                            </div>
                            <button
                              onClick={() => setFilterMenuOpen(false)}
                              style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', fontSize: 13, fontWeight: 900 }}
                            >
                              ✕
                            </button>
                          </div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxHeight: 280, overflowY: 'auto' }}>
                            <button
                              onClick={() => { triggerHaptic('light'); setSelectedBrand("all"); setFilterMenuOpen(false); }}
                              style={{
                                border: selectedBrand === "all" ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                                background: selectedBrand === "all" ? '#ecfdf5' : '#f8fafc',
                                color: selectedBrand === "all" ? '#065f46' : '#1e293b',
                                borderRadius: 999,
                                padding: '8px 14px',
                                fontSize: 12,
                                fontWeight: 800,
                                cursor: 'pointer'
                              }}
                            >
                              All Brands ({baseFiltered.length})
                            </button>
                            {brandFilters.map((brand) => {
                              const isBrandActive = selectedBrand === brand.name;
                              return (
                                <button
                                  key={brand.name}
                                  onClick={() => { triggerHaptic('light'); setSelectedBrand(brand.name); setFilterMenuOpen(false); }}
                                  style={{
                                    border: isBrandActive ? '1.5px solid #10b981' : '1px solid #e2e8f0',
                                    background: isBrandActive ? '#ecfdf5' : '#ffffff',
                                    color: isBrandActive ? '#065f46' : '#1e293b',
                                    borderRadius: 999,
                                    padding: '8px 14px',
                                    fontSize: 12,
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                                  }}
                                >
                                  {brand.name} <span style={{ opacity: 0.65, fontSize: 11 }}>({brand.count})</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                    </div>
                  )}
                </div>
                {filtered.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-700" />
                    <p className="text-base font-bold text-black mb-2">No items found matching "{searchTerm}"</p>
                    <p className="text-xs text-gray-700 mb-6">Try searching with a different item name or go back to main categories.</p>
                    <button
                      onClick={handleGoBack}
                      className="inline-flex items-center gap-2 border px-6 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                      style={{ background: 'linear-gradient(135deg, #000000, #f59e0b)', color: '#ffffff' }}
                    >
                      ← Back to Main Categories
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="product-grid">
                      {sortedProducts.slice(0, visibleCount).map((p) => (
                        <ProductCard key={p.id} product={p} langData={langData} language={language} cartQty={cart.filter(i => i.product.id === p.id).reduce((s, i) => s + i.qty, 0)} onAddToCart={addToCart} onFlyToCart={flyProductToCart} onSelectProduct={selectProductWithHash} isWishlisted={wishlist.includes(p.id)} onToggleWishlist={toggleWishlist} />
                      ))}
                    </div>
                    {visibleCount < sortedProducts.length && (
                      <div style={{ marginTop: 32, marginBottom: 20, textAlign: 'center' }}>
                        <button
                          onClick={() => setVisibleCount(prev => prev + 24)}
                          className="inline-flex items-center gap-3 border px-8 py-3.5 rounded-2xl text-sm font-black tracking-wider uppercase transition-all shadow-xl cursor-pointer"
                          style={{
                            background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                            color: '#ffffff',
                            border: '1px solid #333333',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.25)'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                          </svg>
                          <span>
                            {tr(language, `Load More Items (${Math.min(visibleCount, sortedProducts.length)} of ${sortedProducts.length})`, `Mazeed Items Dekhein (${Math.min(visibleCount, sortedProducts.length)} / ${sortedProducts.length})`, `مزید اشیاء دیکھیں (${Math.min(visibleCount, sortedProducts.length)} / ${sortedProducts.length})`)}
                          </span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </main>
              <footer className="border-t mt-10 py-8 text-center" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
                <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-gray-800 border border-gray-200 rounded-full px-4 py-1.5 bg-gray-50 shadow-xs">
                  <span className="text-amber-600">⏰</span>
                  <span>{tr(language, 'Delivery Timing: 10:00 AM – 8:00 PM (Mon – Sat)', 'Delivery Timing: Subah 10:00 AM se Raat 8:00 PM tak (Peer ta Hafta)', 'ڈیلیوری ٹائمنگ: صبح 10:00 بجے سے رات 8:00 بجے تک (پیر تا ہفتہ)')}</span>
                </div>
                <div>
                  <button
                    onClick={() => setAboutOpen(true)}
                    className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-black border border-gray-300 rounded-full px-4 py-1.5 transition-colors cursor-pointer bg-white"
                  >
                    <span>🏬</span>
                    <span>{tr(language, 'About Sahil Traders', 'Hamare Baare Mein (About Sahil Traders)', 'ہمارے بارے میں (About Sahil Traders)')}</span>
                  </button>
                </div>
                <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(0,0,0,0.12)' }}>{translate(langData, "footer")}</p>
              </footer>
              {cartNotice && (
                <div className="fixed inset-x-0 top-1/2 z-[95] flex justify-center px-4 pointer-events-none" style={{ transform: 'translateY(-50%)' }}>
                  <div style={{ background: '#ffffff', border: '1px solid rgba(22,163,74,0.28)', borderRadius: 18, padding: '13px 18px', boxShadow: '0 18px 45px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 220 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 999, background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 900, color: '#111111', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Poppins',sans-serif" }}>
                      {translate(langData, "added")}
                    </span>
                  </div>
                </div>
              )}
              {/* Product Detail Modal */}
              <ProductDetailModal
                product={selectedProduct}
                open={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={addToCart}
                products={products}
                langData={langData}
                language={language}
                onSelectProduct={selectProductWithHash}
                isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
                onToggleWishlist={toggleWishlist}
              />
              {/* Parchi / Slip Order Modal */}
              <ParchiOrderModal
                open={parchiModalOpen}
                onClose={() => setParchiModalOpen(false)}
                language={language}
                saveOrderHistory={saveOrderHistory}
              />
              {/* Wishlist Drawer */}
              <WishlistDrawer
                open={wishlistOpen}
                onClose={() => setWishlistOpen(false)}
                wishlist={wishlist}
                products={products}
                onAddToCart={addToCart}
                onRemoveWishlist={toggleWishlist}
                language={language}
                langData={langData}
              />
              {/* Variant Selection Modal (Hair Colour Shades, etc.) */}
              <VariantSelectionModal
                product={variantModalProduct}
                open={!!variantModalProduct}
                onClose={() => setVariantModalProduct(null)}
                language={language}
                langData={langData}
                onConfirm={(product, shade, qty) => {
                  setVariantModalProduct(null);
                  addToCart(product, shade, qty);
                }}
              />
              {/* Return & Exchange Policy Modal */}
              <ReturnPolicyModal
                isOpen={returnPolicyOpen}
                onClose={() => setReturnPolicyOpen(false)}
                language={language}
              />
              {/* About Us Modal */}
              <AboutUsModal
                isOpen={aboutOpen}
                onClose={() => setAboutOpen(false)}
                language={language}
              />
              {/* Welcome Disclaimer Modal — shown once per session after splash */}
              {!showSplash && (
                <WelcomeDisclaimerModal
                  isOpen={welcomeOpen}
                  onClose={() => {
                    setWelcomeOpen(false);
                    try { sessionStorage.setItem("sahil_traders_welcome_seen", "1"); } catch(e) {}
                  }}
                  onOpenAbout={() => setAboutOpen(true)}
                  language={language}
                />
              )}
              {/* Cart Drawer */}
              <CartDrawer
                open={cartOpen}
                cart={cart}
                cartTotal={cartTotal}
                langData={langData}
                language={language}
                onClose={() => setCartOpen(false)}
                onUpdateQty={updateQty}
                onRemove={removeFromCart}
                onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
                onSelectProduct={handleSelectProductFromCart}
              />
              <OrderHistoryModal
                open={orderHistoryOpen}
                orders={orderHistory}
                langData={langData}
                language={language}
                onClose={() => setOrderHistoryOpen(false)}
                onClear={clearOrderHistory}
                onReorder={handleReorder}
              />
              {/* Checkout Modal */}
              {checkoutOpen && (
                <CheckoutModal
                  cart={cart}
                  cartTotal={cartTotal}
                  langData={langData}
                  language={language}
                  saveOrderHistory={saveOrderHistory}
                  clearCart={clearCart}
                  onClose={() => setCheckoutOpen(false)}
                  onBack={() => { setCheckoutOpen(false); setCartOpen(true); }}
                />
              )}
              {/* Mobile Navigation Drawer (3-Line Menu) */}
              {mobileMenuOpen && (
                <div
                  className="fixed inset-0 z-50 flex justify-end sm:hidden animate-fade-in"
                  style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
                >
                  {/* Backdrop Click to Close */}
                  <div className="absolute inset-0" onClick={() => setMobileMenuOpen(false)}></div>
                  {/* Drawer Panel */}
                  <div
                    className="relative w-[85%] max-w-[320px] h-full bg-white shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-scale-in"
                    style={{ zIndex: 60, borderLeft: '1px solid rgba(0,0,0,0.1)' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div>
                      {/* Drawer Header */}
                      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                        <div className="flex items-center gap-2.5">
                          <img src="images/sahil-traders-logo.png" alt="Sahil Traders" className="w-9 h-9 object-contain" />
                          <div>
                            <h3 className="text-sm font-black tracking-wider uppercase text-black">Sahil Traders</h3>
                            <p className="text-[11px] text-gray-500">{tr(language, 'Main Menu', 'Main Menu', '\u0645\u06cc\u06ba \u0645\u06cc\u0646\u0648')}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setMobileMenuOpen(false)}
                          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-all cursor-pointer"
                          aria-label="Close menu"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {/* 1. Language Switcher Section */}
                      <div className="mb-5 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="text-xs font-bold text-gray-800 mb-2.5 flex items-center justify-between">
                          <span>{tr(language, 'Switch Language', 'Zaban Tabdeel Karein', '\u0632\u0628\u0627\u0646 \u062a\u0628\u062f\u06cc\u0644 \u06a9\u0631\u06cc\u06ba')}</span>
                          <span className="text-[10px] text-gray-500 font-normal">{tr(language, 'English Active', 'Roman Urdu Active', '\u0627\u0631\u062f\u0648 \u0641\u0639\u0627\u0644 \u06c1\u06d2')}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            onClick={() => { setLanguage("en"); }}
                            className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              language === 'en'
                                ? 'bg-black text-white shadow-sm'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <span>English</span>
                          </button>
                          <button
                            onClick={() => { setLanguage("ro"); }}
                            className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              language === 'ro'
                                ? 'bg-black text-white shadow-sm'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <span>Roman</span>
                          </button>
                          <button
                            onClick={() => { setLanguage("ur"); }}
                            className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              language === 'ur'
                                ? 'bg-black text-white shadow-sm'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <span>{'\u0627\u0631\u062f\u0648'}</span>
                          </button>
                        </div>
                      </div>
                      {/* 2. Menu Navigation Links */}
                      <div className="space-y-2.5">
                        {/* Order History */}
                        <button
                          onClick={() => { setMobileMenuOpen(false); setOrderHistoryOpen(true); }}
                          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all text-left cursor-pointer shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-lg">
                              <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{tr(language, 'Order History', 'Order History', '\u0622\u0631\u0688\u0631 \u06c1\u0633\u0679\u0631\u06cc')}</p>
                              <p className="text-[11px] text-gray-500">{tr(language, 'View past orders & receipts', 'Pichle orders aur receipt dekhein', '\u067e\u0686\u06be\u0644\u06d2 \u0622\u0631\u0688\u0631\u0632 \u0627\u0648\u0631 \u0631\u0633\u06cc\u062f\u06cc\u06ba')}</p>
                            </div>
                          </div>
                          {orderHistory.length > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white">
                              {orderHistory.length}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">&rsaquo;</span>
                          )}
                        </button>
                        {/* Parchi / Photo Order */}
                        <button
                          onClick={() => { setMobileMenuOpen(false); triggerHaptic('medium'); setParchiModalOpen(true); }}
                          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white transition-all text-left cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                              📸
                            </div>
                            <div>
                              <p className="text-xs font-black text-white">{tr(language, 'Parchi / Photo Order', 'Parchi / Photo Order', 'پرچی / فوٹو آرڈر')}</p>
                              <p className="text-[11px] text-emerald-100">{tr(language, 'Upload slip, order in 5 seconds!', 'Slip upload karein, 5 sec mein order!', 'پرچی اپلوڈ کریں، 5 سیکنڈ میں آرڈر!')}</p>
                            </div>
                          </div>
                          <span className="text-white/70 text-xs">&rsaquo;</span>
                        </button>
                        {/* Wishlist */}
                        <button
                          onClick={() => { setMobileMenuOpen(false); triggerHaptic('light'); setWishlistOpen(true); }}
                          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-rose-200 hover:bg-rose-50 transition-all text-left cursor-pointer shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-xl">
                              ❤️
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{tr(language, 'My Wishlist (Favorites)', 'Meri Pasandeeda Ashya', 'میری پسندیدہ اشیاء')}</p>
                              <p className="text-[11px] text-gray-500">{tr(language, 'Save items & order monthly groceries', 'Monthly saman save karein', 'ماہانہ سامان محفوظ کریں')}</p>
                            </div>
                          </div>
                          {wishlist.length > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white">
                              {wishlist.length}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">&rsaquo;</span>
                          )}
                        </button>
                        {/* Return Policy */}
                        <button
                          onClick={() => { setMobileMenuOpen(false); setReturnPolicyOpen(true); }}
                          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all text-left cursor-pointer shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg">
                              <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{tr(language, 'Return & Exchange Policy', 'Wapsi aur Tabdeeli ki Policy', '\u0648\u0627\u067e\u0633\u06cc \u0627\u0648\u0631 \u062a\u0628\u062f\u06cc\u0644\u06cc \u06a9\u06cc \u067e\u0627\u0644\u06cc\u0633\u06cc')}</p>
                              <p className="text-[11px] text-gray-500">{tr(language, '100% replacement or money refund', '100% tabdeeli ya paise wapas', '\u062e\u0631\u0627\u0628 \u0686\u06cc\u0632 \u06a9\u06cc 100% \u062a\u0628\u062f\u06cc\u0644\u06cc \u06cc\u0627 \u0631\u06cc \u0641\u0646\u0688')}</p>
                            </div>
                          </div>
                          <span className="text-gray-400 text-xs">&rsaquo;</span>
                        </button>
                        {/* Direct Call */}
                        <a
                          href="tel:03368945775"
                          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all text-left cursor-pointer shadow-2xs text-decoration-none"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg">
                              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.15 1.15 0 00-1.01.258l-1.589 1.589a13.385 13.385 0 01-6.697-6.697l1.589-1.589a1.15 1.15 0 00.258-1.01L7.544 3.102A1.125 1.125 0 006.453 2.25H5.08A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{tr(language, 'Direct Phone Call (0336-8945775)', 'Direct Call Karein (0336-8945775)', '\u0628\u0631\u0627\u06c1\u0650 \u0631\u0627\u0633\u062a \u0641\u0648\u0646 \u06a9\u0627\u0644 (0336-8945775)')}</p>
                              <p className="text-[11px] text-gray-500">{tr(language, 'Tap to call us directly', 'Fori call kar ke maloomat ya order dein', '\u0641\u0648\u0631\u06cc \u06a9\u0627\u0644 \u06a9\u0631 \u06a9\u06d2 \u0645\u0639\u0644\u0648\u0645\u0627\u0622 \u06cc\u0627 \u0622\u0631\u0688\u0631 \u062f\u06cc\u06ba')}</p>
                            </div>
                          </div>
                          <span className="text-gray-400 text-xs">&rsaquo;</span>
                        </a>
                        {/* About Us */}
                        <button
                          onClick={() => { setMobileMenuOpen(false); setAboutOpen(true); }}
                          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all text-left cursor-pointer shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg">
                              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H21m-4.5 0H12m-9 0h4.5m0 0V9a2.25 2.25 0 012.25-2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44.505.75.958.75h3.423a.75.75 0 00.75-.75V6.75A2.25 2.25 0 0017.25 4.5h-10.5A2.25 2.25 0 004.5 6.75V21" /></svg>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{tr(language, 'About Us', 'Hamare Baare Mein', '\u06c1\u0645\u0627\u0631\u06d2 \u0628\u0627\u0631\u06d2 \u0645\u06cc\u06ba')}</p>
                              <p className="text-[11px] text-gray-500">{tr(language, 'Shop info, timings & owners', 'Dukan ki maloomat aur timings', '\u062f\u06a9\u0627\u0646 \u06a9\u06cc \u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0648\u0631 \u0627\u0648\u0642\u0627\u062a')}</p>
                            </div>
                          </div>
                          <span className="text-gray-400 text-xs">&rsaquo;</span>
                        </button>
                        {/* View Cart in Menu */}
                        <button
                          onClick={() => { setMobileMenuOpen(false); setCartOpen(true); }}
                          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all text-left cursor-pointer shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-lg">
                              <svg className="w-5 h-5 text-purple-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{tr(language, 'Shopping Cart', 'Shopping Cart', '\u0634\u0627\u067e\u0646\u06af \u06a9\u0627\u0631\u0679')}</p>
                              <p className="text-[11px] text-gray-500">{cartCount > 0 ? tr(language, `${cartCount} items in cart`, `Cart mein ${cartCount} cheezein hain`, `${cartCount} \u0627\u0634\u06cc\u0627\u0621 \u0645\u0648\u062c\u0648\u062f \u06c1\u06cc\u06ba`) : tr(language, 'Cart is empty', 'Cart khali hai', '\u06a9\u0627\u0631\u0679 \u062e\u0627\u0644\u06cc \u06c1\u06d2')}</p>
                            </div>
                          </div>
                          {cartCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-black text-white">
                              {cartCount}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">&rsaquo;</span>
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Drawer Footer - WhatsApp & Timing */}
                    <div className="pt-4 border-t border-gray-100 mt-4 space-y-3">
                      <a
                        href="https://wa.me/923368945775"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer"
                        style={{ background: '#25D366' }}
                      >
                        <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        <span>{tr(language, 'WhatsApp (+92 336 8945775)', 'WhatsApp (+92 336 8945775)', '\u0648\u0627\u067c\u0633 \u0627\u06cc\u067e \u067e\u0631 \u0631\u0627\u0628\u0637\u06c1 \u06a9\u0631\u06cc\u06ba')}</span>
                      </a>
                      <div className="text-center text-[10px] text-gray-500 space-y-0.5">
                        <p className="font-semibold text-gray-700">{tr(language, 'Delivery Timing: 10:00 AM – 8:00 PM (Mon – Sat)', 'Delivery Timing: 10:00 AM – 8:00 PM (Peer ta Hafta)', '\u0688\u0644\u06cc\u0648\u0631\u06cc \u06a9\u06d2 \u0627\u0648\u0642\u0627\u062a: \u0635\u0628\u062d 10:00 \u0628\u062c\u06d2 \u062a\u0627 \u0631\u0627\u062a 8:00 \u0628\u062c\u06d2 (\u067e\u06cc\u0631 \u062a\u0627 \u06c1\u0641\u062a\u06c1)')}</p>
                        <p>{tr(language, 'Sahil Saleem & Muhammad Zubair Moin', 'Sahil Saleem & Muhammad Zubair Moin', '\u0633\u0627\u062d\u0644 \u0633\u0644\u06cc\u0645 \u0627\u0648\u0631 \u0645\u062d\u0645\u062f \u0632\u0628\u06cc\u0631 \u0645\u0639\u06cc\u0646')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Exit Confirmation Modal */}
              {exitModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
                    <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-black uppercase tracking-wider">
                        {tr(language, 'Exit Sahil Traders?', 'Sahil Traders se Bahar Jana Chahte Hain?', 'ویب سائٹ سے باہر جانا چاہتے ہیں؟')}
                      </h3>
                      <p className="text-xs text-gray-700 mt-1.5 leading-relaxed">
                        {tr(language, 'Are you sure you want to leave the store?', 'Kya aap Sahil Traders band karna chahte hain?', 'کیا آپ واقعی Sahil Traders بند کرنا چاہتے ہیں؟')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setExitModalOpen(false);
                          setTimeout(() => restoreBackGuardRef.current(), 50);
                        }}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        {tr(language, 'No, Stay', 'Nahi, Wapis Rahein', 'نہیں، واپس رہیں')}
                      </button>
                      <button
                        onClick={() => { if (window.sahilExitStore) window.sahilExitStore(); }}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-extrabold uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer"
                      >
                        {tr(language, 'Yes, Exit', 'Haan, Bahar Jaein', 'ہاں، باہر جائیں')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════ GLOSSY TRANSPARENT FROSTED GLASS 5-TAB BOTTOM NAV ══════════ */}
              <nav className="sm:hidden" style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(30px) saturate(220%) contrast(110%)',
                WebkitBackdropFilter: 'blur(30px) saturate(220%) contrast(110%)',
                borderTop: '1px solid rgba(255, 255, 255, 0.45)',
                boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.7)',
                zIndex: 45,
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                willChange: 'transform',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                display: 'flex', alignItems: 'stretch', height: '58px',
              }}>
                {/* 1. HOME TAB */}
                <button
                  onClick={() => { triggerHaptic('light'); setActiveTab('home'); setSelectedCategory(null); setSearchTerm(''); setActiveCategory('all'); }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px', position: 'relative' }}
                >
                  {activeTab === 'home' && <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 22, height: 3, borderRadius: '0 0 3px 3px', background: '#059669' }} />}
                  <svg style={{ width: 20, height: 20, color: activeTab === 'home' ? '#059669' : '#0f172a' }} fill={activeTab === 'home' ? '#059669' : 'none'} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: activeTab === 'home' ? '#059669' : '#0f172a', letterSpacing: '0.01em' }}>{tr(language, 'Home', 'Home', 'ہوم')}</span>
                </button>

                {/* 2. ORDERS TAB */}
                <button
                  onClick={() => { triggerHaptic('light'); setOrderHistoryOpen(true); }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px', position: 'relative' }}
                >
                  <div style={{ position: 'relative' }}>
                    <svg style={{ width: 20, height: 20, color: '#0f172a' }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {orderHistory.length > 0 && (
                      <span style={{ position: 'absolute', top: -4, right: -7, minWidth: 15, height: 15, borderRadius: 8, background: '#10b981', color: '#fff', fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #ffffff' }}>
                        {orderHistory.length > 9 ? '9+' : orderHistory.length}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.01em' }}>{tr(language, 'Orders', 'Orders', 'آرڈرز')}</span>
                </button>

                {/* 3. CART TAB (HIGHLIGHTED ELEVATED BUTTON + "CART" NAME) */}
                <button
                  onClick={() => { triggerHaptic('medium'); setCartOpen(true); }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 2px', position: 'relative' }}
                >
                  <div
                    style={{
                      width: 44, height: 44,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                      boxShadow: '0 6px 18px rgba(16,185,129,0.5), 0 0 0 3.5px rgba(255,255,255,0.9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative',
                      transform: 'translateY(-8px)',
                      transition: 'all 0.2s',
                    }}
                  >
                    <svg style={{ width: 20, height: 20, color: '#ffffff' }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    {cartCount > 0 && (
                      <span style={{ position: 'absolute', top: -3, right: -3, minWidth: 17, height: 17, borderRadius: 9, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #ffffff' }}>
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f172a', marginTop: '-6px', letterSpacing: '0.01em' }}>{tr(language, 'Cart', 'Cart', 'کارٹ')}</span>
                </button>

                {/* 4. PARCHI TAB */}
                <button
                  onClick={() => { triggerHaptic('medium'); setParchiModalOpen(true); }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px', position: 'relative' }}
                >
                  <svg style={{ width: 20, height: 20, color: '#0f172a' }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.01em' }}>Parchi</span>
                </button>

                {/* 5. ACCOUNT / ME TAB */}
                <button
                  onClick={() => { triggerHaptic('light'); setActiveTab('account'); }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 2px', position: 'relative' }}
                >
                  {activeTab === 'account' && <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 22, height: 3, borderRadius: '0 0 3px 3px', background: '#059669' }} />}
                  <svg style={{ width: 20, height: 20, color: activeTab === 'account' ? '#059669' : '#0f172a' }} fill={activeTab === 'account' ? '#059669' : 'none'} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: activeTab === 'account' ? '#059669' : '#0f172a', letterSpacing: '0.01em' }}>{tr(language, 'Me', 'Mein', 'میں')}</span>
                </button>
              </nav>

              {/* ══════════ FLOATING BACK TOAST NOTIFICATION ══════════ */}
              {backToastVisible && (
                <div style={{
                  position: 'fixed', bottom: '75px', left: '50%', transform: 'translateX(-50%)',
                  background: 'rgba(15, 23, 42, 0.94)', color: '#ffffff',
                  padding: '9px 20px', borderRadius: '24px', fontSize: '12px', fontWeight: '800',
                  zIndex: 9999, boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(12px)', pointerEvents: 'none',
                  whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.15)'
                }}>
                  {tr(language, 'Press back again to exit', 'App band karne ke liye dobara wapas dabayein', 'باہر نکلنے کے لیے دوبارہ دبائیں')}
                </div>
              )}

        </div>
      );
    }
      // -----------------------------------------------------------------------------
    // To add a category image: set the `image` field to a URL or relative file path.
      // -----------------------------------------------------------------------------
    const CATEGORY_META = {
      soaps:        { image: '', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="3"/><circle cx="7" cy="12" r="1"/><circle cx="10.5" cy="9.5" r="1.5"/><circle cx="14.5" cy="14" r="1"/><circle cx="17" cy="11" r="2"/></svg>) },
      shampoo:      { image: '', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M7 21a2 2 0 002 2h6a2 2 0 002-2V10a2 2 0 00-2-2H9a2 2 0 00-2 2v11z"/><path d="M12 2v6"/><path d="M9 5h6"/><path d="M10 13h4"/><path d="M10 17h4"/></svg>) },
      perfumes:     { image: '', gradient: 'linear-gradient(135deg,#f7971e,#ffd200)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2"/><rect x="10" y="7" width="4" height="3"/><path d="M12 3v4"/><path d="M9 3h6"/></svg>) },
      bodyspray:    { image: '', gradient: 'linear-gradient(135deg,#30cfd0,#330867)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="8" y="4" width="8" height="16" rx="2"/><path d="M10 2h4"/><path d="M12 8v4"/><circle cx="12" cy="15" r="1"/></svg>) },
      creams:       { image: '', gradient: 'linear-gradient(135deg,#fa709a,#fee140)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M5 9h14v9a3 3 0 01-3 3H8a3 3 0 01-3-3V9z"/><rect x="4" y="5" width="16" height="4" rx="1"/><path d="M5 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 4 2"/></svg>) },
      bleachfacial: { image: '', gradient: 'linear-gradient(135deg,#e0c3fc,#8ec5fc)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>) },
      stationary:   { image: '', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>) },
      sports:       { image: '', gradient: 'linear-gradient(135deg,#f6d365,#fda085)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/><path d="M2 12h20"/></svg>) },
      toys:         { image: '', gradient: 'linear-gradient(135deg,#fd79a8,#e84393)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>) },
      tapes:        { image: '', gradient: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="3" x2="12" y2="8"/></svg>) },
      shaving:      { image: '', gradient: 'linear-gradient(135deg,#373b44,#4286f4)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 8v13"/><rect x="6" y="3" width="12" height="5" rx="1.5"/><line x1="8" y1="5" x2="16" y2="5"/><line x1="11" y1="12" x2="13" y2="12"/><line x1="11" y1="15" x2="13" y2="15"/><line x1="11" y1="18" x2="13" y2="18"/></svg>) },
      haircolour:   { image: '', gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 3c-1.5 3-5 5-5 9a5 5 0 0010 0c0-4-3.5-6-5-9z"/><path d="M12 17v4"/><path d="M10 21h4"/></svg>) },
      haircare:     { image: '', gradient: 'linear-gradient(135deg,#c471ed,#12c2e9)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 3c-1.5 3-5 5-5 9a5 5 0 0010 0c0-4-3.5-6-5-9z"/><path d="M8 10c1 2 5 2 6 0"/></svg>) },
      condemn:      { image: '', gradient: 'linear-gradient(135deg,#e96c6c,#c0392b)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 9v6l7 7 7-7V9c0-4-3-7-7-7z"/></svg>) },
      lock:         { image: '', gradient: 'linear-gradient(135deg,#636e72,#2d3436)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>) },
      general:      { image: '', gradient: 'linear-gradient(135deg,#000000,#9b7a00)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>) },
      bodylotion:   { image: '', gradient: 'linear-gradient(135deg,#fa709a,#fee140)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M5 9h14v9a3 3 0 01-3 3H8a3 3 0 01-3-3V9z"/><rect x="4" y="5" width="16" height="4" rx="1"/><path d="M5 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 4 2"/></svg>) },
      babycare:     { image: '', gradient: 'linear-gradient(135deg,#ffecd2,#fcb69f)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>) },
      blades:       { image: '', gradient: 'linear-gradient(135deg,#b8c6db,#f5f7fa)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 3L6 21"/><path d="M6 3l12 18"/><rect x="4" y="9" width="16" height="6" rx="1"/></svg>) },
      cells:        { image: '', gradient: 'linear-gradient(135deg,#56ab2f,#a8e063)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="7" y="4" width="10" height="16" rx="2"/><path d="M10 2h4"/><path d="M12 9v4"/></svg>) },
      mosquito:     { image: '', gradient: 'linear-gradient(135deg,#11998e,#38ef7d)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><path d="M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"/></svg>) },
      personalcare: { image: '', gradient: 'linear-gradient(135deg,#ee9ca7,#ffdde1)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>) },
    };
    // ————— CATEGORY HOME ————————————————————————————————————————————————————————————————————————————
    function CategoryHome({ products, onSelectCategory, langData, language }) {
      const isUrdu = language === 'ur';
      const categoriesList = getGlobalCategories();
      return (
        <div>
          {/* Categories Top Title & Count */}
          <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: 8 }}>
            <h2 style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0f172a', fontFamily: "'Poppins', sans-serif" }}>
              {translate(langData, "categoriesLabel")}
            </h2>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#059669', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '2px 8px', whiteSpace: 'nowrap' }}>
              {categoriesList.length} Categories &middot; {products.length.toLocaleString()}+ Items
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {categoriesList.map(cat => {
              const catProducts = products.filter(p => p.categoryId === cat.id);
              const count = catProducts.length;
              const meta = CATEGORY_META[cat.id] || { gradient: 'linear-gradient(135deg,#000000,#9b7a00)', icon: null };
              // Find all items in this category that have images
              const imageProducts = catProducts.filter(p => (window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[p.id]) || p.hasImage);
              // Prepare item list for infinite marquee loop (repeat if < 6)
              let marqueeItems = imageProducts;
              if (marqueeItems.length > 0 && marqueeItems.length < 6) {
                while (marqueeItems.length < 6) {
                  marqueeItems = marqueeItems.concat(imageProducts);
                }
              }
              // Standardize max items per track for equal visual balance
              if (marqueeItems.length > 10) {
                marqueeItems = marqueeItems.slice(0, 10);
              }
              const doubleItems = [...marqueeItems, ...marqueeItems];
              // Dynamic uniform speed: 4.2 seconds per item so ALL categories revolve smoothly with perfect lively pace!
              const animSpeed = (marqueeItems.length * 4.2) + 's';
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    triggerHaptic('light');
                    onSelectCategory(cat.id);
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                  }}
                  className="cat-card-container group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#10b981';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(16,185,129,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  }}
                >
                  {/* Top Image Reel Area */}
                  <div className="cat-img-reel-area" style={{ height: 88, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: '#fafbfc' }}>

                    {/* Top Right Item Count Badge */}
                    <div className="cat-count-badge" style={{ position: 'absolute', top: 5, right: 5, zIndex: 20, padding: '2px 6px', borderRadius: 6, fontSize: 8, fontWeight: 800, background: 'rgba(15, 23, 42, 0.82)', backdropFilter: 'blur(4px)', color: '#ffffff', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
                      {count} {translate(langData, "itemsLabel")}
                    </div>

                    {imageProducts.length > 0 ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                        {/* Side Fade Shading for Glassy Framing */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 16, zIndex: 10, pointerEvents: 'none', background: 'linear-gradient(to right, #fafbfc, transparent)' }} />
                        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 16, zIndex: 10, pointerEvents: 'none', background: 'linear-gradient(to left, #fafbfc, transparent)' }} />

                        {/* Infinite Sliding Track */}
                        <div className="cat-marquee-track" style={{ animation: `catSlideTrack ${animSpeed} linear infinite` }}>
                          {doubleItems.map((item, idx) => {
                            const ext = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[item.id];
                            return (
                              <div key={idx} className="cat-img-box">
                                {ext && (
                                  <img
                                    src={getImgUrl(`images/${item.id}.${ext}`)}
                                    alt=""
                                    loading="lazy"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div style={{ opacity: 0.95, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 12, background: meta.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.4)' }}>
                          {meta.icon || '🛍️'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Clean Info Footer */}
                  <div style={{ padding: '6px 6px 8px', background: '#ffffff', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 2, flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <h3 className="cat-card-title" style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        fontFamily: "'Poppins', sans-serif",
                        color: '#0f172a',
                        lineHeight: 1.2,
                        margin: 0,
                        textAlign: 'center',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word'
                      }}>
                        {langData.categories?.[cat.id] || cat.name}
                      </h3>
                    </div>
                    
                    {/* Interactive Action Line — Clean Explore Arrow Only */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 3, paddingTop: 3, borderTop: '1px dashed #f1f5f9' }}>
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <span>{tr(language, 'Explore', 'Dekhein', 'دیکھیں')}</span>
                        <span style={{ fontSize: '10px' }}>➔</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    function CategoryDropdown({ activeCategory, setActiveCategory, setCatMenuOpen, fullWidth, langData, language }) {
      const categoriesList = getGlobalCategories();
      return (
        <div
          className={`absolute mt-2 ${fullWidth ? "w-full" : "w-64 right-0"} backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-40 max-h-80 overflow-y-auto border`}
          style={{ background: 'rgba(9,9,13,0.97)', borderColor: 'rgba(0,0,0,0.12)' }}
        >
          <button
            onClick={() => {
              setActiveCategory("all");
              setCatMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center justify-between border-b"
            style={{
              borderColor: 'rgba(0,0,0,0.12)',
              color: activeCategory === "all" ? '#000000' : 'rgba(0,0,0,0.7)',
              background: activeCategory === "all" ? 'rgba(0,0,0,0.12)' : 'transparent'
            }}
          >
            <span>{tr(language, 'All Categories', 'Tamam Categories', 'تمام کیٹیگریز')}</span>
            {activeCategory === "all" && <span style={{ color: '#000000' }}>✓</span>}
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setCatMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-xs font-semibold transition-colors flex items-center justify-between border-b"
              style={{
                borderColor: 'rgba(0,0,0,0.12)',
                color: activeCategory === cat.id ? '#000000' : 'rgba(0,0,0,0.7)',
                background: activeCategory === cat.id ? 'rgba(0,0,0,0.12)' : 'transparent'
              }}
            >
              <span>{langData.categories?.[cat.id] || cat.name}</span>
              {activeCategory === cat.id && <span style={{ color: '#000000' }}>✓</span>}
            </button>
          ))}
        </div>
      );
    }
      // -----------------------------------------------------------------------------
    function ProductCard({ product, onAddToCart, langData, language, onSelectProduct, isWishlisted, onToggleWishlist }) {
      const [isAdded, setIsAdded] = useState(false);
      const isUrdu = language === 'ur';
      const pricing = useMemo(() => getProductPricing(product), [product]);
      const handleAdd = (e) => {
        e.stopPropagation();
        onAddToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 900);
      };
      const hasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id];
      const imageSrc = hasFile ? getImgUrl(`images/${product.id}.${window.PRODUCT_IMAGE_MAP[product.id]}`) : null;
      return (
        <div
          onClick={() => onSelectProduct && onSelectProduct(product)}
          className="product-card group bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg relative overflow-hidden"
        >
          {/* Discount Badge */}
          {pricing.hasDiscount && (
            <span className="absolute top-2 left-2 z-10 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1 uppercase tracking-wider">
              <span>🔥</span>
              <span>{pricing.discountPercent}% OFF</span>
            </span>
          )}
          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleWishlist) onToggleWishlist(product);
            }}
            className={`absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
              isWishlisted
                ? 'bg-rose-50 border border-rose-200 text-rose-600 scale-105'
                : 'bg-white/90 backdrop-blur-xs border border-gray-200 text-gray-400 hover:text-rose-500 hover:border-rose-200'
            }`}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <svg className="w-3.5 h-3.5" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isWishlisted ? '0' : '2'} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
          {/* Product Image Box */}
          <div className="product-image-box h-32 sm:h-40 w-full bg-gray-50 rounded-xl p-2 mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-amber-50/30 transition-colors">
            {hasFile ? (
              <img
                src={imageSrc}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white text-xl font-bold shadow-inner`}>
                {product.initial || 'P'}
              </div>
            )}
          </div>
          {/* Product Info */}
          <div className="flex flex-col flex-1">
            <h4 className="product-name font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-snug mb-1 group-hover:text-black transition-colors">
              {getProductDisplayName(product, language)}
            </h4>
            {/* Price & Savings Display */}
            {pricing.hasDiscount ? (
              <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="product-price-text font-black text-sm sm:text-base text-gray-950">
                    {translate(langData, 'priceLabel', { amount: pricing.sellingPrice.toLocaleString() })}
                  </span>
                  <span className="text-[11px] sm:text-xs text-gray-400 line-through font-semibold">
                    Rs. {pricing.retailPrice.toLocaleString()}
                  </span>
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-emerald-700 flex items-center gap-1 flex-wrap">
                  <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200">
                    {tr(language, `Save Rs ${pricing.savings.toLocaleString()}`, `Bachat: Rs ${pricing.savings.toLocaleString()}`, `بچت: Rs ${pricing.savings.toLocaleString()}`)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="product-price-text font-extrabold text-sm sm:text-base" style={{ color: '#000000' }}>
                {translate(langData, 'priceLabel', { amount: product.price.toLocaleString() })}
              </p>
            )}
            <button
              onClick={handleAdd}
              className="product-add-btn mt-auto w-full py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              style={{
                background: isAdded ? '#16a34a' : '#111111',
                border: `1px solid ${isAdded ? '#15803d' : '#111111'}`,
                color: '#ffffff',
                boxShadow: isAdded ? '0 8px 18px rgba(22,163,74,0.24)' : '0 6px 14px rgba(0,0,0,0.16)',
                transform: 'translateY(0)'
              }}
              onMouseEnter={e => { if (!isAdded) { e.currentTarget.style.background='#1f2937'; e.currentTarget.style.borderColor='#1f2937'; e.currentTarget.style.transform='translateY(-1px)'; }}}
              onMouseLeave={e => { if (!isAdded) { e.currentTarget.style.background='#111111'; e.currentTarget.style.borderColor='#111111'; e.currentTarget.style.transform='translateY(0)'; }}}
            >
              {isAdded ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  {translate(langData, "added")}
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  {translate(langData, "addToCart")}
                </>
              )}
            </button>
          </div>
        </div>
      );
    }
      // -----------------------------------------------------------------------------
    function CartDrawer({ open, cart, cartTotal, langData, language, onClose, onUpdateQty, onRemove, onCheckout, onSelectProduct }) {
      const [deleteConfirm, setDeleteConfirm] = React.useState(null);
      const isUrdu = language === 'ur';
      const totalSavings = useMemo(() => {
        return cart.reduce((sum, { product, qty }) => {
          const pricing = getProductPricing(product);
          const bulk = calculateBulkPricing(product.price, qty);
          const normalSavings = pricing.hasDiscount ? pricing.savings * qty : 0;
          return sum + normalSavings + bulk.extraSavings;
        }, 0);
      }, [cart]);
      useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
      }, [open]);
      function handleMinusClick(productId, qty, variant = null) {
        if (qty === 1) {
          setDeleteConfirm({ id: productId, variant });
        } else {
          onUpdateQty(productId, -1, variant);
        }
      }
      function confirmDelete() {
        if (deleteConfirm) { onRemove(deleteConfirm.id, deleteConfirm.variant); setDeleteConfirm(null); }
      }
      return (
        <>
          {/* Backdrop */}
          <div
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              opacity: open ? 1 : 0,
              pointerEvents: open ? 'auto' : 'none',
              transition: 'opacity 0.3s'
            }}
          />
          {/* Drawer */}
          <div
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '100%', maxWidth: '420px',
              zIndex: 51,
              background: '#ffffff',
              borderLeft: '1px solid rgba(0,0,0,0.12)',
              boxShadow: '-8px 0 60px rgba(0,0,0,0.8)',
              transform: open ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
              display: 'flex', flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg style={{ width: 22, height: 22, color: '#000000' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000000', fontFamily: "'Poppins',sans-serif" }}>{translate(langData, "cartTitle")}</span>
                {cart.length > 0 && (
                  <span style={{ background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 20, padding: '1px 10px', fontSize: 11, fontWeight: 700, color: '#000000' }}>
                    {cart.reduce((s,i)=>s+i.qty,0)} {translate(langData, "itemsLabel")}
                  </span>
                )}
              </div>
              <button onClick={onClose} style={{ background: '#f3f4f6', border: '1px solid rgba(0,0,0,0.28)', borderRadius: 10, padding: '6px', color: '#111111', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.12)' }}
                onMouseEnter={e=>e.currentTarget.style.color='#000000'}
                onMouseLeave={e=>e.currentTarget.style.color='#111111'}
              >
                <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {cart.length > 0 && (
                <div style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 14, background: cartTotal >= 2000 ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #fffbe6 0%, #fef3c7 100%)', border: cartTotal >= 2000 ? '1px solid #bbf7d0' : '1px solid #fde68a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, color: cartTotal >= 2000 ? '#166534' : '#92400e' }}>
                    <span style={{ fontSize: 16 }}>🚚</span>
                    <span>{cartTotal >= 2000 ? tr(language, '🎉 Mubarak! Free Delivery Unlocked!', '🎉 Mubarak! Free Delivery Unlocked!', '🎉 مبارک! مفت ڈیلیوری فعال ہو گئی!') : tr(language, `Free Delivery on Rs 2,000+ (Rs ${(2000 - cartTotal).toLocaleString()} remaining)`, `Rs 2,000+ par Free Delivery (Rs ${(2000 - cartTotal).toLocaleString()} baqi)`, `Rs. 2,000 پر مفت ڈیلیوری (Rs ${(2000 - cartTotal).toLocaleString()} باقی)`)}</span>
                  </div>
                  <div style={{ marginTop: 8, height: 6, width: '100%', background: 'rgba(0,0,0,0.08)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (cartTotal / 2000) * 100)}%`, background: cartTotal >= 2000 ? '#22c55e' : '#f59e0b', borderRadius: 10, transition: 'width 0.4s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#555', marginTop: 4 }}>
                    <span>🏠 {tr(language, 'Home Delivery Available', 'Home Delivery Dastyab Hai', 'ہوم ڈیلیوری دستیاب')}</span>
                    <span>🏬 {tr(language, 'BS Mart Pickup Free', 'BS Mart Pickup Muft', 'BS Mart پک اپ مفت')}</span>
                  </div>
                </div>
              )}
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 80, color: '#777777' }}>
                  <svg style={{ width: 60, height: 60, margin: '0 auto 16px', color: 'rgba(0,0,0,0.12)' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{translate(langData, "cartEmpty")}</p>
                  <p style={{ fontSize: 12, marginTop: 6, color: '#888888' }}>{translate(langData, "noProducts")}</p>
                  <button onClick={onClose} style={{ marginTop: 20, background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 12, padding: '10px 24px', color: '#000000', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{translate(langData, "continueShopping")}</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cart.map(({ product, qty, variant }) => {
                    const pricing = getProductPricing(product);
                    const bulk = calculateBulkPricing(product.price, qty);
                    return (
                      <div key={`${product.id}-${variant || ''}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 14 }}>
                        {/* Product Thumbnail - Clickable */}
                        <div
                          onClick={() => onSelectProduct && onSelectProduct(product)}
                          style={{ cursor: 'pointer' }}
                          className="shrink-0 transition-transform active:scale-95 relative"
                          title="Click to view product details"
                        >
                          {pricing.hasDiscount && (
                            <span className="absolute -top-1.5 -left-1.5 z-10 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shadow-2xs uppercase">
                              {pricing.discountPercent}%
                            </span>
                          )}
                          {(window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id]) ? (
                            <img
                              src={getImgUrl(`images/${product.id}.${(window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id]) || "png"}`)}
                              onError={(e) => { e.target.onerror = null; }}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-contain bg-black/40 p-1 border border-gray-200 hover:border-gray-300 transition-colors"
                            />
                          ) : (
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                              <span style={{ color: '#1a1a2e', fontWeight: 800, fontSize: 16, fontFamily: "'Poppins',sans-serif" }}>{product.initial}</span>
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            onClick={() => onSelectProduct && onSelectProduct(product)}
                            style={{ cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3, marginBottom: 2, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                            className="hover:text-black hover:underline transition-colors"
                            title="Click to view product details"
                          >
                            {getProductDisplayName(product, language)}
                          </p>
                          {variant && (
                            <div style={{ marginTop: 1, marginBottom: 3 }}>
                              <span style={{ fontSize: 10.5, fontWeight: 800, color: '#92400e', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 6, padding: '2px 7px', display: 'inline-block' }}>
                                🎨 Shade: {variant}
                              </span>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 12, color: '#000000', fontWeight: 700 }}>
                              {translate(langData, "priceLabel", { amount: product.price.toLocaleString() })} &times; {qty}
                            </span>
                            {pricing.hasDiscount && (
                              <span style={{ fontSize: 10, color: '#9ca3af', textDecoration: 'line-through', fontWeight: 600 }}>
                                Rs. {pricing.retailPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
                            <p style={{ display: 'inline-block', fontSize: 11, color: '#111111', background: '#ffffff', border: '1px solid rgba(0,0,0,0.18)', borderRadius: 8, padding: '2px 7px', fontWeight: 800, margin: 0 }}>
                              = {translate(langData, "priceLabel", { amount: bulk.finalTotal.toLocaleString() })}
                            </p>
                            {bulk.extraPercent > 0 && (
                              <span style={{ fontSize: 9.5, color: '#166534', background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: 6, padding: '1px 5px', fontWeight: 800 }}>
                                🎁 +{bulk.extraPercent}% Bulk OFF (-Rs {bulk.extraSavings.toLocaleString()})
                              </span>
                            )}
                            {pricing.hasDiscount && (
                              <span style={{ fontSize: 9.5, color: '#15803d', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 6, padding: '1px 5px', fontWeight: 700 }}>
                                {tr(language, `Save Rs ${(pricing.savings * qty).toLocaleString()}`, `Bachat: Rs ${(pricing.savings * qty).toLocaleString()}`, `بچت: Rs ${(pricing.savings * qty).toLocaleString()}`)}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Smart Qty Controls */}
                        <div style={{ flexShrink: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.12)', borderRadius: 10, padding: '4px 6px', border: '1px solid rgba(0,0,0,0.12)' }}>
                            {/* Left: Trash if qty=1, Minus if qty>1 */}
                            {qty === 1 ? (
                              <button
                                onClick={() => handleMinusClick(product.id, qty, variant)}
                                title="Remove item"
                                style={{ width: 28, height: 28, border: 'none', background: 'rgba(239,68,68,0.12)', color: 'rgba(239,68,68,0.9)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.25)'; e.currentTarget.style.color='#ef4444'; }}
                                onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.12)'; e.currentTarget.style.color='rgba(239,68,68,0.9)'; }}
                              >
                                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => onUpdateQty(product.id, -1, variant)}
                                title="Decrease quantity"
                                style={{ width: 28, height: 28, border: 'none', background: '#ffffff', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontWeight: 900, fontSize: 15, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                              >
                                -
                              </button>
                            )}
                            <span style={{ fontSize: 13, fontWeight: 900, color: '#111827', width: 20, textAlign: 'center' }}>
                              {qty}
                            </span>
                            <button
                              onClick={() => onUpdateQty(product.id, 1, variant)}
                              title="Increase quantity"
                              style={{ width: 28, height: 28, border: 'none', background: '#ffffff', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, fontWeight: 900, fontSize: 15, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div
              onClick={() => setDeleteConfirm(null)}
              style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            >
              <div
                onClick={e => e.stopPropagation()}
                style={{ background: '#fff', borderRadius: 16, padding: '32px 24px 24px', maxWidth: 320, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.55)', textAlign: 'center', position: 'relative' }}
              >
                <button onClick={() => setDeleteConfirm(null)} style={{ position: 'absolute', top: 12, right: 14, background: 'none', border: 'none', fontSize: 18, color: '#aaa', cursor: 'pointer' }}>✕</button>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="26" height="26" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>Are you sure to delete this item?</p>
                <p style={{ fontSize: 12, color: '#888', marginBottom: 24 }}>This item will be removed from your cart.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    style={{ flex: 1, padding: '12px', border: '1.5px solid #ddd', borderRadius: 10, background: '#fff', color: '#444', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.background='#fff'}
                  >Cancel</button>
                  <button
                    onClick={confirmDelete}
                    style={{ flex: 1, padding: '12px', border: 'none', borderRadius: 10, background: '#1a1a2e', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#2d2d50'}
                    onMouseLeave={e => e.currentTarget.style.background='#1a1a2e'}
                  >Delete</button>
                </div>
              </div>
            </div>
          )}            {/* Footer */}
            {cart.length > 0 && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(0,0,0,0.12)', flexShrink: 0 }}>
                {totalSavings > 0 && (
                  <div style={{ marginBottom: 10, padding: '8px 12px', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid #86efac', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>🎉</span>
                      <span>{tr(language, 'Total Savings on this order:', 'Is order par apki kul bachat:', 'اس آرڈر پر آپ کی کل بچت:')}</span>
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 900, color: '#15803d', background: '#ffffff', padding: '2px 8px', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                      Rs. {totalSavings.toLocaleString()}
                    </span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, padding: '13px 14px', background: 'linear-gradient(135deg,#f8fafc 0%,#ffffff 100%)', border: '1px solid rgba(0,0,0,0.16)', borderRadius: 14, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
                  <span style={{ fontSize: 13, color: '#111111', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{translate(langData, "totalBill")}</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', background: '#000000', borderRadius: 12, padding: '5px 12px', fontFamily: "'Poppins',sans-serif", boxShadow: '0 4px 12px rgba(0,0,0,0.18)' }}>{translate(langData, "priceLabel", { amount: cartTotal.toLocaleString() })}</span>
                </div>
                <button
                  onClick={onCheckout}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                    background: 'linear-gradient(135deg,#000000 0%,#000000 100%)',
                    color: '#ffffff', fontSize: 14, fontWeight: 800,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.filter='brightness(1.1)';e.currentTarget.style.boxShadow='0 6px 28px rgba(0,0,0,0.12)';}}
                  onMouseLeave={e=>{e.currentTarget.style.filter='none';e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.12)';} }
                >
                  <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  {translate(langData, "proceedOrder")}
                </button>
              </div>
            )}
          </div>
        </>
      );
    }
    function OrderHistoryModal({ open, orders, langData, language, onClose, onClear, onReorder }) {
      if (!open) return null;
      // Default expand the first (latest) order
      const [expandedId, setExpandedId] = useState(orders.length > 0 ? orders[0].id : null);
      const toggleOrder = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
      };
      return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} className="animate-fade-in">
          <div style={{ width: '100%', maxWidth: 580, maxHeight: '88vh', overflow: 'hidden', background: '#ffffff', borderRadius: 22, border: '1px solid rgba(0,0,0,0.12)', boxShadow: '0 24px 70px rgba(0,0,0,0.45)', display: 'flex', flexDirection: 'column' }}>
            {/* Modal Header */}
            <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fffbeb', border: '1px solid #fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: '#111827', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>{tr(language, 'Order History', 'Order History', '\u0622\u0631\u0688\u0631 \u06c1\u0633\u067c\u0631\u06cc')}</h3>
                  <p style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{tr(language, 'Tap an order card to view full items', 'Order card par click karein aur mukammal tafseel dekhein', '\u06a9\u0644\u06a9 \u06a9\u0631\u06cc\u06ba \u0627\u0648\u0631 \u0645\u06a9\u0645\u0644 \u0622\u0631\u0688\u0631 \u062f\u06cc\u06a9\u06be\u06cc\u06ba')}</p>
                </div>
              </div>
              <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid rgba(0,0,0,0.18)', background: '#f3f4f6', color: '#111827', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Close modal">
                <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {/* Modal Scroll Body */}
            <div style={{ padding: 18, overflowY: 'auto' }}>
              {orders.length === 0 ? (
                <div style={{ padding: '44px 18px', textAlign: 'center', background: '#f9fafb', border: '1px dashed #d1d5db', borderRadius: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#9ca3af' }}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 900, color: '#111827', margin: 0 }}>{tr(language, 'No saved orders yet', 'Abhi koi order save nahi hai', '\u0627\u0628\u06be\u06cc \u06a9\u0648\u0626\u06cc \u0622\u0631\u0688\u0631 \u0645\u062d\u0641\u0648\u0638 \u0646\u06c1\u06cc\u06ba')}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', marginTop: 6 }}>{tr(language, 'Your placed orders will appear here automatically.', 'Apka agla order yahan khud ba khud show hoga.', '\u0622\u067e \u06a9\u0627 \u0627\u06af\u0644\u0627 \u0622\u0631\u0688\u0631 \u06cc\u06c1\u0627\u06ba \u0646\u0630\u0631 \u0622\u0624 \u06af\u0627')}</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {orders.map((order, idx) => {
                    const isExpanded = expandedId === order.id;
                    const totalItemsCount = order.items ? order.items.reduce((acc, item) => acc + (item.qty || 1), 0) : 0;
                    const itemsSummaryNames = order.items ? order.items.slice(0, 2).map(i => toTitleCase(i.name)).join(', ') + (order.items.length > 2 ? ` +${order.items.length - 2} more` : '') : '';
                    return (
                      <div key={order.id} style={{ border: isExpanded ? '1.5px solid #111827' : '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', background: '#ffffff', boxShadow: isExpanded ? '0 10px 25px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)', transition: 'all 0.2s ease' }}>
                        {/* Collapsible Header Bar (Clickable) */}
                        <div
                          onClick={() => toggleOrder(order.id)}
                          style={{ padding: '14px 16px', background: isExpanded ? '#f8fafc' : '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: isExpanded ? '#111827' : '#f3f4f6', color: isExpanded ? '#ffffff' : '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, flexShrink: 0 }}>
                              #{orders.length - idx}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 13, fontWeight: 900, color: '#111827' }}>#{order.id}</span>
                                <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 12, background: order.deliveryMethod === 'pickup' ? '#eff6ff' : '#f0fdf4', color: order.deliveryMethod === 'pickup' ? '#1d4ed8' : '#15803d', border: `1px solid ${order.deliveryMethod === 'pickup' ? '#bfdbfe' : '#bbf7d0'}` }}>
                                  {order.deliveryMethod === 'pickup' ? tr(language, 'Store Pickup', 'Dukan se Pickup', '\u0627\u0633\u067c\u0648\u0631 \u067e\u06a9 \u0627\u067e') : tr(language, 'Home Delivery', 'Home Delivery', '\u06c1\u0648\u0645 \u0688\u0644\u06cc\u0648\u0631\u06cc')}
                                </span>
                              </div>
                              <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                                  <span>{order.dateText}</span>
                                </div>
                                <span style={{ color: '#d1d5db' }}>\u2022</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                  <span>{totalItemsCount} {totalItemsCount === 1 ? tr(language, 'item', 'cheez', 'آئٹم') : tr(language, 'items', 'cheezein', 'اشیاء')}</span>
                                </div>
                              </div>
                              {!isExpanded && (
                                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '240px' }}>
                                  {itemsSummaryNames}
                                </p>
                              )}
                            </div>
                          </div>
                          {/* Right Side: Total Amount & Expand Arrow */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: 15, fontWeight: 900, color: '#111827' }}>Rs {Number(order.grandTotal || 0).toLocaleString()}</div>
                              <span style={{ fontSize: 10, fontWeight: 700, color: isExpanded ? '#2563eb' : '#9ca3af' }}>
                                {isExpanded ? tr(language, 'Collapse ▲', 'Band Karein ▲', '\u0628\u0646\u062f \u06a9\u0631\u06cc\u06ba \u25b2') : tr(language, 'View Details ▼', 'Tafseel Dekhein ▼', '\u062a\u0641\u0635\u06cc\u0644 \u062f\u06cc\u06a9\u06be\u06cc\u06ba \u25bc')}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* Collapsible Content Body */}
                        {isExpanded && (
                          <div style={{ borderTop: '1px solid #e5e7eb', background: '#ffffff', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div style={{ padding: 12, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                              <div style={{ fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <svg className="w-4 h-4 text-slate-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                                <span>{order.customer?.name} ({order.customer?.phone})</span>
                              </div>
                              {order.customer?.address && (
                                <div style={{ color: '#64748b', fontSize: 11, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                  <svg className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                                  <span>{order.customer.address}</span>
                                </div>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              <p style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                                {tr(language, 'Itemized Receipt:', 'Ashya ki List (Receipt):', '\u0627\u0634\u06cc\u0622 \u06a9\u06cc \u0641\u06c1\u0631\u0633\u067c:')}
                              </p>
                              {order.items && order.items.map(item => {
                                const hasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[item.id];
                                const imgSrc = hasFile ? getImgUrl(`images/${item.id}.${window.PRODUCT_IMAGE_MAP[item.id]}`) : (item.imageExt ? getImgUrl(`images/${item.id}.${item.imageExt}`) : null);
                                return (
                                  <div key={`${order.id}-${item.id}`} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', alignItems: 'center', gap: 12, padding: '6px 0', borderBottom: '1px border-dashed #f1f5f9' }}>
                                    {imgSrc ? (
                                      <img src={imgSrc} alt={item.name} style={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 8, background: '#f8fafc', border: '1px solid #e2e8f0' }} />
                                    ) : (
                                      <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#475569' }}>{item.initial || 'S'}</div>
                                    )}
                                    <div style={{ minWidth: 0 }}>
                                      <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{toTitleCase(item.name || '')}</div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                                        <span style={{ fontSize: 11, color: '#64748b' }}>Qty {item.qty} x Rs {Number(item.price || 0).toLocaleString()}</span>
                                        {item.extraPercent > 0 && (
                                          <span style={{ fontSize: 10, fontWeight: 800, color: '#166534', background: '#dcfce7', padding: '1px 6px', borderRadius: 4 }}>
                                            🎁 -{item.extraPercent}% Bulk OFF (-Rs {Number(item.extraSavings).toLocaleString()})
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <div style={{ fontSize: 13, color: '#0f172a', fontWeight: 900 }}>Rs {Number(item.total || ((item.price || 0) * (item.qty || 1))).toLocaleString()}</div>
                                  </div>
                                );
                              })}
                            </div>
                            <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, border: '1px solid #f1f5f9' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                <span>Subtotal</span>
                                <span>Rs {Number(order.subtotal || 0).toLocaleString()}</span>
                              </div>
                              {(order.totalSavings || (order.items || []).reduce((acc, it) => acc + (it.extraSavings || 0), 0)) > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534', fontWeight: 700 }}>
                                  <span>🎁 Total Bulk Discount Saved</span>
                                  <span>-Rs {Number(order.totalSavings || (order.items || []).reduce((acc, it) => acc + (it.extraSavings || 0), 0)).toLocaleString()}</span>
                                </div>
                              )}
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                <span>Delivery Fee</span>
                                <span>{order.deliveryFee === 0 ? 'FREE' : `Rs ${order.deliveryFee}`}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, color: '#0f172a', fontSize: 14, paddingTop: 4, borderTop: '1px solid #e2e8f0', marginTop: 2 }}>
                                <span>Total Paid</span>
                                <span style={{ color: '#16a34a' }}>Rs {Number(order.grandTotal || 0).toLocaleString()}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  triggerHaptic('success');
                                  if (onReorder) onReorder(order.items);
                                }}
                                style={{ flex: 1, minWidth: 150, padding: '10px 14px', borderRadius: 12, background: '#0f172a', color: '#ffffff', fontSize: 12, fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 12px rgba(15,23,42,0.2)' }}
                                className="hover:bg-black transition-all active:scale-95 cursor-pointer"
                              >
                                <span>🔄</span>
                                <span>{tr(language, 'Re-order All Items', 'Dobara Mangwayein (Re-order)', 'دوبارہ منگوائیں (Re-order)')}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => generatePDFReceipt(order, language)}
                                style={{ padding: '10px 14px', borderRadius: 12, background: '#f8fafc', color: '#0f172a', fontSize: 12, fontWeight: 800, border: '1px solid #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                className="hover:bg-slate-200 transition-all active:scale-95 cursor-pointer"
                              >
                                <span>🧾</span>
                                <span>{tr(language, 'Print / PDF Bill', 'PDF Bill Print Karein', 'بل پرنٹ کریں')}</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {orders.length > 0 && (
              <div style={{ padding: '14px 18px', borderTop: '1px solid #e5e7eb', background: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 700 }}>{orders.length} {tr(language, orders.length === 1 ? 'order saved' : 'orders saved', orders.length === 1 ? 'order save hua' : 'orders save hue', orders.length === 1 ? 'آرڈر محفوظ' : 'آرڈرز محفوظ')}</span>
                <button onClick={onClear} style={{ border: '1px solid #fecaca', background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '8px 14px', fontSize: 11, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {tr(language, 'Clear History', 'History Saaf Karein', 'ہسٹری صاف کریں')}
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
    function CheckoutModal({ cart, cartTotal, langData, language, saveOrderHistory, clearCart, onClose, onBack }) {
      const [name, setName] = useState("");
      const [phone, setPhone] = useState("");
      const [address, setAddress] = useState("");
      const [deliveryMethod, setDeliveryMethod] = useState("home");
      const [errors, setErrors] = useState({});
      const [placing, setPlacing] = useState(false);
      const [success, setSuccess] = useState(false);
      const [placedOrder, setPlacedOrder] = useState(null);
      const [waUrlState, setWaUrlState] = useState("");
      const isUrdu = language === 'ur';
      useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
      }, []);
      const deliveryFee = deliveryMethod === 'pickup' ? 0 : (cartTotal >= 2000 ? 0 : 150);
      const grandTotal = cartTotal + deliveryFee;
      function validate() {
        const e = {};
        if (!name.trim()) e.name = translate(langData, "validationName") || 'Name is required';
        if (!phone.trim()) e.phone = translate(langData, "validationPhone") || 'Phone number is required';
        else if (!/^[0-9]{10,11}$/.test(phone.replace(/\s/g,''))) e.phone = translate(langData, "validationPhone") || 'Enter valid 10-11 digit number';
        if (deliveryMethod === 'home' && !address.trim()) e.address = translate(langData, "validationAddress") || 'Address is required';
        return e;
      }
      function handleOrder() {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setPlacing(true);
        const totalBulkSavings = cart.reduce((sum, { product, qty }) => {
          const bulk = calculateBulkPricing(product.price, qty);
          return sum + (bulk.extraSavings || 0);
        }, 0);
        const itemLines = cart.map(({ product, qty, variant }) => {
          const bulk = calculateBulkPricing(product.price, qty);
          const shadeText = variant ? `\n   🎨 Shade / Colour: ${variant}` : '';
          const bulkText = bulk.extraPercent > 0 ? `\n   🎁 Extra Bulk Discount (${bulk.extraPercent}% OFF): -Rs ${bulk.extraSavings.toLocaleString()} (Effective: Rs ${Math.round(bulk.finalTotal / qty)}/pc)` : '';
          return `• ${product.name}${shadeText}\n   Qty: ${qty}  |  Rate: Rs ${product.price.toLocaleString()}  |  Total: Rs ${bulk.finalTotal.toLocaleString()}${bulkText}`;
        }).join('\n\n');
        const deliveryText = deliveryMethod === 'pickup'
          ? '🏪 Store Pickup (BS Mart Shop)\n  ⏱️ Pickup Time: Ready in 20 Mins to 1 Hour'
          : `🚚 Home Delivery (${deliveryFee === 0 ? 'FREE Delivery' : 'Rs 150 Delivery Fee'})`;
        const bulkSavingsSummary = totalBulkSavings > 0 ? `\n*🎁 Total Bulk Discount Saved:* -Rs ${totalBulkSavings.toLocaleString()}` : '';
        const msg = [
          '🛒 *NEW ORDER – Sahil Traders*',
          '-----------------------------------------',
          '',
          '*📦 ORDER DETAILS:*',
          itemLines,
          '',
          '-----------------------------------------',
          `*Subtotal:* Rs ${cartTotal.toLocaleString()}${bulkSavingsSummary}`,
          `*Delivery:* ${deliveryText}`,
          `*💰 TOTAL BILL: Rs ${grandTotal.toLocaleString()}*`,
          '-----------------------------------------',
          '',
          '*👤 CUSTOMER INFO:*',
          `• Name: ${name.trim()}`,
          `• Phone: ${phone.trim()}`,
          deliveryMethod === 'home' 
            ? `• Delivery Address: ${address.trim()}` 
            : `• Store Location: BS Mart Shop (Muhammad Zubair Moin & Sahil Saleem)\n  ⏱️ Note: Order will be ready for pickup in 20 mins to 1 hour`,
          '',
          '-----------------------------------------',
          `📅 Date: ${new Date().toLocaleDateString('en-PK', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}`
        ].join('\n');
        const waUrl = buildWhatsAppUrl('923368945775', msg);
        const orderDate = new Date();
        const orderRecord = {
          id: `${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}${String(orderDate.getDate()).padStart(2, '0')}-${String(orderDate.getHours()).padStart(2, '0')}${String(orderDate.getMinutes()).padStart(2, '0')}${String(orderDate.getSeconds()).padStart(2, '0')}`,
          dateText: orderDate.toLocaleDateString('en-PK', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }),
          customer: { name: name.trim(), phone: phone.trim(), address: address.trim() },
          deliveryMethod,
          subtotal: cartTotal,
          totalSavings: totalBulkSavings,
          deliveryFee,
          grandTotal,
          items: cart.map(({ product, qty, variant }) => {
            const bulk = calculateBulkPricing(product.price, qty);
            return {
              id: product.id,
              name: product.name,
              price: product.price,
              qty,
              variant: variant || null,
              extraPercent: bulk.extraPercent,
              extraSavings: bulk.extraSavings,
              total: bulk.finalTotal,
              initial: product.initial,
              imageExt: window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id] ? window.PRODUCT_IMAGE_MAP[product.id] : null
            };
          })
        };
        try {
          window.open(waUrl, '_blank');
        } catch (err) {}
        if (typeof saveOrderHistory === 'function') {
          saveOrderHistory(orderRecord);
        }
        if (typeof clearCart === 'function') {
          clearCart();
        }
        setWaUrlState(waUrl);
        setPlacedOrder(orderRecord);
        setPlacing(false);
        setSuccess(true);
      }
      const inputStyle = (hasErr) => ({
        width: '100%', boxSizing: 'border-box',
        padding: '13px 15px', borderRadius: 12,
        border: `1px solid ${hasErr ? 'rgba(239,68,68,0.65)' : 'rgba(0,0,0,0.18)'}`,
        background: '#ffffff',
        color: '#111827', fontSize: 14,
        outline: 'none', caretColor: '#000000',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
        transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s'
      });
      return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
          <div style={{ width: '100%', maxWidth: 500, background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 24, boxShadow: '0 24px 80px rgba(0,0,0,0.9)', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {success && placedOrder ? (
              <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }} className="animate-fade-in">
                <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid #bbf7d0', borderRadius: 20, padding: '20px 16px' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: '0 8px 20px rgba(22,163,74,0.3)' }}>
                    <svg style={{ width: 32, height: 32 }} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  </div>
                  <h3 style={{ fontSize: 19, fontWeight: 900, color: '#14532d', margin: 0 }}>
                    {tr(language, 'Thank You! Order Placed! 🎉', 'Mubarak! Order Kamiyabi se Bhej Diya Gaya! 🎉', '\u0622\u0631\u0688\u0631 \u06a9\u0627\u0645\u06cc\u0627\u0628\u06cc \u0633\u06d2 \u0645\u062d\u0641\u0648\u0638 \u06c1\u0648 \u06af\u06cc\u0627!')}
                  </h3>
                  <p style={{ fontSize: 12, color: '#166534', fontWeight: 700, margin: '4px 0 0' }}>
                    {tr(language, 'Your order receipt is saved below and sent to WhatsApp.', 'Apka order hamare system mein save ho chuka hai aur WhatsApp par bhej diya gaya hai.', '\u0622\u067e \u06a9\u0627 \u0622\u0631\u0688\u0631 \u06c1\u0645\u0627\u0631\u06d2 \u0633\u0633\u067c\u0645 \u0645\u06cc\u06ba \u0645\u062d\u0641\u0648\u0638 \u06c1\u0648 \u0686\u06a9\u0627 \u06c1\u06d2')}
                  </p>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ffffff', border: '1px solid #86efac', borderRadius: 10, padding: '4px 12px', marginTop: 10, fontSize: 12, fontWeight: 900, color: '#166534' }}>
                    <span>{tr(language, 'Order Ref #:', 'Order Ref #:', 'آرڈر ریفرنس نمبر:')}</span>
                    <span style={{ color: '#111827' }}>#{placedOrder.id}</span>
                  </div>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 18, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                        <span>{placedOrder.customer.name} ({placedOrder.customer.phone})</span>
                      </div>
                      {placedOrder.customer.address && (
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                          <span>{placedOrder.customer.address}</span>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 900, padding: '3px 8px', borderRadius: 8, background: placedOrder.deliveryMethod === 'pickup' ? '#eff6ff' : '#f0fdf4', color: placedOrder.deliveryMethod === 'pickup' ? '#1d4ed8' : '#15803d', border: `1px solid ${placedOrder.deliveryMethod === 'pickup' ? '#bfdbfe' : '#bbf7d0'}` }}>
                      {placedOrder.deliveryMethod === 'pickup' ? tr(language, 'Store Pickup', 'Dukan se Pickup', '\u0627\u0633\u067c\u0648\u0631 \u067e\u06a9 \u0627\u067e') : tr(language, 'Home Delivery', 'Home Delivery', '\u06c1\u0648\u0645 \u0688\u0644\u06cc\u0648\u0631\u06cc')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 150, overflowY: 'auto' }}>
                    {placedOrder.items.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, fontSize: 12 }}>
                        <div style={{ minWidth: 0 }}>
                          <span style={{ fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{toTitleCase(item.name)}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                            {item.variant && (
                              <span style={{ fontSize: 10, fontWeight: 800, color: '#92400e', background: '#fef3c7', padding: '1px 5px', borderRadius: 4, display: 'inline-block', marginTop: 1 }}>
                                Shade: {item.variant}
                              </span>
                            )}
                            {item.extraPercent > 0 && (
                              <span style={{ fontSize: 9.5, fontWeight: 800, color: '#166534', background: '#dcfce7', padding: '1px 5px', borderRadius: 4, display: 'inline-block', marginTop: 1 }}>
                                🎁 -{item.extraPercent}% Bulk OFF (-Rs {Number(item.extraSavings).toLocaleString()})
                              </span>
                            )}
                          </div>
                        </div>
                        <span style={{ color: '#475569', fontWeight: 800, whiteSpace: 'nowrap' }}>Qty {item.qty} x Rs {Number(item.price).toLocaleString()} = <span style={{ color: '#0f172a' }}>Rs {Number(item.total).toLocaleString()}</span></span>
                      </div>
                    ))}
                  </div>
                  {(placedOrder.totalSavings || 0) > 0 && (
                    <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#166534', fontWeight: 800 }}>
                      <span>🎁 Total Bulk Discount Saved:</span>
                      <span>-Rs {Number(placedOrder.totalSavings).toLocaleString()}</span>
                    </div>
                  )}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 900, fontSize: 13 }}>
                    <span style={{ color: '#334155' }}>{tr(language, 'Total Bill Amount:', 'Kul Bill Amount:', 'کل بل کی رقم:')}</span>
                    <span style={{ color: '#16a34a', fontSize: 17 }}>Rs {Number(placedOrder.grandTotal).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ padding: '10px 12px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 12, fontSize: 11, color: '#92400e', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg style={{ width: 18, height: 18, color: '#16a34a', flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  <div>
                    <strong>{tr(language, 'WhatsApp Chat:', 'WhatsApp Chat:', '\u0648\u0627\u067e\u0633 \u0627\u06cc\u067e \u0686\u0627\u067c:')}</strong> {tr(language, 'If chat did not open automatically, click button below.', 'Agar WhatsApp khud ba khud nahi khula to neeche button dabayein.', '\u0627\u06af\u0631 \u0648\u0627\u067e\u0633 \u0627\u06cc\u067e \u062e\u0648\u062f \u0628\u062e\u0648\u062f \u0646\u06c1\u06cc\u06ba \u06a9\u06be\u0644\u0627 \u062a\u0648 \u0646\u06cc\u0686\u06d2 \u0628\u067c\u0646 \u062f\u0628\u0627\u0626\u06cc\u06ba\u06d5')}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {waUrlState && (
                    <a
                      href={waUrlState}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: '#25d366', color: '#ffffff', borderRadius: 12, padding: '11px 16px', fontSize: 13, fontWeight: 900, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(37,211,102,0.3)' }}
                    >
                      <svg style={{ width: 18, height: 18 }} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      <span>{tr(language, 'Open WhatsApp Chat', 'WhatsApp par Chat Kholein', '\u0648\u0627\u067e\u0633 \u0627\u06cc\u067e \u067e\u0631 \u0686\u0627\u067c \u06a9\u06be\u0644\u06cc\u06ba')}</span>
                    </a>
                  )}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => saveInvoiceAsImage(placedOrder, language)}
                      style={{ flex: 1, minWidth: 160, background: 'linear-gradient(135deg, #059669, #0d9488)', color: '#ffffff', borderRadius: 12, padding: '11px 14px', fontSize: 13, fontWeight: 900, textAlign: 'center', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 14px rgba(5,150,105,0.35)' }}
                      className="hover:from-emerald-700 hover:to-teal-800 transition-all active:scale-95 cursor-pointer"
                    >
                      <span>📸</span>
                      <span>{tr(language, 'Save to Gallery', 'Gallery Mein Save Karein', 'تصویر محفوظ کریں')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => generatePDFReceipt(placedOrder, language)}
                      style={{ flex: 1, minWidth: 130, background: '#0f172a', color: '#ffffff', borderRadius: 12, padding: '11px 14px', fontSize: 13, fontWeight: 900, textAlign: 'center', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 14px rgba(15,23,42,0.25)' }}
                      className="hover:bg-black transition-all active:scale-95 cursor-pointer"
                    >
                      <span>🖨️</span>
                      <span>{tr(language, 'Print / PDF', 'Print / PDF Bill', 'پی ڈی ایف بل')}</span>
                    </button>
                  </div>
                  <button
                    onClick={onClose}
                    style={{ background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: 12, padding: '11px 16px', fontSize: 12, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    {tr(language, 'Done & Continue Shopping', 'Mukammal Karein (Done)', '\u0645\u06a9\u0645\u0644 \u06a9\u0631\u06cc\u06ba (Done)')}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={onBack} style={{ background: '#f3f4f6', border: '1px solid rgba(0,0,0,0.28)', borderRadius: 10, padding: '6px 10px', color: '#111111', cursor: 'pointer', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.12)' }}>
                      <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                      {translate(langData, "backBtn")}
                    </button>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#000000', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Poppins',sans-serif" }}>{translate(langData, "checkoutTitle")}</span>
                  </div>
                  <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex' }}
                    onMouseEnter={e=>e.currentTarget.style.color='white'}
                    onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}
                  >
                    <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ background: '#f8f9fa', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 16, padding: '14px 16px' }}>
                    <p style={{ fontSize: 11, fontWeight: 900, color: '#111111', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>{translate(langData, "orderSummary")}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
                      {cart.map(({ product, qty, variant }) => {
                        const bulk = calculateBulkPricing(product.price, qty);
                        return (
                          <div key={`${product.id}-${variant || ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                              {(window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id]) ? (
                                <img
                                  src={getImgUrl(`images/${product.id}.${(window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id]) || "png"}`)}
                                  onError={(e) => { e.target.onerror = null; }}
                                  alt={product.name}
                                  className="w-7 h-7 rounded-lg object-contain bg-black/40 p-0.5 shrink-0 border border-gray-200"
                                />
                              ) : (
                                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${product.gradient} flex items-center justify-center shrink-0`}>
                                  <span style={{ color: '#1a1a2e', fontSize: 10, fontWeight: 800 }}>{product.initial}</span>
                                </div>
                              )}
                              <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: 12, color: '#1a1a2e', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{toTitleCase(product.name)}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                                  {variant && (
                                    <span style={{ fontSize: 9.5, fontWeight: 800, color: '#92400e', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 4, padding: '0.5px 4px', display: 'inline-block' }}>
                                      Shade: {variant}
                                    </span>
                                  )}
                                  {bulk.extraPercent > 0 && (
                                    <span style={{ fontSize: 9, fontWeight: 800, color: '#166534', background: '#dcfce7', borderRadius: 4, padding: '0.5px 4px' }}>
                                      🎁 -{bulk.extraPercent}% Bulk OFF
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <span style={{ fontSize: 12, color: '#000000', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>&times; {qty} = {translate(langData, "priceLabel", { amount: bulk.finalTotal.toLocaleString() })}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: 14, padding: '12px 14px', border: '1px solid rgba(0,0,0,0.16)', borderRadius: 14, background: 'linear-gradient(135deg,#ffffff 0%,#f8fafc 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
                      <span style={{ fontSize: 13, color: '#111111', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{translate(langData, "totalBill")}</span>
                      <span style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', background: '#000000', borderRadius: 12, padding: '5px 12px', fontFamily: "'Poppins',sans-serif", boxShadow: '0 4px 12px rgba(0,0,0,0.18)' }}>{translate(langData, "priceLabel", { amount: cartTotal.toLocaleString() })}</span>
                    </div>
                  </div>
                  {/* Delivery Option Selection */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ padding: "10px 12px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#1e40af", fontWeight: 800 }}>
                      <svg className="w-3.5 h-3.5 text-blue-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                      <span>{tr(language, "Notice: Home Delivery is ONLY available within Karachi city.", "Note: Home Delivery SIRF Karachi sheher ke liye dastyab hai.", "\u0646\u0648\u067c\u0633: \u06c1\u0648\u0645 \u0688\u0644\u06cc\u0648\u0631\u06cc \u0635\u0631\u0641 \u06a9\u0631\u0627\u0686\u06cc \u06a9\u06d2 \u0634\u06c1\u0631 \u06a9\u06d2 \u0644\u0626\u06d2 \u062f\u0633\u062a\u06cc\u0627\u0628 \u06c1\u06d2\u06d5")}</span>
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 900, color: '#111111', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{tr(language, 'Delivery Option', 'Delivery Ka Tareeqa', 'ڈلیوری کا طریقہ')}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div 
                        onClick={() => setDeliveryMethod('home')}
                        style={{
                          padding: '12px', borderRadius: 14, border: deliveryMethod === 'home' ? '2px solid #000' : '1px solid #e5e7eb',
                          background: deliveryMethod === 'home' ? '#f9fafb' : '#fff', cursor: 'pointer', textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: 18 }}>🚚</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#111', marginTop: 4 }}>{tr(language, 'Home Delivery', 'Ghar par Delivery', 'ہوم ڈلیوری')}</div>
                        <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{cartTotal >= 2000 ? tr(language, 'FREE', 'FREE (Muft)', 'مفت') : 'Rs 150'}</div>
                      </div>
                      <div 
                        onClick={() => setDeliveryMethod('pickup')}
                        style={{
                          padding: '12px', borderRadius: 14, border: deliveryMethod === 'pickup' ? '2px solid #000' : '1px solid #e5e7eb',
                          background: deliveryMethod === 'pickup' ? '#f9fafb' : '#fff', cursor: 'pointer', textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: 18 }}>🏪</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#111', marginTop: 4 }}>{tr(language, 'Store Pickup', 'Dukan se Pickup', 'دکان سے پک اپ')}</div>
                        <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 700, marginTop: 2 }}>BS Mart (FREE)</div>
                      </div>
                    </div>
                  </div>
                  {/* Customer Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 900, color: '#111111', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{translate(langData, "yourDetails")}</p>
                    <div>
                      <label style={{ fontSize: 12, color: '#444444', fontWeight: 600, display: 'block', marginBottom: 6 }}>{translate(langData, "fullName")}</label>
                      <input
                        type="text" placeholder={translate(langData, "fullNamePlaceholder")}
                        value={name} onChange={e=>{setName(e.target.value);if(errors.name)setErrors(p=>({...p,name:''}))}}
                        style={inputStyle(errors.name)}
                        onFocus={e=>{e.target.style.borderColor='rgba(0,0,0,0.42)';e.target.style.boxShadow='0 0 0 3px rgba(0,0,0,0.08), inset 0 1px 2px rgba(0,0,0,0.04)';}}
                        onBlur={e=>{e.target.style.borderColor=errors.name?'rgba(239,68,68,0.65)':'rgba(0,0,0,0.18)';e.target.style.boxShadow='inset 0 1px 2px rgba(0,0,0,0.04)';}}
                      />
                      {errors.name && <p style={{ color: 'rgba(239,68,68,0.9)', fontSize: 11, marginTop: 4, fontWeight: 600 }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: 12, color: '#444444', fontWeight: 600, display: 'block', marginBottom: 6 }}>{translate(langData, "mobileNumber")}</label>
                      <input
                        type="tel" placeholder="03xxxxxxxxx"
                        value={phone} onChange={e=>{setPhone(e.target.value);if(errors.phone)setErrors(p=>({...p,phone:''}))}}
                        style={inputStyle(errors.phone)}
                        onFocus={e=>{e.target.style.borderColor='rgba(0,0,0,0.42)';e.target.style.boxShadow='0 0 0 3px rgba(0,0,0,0.08), inset 0 1px 2px rgba(0,0,0,0.04)';}}
                        onBlur={e=>{e.target.style.borderColor=errors.phone?'rgba(239,68,68,0.65)':'rgba(0,0,0,0.18)';e.target.style.boxShadow='inset 0 1px 2px rgba(0,0,0,0.04)';}}
                      />
                      {errors.phone && <p style={{ color: 'rgba(239,68,68,0.9)', fontSize: 11, marginTop: 4, fontWeight: 600 }}>{errors.phone}</p>}
                    </div>
                    {deliveryMethod === 'home' ? (
                      <div>
                        <label style={{ fontSize: 12, color: '#444444', fontWeight: 600, display: 'block', marginBottom: 6 }}>{translate(langData, "deliveryAddress")}</label>
                        <textarea
                          placeholder={translate(langData, "addressPlaceholder")}
                          value={address} onChange={e=>{setAddress(e.target.value);if(errors.address)setErrors(p=>({...p,address:''}))}}
                          rows={3}
                          style={{ ...inputStyle(errors.address), resize: 'none', fontFamily: 'inherit' }}
                          onFocus={e=>{e.target.style.borderColor='rgba(0,0,0,0.42)';e.target.style.boxShadow='0 0 0 3px rgba(0,0,0,0.08), inset 0 1px 2px rgba(0,0,0,0.04)';}}
                          onBlur={e=>{e.target.style.borderColor=errors.address?'rgba(239,68,68,0.65)':'rgba(0,0,0,0.18)';e.target.style.boxShadow='inset 0 1px 2px rgba(0,0,0,0.04)';}}
                        />
                        {errors.address && <p style={{ color: 'rgba(239,68,68,0.9)', fontSize: 11, marginTop: 4, fontWeight: 600 }}>{errors.address}</p>}
                      </div>
                    ) : (
                      <div style={{ padding: '14px', borderRadius: 14, background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, color: '#166534' }}>
                          <span style={{ fontSize: 18 }}>⏱️</span>
                          <span>پک اپ کا وقت: 20 منٹ سے 1 گھنٹہ</span>
                        </div>
                        <p style={{ fontSize: 11, color: '#15803d', fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                          آپ کا آرڈر تیار ہونے میں 20 منٹ سے 1 گھنٹہ لگ سکتا ہے۔ اس وقت کے بعد آپ BS Mart اسٹور (محمد زبیر معین / محمد سہیل سلیم) سے اپنا سامان پک اپ کر سکتے ہیں۔
                        </p>
                      </div>
                    )}
                  </div>
                  {/* WhatsApp note */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 12, padding: '12px 14px' }}>
                    <svg style={{ width: 18, height: 18, color: '#25d366', flexShrink: 0, marginTop: 1 }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <p style={{ fontSize: 12, color: '#444444', lineHeight: 1.5 }}>{translate(langData, "whatsappNotice")}</p>
                  </div>
                  {/* Submit */}
                  <button
                    onClick={handleOrder}
                    disabled={placing}
                    style={{
                      width: '100%', padding: '15px', borderRadius: 14, border: 'none',
                      background: placing ? 'rgba(0,0,0,0.12)' : 'linear-gradient(135deg,#25d366 0%,#128C7E 100%)',
                      color: '#1a1a2e', fontSize: 15, fontWeight: 800,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      cursor: placing ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      transition: 'all 0.2s', marginBottom: 4
                    }}
                    onMouseEnter={e=>{if(!placing){e.currentTarget.style.filter='brightness(1.08)';e.currentTarget.style.boxShadow='0 6px 28px rgba(37,211,102,0.45)';}}}
                    onMouseLeave={e=>{e.currentTarget.style.filter='none';e.currentTarget.style.boxShadow='0 4px 20px rgba(37,211,102,0.3)';}}
                  >
                    {placing ? (
                      <>
                        <svg style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                        {translate(langData, "placingOrder")}
                      </>
                    ) : (
                      <>
                        <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        {translate(langData, "placeOrderBtn")}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
