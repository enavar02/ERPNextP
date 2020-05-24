import React from 'react';
import {useRouter} from 'next/router';
import { useQuery, gql } from '@apollo/client';

const OBTENER_USUARIO = gql`
    query obtenerUsuario{
            obtenerUsuario{
                id
                nombre
                apellido
                email
                creado
            }
    }
`;

const Header = () => {

    //Query de apollo
    const {data, loading, error, refetch}= useQuery(OBTENER_USUARIO);

    //refetch();
    //Routing
    const router = useRouter();

    // Proteger que no acceda a data antes de ener los resultados
    if(loading) return null;


    //console.log(data);
    // console.log(loading);
    // console.log(error);

    

    //si no hay una session activa
    if(!data){
        return router.push('/login');
    }

    const {nombre, apellido} = data.obtenerUsuario;
    const cerrarSesion = () =>{
        localStorage.removeItem('token');
        router.push('/login');
    }
    return ( 
        
        <div className="sm:flex sm:justify-end ">
            <button onClick={() => refetch()}>Refetch!</button>
            <p className="mr-5 mb-5 lg:mb-0">Hola: {nombre} {apellido}</p>
            <button
            onClick={() => cerrarSesion()}
            className="bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md" 
            type="button">
                Cerrar Sesión
            </button>
        </div>
     );
}
 
export default Header;