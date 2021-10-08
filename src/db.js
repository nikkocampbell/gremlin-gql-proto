import gremlin from 'gremlin'
const traversal = gremlin.process.AnonymousTraversalSource.traversal;
const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const { t } = gremlin.process;

const __ = gremlin.process.statics;

let _conn;

const dropAll = async (g) => {
  await g.V().drop().next()
}

export const init = async () => {
  _conn = new DriverRemoteConnection('ws://localhost:8182/gremlin')

  const g = traversal().withRemote(_conn);

  return g;
}

export const dispose = async () => {
  await _conn.close()
}

export const seed = async (g) => {
  await dropAll(g)

  const v1 = await g.addV('person').property('name','nikko').next();
  const v2 = await g.addV('person').property('name','kay').next();
  const v3 = await g.addV('person').property('name','ian').next();

  await g.V(v1.value.id).addE('knows').to(__.V(v2.value.id)).iterate()
  await g.V(v1.value.id).addE('knows').to(__.V(v3.value.id)).iterate()
  await g.V(v2.value.id).addE('knows').to(__.V(v3.value.id)).iterate()
}

export const getPerson = async (g, { id }) => {
  const { value } = await g.V(id).hasLabel('person').valueMap('name').next()
  return value
}

export const getKnownPeople = async (g, { id }) => {
  const people = await g.V(id).hasLabel('person').both('knows').valueMap(true).toList()

  return people.map(p => {
    const [name] = p.get('name')
    const id = p.get(t.id)
    return {
      id,
      name
    }
  })
}


export default {
  init,
  dispose,
  seed
}
