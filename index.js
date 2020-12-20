const http = require('http')
const fs = require('fs')
const obtenerUsuarioRandom = require('./modulos/RandomUser')
const enviarCorreo = require('./modulos/EnviarCorreo')

http.createServer(async(req,res)=>{
    let {usuarios} = JSON.parse(fs.readFileSync('./datosJson/usuarios.json','utf8')) //JSON usuarios parseado
    let premio = JSON.parse(fs.readFileSync('./datosJson/premio.json','utf8'))
    let rutas = usuarios.map((r)=> r = `/${r.id}`)
    //opcional
    if(req.url == rutas.find((r)=> r == req.url) && req.method == 'GET'){
        const endPointId = req.url.slice(1)
        res.setHeader('Content-Type','application/json')
        const datosUsuarioBuscado = usuarios.filter(u=>u.id == endPointId)
        res.end(JSON.stringify(datosUsuarioBuscado))
    }
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
    if(req.url.startsWith('/usuarios') && req.method == 'GET'){
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
        let obtenerCorreosParticipantes = await usuarios.map((u)=>u.correo)
        let posicionesTotalArregloUsuarios = usuarios.length-1
        let usuarioGanador = usuarios[(Math.floor(Math.random() * Math.floor(posicionesTotalArregloUsuarios)))]
        let mensajeGanador = `<h2>Felicidades a ${usuarioGanador.nombre},</h2>
            <p>que ha ganado el premio Gordo de nuestro sorteo. Te ganaste lo siguiente: ${premio.nombre}.</p>
            <p>A la brevedad nos contactaremos contigo para coordinar la entrega de tu premio</p>
            <p>y para el resto, no se desanimen porque se vienen más sorpresas</p>`
        enviarCorreo([...obtenerCorreosParticipantes, 'pmorales.contacto@gmail.com'], mensajeGanador)
        res.end(JSON.stringify(usuarioGanador))
    }
})
.listen(3000)