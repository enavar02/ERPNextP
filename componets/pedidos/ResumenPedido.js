import React, {useContext} from 'react';
import PedidoContext from '../../context/pedidos/PedidoContext';
import ProductoResumen from './ProductoResumen';

const ResumenPedido = () => {
    //context de pedido
    const pedidoContext = useContext(PedidoContext);
    const {productos} = pedidoContext;

    //console.log(productos);

    return ( 
        <>
        <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3.- Ajusta la cantidades del producto</p>

        {productos == null ? (
            <p className="mt-5 text-sm">Aún No hay productos</p>
        ) : (
            productos.length > 0 ? (
            
                <>
                    {productos.map(producto =>(
                        <ProductoResumen
                            key={producto.id}
                            producto={producto}
                        />
                    ))}
                </>
                
            ) : (
                
                <p className="mt-5 text-sm">Aún No hay productos</p>
            )
        )}

        
        </>
     );
}
 
export default ResumenPedido;