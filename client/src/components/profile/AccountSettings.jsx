import React from 'react';

export default function AccountSettings({
  accountFormData, setAccountFormData,
  accountMessage, accountError,
  updatingAccount, handleUpdateAccount
}) {
  return (
    <div>
      <div className="profile-section-heading">
        <span>MEMBER SERVICES / 03</span>
        <h1>ACCOUNT SETTINGS</h1>
        <p>Keep your member details current and manage your password securely.</p>
      </div>
      
      <form className="profile-account-form" onSubmit={handleUpdateAccount} style={{ maxWidth: '600px' }}>
        {accountMessage && <div className="profile-message is-success" style={{ padding: '15px', background: '#e6ffdb', border: '1px solid #b7f5a4', color: '#2b7811', marginBottom: '20px' }}>{accountMessage}</div>}
        {accountError && <div className="profile-message is-error" style={{ padding: '15px', background: '#fff0f0', border: '1px solid #ffd0d0', color: '#d32f2f', marginBottom: '20px' }}>{accountError}</div>}
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Display name *</label>
          <input 
            type="text" required 
            value={accountFormData.username} 
            onChange={e => setAccountFormData(prev => ({ ...prev, username: e.target.value }))}
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', background: '#fafafa', fontSize: '14px', boxSizing: 'border-box' }}
          />
          <div style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>This will be how your name will be displayed in the account section and in reviews</div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Email address *</label>
          <input 
            type="email" required 
            value={accountFormData.email} 
            onChange={e => setAccountFormData(prev => ({ ...prev, email: e.target.value }))}
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', background: '#fafafa', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #eaeaea', paddingBottom: '10px', marginBottom: '20px' }}>Password change</h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Current password (leave blank to leave unchanged)</label>
          <input 
            type="password" 
            value={accountFormData.currentPassword} 
            onChange={e => setAccountFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', background: '#fafafa', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>New password (leave blank to leave unchanged)</label>
          <input 
            type="password" 
            value={accountFormData.newPassword} 
            onChange={e => setAccountFormData(prev => ({ ...prev, newPassword: e.target.value }))}
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', background: '#fafafa', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Confirm new password</label>
          <input 
            type="password" 
            value={accountFormData.confirmPassword} 
            onChange={e => setAccountFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', background: '#fafafa', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          className="profile-save-button"
          type="submit" 
          disabled={updatingAccount}
          style={{ background: '#000', color: 'var(--brand-yellow)', border: 'none', padding: '15px 30px', fontWeight: 'bold', textTransform: 'uppercase', cursor: updatingAccount ? 'not-allowed' : 'pointer', width: '100%', boxSizing: 'border-box' }}
        >
          {updatingAccount ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}
