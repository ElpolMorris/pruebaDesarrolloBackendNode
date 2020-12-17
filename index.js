const http = require('http')
const fs = require('fs')
const obtenerUsuarioRandom = require('./modulos/RandomUser')
const enviarCorreo = require('./modulos/EnviarCorreo')

http.createServer(async(req,res)=>{
    let {usuarios} = JSON.parse(fs.readFileSync('./datosJson/usuarios.json','utf8')) //JSON usuarios parseado
    let premio = JSON.parse(fs.readFileSync('./datosJson/premio.json','utf8'))
    //ruta raiz
    if(req.url == '/' && req.method == 'GET'){
        res.setHeader('Content-Type','text/html')
        const html = fs.readFileSync('index.html','utf8')
        res.end(html)
    }
    //ruta Usuario
    if(req.url.startsWith('/usuario') && req.method == 'POST'){
        let nuevoUsuario = await obtenerUsuarioRandom()
        usuarios.push(nuevoUsuario)
        fs.writeFileSync('./datosJson/usuarios.json',JSON.stringify({usuarios}))
        res.end(JSON.stringify({usuarios}))
    }
    if(req.url.startsWith('/usuario') && req.method == 'GET'){
        res.setHeader('Content-Type','application/json')
        let listaUsuariosConcurso = fs.readFileSync('./datosJson/usuarios.json','utf8')
        res.end(listaUsuariosConcurso)
    }
    //ruta premio
    if(req.url.startsWith('/premio') && req.method == 'GET'){
        res.setHeader('Content-Type','application/json')
        let listaPremios = fs.readFileSync('./datosJson/premio.json','utf8')
        res.end(listaPremios)
    }
    if(req.url.startsWith('/premio') && req.method == 'PUT'){
        let body;
        req.on("data",(payload)=>{
            body = JSON.parse(payload)
        })
        req.on("end", ()=>{
            premio.nombre = body.nombre
            premio.img = body.img
            fs.writeFileSync('./datosJson/premio.json', JSON.stringify(premio))
            res.end()
        })
    }
    //ruta ganador
    if(req.url.startsWith('/ganador') && req.method == 'GET'){
        let posicionesTotalArregloUsuarios = usuarios.length-1
        console.log(posicionesTotalArregloUsuarios)
        let usuarioGanador = usuarios[(Math.floor(Math.random() * Math.floor(posicionesTotalArregloUsuarios)))]
        let mensajeGanador = `<h2>Felicidades ${usuarioGanador.nombre},</h2>
            <p>haz ganado el premio Gordo del Sorteo de ${premio.nombre}.</p>
            <p>A la brevedad nos contactaremos contigo para coordinar la entrega de tu premio</p>`
        let tituloCorreoGanador = `Felicidades!!!! haz ganado el premio gordo` 
        enviarCorreo([usuarioGanador.correo, 'pmorales.contacto@gmail.com'],tituloCorreoGanador,mensajeGanador)
        res.end(JSON.stringify(usuarioGanador))
    }
})
.listen(3000)