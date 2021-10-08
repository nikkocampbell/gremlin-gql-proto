import { graphql, buildSchema } from 'graphql'
import { getKnownPeople, getPerson } from './db.js'

let g

var schema = buildSchema(`
  type Query {
    hello: String
    person(id: ID!): Person
  }

  type Person {
    id: ID!
    name: String!
    knows: [Person]!
  }
`)


class Person {
  constructor(id, name, g) {
    this.id = id
    this.name = name
    this.g = g
  }

  async knows() {
    const people = await getKnownPeople(g, { id: this.id })

    return people.map(p => {
      return new Person(p.id, p.name, g)
    })

  }
}

var root = {
  hello: () => {
    return 'Hello World!'
  },
  person: async ({ id }) => {
    const person = await getPerson(g, { id })

    const [name] = person.get('name')

    return new Person(id, name)
  }
}

export const query = (graphTraversal, q) => {
  g = graphTraversal
  return graphql(schema, q, root)
}
