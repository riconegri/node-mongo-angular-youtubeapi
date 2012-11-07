node-mongo-angular-youtubeapi
=============================

# Aplicação feita em NodeJS, MongoJS e AngularJS

Aplicativo utiliza a api do Youtube para fazer pesquisa sobre vídeos, e arquiva o comportamento do usuário, 
como buscas, vídeos favoritos, playlist, detalhes de layout, e tudo mais, que se achar importante, para se saber
sobre o mesmo.

###Vídeo da aplicação - devido a um problema no ScreenR, atrasou, mas logo logo estará disponível.
Em breve, vídeos detalhados da construção, focando especificações:
* NodeJS e sua função
* Modelagem de dados, com o Mongoose
* O M,V e o C do AngularJS

## Resumo
Esta aplicação visa reduzir ao extremo processamento no servidor, transferindo esta responsabilidade para o 
client-side, disponibizando ao programador de front-end, uma estrutura versátil e inteligente de manuseio dos dados
e lógica.

Outro detalhe importante, a facilitação no arquivamento de estrutura de dados complexas.

Um fator, que faz toda a diferença para o usuário, é garantir o estado da aplicação, fazendo a 
transição entre sessões (login e logout), uma linha única, ou seja, continua de onde parou.

A estrutura coleciona dados específicos dos usuários, alimentando o big-data, e futuro trabalho para 
os engenheiros analíticos.

O app foi construído, dividindo a aplicação por layers, possibilitando, em caso de equipes grandes,
a programação verticalizada.

A utilização de qualquer outro motivo (api - twitter, facebook, github, etc), trará resultados semelhantes.

Fique livre para utilizar a sessão de ISSUES do github.

## Objetivos
* Html estático, o servidor não gera uma linha de html, somente despacha objetos para o front-end
* Capturar atividades do usuário, para servir de base para criação de novas aplicações
* Manter o estado da aplicação
* Gerenciar grande número de conexões concorrentes
* Isolar por layers - m*c backend (neste caso, foi suprimido o papel da view), mvc front-end
* Interface objetiva e funcional
* Escalável
* Uma única linguagem dinâmica para todo processo de desenvolvimento (JS)

## Funcionalidades

* Buscar vídeos no YouTube
* Visualizar os vídeos
* Listar os vídeos visualizados
* Criar playlists
* Navegar pela playlist
* Adicionar vídeo a favoritos
* Arquivar os termos buscados
* Pré-visualizar detalhes sobre o vídeo ao passar o mouse (onmouseover)
* Ativar/desativar blocos de layout
* Editar usuário
* Informações do vídeo atual

## Recursos utilizados (Cliente)
* Twitter bootstrap em layout fluído
* AngularJS - (realiza o processamento da lógica no cliente, como rotas, atualizações, interface), existe hoje
outras bibliotecas interessantes que fazem o mesmo trabalho, como BackBone e CanJS.
* JQuery, levemente, com uma pequena refatoração, é possível remover o jQuery, e ficar somente com o jQuery Lite, 
que nativamente, já faz parte do AngularJS
* API e javascript do player do Youtube

## Recursos utilizados (Servidor)
* NodeJS por causa da assincronia, programar em uma única linguagem, mas facilmente portado para qualquer 
outra biblioteca dinâmica do mercado (php, python, ruby), pois somente utiliza do servidor, rotas, e o 
controller para gerenciar o rest, e o model para gerenciar os dados (aka documentos)
* MongoDB para salvar o estado da aplicação e comportamento do usuário
* Mongoose - ORM em NodeJS para o MongoDB

## Instalando
* Instalar Node e Mongo (node install --os-- e mongodb install --os-- no Google)
* Salve o zip em algum diretório, certifique-se de que o node e o mongo estejam rodando.
* Em terminal, ou cmd, no root da aplicação: **npm install -l**
* Após carregar os módulos, digite: **node app.js**
* A aplicação irá rodar em **http://localhost:3000**

## A fazer (TODO)

* Criar acão de remover das listagens
* Localizar um design para aprimorar o visual da interface
* Adicionar um link para resetar aplicação (apagar o documento o usuário no Mongo)
* Refatorar rest (em andamento)
* Permitir aplicação rodar pelo Mongolab ou MongoHQ
* Salvar opções de layout para o usuário
* Implantar websocket, para atualizar perfil de usuário, caso haja edição em outro terminal.
* Criar a versão mobile do projeto
* Layer de autenticação
* Atrelar os vídeos visualizados aos termos buscados, ao passar o mouse por cima, mostra os vídeos do termo
* Identificar e corrigir bugs para o cross-browser, inicialmente rodando ok no Chrome e Firefox, no ie- bug no flash
* Converter readme para inglês
* Carregar player html5 para dispositivos sem flash
* Adicionar funcionalidades como salvar o ponto do vídeo, e recarregar este ponto
* Adicionar redes socias (Twitter, Facebook, Thumbler...)
* Implementar a rest do AngularJS
* LocalStorage para evitar de carregar todo o modelo do banco ao atualizar a página

## Palavras finais
A construção de aplicações web, em tempos recentes, alterou profundamente, utilizando-se base de códigos
otimizadas, permite adicionar complexidade na coleta de dados, e facilidades para os desenvolvedores na
construção da interface do usuário.

Outras caracteristicas a levar em conta, é a assincronia do NodeJS, e, o que considero o futuro da web, 
o real time (websockets), permitindo fluência no tráfego de dados entre cliente e servidor, mantendo, interfaces de 
dispositivos diferentes, atualizados.