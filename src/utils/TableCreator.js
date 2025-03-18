import openModal from "../DialogWin.jsx";

function tableCreator(tableData) {
    let table = document.createElement("table");
    table.border = "1";

    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");

    let headers = ["ID", "Имя", "Фамилия", "Должность", "Изменить", "Удалить"]
    let listHeader = ["ID", "Name", "Surname", "Job", "Изменить", "Удалить"]

    headers.forEach(header => {
        let th = document.createElement("th");
        th.textContent = header;
        table.appendChild(th);
    })
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tableBody = document.createElement("tbody");
    tableData.forEach(item => {
        let tr = document.createElement("tr");
        listHeader.forEach(header => {
            const cell = document.createElement("td");
            if (header === "Изменить" || header === "Удалить") {
                let btn = document.createElement("button");
                btn.textContent = header;
                btn.addEventListener("click", () => {
                    openModal(header, item);
                })
                cell.appendChild(btn);
            }
            else {
                cell.textContent = item[header];
            }
            tr.appendChild(cell);
        })
        tableBody.appendChild(tr);
    })
    table.appendChild(tableBody);
    return table;
}

export default tableCreator;