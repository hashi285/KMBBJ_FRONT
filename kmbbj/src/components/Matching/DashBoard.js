import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/api";
import SearchAndSort from "./SearchAndSort";
import RoomList from "./RoomList";
import Pagination from "./Pagination";
import "../../assets/styles/Matching/RoomList.css";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("roomId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = searchTerm ? "/room/searching" : "/room/list";
      const params = searchTerm
        ? {
            title: searchTerm,
            page: currentPage - 1,
          }
        : {
            isDeleted: false,
            isStarted: false,
            page: currentPage - 1,
            sortField,
            sortDirection: sortOrder,
          };
      const response = await api.post(endpoint, params);
      const { content, totalPages } = response.data.data;
      setRooms(content);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage, sortField, sortOrder]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]); // useCallback에서 반환된 fetchRooms 함수를 의존성 배열에 포함시킵니다.

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSort = (order, field) => {
    setSortOrder(order);
    setSortField(field);
    setCurrentPage(1);
  };

  return (
    <div className="dashboard">
      {error && <p className="error">{error}</p>}
      <SearchAndSort onSearch={handleSearch} onSort={handleSort} />
      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <RoomList rooms={rooms} />
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default Dashboard;