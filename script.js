function buscarCatAndEmotion() {
    const emotionInput = document.getElementById('emotionInput').value;
    traduzirParaIngles(emotionInput)
        .then((translatedEmotion) => {
            console.log(translatedEmotion)
            buscarEmotion(translatedEmotion);
        })
        .catch((error) => {
            console.error('Erro ao traduzir:', error);
        });
}

function traduzirParaIngles(texto) {
    const apiKey = 'AIzaSyB4DhakyRyaGN_E5fuiDQYe6IN8FHSoO2c';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}&q=${encodeURIComponent(texto)}&source=pt&target=en`;
    
    return fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`${response.status}: Erro ao traduzir`);
            }
            return response.json();
        })
        .then((data) => {
            return data.data.translations[0].translatedText;
        });
}

function buscarEmotion(emotion) {
    fetch('http://localhost:8100/api/emotion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: emotion })
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error(`${res.status}: Erro ao buscar emoção`);
        }
        return res.json();
    })
    .then((data) => {
        console.log(data)
        const catTag = formatarEmocao(data.sentiment);
        console.log(catTag)
        buscarCat(catTag);

        document.getElementById('emotionContainer').innerText = data.sentiment;
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
}

function buscarCat(tag) {
    fetch(`http://localhost:8090/cat/${tag}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`${res.status}: Erro ao buscar gato`);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data)
            const catContainer = document.getElementById('catContainer');
            catContainer.innerHTML = '';
            const img = document.createElement('img');
            img.src = data.url;
            img.alt = 'Gato';
            catContainer.appendChild(img);
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
}

function formatarEmocao(emotion) {
    format = emotion.replace(/[,\s!]+/g, '');
    switch (format) {
        case "Atéquetafelizinho":
            return "feliz"
        case "Tameioborocoxoné":
            return "triste"
        case "Vocêtatristequepena":
            return "muitotriste"   
        case "Vocêtafelizquebom":
            return "muitofeliz"
        default:
            return "feliz"
    }
}
