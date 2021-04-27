async function createParty() {
    var response = await fetch("http://127.0.0.1:1337/party/v1/create", {
        method: "GET"
    });
    return response  
}

async function joinParty() {
    var response = await fetch(`http://127.0.0.1:1337/party/v1/join/${document.getElementById("partyid").value}`, {
        method: "GET"
    });
    return response;
}

document.querySelector("#createlobby").addEventListener("click", async () => {
    var partyID;
    await createParty().then(resp => resp.json()).then(data => {partyID = data});
    document.write(partyID.partyID);
});

document.querySelector("#joinlobby").addEventListener("click", async () => {
    await joinParty();
});