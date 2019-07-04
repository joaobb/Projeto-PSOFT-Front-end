//Tempo que o usuario tem de digitacao na barra de pesquisa de disciplinas ate que o sistema faca o fetch para buscar disciplinas
var bufferTime = null;

//Barra de pesquisa de perfis de disciplinas
const $disciplinaSearchBar = document.getElementById("disciplinaSearchBar");

//Muda a cor do botao de acordo com a escolha do usuario de curtir ou nao o perfil da disciplina
function mudarCorBotaoLike(flag) {
    if (flag) document.getElementById("likeBt").style = "filter: invert(32%) sepia(95%) saturate(1073%) hue-rotate(103deg) brightness(95%) contrast(105%);"
    else document.getElementById("likeBt").style = ""
}

//Recebe (parte) do nome da disciplina a ser buscada
$disciplinaSearchBar.onkeyup = async function () {
    if (!$disciplinaSearchBar.value) {
        killAllChildren("#disciplinaSearchBar")
        return;
    }

    if (bufferTime != null) clearTimeout(bufferTime);                           //Restart the buffer if it is the first time being called
    bufferTime = setTimeout(await DisciplinaBtControler, 400);                  //Starts the buffer countdown, if the uses don't write anything new in 300ms, 
    //it will run the button creator function
}

//Controla a criacao de botoes das disciplinas dinamicamente
var DisciplinaBtControler = async function () {
    if (!$disciplinaSearchBar.value) return;

    killAllChildren(".disciplinas-container"); //:D

    const DisciplinasList = await disciplinaFethcer()

    DisciplinasList.forEach(Subject => {
        DisciplinaButtonCreator(Subject["id"], Subject["nome"]);
    });
}

//Cria botoes baseados no nome e ids das disciplinas, e adiciona estes ao HTML da pagina
function DisciplinaButtonCreator(discId, discNome) {
    let button = document.createElement("button");
    button.id = discId;
    button.innerText = (discId + " - " + capitalize(discNome));
    button.onclick = () => {
        if (loggedInCheck()) return;
        perfilModController(discId);
    }
    button.className = "discBt";

    document.querySelector(".disciplinas-container").appendChild(button);
}

//Recupera todas as disciplinas que tem o nome/parte dele igual ao pesquisado pelo usuario
async function disciplinaFethcer() {
    if (!$disciplinaSearchBar.value) return;

    const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/findSubjects/?substring=" + $disciplinaSearchBar.value.replace(/ /g, "%20");
    let fetcher = await fetch(requestUrl)
    if (!fetcher.ok) throw new Error("Subject fetch failed");
    let discJson = await fetcher.json();

    return discJson;
}

//Controla o modal dos perfis das disciplinas, limpando e adicionando a este as informacoes da disciplina escolhida pelo usuario
async function perfilModController(discId) {
    killAllChildren("#comentariosContainer");
    killAllChildren("#perfilComentarioDiv");
    comentarioPerfilInputCreator(discId)

    const perfilJson = await perfilFetcher(discId);

    perfilModalLikeControler(perfilJson["id"], perfilJson["disciplina"], perfilJson["qtdLikes"])

    console.log(perfilJson)
    mudarCorBotaoLike(perfilJson["flagLike"])

    let subComentarioDivNumber = 0;

    perfilJson["comentarios"].forEach(comentario => {
        if (!comentario["apagado"]) {
            console.log(comentario)

            comentarioPrincipalCreator(discId, comentario["id"], comentario["usuario"]["firstName"] + " " + comentario["usuario"]["lastName"],
                comentario["date"] + " " + comentario["hora"], comentario["usuario"]["email"], comentario["comentario"]);

            subComentarioDivNumber++;
            comentario["comentarioDocomentario"].forEach(subComentario => {
                if (!subComentario["apagado"]) {
                    console.log(subComentario)
                    comentarioComentarioCreator(discId, comentario["id"], subComentario["id"], subComentario["usuario"]["firstName"] + " " + subComentario["usuario"]["lastName"],
                        subComentario["date"] + " " + subComentario["hora"], subComentario["usuario"]["email"], subComentario["comentario"])
                }
            })
        }
    });

    discModal.style.display = "block";
}

