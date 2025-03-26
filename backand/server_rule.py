import json
import time
import collections

import psycopg2
from flask import Flask, request
from flask_cors import CORS
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
CORS(app)
PrometheusMetrics(app)

# metrics = PrometheusMetrics(app)
# metrics.info('app_info', 'Application info', version='1.0.3')

# metrics.register_default(
#  metrics.counter(
#  'by_path_counter', 'Request count by request paths',
#  labels={'path': lambda: request.path}
#  )
# )

port = 8585
table = 'сadri'

Person = collections.namedtuple("Person", ["name", "family", "doljnost"])
defaultcadri = Person("Иванов", "Иван", "Директор"),("Петров", "Иван", "Зам.Директора"),("Сидоров", "Иван", "Зам.Зам.Директор")

def ConnectorDB() :
    # conn = psycopg2.connect('postgresql://postgres:cadri@localhost:5432/postgres')# For Windows
   conn = psycopg2.connect('postgresql://postgres:cadri@postgres_container:5432/postgres')
   return conn

#Проверка наличия таблицы и при необходимости создание ее с добавление 3 записей
def isCreated_DB() :
    conn = ConnectorDB()
    cur = conn.cursor()
    # Создание таблицы Фамилия Имя должность
    cur.execute('SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = %s) AS table_exists;', (table,))
    existtable = bool(cur.fetchone()[0])
    cur.close()
    conn.close()
    print(existtable)
    if existtable == False :
        print(f"table \t{table} not exists, creat....")
        cur = conn.cursor()
        cur.execute(f'CREATE TABLE IF NOT EXISTS \t{table} (id SERIAL PRIMARY KEY, name VARCHAR(100), family VARCHAR(100), doljnost VARCHAR(100));')
        cur.close()
        conn.close()
        #Вставка дефолтных значений
        Insert_DB(defaultcadri)
        # отображение того, что вставили
        rows = AllEntries()
        print(f"table created \t{table} success, added 3 entries: ")
        print(rows)
    else :
        print(f"table \t{table} exists")


# Извлечение всех записей из таблицы servers
def AllEntries() :
    conn = ConnectorDB()
    cur = conn.cursor()    
    cur.execute(f"SELECT id, name, family, doljnost FROM \t{table} ORDER BY id;")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

# Вставка блока записей
def Insert_DB(datainput):
    print(f"Insert from table \t{table}")
    conn = ConnectorDB()
    cur = conn.cursor()
    for name, family, doljnost in datainput :
       cur.execute(f"INSERT INTO \t{table} (name, family, doljnost) VALUES (%s, %s, %s);", (name, family, doljnost))        
    conn.commit()
    cur.close()
    conn.close()

# Обновление блока записей
def Update_DB(id, name, family, doljnost ): 
    print(f"Update from table \t{table}")
    conn = ConnectorDB()   
    cur = conn.cursor()
    cur.execute(f"UPDATE \t{table} SET name = %s, family = %s, doljnost = %s WHERE  id = \t{id};", (name, family, doljnost))
    conn.commit()
    cur.close()
    conn.close()

# Удаление блока записей
def Delete_DB(id): 
    conn = ConnectorDB()
    cur = conn.cursor()
    print(f"Delete from table \t{table}")
    cur.execute( f"DELETE FROM \t{table} WHERE id = \t{id};")
    conn.commit()
    cur.close()
    conn.close()

#Сервак
#Формируем данные
def jsoncreat():
  row = AllEntries()
  rezult = []
  for id, name, family, doljnost in row :
    # st = {'user_id': id, 'user_name': name, 'user_surname': family, 'user_job': doljnost}
    st = {'ID': str(id) , 'Name': name, 'Surname': family, 'Job': doljnost}
    rezult.append(st)
  return rezult 

#Команда на передачу данных на сайта
@app.route('/', methods=['GET'])
def get():
  return jsoncreat()

#Команда на прием на создание нового сотрудника
@app.route('/', methods=['POST'])
def post():
  data = request.get_json()
  print(f"Loading of server inserting:\t{data}")
  t = Person(data['user_name'], data['user_surname'], data['user_job']),
  Insert_DB(t)
  return jsoncreat()

#Команда на удаление
@app.route('/', methods=['DELETE'])
def delit():
  data = request.get_json()
  print(f"Deliting of server inserting:\t{data}")
  Delete_DB(data['user_id'])
  return jsoncreat()

#Команда на обновление
@app.route('/', methods=['PUT'])
def put():
  data = request.get_json()
  print(f"Updating of server inserting:\t{data}")
  Update_DB(data['user_id'], data['user_name'], data['user_surname'], data['user_job'])
  return jsoncreat()

if __name__ == '__main__':
    # Небольшая задержка
    # time.sleep(40)
    # Работа с БД
    isCreated_DB()

    app.run(host="0.0.0.0", threaded=True, port=port, debug=False)   