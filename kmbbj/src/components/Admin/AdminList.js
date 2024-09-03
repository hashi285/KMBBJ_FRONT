// src/components/Admin/AdminList.js
import React, { useEffect, useState } from 'react';
import { fetchAdmins } from '../../services/Admin/userService';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const data = await fetchAdmins(page);
        setAdmins(data.content);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error loading admins:', error);
      }
    };

    loadAdmins();
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  return (
    <div className="admin-list">
      <h3>관리자 리스트</h3>
      <table>
        <thead>
          <tr>
            <th>닉네임</th> {/* 닉네임이 이메일보다 앞에 오도록 수정 */}
            <th>이메일</th> {/* 이메일을 뒤로 이동 */}
            <th>Is Admin</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id}>
              <td>{admin.nickname}</td> {/* 닉네임을 첫 번째로 표시 */}
              <td>{admin.email}</td> {/* 이메일을 두 번째로 표시 */}
              <td>{admin.authority === 'ROLE_ADMIN' ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 0}>Previous</button>
        <span>Page {page + 1} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page === totalPages - 1}>Next</button>
      </div>
    </div>
  );
};

export default AdminList;
