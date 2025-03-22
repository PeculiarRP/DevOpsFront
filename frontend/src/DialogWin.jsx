import './utils/API.js'
import api from "./utils/API.js";

import tableCreator from "./utils/TableCreator.js";

function openModal(title, context) {
    let modal = document.getElementById("myModal");
    let modalTitle = document.getElementById("modalTitle");
    let modalBody = document.getElementById("modalBody");

    function closeModal() {
        while (modalTitle.firstChild) modalTitle.removeChild(modalTitle.firstChild);
        while (modalBody.firstChild) modalBody.removeChild(modalBody.firstChild);
        modal.style.display = "none";
    }

    function updateTable(data) {
        let oldTable = document.querySelector("table");
        if(oldTable) oldTable.remove();
        let newTable = tableCreator(data);
        let tablePlace = document.getElementById('tablePlace');
        tablePlace.appendChild(newTable);
    }

    window.addEventListener("click", (event) => {
        if (event.target === modal){
            closeModal();
        }
    })

    modalTitle.textContent = title;
    if (title === "Удалить"){
        let text = document.createElement("p");
        text.textContent = "Подтвердите удаление сотрудника " + context["ID"] + " " + context["Name"] + " "
            + context["Surname"] + " " + context["Job"];
        let del_btn = document.createElement("button");
        del_btn.textContent = title;
        del_btn.addEventListener("click", () => {
            api.delete("", {
                data: {
                    // user_id: context[0]
                    user_id: context["ID"]
                },
             }).then(r => {
                console.log(r.data);
                updateTable(r.data);
            })
            console.log("User delete !!");
            
            closeModal();
        })
        modalBody.appendChild(text);
        modalBody.appendChild(del_btn);
    }
    else {
        let text = document.createElement("p");
        let nameLabel = document.createElement("p");
        nameLabel.textContent = "Введите имя работника:";
        let nameInput = document.createElement("input");
        nameInput.value = context["Name"];
        let surnameLabel = document.createElement("p");
        surnameLabel.textContent = "Введите фамилию работника:";
        let surnameInput = document.createElement("input");
        surnameInput.value = context["Surname"];
        let jobLabel = document.createElement("p");
        jobLabel.textContent = "Введите должность работника:";
        let jobInput = document.createElement("input");
        jobInput.value = context["Job"];
        let btn = document.createElement("button");
        btn.textContent = title;
        if (title === "Изменить"){
            text.textContent = "Изменяем пользователя под ID: " + context["ID"];
            btn.addEventListener("click", () => {
                console.log("User update !!");
                api.put("",{
                    user_id: context["ID"],
                    user_name: nameInput.value,
                    user_surname: surnameInput.value,
                    user_job: jobInput.value,
                }).then(r => {
                    console.log(r.data);
                    updateTable(r.data);
                })
                closeModal();
            })
        }
        else {
            text.textContent = "Добавляем в систему нового сотрудника ()_()";
            btn.addEventListener("click", () => {
                console.log("User insert !!");
                api.post("", {
                    user_name: nameInput.value,
                    user_surname: surnameInput.value,
                    user_job: jobInput.value,
                }).then(r => {
                    console.log(r.data);
                    updateTable(r.data);
                })
                closeModal();
            })
        }
        modalBody.appendChild(text);
        modalBody.appendChild(nameLabel);
        modalBody.appendChild(nameInput);
        modalBody.appendChild(surnameLabel);
        modalBody.appendChild(surnameInput);
        modalBody.appendChild(jobLabel);
        modalBody.appendChild(jobInput);
        modalBody.appendChild(btn);
    }

    modal.style.display = "block";
}

export default openModal;