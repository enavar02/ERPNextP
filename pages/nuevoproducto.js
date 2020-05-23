import React from 'react';
import {useRouter} from 'next/router';
import Layout from '../componets/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {gql, useMutation} from '@apollo/client';
import Swal from 'sweetalert2';

const NUEVO_PRODUCTO = gql`
   mutation nuevoProducto($input: ProductoInput){
        nuevoProducto(input:$input){
            id
            nombre
            existencia
            precio
            creado
        }
  }
`;
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

const NuevoProducto = () => {

    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO,{
        update(cache, {data:{nuevoProducto} }) {
            //Obtenerel objeto de cache que desea actualizar
            const { obtenerProductos } = cache.readQuery({query: OBTENER_PRODUCTOS});

            //Reescribir el Cache (el cache nunca se debe modificar)
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data:{
                    obtenerProductos: [...obtenerProductos, nuevoProducto]
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
            existencia: '',
            precio: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es obligatorio'),
            existencia: Yup.number().required('Agregar la cantidad disponible').positive('No se aceptan números negativo').integer('La existencia debe ser números enteros'),
            precio: Yup.number().required('El precio es obligatorio').positive('No se aceptan números negativo')
            
        }),
        onSubmit: async valores => {
            console.log(valores);
            const { nombre, existencia, precio } = valores;

            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            existencia,
                            precio
                            // existencia: parseInt(existencia),
                            // precio: Number(existencia)
                        }
                    }
                });
                Swal.fire(
                    'Creado!',
                    'Se creo Correctamente',
                    'success'
                  )
                router.push('/productos');
                
            } catch (error) {
                console.log(error);

            }

        }
    });

    return ( 
       <Layout>
            <h1 className="text-2xl text-gray-800 font-bold">Crear Nuevo Producto</h1>

            <div className="flex justify-center mt-5">
                <div className="w-full max-w-lg">
                    <form
                        onSubmit={formik.handleSubmit}
                        className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                            <input id="nombre" type="text" placeholder="Nombre del Producto" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="existencia">Cantidad Disponible</label>
                            <input id="existencia" type="number" placeholder="Cantidad Disponible" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formik.values.existencia}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        { formik.touched.existencia && formik.errors.existencia? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.existencia}</p>
                                </div>
                            ): null}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
                            <input id="precio" type="number" placeholder="Precio del Producto" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>
                        { formik.touched.precio && formik.errors.precio? (
                                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                                    <p className="font-bold">Error</p>
                                    <p>{formik.errors.precio}</p>
                                </div>
                            ): null}
                        <input type="submit" className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900" value="Agregar Nuevo Producto" />

                    </form>
                </div>
            </div>  
       </Layout>
     );
}
 
export default NuevoProducto;