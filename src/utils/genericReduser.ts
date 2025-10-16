interface idFullObject {
    id: string
}

type Action<T> =
  | { type: "INITIALIZE", payload: T[] }
  | { type: "ADD", payload: { newObject: T } }
  | { type: "EDIT", payload: { editedObject: T } }
  | { type: "DELETE", payload: { objectId: string } }
  | { type: "RESET" }

export function genericReducer<T extends idFullObject>(initialState: T[], action: Action<T>): T[]{
  switch (action.type) {
    case "INITIALIZE":
      // Se usa para cargar el valor inicial desde la base de datos  
      return action.payload
    case "ADD":
      // Agrega el nuevo item al estado
      return [...initialState, action.payload.newObject]
    case "EDIT":
      // Edita el objeto correspondiente en el estado.
      const data = initialState.map((object) => {
        if (object.id === action.payload.editedObject.id) {
          object = action.payload.editedObject
        }
        return object
      })

      return data
    case "DELETE":
      // Elimina el objeto
      return initialState.filter((o) => o.id !== action.payload.objectId)
    case "RESET":
      return []
  }
}