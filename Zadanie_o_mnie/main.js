const liczbaDoZgadniecia = Math.floor(Math.random() * 10) + 1;

function sprawdz() {
    const guess = parseInt(document.getElementById('userGuess').value);
    const result = document.getElementById('result');

    if (guess === liczbaDoZgadniecia) {
        result.textContent = "Trafiona!";
    } else if (Math.abs(guess - liczbaDoZgadniecia) <= 2) {
        result.textContent = "Ciepło!";
    } else {
        result.textContent = "Zimno!";
    }
}