//Realiza a ligacao entre a aplicacao front e back, recuperando as informacoes de um perfil de uma disciplina a partir de seu id
async function perfilFetcher(id) {
    const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]
    const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/getPerfil?id=" + id;

    let fetcher = await fetch(requestUrl, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + userToken
        }
    });

    if (!fetcher.ok) {
        tokenExpirado(fetcher)
        throw new Error(fetcher.response);
    }

    let perfilData = await fetcher.json();

    return perfilData;
}

//Controla as informacoes sobre like de uma disciplina e as adicionam na pagina dinamicamente
function perfilModalLikeControler(idDisc, nomeDisc, numLikes) {
    document.querySelector("#nomeDisc").innerText = nomeDisc;
    const $likeInfo = document.querySelector("#likeInfo")

    killAllChildren("#likeInfo")

    const likeBt = document.createElement("input")
    likeBt.type = "image"
    likeBt.src = "./images/like.svg"
    likeBt.id = "likeBt"
    likeBt.onclick = async () => {
        const likeUpdate = await curtirPerfil(idDisc)
        mudarCorBotaoLike(likeUpdate[0])

        document.querySelector("#likeNum").innerText = likeUpdate[1]
    }

    const likeCounter = document.createElement("p")
    likeCounter.id = "likeNum"
    likeCounter.innerText = numLikes;

    $likeInfo.append(likeBt, likeCounter)
}

//Realiza a ligacao entre a aplicacao front e back, possibilitando ao usuario curtir um determinado perfil de uma disciplina a partir de seu id
async function curtirPerfil(id) {
    const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/like?id=" + id;
    const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]

    const fetcher = await fetch(requestUrl, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + userToken
        }
    });

    if (!fetcher.ok) {
        tokenExpirado(fetcher)
        throw new Error(fetcher.response);
    }

    const responseTxt = await fetcher.text();
    const responseJson = await JSON.parse(responseTxt);
    return [responseJson["flagLike"], responseJson["qtdLikes"]]
};

// COMENTARIOS BEGIN \\

function estruturaDataGeralComentario(autor, data, comentario) {
    const comentarioData = document.createElement("div")
    comentarioData.className = "comentarioData"

    const donoComentarioDiv = document.createElement("div")
    donoComentarioDiv.className = "donoComentario"

    const autorP = document.createElement("p")
    autorP.className = "autor"
    autorP.innerText = autor;

    const timeDataP = document.createElement("p")
    timeDataP.className = "timeData"
    timeDataP.innerText = data

    donoComentarioDiv.append(autorP, timeDataP)

    const comentarioTextH = document.createElement("h5")
    comentarioTextH.id = "comentarioText"
    comentarioTextH.innerText = comentario;

    comentarioData.append(donoComentarioDiv, comentarioTextH)

    return comentarioData;
}

function comentarioComentarioCreator(disciplinaId, comPaiId, comentarioId, autor, data, email, comentario) {
    const comentarioDoComentario = document.createElement("div");
    comentarioDoComentario.className = "comentarioComentario"

    const comentarioComentarioDiv = document.createElement("div")
    comentarioDoComentario.className = "comentarioComentarioDiv"

    console.log(comentario)

    const comentarioData = estruturaDataGeralComentario(autor, data, comentario)

    comentarioComentarioDiv.append(comentarioData, usuarioDonoDoComentario(comentarioId, disciplinaId, email))
    comentarioDoComentario.appendChild(comentarioComentarioDiv)

    document.getElementById("comentarioDe" + comPaiId).appendChild(comentarioDoComentario)
}

