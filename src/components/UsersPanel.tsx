import React, { useState } from 'react';
import { User } from '../types';

export const UsersPanel: React.FC<{ users: User[]; onCreate: (payload: any) => Promise<void>; onToggleActive: (user: User) => Promise<void>; }> = ({ users, onCreate, onToggleActive }) => {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'salesperson' });
  return (
    <div className="stack-lg">
      <div className="panel"><h1>User management</h1><p>Admins can provision operators and control access roles.</p></div>
      <div className="two-col">
        <div className="panel stack-md">
          <h3>Create user</h3>
          {['full_name','email','password'].map((field) => <label key={field}><span>{field.replace('_',' ')}</span><input type={field === 'password' ? 'password' : 'text'} value={(form as any)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} /></label>)}
          <label><span>Role</span><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="admin">Admin</option><option value="warehouse_manager">Warehouse Manager</option><option value="salesperson">Salesperson</option></select></label>
          <button className="primary-btn" onClick={() => onCreate(form)}>Create user</button>
        </div>
        <div className="panel table-panel">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead>
            <tbody>
              {users.map((user) => <tr key={user.id}><td>{user.full_name}</td><td>{user.email}</td><td>{user.role}</td><td><span className={user.is_active ? 'pill success' : 'pill danger'}>{user.is_active ? 'Active' : 'Disabled'}</span></td><td><button className="ghost-btn" onClick={() => onToggleActive(user)}>{user.is_active ? 'Disable' : 'Activate'}</button></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
