import React, {useEffect} from 'react';
import Layout from '../componets/Layout';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {gql, useQuery} from '@apollo/client';

const MEJORES_VENDEDORES = gql`
query mejorVendedores{
    mejorVendedores{
      total
      vendedor{
        nombre
        email
      }
    }
  }
`;


    const MejoresVendedores = () => {

    const {data, loading, error, startPolling, stopPolling} = useQuery(MEJORES_VENDEDORES);

    useEffect (() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    },[startPolling, stopPolling]);

    if(loading) return 'cargando...';

    console.log(data);

    const {mejorVendedores} = data;

    const vendedorGrafica = [];

    //aplana el objeto
    mejorVendedores.map((vendedor, index) => {
        vendedorGrafica[index] = {
            ...vendedor.vendedor[0],
            total: vendedor.total
        }
    })
    
    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-bold">Mejores Vendedores</h1>
            <ResponsiveContainer
                width={'99%'}
                height={550}
            >
            <BarChart
                className="mt-10"
                width={600}
                height={500}
                data={vendedorGrafica}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3182CE" />              
            </BarChart>
            </ResponsiveContainer>

        </Layout>
     );
}
 
export default MejoresVendedores;