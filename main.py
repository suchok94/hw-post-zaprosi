import logging
from typing import Union
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger('uvicorn.error')

class Cat(BaseModel):
    id: int = 0
    name: str 
    color: Union[str, None] = None
    likes: int = 0

    def give_like(cat):
        cat.likes += 1

    

class StorageCats():

    __storage: list = []

    @classmethod
    def add_cat(cls, cat):

        cls.__storage.append(cat)

    @classmethod
    def get_all_cats(cls):
        return cls.__storage
    
    @classmethod
    def count_cats(cls):
        return len(cls.__storage)
    
    @classmethod
    def find_cat_id(cls, id):
        for cat in cls.__storage:
            if cat.id == id:
                return cat
        return


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get('/cats')
def get_cats():
    logger.info(f"{StorageCats.count_cats()} cats returned")
    return {'status': 'ok', 'cats': StorageCats.get_all_cats()}

@app.post('/cats')
def post_cats(cat: Cat):
    StorageCats.add_cat(cat)
    logger.info(f"Cat {cat} added")
    return {'status': 'ok'}

@app.patch('/cats/{id}/like')
def give_like_cat(id):
    target_cat_id = StorageCats.find_cat_id(id)
    target_cat_id.give_like()
    logger.info(f"Лайк поставлен котику под id {target_cat_id}")
    return {'status like': 'ok'}


app.mount("/", StaticFiles(directory="./static", html=True), name="static")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', reload=True)