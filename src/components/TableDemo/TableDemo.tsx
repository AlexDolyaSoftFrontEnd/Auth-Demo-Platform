import React, { useState } from "react";
import "./TableDemo.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import { FaTrashAlt } from "react-icons/fa";

const TableDemo: React.FC = () => {
  const [data, setData] = useState([
    { id: 1, name: "Мария Козлова", email: "maria@example.com", role: "Guest", status: "inactive" },
    { id: 2, name: "Дмитрий Волков", email: "dmitry@example.com", role: "User", status: "active" },
    { id: 3, name: "Елена Морозова", email: "elena@example.com", role: "Admin", status: "active" }
  ]);

  // Функция удаления строки
  const handleDelete = (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
      setData(prevData => prevData.filter(row => row.id !== id));
    }
  };

  return (
    <main className="table-layout">
      <Sidebar />

      <div className="table-page">
        <div className="table-wrapper">
          <table className="table">
            <thead className="table__header">
              <tr>
                <th className="table__header-cell">Имя</th>
                <th className="table__header-cell">Email</th>
                <th className="table__header-cell">Роль</th>
                <th className="table__header-cell">Статус</th>
                <th className="table__header-cell">Действия</th>
              </tr>
            </thead>

            <tbody className="table__body">
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id} className="table__row">
                    <td className="table__cell" data-column="Имя">{row.name}</td>
                    <td className="table__cell" data-column="Email">{row.email}</td>
                    <td className="table__cell" data-column="Роль">
                      <span className={`badge badge-${row.role.toLowerCase()}`}>{row.role}</span>
                    </td>
                    <td className="table__cell" data-column="Статус">
                      <span className={`status status-${row.status}`}>
                        {row.status === "active" ? "Активен" : "Неактивен"}
                      </span>
                    </td>
                    <td className="table__cell" data-column="Действия">
                      <button 
                        className="btn-icon btn-delete" 
                        aria-label="Удалить"
                        onClick={() => handleDelete(row.id)}
                        title="Delete"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="table__empty">
                    Нет данных для отображения
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default TableDemo;


// const handleDelete = async (id: number) => {
//   if (window.confirm("Вы уверены, что хотите удалить эту запись?")) {
//     try {
//       // 1. Оптимистичное обновление UI
//       setData(prevData => prevData.filter(row => row.id !== id));
      
//       // 2. Запрос на сервер
//       await fetch(`/api/users/${id}`, { method: "DELETE" });
//     } catch (error) {
//       console.error("Ошибка при удалении:", error);
//       // 3. Откат изменений при ошибке
//       setData(prevData => [...prevData, { /* восстановленные данные */ }]);
//       alert("Не удалось удалить запись");
//     }
//   }
// }; 
