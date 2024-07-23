import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { useAuth } from '../hooks/useAuth';
import 'bootstrap/dist/css/bootstrap.min.css';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      try {
        const response = await axios.get('/users', {
          headers: {
            'x-access-token': token,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        if (error.response && error.response.status === 401) {
          window.location.href = '/login';
        }
      }
    };
  
    fetchUsers();
  }, []);

  const handleBlockUser = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`/users/${id}/block`, null, {
        headers: {
          'x-access-token': token,
        },
      });
      setUsers(users.map((u) => (u.id === id ? { ...u, status: 'blocked' } : u)));
    } catch (error) {
      console.error('Error blocking user:', error);
    }
  };
  
  const handleUnblockUser = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(`/users/${id}/unblock`, null, {
        headers: {
          'x-access-token': token,
        },
      });
      setUsers(users.map((u) => (u.id === id ? { ...u, status: 'active' } : u)));
    } catch (error) {
      console.error('Error unblocking user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`/users/${id}`, {
        headers: {
          'x-access-token': localStorage.getItem('token'),
        },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.clear();
  };

  const handleHeaderCheckboxChange = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    const updatedUsers = users.map(user => ({ ...user, selected: checked }));
    setUsers(updatedUsers);
  };

  const handleRowCheckboxChange = (id, event) => {
    const checked = event.target.checked;
    const updatedUsers = users.map(user => (user.id === id ? { ...user, selected: checked } : user));
    setUsers(updatedUsers);

    const allSelected = updatedUsers.every(user => user.selected);
    setSelectAll(allSelected);
  };

  const handleBulkAction = async (action) => {
    const selectedUsers = users.filter(user => user.selected);
    for (const user of selectedUsers) {
      try {
        if (action === 'block') {
          await handleBlockUser(user.id);
        } else if (action === 'unblock') {
          await handleUnblockUser(user.id);
        } else if (action === 'delete') {
          await handleDeleteUser(user.id);
        }
      } catch (error) {
        console.error(`Error performing ${action} action on user ${user.id}:`, error);
      }
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      <div className="toolbar mb-3">
        <button 
          className="btn btn-danger me-2" 
          onClick={() => handleBulkAction('block')}
        >
          Block
        </button>
        <button 
          className="btn btn-secondary me-2" 
          onClick={() => handleBulkAction('unblock')}
        >
          <i className="bi bi-unlock"></i> Unblock
        </button>
        <button 
          className="btn btn-danger" 
          onClick={() => handleBulkAction('delete')}
        >
          <i className="bi bi-trash"></i> Delete
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                checked={selectAll}
                onChange={handleHeaderCheckboxChange} 
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Registration Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input 
                  type="checkbox" 
                  checked={user.selected || false}
                  onChange={(e) => handleRowCheckboxChange(user.id, e)} 
                />
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.last_login}</td>
              <td>{user.registration_time}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-outline-secondary" onClick={handleLogout}>Logout</button>
    </div>
  );
};
