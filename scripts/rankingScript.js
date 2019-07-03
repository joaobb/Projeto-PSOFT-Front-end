//Opcao de ordenacao por numero do likes
const $likeNumberOption = document.getElementById("rankByLikeNumb")

//Opcao de ordenacao por numero do comentarios
const $commentNumberOption = document.getElementById("rankByCommentNumb")

//Faz a chamada para ordenar o ranking por numero de likes.
$likeNumberOption.onclick = () => {
    $likeNumberOption.className = "opcaoAtivada"
    $commentNumberOption.className = ""
    rankingByControler("Like")
}

//Faz a chamada para ordenar o ranking por numero de likes.
$commentNumberOption.onclick = () => {
    $commentNumberOption.className = "opcaoAtivada"
    $likeNumberOption.className = ""
    rankingByControler("Comentario")
}

//Controla a ordenacao do ranking de acordo com o parametro option passado como parametro, limpando o container de ranking
//e redirecionando os dados necessarios para a criacao de cada disciplina no HTML
async function rankingByControler(option) {
    if (loggedInCheck()) return;

    const rankingList = await getRankingBy(option)

    killAllChildren(".ranking-container")

    for (let index = 0; index < rankingList.length; index++) {
        const disciplina = rankingList[index];

        disciplinaRanking(index + 1, disciplina["disciplina"], disciplina["qtdLikes"], disciplina["comentarios"].length);
    }
}

//Realiza a ligacao entre a aplicacao front e back, e faz a requisicao do ranking de perfis de disciplinas ordenadas de acordo com opcao escolhida
async function getRankingBy(option) {
    const userToken = await JSON.parse(localStorage.getItem("userToken"))["token"]
    const requestUrl = "https://ucdb-plataform1.herokuapp.com/api/v1/disciplina/ranking" + option;

    let fetcher = await fetch(requestUrl, {
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'authorization': 'Bearer ' + userToken
        }
    })

    if (!fetcher.ok) {
        tokenExpirado(fetcher)
        throw new Error(fetcher.response);
    }

    let rankingJson = await fetcher.json();
    return rankingJson;
}

const loggedInCheck = function () {
    if (localStorage.getItem("userToken") == null) {
        alert("Faça login para continuar")

        document.getElementById("signInMod").style.display = "flex";
        return true;
    }
}

//Cria a estrutura de HTML de cada disciplina presente no ranking
function disciplinaRanking(posicao, discNome, qtdLikes, qtdComentarios) {

    const disciplinaDiv = document.createElement("div");
    disciplinaDiv.className = "disciplinaDiv";
    disciplinaDiv.id = "posicao" + posicao;

    const disciplinaInfoList = document.createElement("ul");
    disciplinaInfoList.className = "disciplinaInfoList";

    const disciplinaNome = document.createElement("li")
    disciplinaNome.className = "nomeDisciplina"
    disciplinaNome.innerText = posicao + "º - " + discNome

    const disciplinaQtdsInfo = document.createElement("li")
    disciplinaQtdsInfo.className = "disciplinaQtdsInfo"
    disciplinaQtdsInfo.innerText = "Likes: " + qtdLikes + " - Comentarios: " + qtdComentarios

    disciplinaDiv.append(disciplinaNome, disciplinaQtdsInfo)

    document.querySelector(".ranking-container").appendChild(disciplinaDiv);
}
