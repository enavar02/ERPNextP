import React, {useState} from 'react';
import {useRouter} from 'next/router';
import Layout from '../componets/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NUEVA_CUENTA = gql`
mutation nuevoUsuario($input: UsuarioInput){
    nuevoUsuario(input: $input){
        id
        nombre
        apellido
        email
        creado
    }
  }
`;

const NuevaCuenta = () => {

    //State para el Mensje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation para crear nuevo usuario
    const [nuevoUsuario] = useMutation(NUEVA_CUENTA);

    //Routing
    const router = useRouter();

     //Validacion del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El Nombre es obligatorio'),
            apellido: Yup.string().required('El Apellido es obligatorio'),
            email: Yup.string().email('El Email no es valido').required('El email es obligatorio'),
            password: Yup.string().required('El Password es obligatorio').min(6,'El Password de ser de almenos 6 caracteres')
        }),
        onSubmit: async valores => {
            // console.log(valores);
            const { nombre, apellido, email, password }= valores;
            try {
               const {data} = await nuevoUsuario({
                    variables:{
                        input:{
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                });
                console.log(data);
                //Usuario Creado Correctamente
                guardarMensaje(`Se Creo Correctamente el Usuario: ${data.nuevoUsuario.nombre}`);
                setTimeout(()=>{
                    router.push('/login');
                },3000);


            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error:', ''));
                
                setTimeout(()=>{
                    guardarMensaje(null);
                },3000);
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
        <>
            <Layout>
                {mensaje && mostrarMensaje()}
                <h1 className="text-center text-2xl text-white font-light">CREAR NUEVA CUENTA</h1>
                <div className="flex justify-center mt5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                        onSubmit={formik.handleSubmit}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                                <input id="nombre" type="text" placeholder="Nombre Usuario" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
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
                                <input id="apellido" type="text" placeholder="Apellido Usuario" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                                <input id="email" type="email" placeholder="Email Usuario" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
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
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                                <input id="password" type="password" placeholder="Password Usuario" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                />
                            </div>
                            { formik.touched.password && formik.errors.password? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.password}</p>
                                </div>
                            ): null}
                            <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900" value="Crear Cuenta" />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}
 
export default NuevaCuenta;
