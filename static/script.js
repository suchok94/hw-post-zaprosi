const backendUrl = 'http://localhost:8000';

const createCat = (id, name, color, likes) => {
    const container = document.getElementById('container');

    const cat = document.createElement('div');
    cat.classList.add('cat');

    const headerElement = document.createElement('h1');
    const colorElement = document.createElement('p');
    const likesElement = document.createElement('h2');

    headerElement.innerHTML = name;
    colorElement.innerHTML = color;
    likesElement.innerHTML = likes;

    cat.append(headerElement, colorElement, likesElement);

    // cat.onclick = () => {
    //     deleteCat(id)
    //         .then(() => fetchCats())
    //         .then(cats => {
    //             document.getElementById('container').innerHTML = '';
    //             cats.forEach(cat => createCat(cat.id, cat.name, cat.color, cat.likes));
    //         })
    //         .catch(error => console.log(error));
    // };

    likesElement.onclick = () => {
        likedCat(id)
            .then(() => fetchCats())
            .then(cats => {
                document.getElementById('container').innerHTML = '';
                cats.forEach(cat => createCat(cat.id, cat.name, cat.color, cat.likes));
            })
            .catch(error => console.log(error));
    };

    container.appendChild(cat);
}

const fetchCats = async () => {
    try {
        const response = await fetch(backendUrl + '/cats');
        const data = await response.json();
        return data.cats || [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

const postCat = async (id, name, color, likes) => {
    try {
        const response = await fetch(backendUrl + '/cats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({id: id, name: name, color: color, likes: likes})
        });
        return await response.json();
    } catch (error) {
        return console.log(error);
    }
}

const deleteCat = (catId) => {
    return fetch(backendUrl + '/cats/' + catId, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .catch(error => console.log(error));
}

const likedCat = (catId) => {
    return fetch(backendUrl + '/cats/' + catId, {
        method: 'PATCH',
        body: JSON.stringify({
          likes: "1"
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"	
        }
      })
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.log(error));
}

document.getElementById('post-cat').onclick = () => {
    const catId = 0
    const catName = document.getElementById('cat-name').value;
    const catColor = document.getElementById('cat-color').value;
    const catLikes = 0

    postCat(catId, catName, catColor, catLikes)
        .then(() => fetchCats())
        .then(cats => {
            document.getElementById('container').innerHTML = '';
            cats.forEach(cat => createCat(cat.id, cat.name, cat.color, cat.likes));
        })
        .catch(error => console.log(error));
}

window.onload = () => {
    fetchCats()
        .then(cats => {
            // document.getElementById('container').innerHTML = '';
            cats.forEach(cat => createCat(cat.id, cat.name, cat.color, cat.likes));
        })
        .catch(error => console.log(error));
}