<div style="display:flex; align-items:center; justify-content:center; text-align:center">
  <h1 style="font-size: 40px;">Flingr GraphQL</h1>
</div>
<div style="display:flex; align-items:center; justify-content:center; text-align:center; gap: 20px;">
  <img src="/images/graphql.png" />
  <img src="/images/react.png" />
  <img src="/images/tailwind.png" />
  <img src="/images/express.png" />
  <img src="/images/typeorm.png" />
  <img src="/images/docker.png" />
</div>

---
# *Flingr* - um clone do Tinder em GraphQL

- Clique [aqui](https://flingr.vercel.app) para testar a aplicação.

```
Email: 
```

### Descrição

O aplicativo replica as funcionalidades-padrão do Tinder, um aplicativo de encontros e mensagens. Optei por implementar GraphQL para usar as **subscriptions** (que seriam os ”*websockets* do GraphQL”) nas funções de tempo real (*novas mensagens*, *novos matches*, etc).

Além disso, o GraphQL proporcionou uma grande vantagem no momento de definir as requisições no lado do cliente, pois é possível criar *queries* complexas no frontend sem precisar criar inúmeras rotas no *backend* ou *queries* SQL. GraphQL proporciona liberdade na escolha dos dados que o cliente precisa, sem precisar alterar o *backend*.

Clique [aqui](https://www.youtube.com/watch?v=uH_MLSoBP_A) (vídeo de 40seg) para ver a demo do aplicativo.

---
### Funcionalidades:

- Autenticação
- Dar *likes* e *dislikes* (e *matches*)
- Enviar e receber mensagens em tempo real
- Notificações (em tempo real) de novos *matches* e *mensagens*

---
### Back-end

O servidor foi construído utilizando *Apollo Server* com *Express* (`apollo-server-express`), onde *Apollo Server* é a *lib* utilizada para instanciar o servidor GraphQL, e o *Express* entra para a configuração do servidor de *websockets*, e *middleware* de autenticação. 

Para o banco de dados, usei PostgreSQL em um *container* do *Docker*, e TypeORM para lidar com as *queries*.

O servidor está instalado em um instância EC2 da AWS e linkado à uma distribuição do *Cloudfront* para distribuição em *edge locations* e certificado SSL.

---

### Front-end

O cliente foi construído utilizando React (usando Vite como framework), TailwindCSS e Framer Motion. Para interagir com o backend em GraphQL, temos a lib *Apollo Client*.

A aplicação está distribuída na Vercel.

---
### Execute a aplicação no seu dispositivo

##### Backend

É necessário ter Node e Docker instalados na sua máquina.

Após clonar a aplicação, entre na pasta `backend` e execute um dos comandos abaixo para instalar as bibliotecas necessárias.

```
npm install
yarn
```

Então, execute o seguinte comando para criar o *container* com o banco de dados:

```
docker compose up -d
```

Então, execute a aplicação com `npm run dev` (ou `yarn dev`). Na primeira execução, as tabelas da aplicação serão criadas no banco.

```
npm run dev
yarn dev
```

##### Frontend

Na pasta `frontend`, execute um dos comandos abaixo para instalar as bibliotecas da aplicação:

```
npm install
yarn
```

Então, execute a aplicação com `npm run dev` (ou `yarn dev`). Na primeira execução, as tabelas da aplicação serão criadas no banco.

```
npm run dev
yarn dev
```


---
### Ferramentas utilizadas

- GraphQL (*Apollo Server e Apollo Client*)
- Express
- TypeORM
- Docker
- React
- TailwindCSS
- Framer Motion
