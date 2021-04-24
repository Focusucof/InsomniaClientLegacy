async function createParty() {
    var response = await fetch("http://127.0.0.1:1337/party/v1/create", {
        method: "GET"
    });
    return response
}

document.querySelector("#createlobby").addEventListener("click", async () => {
    await createParty();
});