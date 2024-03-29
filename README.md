# UCDb - UFCG Cursos database - Front-end

<a align="center" href="http://ucdb-frontend-jr.herokuapp.com/index.html" target="_blank">
 <p>
  <img src="https://github.com/joaobb/Projeto-PSOFT-Front-end/blob/master/images/ucdb.png?raw=true" max-height="150" width="150" title="UCDb deploy">
   
   Deploy Atual
 </p>
</a>


##### Neste repositório esta disponível o front-end do nosso projeto da disciplina Projeto de Software do periodo 2019.1. 

### Descrição
O UCDb é uma aplicação para classificação e reviews de disciplinas de de cursos da UFCG. Por enquanto, só estão disponíveis disciplinas do curso de Ciência da Computação.
Os próprios usuários que gerem esta aplicação, de forma que estes constrõem o conteudo sobre as disciplinas de forma colaborativa, através de likes e comentários nos perfis das disciplinas.
Além disso, ainda é possível gerar um ranking com todas as disciplinas.

------------

## Arquitetura do Front-end
* images - Diretório que armazena todos as imagens utilizadas no projeto.
   * \*.* - Imagens utilizadas no projeto.

 * index.html - Pagina inicial do programa. Possui o esqueleto do HTML, esse sempre estando presente durante toda a interação com o usuário com a página inicial.
 * ranking.html - Pagina do ranking das disciplinas. Possui apenas o esqueleto do HTML, esse sempre estando presente durante toda a interação do usuário com o endereço do ranking.
 * index.php - Arquivo necessário para deploy do front-end no heroku.
 
 * scripts - Diretório que armazena todos a programação resposável por modificar a página.
   * model.js - Modelo de signin e signout que transforma entradas do usuário nos campos de /entrar e /cadastrar em objetos, para que estes seja utilizados
   * noSlepp.sh - Script para que nenhum dos deploys do heroku sejam desativados. Por meio de um request em cada aplicação (front e api) a cada periodo de tempo definido pelo script. 
   * script.js - Funções gerais que podem vir a ser utilizadas por outras funções mais especificas. 
   * signInUpOut.js - Arquivo que engloba todas as interações da aplicação que envolvem login e registro de novos usuários.
   * rankingScript.js - Arquivo que engloba todas as interações da aplicação que envolvem a geração e exibição do ranking de disciplinas.
   * perfilDisciplina.js - Arquivo que engloba todas as interações da aplicação que envolvem disciplinas e seus perfis. criando e modificando HTML dinamicamente.
   
 * styles - Diretório que armazena todos os estilos presentes no projeto.
   * styleRanking.css	- Contém os estilos que são utilizados apenas no ranking.
   * style.css - Contem os estilos que são utilizados em todo o projeto.
 * README.md - Este que vôs lê

------------

## Tecnologias utilizadas
- [Pure CSS](https://www.purecss.io/)
  * Pequeno conjunto de modulos CSS que foi utilizado na parte grafica da aplicação, principalmente nos formularios de SignIn e SignUp. 

- JavaScript Fetch
  * A API Fetch foi utilizada para fazer requests ao back-end.

- [NoIp](https://www.noip.com/)
  * Para que houvesse uma maior comodidade na hora do acesso nossa aplicação, resolvemos registrar um DNS Host.
  * [DNS](http://ucdb.zapto.org)
 
------------

### Grupo

  <a href="https://github.com/joaobb" target="_blank"><img src="https://avatars1.githubusercontent.com/u/29379615?s=460&v=4" height="70" width="70"> João Pedro de Barros Barbosa
  </a> 
  
  <a href="https://github.com/Rafaeldsa" target="_blank"><img src="https://avatars1.githubusercontent.com/u/38410234?s=460&v=4" height="70" width="70"> Rafael Dantas Santos de Azevedo
  </a>

[Parte back-end do projeto](https://github.com/Rafaeldsa/Projeto-PSOFT-Back-end)
