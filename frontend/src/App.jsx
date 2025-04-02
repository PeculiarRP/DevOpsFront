import React, {useEffect } from 'react'
import './App.css'
import './utils/TableCreator.js'
import './utils/API.js'
import tableCreator from "./utils/TableCreator.js";
import api from "./utils/API.js";
// import { register, Gauge, Counter} from "prom-client";

// const pageLoadDuration = new Gauge({
//     name: "page_load_duration_seconds",
//     help: "Page load duration in seconds",
//     registers: [register],
// })
//
// const pageViews = new Counter({
//     name: 'page_views_total',
//     help: 'Total number of page views',
//     registers: [register],
// });

function App() {
    // const  tmpList = [
    //     {ID: "1", Name: "Ivan", Surname: "Ivanov", Job: "MATH"},
    //     {ID: "2", Name: "Petr", Surname: "Petrov", Job: "ALGO"},
    // ];
    // const [data, setData] = useState([]);

    // function trackPageLoadTime(){
    //     const start = performance.now();
    //     window.onload = () => {
    //         const end = performance.now();
    //         const duration = (end - start) / 1000;
    //         pageLoadDuration.set(duration);
    //     }
    // }

    function updateTable(data) {
        let oldTable = document.querySelector("table");
        if(oldTable) oldTable.remove();
        let newTable = tableCreator(data);
        let tablePlace = document.getElementById('tablePlace');
        tablePlace.appendChild(newTable);
    }

    const getData = async () => {
        const req = await api.get("/"); 
        // setData(req.data);
        updateTable(req.data);
    }

    // const sendMetrics = () => {
    //     setInterval(() => {
    //         api.post('/metrics', {
    //             page_load_duration: pageLoadDuration.get().values[0]?.value || 0,
    //             page_views_total: pageViews.get().values[0]?.value || 0,
    //         }).catch(error => console.error('Error sending metrics:', error));
    //     }, 5000);
    // };

    useEffect(() => {
        // trackPageLoadTime();
        getData();
        // sendMetrics();
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
                {/*{ data }*/}
            </div>
            <div id="tablePlace"/>
        </div>
    </>
  )
}

export default App
