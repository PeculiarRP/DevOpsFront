import './utils/API.js'
import api from "./utils/API.js";

function openModal(title, context) {
    let modal = document.getElementById("myModal");
    let modalTitle = document.getElementById("modalTitle");
    let modalBody = document.getElementById("modalBody");

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
                    user_id: context[0]
                },
             }).then(r => {
                 console.log(r.data);
                 modal.style.display = "none";
            })
        })
        modalBody.appendChild(text);
        modalBody.appendChild(del_btn);
    }
    else {
        return
    }
    modal.style.display = "block";
}

export default openModal;