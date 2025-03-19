import openModal from "../DialogWin.jsx";

function tableCreator(tableData) {
    let table = document.createElement("table");
    table.border = "1";

    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");

    let headers = ["ID", "Имя", "Фамилия", "Должность", "Добавить запись"]
    let listHeader = ["ID", "Name", "Surname", "Job", "Добавить запись"]

    headers.forEach(header => {
        let th = document.createElement("th");
        if (header === "Добавить запись") {
            let btn = document.createElement("button");
            btn.textContent = header;
            btn.addEventListener("click", () => {
                openModal(header, {
                    ID: "",
                    Name: "",
                    Surname: "",
                    Job: "",
                })
            })
            th.appendChild(btn);
        }
        else{
            th.textContent = header;
        }
        table.appendChild(th);
    })
    thead.appendChild(headerRow);
    table.appendChild(thead);

    let tableBody = document.createElement("tbody");
    tableData.forEach(item => {
        let tr = document.createElement("tr");
        listHeader.forEach(header => {
            const cell = document.createElement("td");
            if (header === "Добавить запись") {
                let btn_up = document.createElement("button");
                btn_up.textContent = "Изменить";
                btn_up.addEventListener("click", () => {
                    openModal("Изменить", item);
                })
                let btn_del = document.createElement("button");
                btn_del.textContent = "Удалить";
                btn_del.addEventListener("click", () => {
                    openModal("Удалить", item);
                })
                cell.appendChild(btn_up);
                cell.appendChild(btn_del);
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