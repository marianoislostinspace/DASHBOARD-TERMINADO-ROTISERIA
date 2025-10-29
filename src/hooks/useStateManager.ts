import { useState } from "react"

export class State {
        _id : number
        name : string
        color: string

        constructor(name: string, color = "#fff", id: number){
            
            this._id = id
            this.name = name
            this.color = color
        }

        toString() : string{
            return this.name
        }

        getId() : number{
            return this._id
        }
    }

interface statefullObject {
        state : number
    }

export const stateList = [
    new State("Nuevo", "#ecf2faff", 0),
    new State("En Preparación", "#f5b505ff", 1),
    new State("Listo", "#1cda7bff", 2),
    new State("Cancelado", "#ee4848", 3)
]


export const useStateManager = () => {
    /*const [statesList, setStatesList] = useState<State[]>([])

    const initStates = (list : State[]) => {
        setStatesList(list)
    } */

    function changeState(object : statefullObject, state : State) {
        object.state = state.getId()
        return object
    }
    
    
  return {
    State,
    changeState
  }
}
