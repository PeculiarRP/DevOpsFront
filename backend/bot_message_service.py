import requests

TOKEN = '7624484912:AAGag_O5gMtXNWKNy_63n7av13ZX7mYaAxE'
chat_id = 1661413155

url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"


def delete_row(id):
    data = {
        "chat_id": chat_id,
        'text': f'Удалена запись по id {id}'
    }
    response = requests.post(url, json=data)


def add_row(name, family, doljnost):
    data = {
        "chat_id": chat_id,
        'text': f'Добавлена запись {name} {family} {doljnost}'
    }
    response = requests.post(url, json=data)


def update_row(id, name, family, doljnost, ):
    data = {
        'chat_id': chat_id,
        'text': f'Изменена запись по id {id} на {name} {family} {doljnost}'
    }
    response = requests.post(url, json=data)


if __name__ == '__main__':
    add_row('Ivan', 'Ivanov', 'Toster')
    update_row('1', 'Ivan', 'Ivanov', 'Toster')
    delete_row('11')
