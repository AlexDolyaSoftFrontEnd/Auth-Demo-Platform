// src/components/Table/Table.tsx

import React from "react";
import "./TableDemo.css";
import Sidebar from "../../components/Sidebar/Sidebar";

const TableDemo: React.FC = () => {

  const data = [
    { id: 1, name: "Мария Козлова", email: "maria@example.com", role: "Guest", status: "inactive" },
    { id: 2, name: "Дмитрий Волков", email: "dmitry@example.com", role: "User", status: "active" },
    { id: 3, name: "Елена Морозова", email: "elena@example.com", role: "Admin", status: "active" }
  ];

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

              {data.map((row) => (
                <tr key={row.id} className="table__row">

                  <td className="table__cell" data-column="Имя">
                    {row.name}
                  </td>

                  <td className="table__cell" data-column="Email">
                    {row.email}
                  </td>

                  <td className="table__cell" data-column="Роль">
                    <span className={`badge badge-${row.role.toLowerCase()}`}>
                      {row.role}
                    </span>
                  </td>

                  <td className="table__cell" data-column="Статус">
                    <span className={`status status-${row.status}`}>
                      {row.status === "active" ? "Активен" : "Неактивен"}
                    </span>
                  </td>

                  <td className="table__cell" data-column="Действия">

                    <button className="btn-icon" aria-label="Редактировать">
                      ✏️
                    </button>

                    <button className="btn-icon" aria-label="Удалить">
                      🗑️
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </main>
  );
};

export default TableDemo;