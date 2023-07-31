const realTimeProductsHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href=" https://cdn.jsdelivr.net/npm/sweetalert2@11.7.18/dist/sweetalert2.min.css " rel="stylesheet">
    <link rel="stylesheet" href="/css/styles.css" />
    <title>Document</title>
</head>
<body>
    {{> nav}} <!-- Contenido de nav.handlebars -->

    <h1 class="chatTitle">Chat por Websocket</h1>

    {{> chat}} <!-- Contenido de chat.handlebars -->

    <script src=" https://cdn.jsdelivr.net/npm/sweetalert2@11.7.18/dist/sweetalert2.all.min.js "></script>
    <script src="/socket.io/socket.io.js"></script>
    <script src="/js/index.js"></script>
</body>
</html>
`;

export default realTimeProductsHTML;
