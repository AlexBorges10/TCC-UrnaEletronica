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
    candidateName: 'Ronaldo',
    partyName: 'Partido RD',
    partyId: 90,
    imageUrl: 'http://localhost:8888/img/Ronaldo.webp',
    contagemVotos: 0
  },

  {
    candidateId: 1010,
    candidateName: 'Zidane',
    partyName: 'Partido ZD',
    partyId: 10,
    imageUrl: 'http://localhost:8888/img/zidane.jpg',
    contagemVotos: 0
  },
  {
    candidateId: 1212,
    candidateName: 'Tite',
    partyName: 'Partido TI',
    partyId: 12,
    imageUrl: 'http://localhost:8888/img/tite.jpg',
    contagemVotos: 0
  }
]

const registration = []

// [Pesquisa de Candidatos] //
app.get('/candidates/:id', (request, response) => {
  const pessoa = request.get('x-bolovo-username')

  const { id } = request.params
  console.log(
    `[Pesquisa de Candidatos] - ${Date()}, ${pessoa}  selecionou o candidato ${id}`
  )
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

app.post('/users', (request, response) => {
  const { candidateId, candidateNome, partyNome, partyId, imageUrl } =
    request.body

  const exists = urnas.some(urnas => urnas.candidateId === candidateId)

  if (exists) {
    response.status(400).json({ err: 'Candidato existente.' })
  }
  const urnaa = {
    candidateId: candidateId,
    candidateNome: candidateNome,
    partyNamee: partyNome,
    partyId: partyId,
    imageUrl: imageUrl
  }
  urnas.push(urnaa)

  response.status(200).send()
})

//  [Confirmaçao de voto] //
app.post('/votes/:candidateId', (request, response) => {
  const pessoa = request.get('x-bolovo-username')

  console.log(`[Confirmação de voto] - ${Date()} , ${pessoa} selecionou:`)
  const { candidateId } = request.params

  const urnaa = urnas.find(urnaa => urnaa.candidateId == candidateId)

  if (urnaa == null) {
    const votacao = {
      candidateId: null,
      candidateName: null,
      partyName: null
    }

    urnas.push(votacao)
    console.log(votacao)
    console.log(`${pessoa} Confimou Nulo. `)
  } else {
    const votacao = {
      candidateName: urnaa.candidateName,
      partyName: urnaa.partyName,
      contagemVotos: urnaa.contagemVotos
    }
    urnas.push(votacao)
    console.log(votacao)
    console.log(
      `${pessoa}, seu voto foi confirmado no candidato [${urnaa.candidateName}] do [${urnaa.partyName}] com sucesso.`
    )
    console.log(`${urnaa.candidateName}  ${urnaa.contagemVotos++} votos.`)

    return response.json({
      Msg: `${pessoa} seu voto foi confirmado no candidato ${urnaa.candidateName} do ${urnaa.partyName}`
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
