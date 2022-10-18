const express = require('express')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/img', express.static('img'))

const urnas = [
  {
    candidateId: 9090,
    nomeCandidato: 'Ronaldo',
    partyNome: 'Partido RD',
    partyId: 90,
    imageUrl: 'http://localhost:8888/img/Ronaldo.webp'
  },

  {
    candidateId: 1010,
    nomeCandidato: 'Zidane',
    partyNome: 'Partido ZD',
    partyId: 10,
    imageUrl: 'http://localhost:8888/img/zidane.jpg'
  },
  {
    candidateId: 1212,
    nomeCandidato: 'Tite',
    partyNome: 'Partido TI',
    partyId: 12,
    imageUrl: 'http://localhost:8888/img/tite.jpg'
  }
]

const registration = []

// [Pesquisa de Candidatos] //
app.get('/candidates/:id', (request, response) => {
  const pessoa = request.get('x-bolovo-username')

  console.log(
    `[Pesquisa de Candidatos] - ${Date()}, ${pessoa}  selecionou o candidato:`
  )

  const { id } = request.params

  const urnaa = urnas.find(urnaa => urnaa.candidateId == id)

  if (urnaa == null) {
    response.status(400).json({ Atenção: 'Candidato Inexistente.' })
  }
  console.log(urnaa)
  console.log(
    `[Pesquisa de Candidatos] - ${Date()}, ${pessoa}  deseja prosseguir?`
  )
  return response.status(200).json(urnaa)
})

// [Confirmaçao de voto] //
app.post('/votes/:candidateId', (request, response) => {
  const pessoa = request.get('x-bolovo-username')

  console.log(`[Confirmação de voto] - ${Date()} , ${pessoa} confimou:`)
  const { candidateId } = request.params
  const { nomeCandidato, partyNome } = request.body

  const urnaa = urnas.find(urnaa => urnaa.candidateId == candidateId)

  if (urnaa == null) {
    const votacao = {
      candidateId: null,
      nomeCandidato: null,
      partyNome: null
    }
    urnas.push(votacao)
    console.log(votacao)
    console.log(` Confimou Nulo. `)

    return response.json(votacao)
  } else {
    const votacao = {
      nomeCandidato: urnaa.nomeCandidato,
      partyNome: urnaa.partyNome
    }
    urnas.push(votacao)
    console.log(votacao)
    console.log(
      `${pessoa}, seu voto foi confirmado no candidato [${urnaa.nomeCandidato}] do [${urnaa.partyNome}] com sucesso.`
    )

    return response.json({
      Mensagem: `${pessoa} seu voto foi confirmado no candidato ${urnaa.nomeCandidato}`
    })
  }
})

// [Cadastro de usuarios] //
app.post('/usuario', (request, response) => {
  const { cpf, name } = request.body

  const userExists = registration.some(regist => regist.cpf === cpf)

  if (userExists) {
    return response.status(400).json({ Atencao: 'Cadastro ja existente!' })
  }

  registration.push({
    cpf,
    name
  })
  console.log(`[Cadastro] - ${Date()},  Tem certeza que deseja confirmar?`)
  console.log(registration)
  return response.status(201).send()
})

app.get('/registro/:cpf', (request, response) => {
  const { cpf } = request.params

  const regist = registration.find(regist => regist.cpf === cpf)
  console.log(
    `[Cadastrado] - ${Date()} , Sua conta foi cadastrada com sucesso!`
  )
  console.log(registration)
  return response.status(201).json(regist)
})

app.listen(8888)
