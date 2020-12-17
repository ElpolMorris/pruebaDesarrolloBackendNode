const axios = require('axios')
const {v4:uuid} = require('uuid')

const url = 'https://randomuser.me/api'

const obtenerUsuarioRandom = async ()=>{
    const {data} = await axios.get(url)
    const {results} = data
    return {
        id: uuid().slice(30),
        nombre: `${results[0].name.title} ${results[0].name.first} ${results[0].name.last}`,
        correo: results[0].email,
        foto: results[0].picture.thumbnail,
        pais: results[0].location.country
    }

}

module.exports = obtenerUsuarioRandom