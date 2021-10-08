import { query } from './gql.js';
import db from './db.js'

const main = async () => {

  const g = await db.init()

  try {
    const { data } = await query(g, `
    {
      person(id: 82) {
        id
        name
        knows {
          id
          name
          knows {
            id
            name
            knows {
              id
              name
            }
          }
        }
      }
    }
    `)
    console.log(JSON.stringify(data, null, 2))

  } catch(err) {
    console.error(err)
  }

  await db.dispose()
}

main()
