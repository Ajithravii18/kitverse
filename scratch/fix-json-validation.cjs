const fs = require('fs');
let code = fs.readFileSync('client/src/pages/AdminContent.jsx', 'utf8');

const oldSaveDraft = `
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      let parsedValue = draftValue;
      try { parsedValue = JSON.parse(draftValue); } catch(e) {} // auto convert if valid json
`;

const newSaveDraft = `
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      let parsedValue = draftValue;
      try { 
        parsedValue = JSON.parse(draftValue); 
      } catch(e) {
        if (draftValue.trim().startsWith('{') || draftValue.trim().startsWith('[')) {
          throw new Error('Invalid JSON format. Please check your syntax.');
        }
      } 
`;

code = code.replace(oldSaveDraft.trim(), newSaveDraft.trim());

const oldPublish = `
  const handlePublish = async () => {
    setIsSaving(true);
    try {
      let parsedValue = draftValue;
      try { parsedValue = JSON.parse(draftValue); } catch(e) {} // auto convert if valid json
`;

const newPublish = `
  const handlePublish = async () => {
    setIsSaving(true);
    try {
      let parsedValue = draftValue;
      try { 
        parsedValue = JSON.parse(draftValue); 
      } catch(e) {
        if (draftValue.trim().startsWith('{') || draftValue.trim().startsWith('[')) {
          throw new Error('Invalid JSON format. Please check your syntax.');
        }
      }
`;

code = code.replace(oldPublish.trim(), newPublish.trim());

fs.writeFileSync('client/src/pages/AdminContent.jsx', code);
