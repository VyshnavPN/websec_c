import React, { useEffect, useState } from 'react';
import { useToolStore } from '../state/useToolStore';
import { getTheme } from '../utils/theme';

export default function Admin() {
  const user = useToolStore((s) => s.user);
  const { primary: themeColor, bg: themeBg, accent, panelBg } = getTheme('audit');
  const [users, setUsers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const token = user?.token;

  useEffect(() => {
    if (!token) return;
    fetch('/api/users', { headers: { token } })
      .then(r => r.json())
      .then(setUsers);
    fetch('/api/suggestions', { headers: { token } })
      .then(r => r.json())
      .then(setSuggestions);
  }, [token]);

  const changeRole = async (username, role) => {
    await fetch('/api/users/role', {
      method: 'POST', headers:{ 'Content-Type':'application/json', token },
      body: JSON.stringify({ username, role })
    });
    setUsers(users.map(u=>u.username===username?{...u,role}:u));
  };

  const deleteSuggestion = async (id) => {
    await fetch('/api/suggestions/delete', {
      method:'POST', headers:{ 'Content-Type':'application/json', token },
      body: JSON.stringify({ id })
    });
    setSuggestions(suggestions.filter(s=>s.id!==id));
  };

  return (
    <div style={{ padding: '3rem', color: '#fff', background: themeBg, minHeight: '100vh', fontFamily:'monospace' }}>
      <h1 style={{ color: themeColor }}>ADMIN PANEL</h1>
      <section style={{ marginTop:'2rem' }}>
        <h2>Users</h2>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr><th>Username</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.username} style={{ borderBottom: `1px solid ${accent}` }}>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>
                  <select value={u.role} onChange={(e)=>changeRole(u.username, e.target.value)}>
                    <option value="user">user</option>
                    <option value="pro">pro</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section style={{ marginTop:'2rem' }}>
        <h2>Suggestions</h2>
        <ul>
          {suggestions.map(s => (
            <li key={s.id} style={{ marginBottom:'0.5rem' }}>
              <strong>{s.username}</strong>: {s.suggestion}{' '}
              <button onClick={() => deleteSuggestion(s.id)} style={{ marginLeft:'1rem', background:themeColor, color:'#000' }}>DELETE</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
