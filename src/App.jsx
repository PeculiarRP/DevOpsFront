import React, {useEffect, useState} from 'react'
import './App.css'
import './utils/TableCreator.js'
import './utils/API.js'
import tableCreator from "./utils/TableCreator.js";
import api from "./utils/API.js";

function App() {
    const  tmpList = [
        {ID: "12", Name: "Ivan", Surname: "Ivanov", Job: "MATH"},
        {ID: "13", Name: "Petr", Surname: "Petrov", Job: "ALGO"},
    ];
    const [data, setData] = useState([]);

    function updateTable(data) {
        let oldTable = document.querySelector("table");
        if(oldTable) oldTable.remove();
        let newTable = tableCreator(data);
        let tablePlace = document.getElementById('tablePlace');
        tablePlace.appendChild(newTable);
    }

  const getData = async () => {
      const req = await api.get("/");
      setData(req.data);
  }

  useEffect(() => {
      getData();
      updateTable(tmpList);
  }, []);

  return (
    <>
        <div className="container">
            <div id="myModal" className="modal">
                <div id={"modalContext"} className="modal-context">
                    <h2 id="modalTitle"/>
                    <div id="modalBody"/>
                </div>
            </div>
            <div id="info">
                {data}
            </div>
            <div id="tablePlace"/>
        </div>
    </>
  )
}

export default App
