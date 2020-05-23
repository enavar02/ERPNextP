import React, {useState, useEffect, useContext} from 'react';
import Select from 'react-select';
import {gql, useQuery} from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

const OBTENER_PRODUCTOS = gql`
  query {
    obtenerProductos{
        id
        nombre
        existencia
        precio
        creado
    }
  }
`;

const AsignarProductos = () => {

    //State local del componente
    const [productos, setProductos] = useState([]);

    //context de pedido
    const pedidoContext = useContext(PedidoContext);
    const {agregarProducto,actualizarTotal} = pedidoContext;

    //Consultar productos de la bd
    const {data, loading, error} = useQuery(OBTENER_PRODUCTOS);

    useEffect(() => {
        if(productos === null){
            setProductos([]);
            actualizarTotal();
        } else {
            agregarProducto(productos);
            actualizarTotal();
        }
        
    },[productos]);

    const seleccionarProducto = producto =>{
        setProductos(producto);
    }
    
    if(loading) return null;
    const {obtenerProductos} = data;
    return ( 
        <>
        <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Seleccionar los Productos</p>
        <Select
        className="mt-3"
        options={obtenerProductos}
        onChange={ opcion => seleccionarProducto(opcion)}
        isMulti={true}
        getOptionValue={opciones => opciones.id}
        getOptionLabel={opciones => `${opciones.nombre} - ${opciones.existencia} Disponible`}
        placeholder="Seleccione los productos"
        noOptionsMessage={() => "No hay resultados"}
        />
      </>
     );
}
 
export default AsignarProductos;