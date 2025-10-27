// Context
import { usePedidos } from "../contexts/PedidoContext"
// Utils
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// Assets
import type { Pedido } from "../assets/types/types"
import "../assets/styles/orderCard.css"
import { faPhone, faUserCircle, faDollarSign, faNoteSticky } from "@fortawesome/free-solid-svg-icons"
import { stateList } from "../hooks/useStateManager"

type Props = {
    order: Pedido
}

export const OrderCard = ({ order }: Props) => {

    const { OrderStorage } = usePedidos()

    if (order.estaArchivado) return

    return (
        <div className='container pedido'
            style={{
                borderTopColor: order.state.color
            }}
        >
            <div className='estadoButtondiv'>
                <select name="state" id="stateSelect"
                    style={{
                        backgroundColor: order.state.color,
                        WebkitAppearance: "none"
                    }}
                    onChange={(e) =>
                        OrderStorage.editState(order, stateList[parseInt(e.target.value)])}
                    value={order.state._id}>

                    {stateList.map((state) => {
                        return <option
                            value={state.getId()}
                            key={state.getId()}
                            style={{ backgroundColor: state.color }}
                        >{state.toString()}</option>
                    })}

                </select>
            </div>

            <div className="client-data-container">
                <div>
                    {/* <FontAwesomeIcon icon={faUserCircle}></FontAwesomeIcon>*/}
                    {order.cliente.nombre}
                </div>
                <div>
                    <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>  {order.cliente.telefono}
                </div>
            </div>



            <div className='order-container'>
                <table className="order-table">
                    <colgroup>
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "50%" }} />
                        <col style={{ width: "30%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Cant.</th>
                            <th>Orden</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[0, 1, 2, 3, 4, 5, 6].map((value) => {
                            return <tr>
                                <td>{value}</td>
                                <td></td>
                                <td></td>
                            </tr>
                            /*<>{
                                order.items[value] 
                                ?  <></>
                                : <></>
                            }</>*/
                        })}
                        {order.items?.map((item) => (
                            <>
                                <tr>
                                    <td>{item.cantidad}</td>
                                    <td>{item.nombre}</td>
                                    <td>{item.precio}</td>
                                </tr>
                                {item.opcionesSeleccionadas &&
                                    <>
                                        {item.opcionesSeleccionadas.map((option) => {
                                            <tr>
                                                <td></td>
                                                <td>{option.nombre}</td>
                                                <td></td>
                                            </tr>
                                        })}
                                    </>
                                }
                            </>


                        ))}

                    </tbody>
                </table>
                {/* 
                
                
                <div className="order-items">
                    {order.items?.map((item) => (
                        <div key={order.id}>
                            <h1><b>{item.nombre} - x{item.cantidad}</b></h1>

                            {item.opcionesSeleccionadas &&
                                <ul className='opciones'>

                                    {item.opcionesSeleccionadas?.map((opc) => {
                                        return <li key={opc.id}><b>{opc.nombre.trim()}</b></li>
                                    })}

                                </ul>}
                            {item.nota &&
                                <h1 className="order-item-note">
                                    <b>
                                        <FontAwesomeIcon icon={faNoteSticky}></FontAwesomeIcon>
                                        {item.nota}
                                    </b>
                                </h1>}
                        </div>
                    ))}
                </div>
                */}
                <h1>
                    ---------------------------
                    <br />
                    <FontAwesomeIcon icon={faDollarSign}></FontAwesomeIcon>{order.total}
                </h1>
            </div>




            <button className='pedido-delete' onClick={() => OrderStorage.setArchivate(order, true)}>Archivar</button>

            <span>{order.id}</span>
            <span className="order-date">{new Date(order.fecha).toLocaleString()}</span>
        </div>
    )
}






