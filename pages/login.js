import React, {useState} from 'react';
import {useRouter} from 'next/router';
import Layout from '../componets/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql, useQuery } from '@apollo/client';

const AUTENTICAR_USUARIO = gql`
mutation autenticarUsuario($input: AutenticarInput){
    autenticarUsuario(input: $input){
      token
    }
  }
`;

const Login = () => {

    //State para el Mensje
    const [mensaje, guardarMensaje] = useState(null);

    //Mutation para autenticar usuario
    const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);
   

     //Routing
     const router = useRouter();



      //Validacion del formulario
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('El Email no es valido').required('El email es obligatorio'),
            password: Yup.string().required('El Password es obligatorio')
        }),
        onSubmit: async valores => {
            //    console.log(valores);
            const { email, password } = valores;

            try {
                const { data } = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });
                //console.log(data);
                //guardar el token en localStorage
                const { token } = data.autenticarUsuario;
                localStorage.setItem('token', token);
                //Consultar de Apollo
                router.push('/');
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error:', ''));

                setTimeout(() => {
                    guardarMensaje(null);
                }, 20000);
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
                <h1 className="text-center text-2xl text-white font-light">Login</h1>
                {mensaje && mostrarMensaje()}
                <div className="flex justify-center mt5">
                    <div className="w-full max-w-sm">
                        <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
                         onSubmit={formik.handleSubmit}
                         >
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
                            <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Iniciar Sesión" />
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    );
}
 
export default Login;