//Constroi a estrutura dos comentarios dos perfis das disciplinas
function comentarioPrincipalCreator(disciplinaId, comentarioId, autor, data, email, comentario) {
    const perfilComentario = document.createElement("div");
    perfilComentario.className = "perfilComentario"

    const comentarioDiv = document.createElement("div")
    comentarioDiv.className = "comentario"

    const comentarioData = estruturaDataGeralComentario(autor, data, comentario)

    const subComentarioInp = document.createElement("input")
    subComentarioInp.type = "text"
    subComentarioInp.className = "subComentario"
    subComentarioInp.placeholder = "Comenta ai, bicho"

    subComentarioInp.onkeyup = async function (event) {
        if (event.keyCode === 13) {
            console.log("subcomentado")
            await adicionarSubComentario(disciplinaId, comentarioId, subComentarioInp.value);
            await perfilModController(disciplinaId);
        }
    }

    const subComentarioContainer = document.createElement("div")
    subComentarioContainer.className = "subComentarioContainer"
    subComentarioContainer.id = "comentarioDe" + comentarioId;

    comentarioDiv.append(comentarioData, subComentarioInp, usuarioDonoDoComentario(comentarioId, disciplinaId, email), subComentarioContainer)
    perfilComentario.appendChild(comentarioDiv)

    document.querySelector("#comentariosContainer").appendChild(perfilComentario);
}

//Verifica se o usuario logado atualmente e o dono do comentario, passado como parametro, caso verdadeiro, adiciona a opcao de deletar este comentario.
function usuarioDonoDoComentario(comentarioId, disciplinaId, email) {
    if (localStorage.getItem("userEmail") == email) {
        const comentarioDelete = document.createElement("input")
        comentarioDelete.type = "image"
        comentarioDelete.className = "comentarioDelete"
        comentarioDelete.src = "./images/delete.svg"
        comentarioDelete.onclick = async function () {
            await deletarComentarioFetcher(disciplinaId, comentarioId)
            await perfilModController(disciplinaId)
        }
        return comentarioDelete;
    }
    return "";
}

//Cria uma area de insercao de comentarios no perfil da disciplina escolhida pelo usuario
function comentarioPerfilInputCreator(id) {
    const input = document.createElement("input")

    input.type = "text"
    input.id = "comentarioPerfilInp"
    input.placeholder = "Escreva um comentario"

    input.onkeyup = async function (event) {
        if (event.keyCode === 13) {
            await comentarPerfil(id, document.getElementById("comentarioPerfilInp").value)
            await perfilModController(id)
        }
    }

    document.getElementById("perfilComentarioDiv").appendChild(input)
}

//Realiza a ligacao entre a aplicacao front e back, para que seja possivel adicionar um comentario de um comentario
async function adicionarSubComentario(disciplinaId, comentarioId, comentario) {
    const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/addResposta?idPerfil=" + disciplinaId + "&idComentario=" + comentarioId;
    const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]
    const jsonBody = JSON.stringify(comentarioToJson(comentario))

    const fetcher = await fetch(requestUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + userToken
        },
        body: jsonBody
    })

    if (!fetcher.ok) {
        tokenExpirado(fetcher)
        console.log(fetcher.response);
        throw new Error(fetcher.response);
    }

    const responseTxt = await fetcher.text();

    return false;
};

//Padroniza o envio de comentario para o backend
function comentarioToJson(comentario) {
    const comentarioJson = {
        "comentario": comentario
    };

    return comentarioJson;
}

//Recebe um comentario de um determinado perfil de disciplina e manda este para o backend.
async function comentarPerfil(id, comentario) {
    const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/addComentario?id=" + id;
    const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]
    const jsonBody = JSON.stringify(comentarioToJson(comentario))

    const fetcher = await fetch(requestUrl, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + userToken
        },
        body: jsonBody
    })

    if (!fetcher.ok) {
        tokenExpirado(fetcher)
        console.log(fetcher.response);

        throw new Error(fetcher.response);
    }

    const responseTxt = await fetcher.text();
    return false;
};

//Recebe um comentario de um determinado perfil de disciplina e manda este para o backend.
async function deletarComentarioFetcher(idPerfil, idComentario) {
    const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/deleteComentario?idPerfil=" + idPerfil + "&idComentario=" + idComentario;
    const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]

    const fetcher = await fetch(requestUrl, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + userToken
        }
    })

    if (!fetcher.ok) {
        tokenExpirado(fetcher)
        console.log(fetcher.response);

        throw new Error(fetcher.response);
    }

    const responseTxt = await fetcher.text();

};