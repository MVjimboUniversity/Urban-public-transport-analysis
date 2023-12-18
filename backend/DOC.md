# Общие сведения
Backend разрабатывался на веб-фреймворке FastAPI.
# Структура проекта
В каталоге `/app` хранится backend проекта.

## `/database`

В данном каталоге описывается логика работы с БД Neo4j.

В `backend.py` объявляется драйвер для подклчения к БД Neo4j. В `crud.py` описываются CRUD операции: 
- `create_graph` - добавление графа в БД;
- `get_graph` - получение графа из БД;
- `check_graph` - проверка на существование графа в БД;
- `remove_graph` - удаление графа из БД.

## `/public_transport_osmnx`

В данном каталоге используется [public_transport_osmnx](https://github.com/MVjimboUniversity/public_transport_osmnx), являющийся форком проекта OSMnx. Используя методы, представленные в public_transport_osmnx, можно получить граф общественного транспорта. Структура public_transport_osmnx совпадает со структурой OSMnx.

Основные методы представлены в `/public_transport_osmnx/osmnx/graph.py`: методы graph_from_...  

## `/routers`

В данном каталоге объявляются API- методы:
- `/network/name` - получение графа из области по ее названию;
- `/network/bbox` - получение графа из квадратной области;
- `/network/polygon` - получение графа из области, заданной полигоном;
- `/network/db` - получение графа из БД;
- `/network/db/check` - получение информации о существовании графа в БД;
- `/network/db/delete` - удаление графа из БД.
