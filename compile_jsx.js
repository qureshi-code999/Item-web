const fs = require('fs');
const path = require('path');

// Load Babel Standalone in Node
const babelCode = fs.readFileSync('c:/Users/ALICOM4/Desktop/ITEMS WEB/babel.min.js', 'utf8');
const vm = require('vm');
const sandbox = { global: {}, console: console, process: process, Buffer: Buffer, setTimeout: setTimeout, clearTimeout: clearTimeout };
sandbox.window = sandbox;
sandbox.self = sandbox;
vm.createContext(sandbox);
vm.runInContext(babelCode, sandbox);
const Babel = sandbox.Babel;

console.log('Babel loaded successfully, version:', Babel.version);

// Read INDEX.JSX
let jsxCode = fs.readFileSync('c:/Users/ALICOM4/Desktop/ITEMS WEB/INDEX.JSX', 'utf8');

// Strip ES module imports/exports for browser UMD execution
jsxCode = jsxCode.replace(/import\s+React[^\n]*\n/g, '');
jsxCode = jsxCode.replace(/export\s+default\s+function\s+SahilTraders/g, 'function SahilTraders');

// Transform with Babel React preset
const compiled = Babel.transform(jsxCode, {
  presets: ['react'],
  compact: false
}).code;

// Wrap inside an isolated IIFE so no global const / let clashes can ever occur
const output = `// SAHIL TRADERS MASTER APP BUNDLE
(function() {
  'use strict';
  var React = window.React || (typeof React !== 'undefined' ? React : null);
  var ReactDOM = window.ReactDOM || (typeof ReactDOM !== 'undefined' ? ReactDOM : null);
  if (!React) {
    console.error('React not found on window!');
    return;
  }
  const { useState, useMemo, useEffect, useRef } = React;

${compiled}

  window.SahilTraders = SahilTraders;

  // Auto-mount React App safely when DOM is ready
  function mount() {
    var rootEl = document.getElementById('root');
    if (rootEl && !rootEl.__reactRootMounted && typeof ReactDOM !== 'undefined' && ReactDOM.createRoot && typeof SahilTraders !== 'undefined') {
      rootEl.__reactRootMounted = true;
      ReactDOM.createRoot(rootEl).render(React.createElement(SahilTraders));
      console.log('Sahil Traders App mounted successfully via React 18 createRoot!');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
`;

// Save to all target locations cleanly without BOM
const targets = [
  'c:/Users/ALICOM4/Desktop/ITEMS WEB/app.js',
  'c:/Users/ALICOM4/Desktop/ITEMS WEB/www/app.js',
  'c:/Users/ALICOM4/Desktop/ITEMS WEB/android/app/src/main/assets/public/app.js'
];

targets.forEach(target => {
  fs.writeFileSync(target, output, { encoding: 'utf8' });
  const size = fs.statSync(target).size;
  console.log(`Compiled and wrote ${target} (${(size / 1024).toFixed(1)} KB)`);
});
