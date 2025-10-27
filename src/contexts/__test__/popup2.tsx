import { ReactElement, createContext, useEffect } from "react"

let testObject = {
    nombre: "",
    edad: 1,
    apellido: "",
    esMujer: false
}

export const popup2 = () => {

    const PopUp = {
        raiseForm: () => { },

    }

    return {
        testObject,
        generateForm
    }
}

type FormInput = "string" | "number" | "boolean" | "file"

type SelectInput = string[]

interface FormTemplate {
    [key: string]: FormInput | SelectInput
}

/*
interface FormOptions {
    excludedAttributes: string[],
    fileAttributes: string[] | string
    selectAttributes: Object[] | Object
    onSubmit: CallableFunction
} */

const generateForm = (object: FormTemplate, excludedAttributes?: string[]) => {
    let form: ReactElement[] = []
    let keys = Object.keys(object)

    Object.values(object).map((value, index) => {
        switch (value) {
            case "string":
                form.push(<input name={keys[index]} type="text" placeholder={keys[index]}></input>)
                break
            case "number":
                form.push(<input name={keys[index]} type="number" placeholder={keys[index]}></input>)
                break
            case "boolean":
                form.push(<label>{keys[index]}</label>)
                form.push(<input name={keys[index]} type="checkbox" placeholder={keys[index]}></input>)
                break
            case "file":
                form.push(<input type="file"></input>)
                break
            default:
                if (value as SelectInput) {
                    // Array of selects
                    form.push(
                    <select>
                        {value.map((option)=>{
                            return <option value={option}>{option} </option>
                        })}
                    </select>
                    )
                }

                break
        }
    })

    /*
    Object.values(object).forEach((value, index) => {
        if (excludedAttributes){
              if (excludedAttributes.find((v) => {return v == keys[index]})) {
                return
            }      
        }
        switch (typeof(value)){
            case "string":
                form.push(<input name={keys[index]} type="text" placeholder={keys[index]}></input>)
                break
            case "number":
                form.push(<input name={keys[index]} type="number" placeholder={keys[index]}></input>)
                break
            case "bigint":
                form.push(<input name={keys[index]} type="number" placeholder={keys[index]}></input>)
                break
            case "boolean":
                form.push(<label>{keys[index]}</label>)
                form.push(<input name={keys[index]} type="checkbox" placeholder={keys[index]}></input>)
                break
            case "symbol":
            case "undefined":
            case "object":
            case "function":
                break
            default:
                form.push(<input name={keys[index]} type="text" placeholder={keys[index]}></input>)
        }
    })
    */
    return (
        <>
            <form className="container">
                {form.map((value) => {
                    return value
                })}
            </form>
        </>
    )
}