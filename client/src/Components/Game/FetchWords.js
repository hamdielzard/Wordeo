const baseUrl = "http://localhost:8080";

async function fetchWords(count) {
    var words;
    try {
        const response = await fetch(`${baseUrl}/words?count=${count}`);
        const result = await response.json();
        words = result;
    } catch (error) {
        console.log(error);
    }
    return words;
}

export default fetchWords;