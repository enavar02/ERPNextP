import React, {useState} from 'react';
import {useRouter} from 'next/router';
import Layout from '../componets/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NUEVO_CLIENTE = gql`
    mutation nuevoCliente($input: ClienteInput){
        nuevoCliente(input:$input){
            id
            nombre
            apellido
            email
            empresa
            vendedor
            telefono
            creado
        
        }
    }
`;
const OBTENER_CLIENTES_USUARIO = gql`
query obtenerClientesVendedor{
    obtenerClientesVendedor{
        id
        nombre
        apellido
        empresa
        email
    }
}
`;

const NuevoCliente = () => {

    //State para el Mensje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation para autenticar usuario
    const [nuevoCliente] = useMutation(NUEVO_CLIENTE,{
        update(cache, {data:{nuevoCliente} }) {
            //Obtenerel objeto de cache que desea actualizar
            const { obtenerClientesVendedor } = cache.readQuery({query: OBTENER_CLIENTES_USUARIO});

            //Reescribir el Cache (el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data:{
                    obtenerClientesVendedor: [...obtenerClientesVendedor, nuevoCliente]
                }
            })
        }
    });

     //Routing
     const router = useRouter();


      //Validacion del formulario
      const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            apellido: Yup.string().required('El apellido es obligatorio'),
            empresa: Yup.string().required('El campo empresa es obligatorio'),
            email: Yup.string().email('El email no es valido').required('El email es obligatorio'),
            
        }),
        onSubmit: async valores => {
            console.log(valores);
            const { nombre, apellido, empresa, email, telefono } = valores;

            try {
                const { data } = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }
                });
                //console.log(data.nuevoCliente);
                router.push('/');
                
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error:', ''));

                setTimeout(() => {
                    guardarMensaje(null);
                }, 2000);
            }

        }
    });

    const mostrarMensaje = () =>{
        return(
            <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
                <p>{mensaje}</p>
            </div>
        )
    }

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-bold">Nuevo Cliente</h1>
            {mensaje && mostrarMensaje()}
            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                     onSubmit={formik.handleSubmit}
                     className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                            <input id="nombre" type="text" placeholder="Nombre Cliente" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        { formik.touched.nombre && formik.errors.nombre? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.nombre}</p>
                                </div>
                            ): null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">Apellido</label>
                            <input id="apellido" type="text" placeholder="Apellido Cliente" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formik.values.apellido}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        { formik.touched.apellido && formik.errors.apellido? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.apellido}</p>
                                </div>
                            ): null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="empresa">Empresa</label>
                            <input id="empresa" type="text" placeholder="Empresa" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formik.values.empresa}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        { formik.touched.empresa && formik.errors.empresa? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.empresa}</p>
                                </div>
                            ): null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                            <input id="email" type="email" placeholder="Email Cliente" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            />
                        </div>
                        { formik.touched.email && formik.errors.email? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.email}</p>
                                </div>
                            ): null}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telefono">Teléfono</label>
                            <input id="telefono" type="tel" placeholder="Telefono Cliente" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formik.values.telefono}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Registrar Cliente" />
                    </form>
                </div>
            </div>
        </Layout>
     );
}
 
export default NuevoCliente;