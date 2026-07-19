$lines = Get-Content -Path 'index.html' -Encoding UTF8
Write-Host "Total lines before: $($lines.Count)"

$adminPortal = @'

    // ── ADMIN PORTAL ──────────────────────────────────────────────────────
    function AdminPortal({ products, onSave, saving, adminSearch, setAdminSearch }) {
      const [localProducts, setLocalProducts] = React.useState(() => products.map(p => ({...p})));
      const [editId, setEditId] = React.useState(null);
      const [editForm, setEditForm] = React.useState({});
      const [addForm, setAddForm] = React.useState({ name: '', price: '', categoryId: 'personalcare' });
      const [showAddForm, setShowAddForm] = React.useState(false);
      const [confirmDelete, setConfirmDelete] = React.useState(null);

      const filtered = localProducts.filter(p =>
        p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
        String(p.id).includes(adminSearch)
      );

      function startEdit(p) {
        setEditId(p.id);
        setEditForm({ name: p.name, price: p.price, categoryId: p.categoryId });
      }

      function saveEdit(id) {
        const updated = localProducts.map(p =>
          p.id === id ? { ...p, name: editForm.name, price: Number(editForm.price), categoryId: editForm.categoryId } : p
        );
        setLocalProducts(updated);
        setEditId(null);
      }

      function deleteProduct(id) {
        const remaining = localProducts.filter(p => p.id !== id);
        const renumbered = remaining.map((p, idx) => ({ ...p, id: idx + 1 }));
        setLocalProducts(renumbered);
        setConfirmDelete(null);
      }

      function addProduct() {
        if (!addForm.name.trim() || !addForm.price) return;
        const newId = localProducts.length > 0 ? Math.max(...localProducts.map(p => p.id)) + 1 : 1;
        const catName = CATEGORIES.find(c => c.id === addForm.categoryId)?.name || addForm.categoryId;
        const newProduct = {
          id: newId,
          name: addForm.name.trim().toUpperCase(),
          price: Number(addForm.price),
          categoryId: addForm.categoryId,
          categoryName: catName
        };
        setLocalProducts(prev => [...prev, newProduct]);
        setAddForm({ name: '', price: '', categoryId: 'personalcare' });
        setShowAddForm(false);
      }

      const inputStyle = {
        background: 'rgba(9,9,13,0.9)',
        border: '1px solid rgba(212,175,55,0.3)',
        borderRadius: '8px',
        color: 'rgba(255,255,255,0.9)',
        padding: '6px 10px',
        fontSize: '13px',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box'
      };
      const catSelectStyle = { ...inputStyle, cursor: 'pointer' };

      return (
        React.createElement('div', { style: { fontFamily: "'Inter', sans-serif" } },
          /* Header Bar */
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' } },
            React.createElement('div', null,
              React.createElement('h2', { style: { color: '#d4af37', fontFamily: "'Poppins', sans-serif", fontSize: '20px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 } }, '\uD83D\uDEE0 Admin Portal'),
              React.createElement('p', { style: { color: 'rgba(212,175,55,0.5)', fontSize: '12px', marginTop: '4px', margin: '4px 0 0 0' } },
                localProducts.length + ' items \u2014 changes yahan save hon ge, phir "Save to Disk" dabayein'
              )
            ),
            React.createElement('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap' } },
              React.createElement('button', {
                onClick: () => setShowAddForm(!showAddForm),
                style: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.5)', background: 'rgba(212,175,55,0.12)', color: '#d4af37', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }
              }, '\u2795 Naya Item Add Karo'),
              React.createElement('button', {
                onClick: () => onSave(localProducts),
                disabled: saving,
                style: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(34,197,94,0.5)', background: saving ? 'rgba(34,197,94,0.05)' : 'rgba(34,197,94,0.15)', color: '#4ade80', fontWeight: '700', fontSize: '13px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }
              }, saving ? '\u23F3 Saving...' : '\uD83D\uDCBE Save to Disk')
            )
          ),
          /* Add New Item Form */
          showAddForm && React.createElement('div', { style: { background: 'rgba(9,9,13,0.95)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '14px', padding: '18px', marginBottom: '18px' } },
            React.createElement('h3', { style: { color: '#d4af37', fontSize: '15px', fontWeight: '700', marginBottom: '14px' } }, '\u2795 Naya Item'),
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' } },
              React.createElement('div', null,
                React.createElement('label', { style: { color: 'rgba(212,175,55,0.6)', fontSize: '11px', display: 'block', marginBottom: '4px', fontWeight: '600' } }, 'ITEM KA NAAM'),
                React.createElement('input', { style: inputStyle, placeholder: 'Jaise: HEAD SHOULDERS 400ML', value: addForm.name, onChange: e => setAddForm(f => ({...f, name: e.target.value})) })
              ),
              React.createElement('div', null,
                React.createElement('label', { style: { color: 'rgba(212,175,55,0.6)', fontSize: '11px', display: 'block', marginBottom: '4px', fontWeight: '600' } }, 'PRICE (Rs.)'),
                React.createElement('input', { style: inputStyle, type: 'number', placeholder: 'Jaise: 250', value: addForm.price, onChange: e => setAddForm(f => ({...f, price: e.target.value})) })
              ),
              React.createElement('div', null,
                React.createElement('label', { style: { color: 'rgba(212,175,55,0.6)', fontSize: '11px', display: 'block', marginBottom: '4px', fontWeight: '600' } }, 'CATEGORY'),
                React.createElement('select', { style: catSelectStyle, value: addForm.categoryId, onChange: e => setAddForm(f => ({...f, categoryId: e.target.value})) },
                  CATEGORIES.map(c => React.createElement('option', { key: c.id, value: c.id, style: {background:'#09090d'} }, c.name))
                )
              ),
              React.createElement('div', { style: { display: 'flex', gap: '8px' } },
                React.createElement('button', { onClick: addProduct, style: { padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.5)', background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontWeight: '700', fontSize: '12px', cursor: 'pointer' } }, 'Add \u2713'),
                React.createElement('button', { onClick: () => setShowAddForm(false), style: { padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontWeight: '700', fontSize: '12px', cursor: 'pointer' } }, 'Cancel')
              )
            )
          ),
          /* Search Box */
          React.createElement('div', { style: { position: 'relative', marginBottom: '16px' } },
            React.createElement('input', {
              style: { ...inputStyle, paddingLeft: '36px', fontSize: '14px' },
              placeholder: 'Item ka naam ya ID search karein...',
              value: adminSearch,
              onChange: e => setAdminSearch(e.target.value)
            }),
            React.createElement('span', { style: { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(212,175,55,0.4)', fontSize: '14px' } }, '\uD83D\uDD0D')
          ),
          /* Products Table */
          React.createElement('div', { style: { background: 'rgba(9,9,13,0.85)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '14px', overflow: 'hidden' } },
            /* Table Header */
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '55px 1fr 1fr 110px 100px', gap: '0', padding: '10px 14px', borderBottom: '1px solid rgba(212,175,55,0.12)', background: 'rgba(212,175,55,0.05)' } },
              ['ID', 'ITEM KA NAAM', 'CATEGORY', 'PRICE (Rs.)', 'ACTIONS'].map(h =>
                React.createElement('span', { key: h, style: { color: 'rgba(212,175,55,0.55)', fontSize: '10px', fontWeight: '800', letterSpacing: '0.1em' } }, h)
              )
            ),
            /* Rows */
            React.createElement('div', { style: { maxHeight: '60vh', overflowY: 'auto' } },
              filtered.length === 0 && React.createElement('div', { style: { textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.25)' } }, 'Koi item nahi mila'),
              filtered.map((p, idx) =>
                React.createElement('div', {
                  key: p.id,
                  style: { display: 'grid', gridTemplateColumns: '55px 1fr 1fr 110px 100px', gap: '0', padding: '10px 14px', borderBottom: '1px solid rgba(212,175,55,0.06)', background: idx % 2 === 0 ? 'transparent' : 'rgba(212,175,55,0.02)', alignItems: 'center' }
                },
                  React.createElement('span', { style: { color: 'rgba(212,175,55,0.4)', fontSize: '12px', fontWeight: '700' } }, '#' + p.id),
                  editId === p.id
                    ? React.createElement('input', { style: { ...inputStyle, fontSize: '12px' }, value: editForm.name, onChange: e => setEditForm(f => ({...f, name: e.target.value})), autoFocus: true })
                    : React.createElement('span', { style: { color: 'rgba(255,255,255,0.85)', fontSize: '12px', fontWeight: '500', paddingRight: '8px' } }, p.name),
                  editId === p.id
                    ? React.createElement('select', { style: { ...catSelectStyle, fontSize: '12px' }, value: editForm.categoryId, onChange: e => setEditForm(f => ({...f, categoryId: e.target.value})) },
                        CATEGORIES.map(c => React.createElement('option', { key: c.id, value: c.id, style: {background:'#09090d'} }, c.name))
                      )
                    : React.createElement('span', { style: { color: 'rgba(255,255,255,0.45)', fontSize: '11px' } }, (CATEGORIES.find(c => c.id === p.categoryId) || {}).name || p.categoryId),
                  editId === p.id
                    ? React.createElement('input', { style: { ...inputStyle, fontSize: '12px' }, type: 'number', value: editForm.price, onChange: e => setEditForm(f => ({...f, price: e.target.value})) })
                    : React.createElement('span', { style: { color: '#d4af37', fontSize: '13px', fontWeight: '700' } }, 'Rs. ' + p.price.toLocaleString()),
                  React.createElement('div', { style: { display: 'flex', gap: '6px', justifyContent: 'flex-end' } },
                    editId === p.id
                      ? React.createElement(React.Fragment, null,
                          React.createElement('button', { onClick: () => saveEdit(p.id), style: { padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.12)', color: '#4ade80', fontSize: '11px', fontWeight: '700', cursor: 'pointer' } }, '\u2713 Save'),
                          React.createElement('button', { onClick: () => setEditId(null), style: { padding: '5px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.35)', fontSize: '11px', cursor: 'pointer' } }, '\u2715')
                        )
                      : confirmDelete === p.id
                        ? React.createElement(React.Fragment, null,
                            React.createElement('button', { onClick: () => deleteProduct(p.id), style: { padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontSize: '11px', fontWeight: '700', cursor: 'pointer' } }, 'Delete?'),
                            React.createElement('button', { onClick: () => setConfirmDelete(null), style: { padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.35)', fontSize: '11px', cursor: 'pointer' } }, 'Cancel')
                          )
                        : React.createElement(React.Fragment, null,
                            React.createElement('button', { onClick: () => startEdit(p), title: 'Edit', style: { padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.08)', color: '#d4af37', cursor: 'pointer', fontSize: '14px' } }, '\u270F\uFE0F'),
                            React.createElement('button', { onClick: () => setConfirmDelete(p.id), title: 'Delete', style: { padding: '5px 8px', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.06)', color: '#f87171', cursor: 'pointer', fontSize: '14px' } }, '\uD83D\uDDD1\uFE0F')
                          )
                  )
                )
              )
            )
          ),
          /* Footer */
          React.createElement('p', { style: { color: 'rgba(212,175,55,0.3)', fontSize: '11px', textAlign: 'center', marginTop: '14px' } },
            'Tip: Changes sirf browser mein hain. Permanent karne ke liye "Save to Disk" dabayein (Admin Portal server chalna chahiye).'
          )
        )
      );
    }
'@

# Insert after line 2541 (0-indexed: 2540)
$before = $lines[0..2540]
$after  = $lines[2541..($lines.Count - 1)]
$fixed = $before + $adminPortal.Split("`n") + $after

Write-Host "Total lines after: $($fixed.Count)"
$fixed | Set-Content -Path 'index.html' -Encoding UTF8
Write-Host "Done. Saved index.html"
