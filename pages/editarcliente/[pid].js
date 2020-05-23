import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../componets/Layout';
import {gql, useQuery, useMutation} from '@apollo/client';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_CLIENTE = gql`
    query obtenerCliente($id: ID!){
        obtenerCliente(id:$id){
            id
            nombre
            apellido
            empresa
            email
            telefono
            vendedor
            creado
        }
    }
`;

const ACTUALIZAR_CLIENTE = gql`
mutation actualizarCliente($id: ID!, $input: ClienteInput){
    actualizarCliente(id:$id, input:$input){
      id
      nombre
      apellido
      empresa
      email
      telefono
      vendedor
      creado
    }
  }
`;

const EditarCliente = () => {
    //obtener el ID actual
    const router = useRouter();
    const { query: {id} }= router;
    //console.log(id);

    //consulatr para obtener el cliente
    const { data, loading, error } =useQuery(OBTENER_CLIENTE,{
        variables: {
            id
        }
    });
    //Actualizar el cliente
    const [ actualizarCliente ] = useMutation( ACTUALIZAR_CLIENTE );

    //Schema de validacion
    const schemaValidacion = Yup.object({
        nombre: Yup.string().required('El nombre es obligatorio'),
        apellido: Yup.string().required('El apellido es obligatorio'),
        empresa: Yup.string().required('El campo empresa es obligatorio'),
        email: Yup.string().email('El email no es valido').required('El email es obligatorio'),
        
    });

 if(loading) return 'Cargando...';

 const { obtenerCliente} = data;

 //Modificar el cliente en la BD
  const actualizarInfoCliente = async valores =>{
      const { nombre, apellido, empresa, email, telefono } = valores;

      try {
          const { data } = await actualizarCliente({
              variables:{
                  id,
                  input:{
                      nombre,
                      apellido,
                      empresa,
                      email,
                      telefono
                  }
              }
          });
          //console.log(data);

          //mostrar una alerta  
          Swal.fire(
            'Actualizado!',
            'El Cliente se actualizó correctamente',
            'success'
          )
          router.push('/');
      } catch (error) {
          console.log(error);
      }
  }

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-bold">Editar Cliente</h1>
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <Formik
                        validationSchema={schemaValidacion}
                        enableReinitialize
                        initialValues={obtenerCliente}
                        onSubmit={(valores) =>{
                            actualizarInfoCliente(valores);
                        }}
                    >
                        {props => {
                            //console.log(props);
                            return (
                                <form
                                    onSubmit={props.handleSubmit}
                                    className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                                >
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                                        <input id="nombre" type="text" placeholder="Nombre Cliente" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={props.values.nombre}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.nombre && props.errors.nombre ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.nombre}</p>
                                        </div>
                                    ) : null}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">Apellido</label>
                                        <input id="apellido" type="text" placeholder="Apellido Cliente" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={props.values.apellido}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.apellido && props.errors.apellido ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.apellido}</p>
                                        </div>
                                    ) : null}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">Empresa</label>
                                        <input id="empresa" type="text" placeholder="Empresa" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={props.values.empresa}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.empresa && props.errors.empresa ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.empresa}</p>
                                        </div>
                                    ) : null}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                                        <input id="email" type="email" placeholder="Email Cliente" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={props.values.email}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        />
                                    </div>
                                    {props.touched.email && props.errors.email ? (
                                        <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                            <p className="font-bold">Error</p>
                                            <p>{props.errors.email}</p>
                                        </div>
                                    ) : null}

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">Teléfono</label>
                                        <input id="telefono" type="tel" placeholder="Telefono Cliente" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        value={props.values.telefono}
                                        onChange={props.handleChange}
                                        onBlur={props.handleBlur}
                                        />
                                    </div>

                                    <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Editar Cliente" />
                                </form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        </Layout>
     );
}
 
export default EditarCliente;