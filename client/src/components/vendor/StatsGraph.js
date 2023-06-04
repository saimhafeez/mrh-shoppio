import { Button, ButtonGroup, Skeleton, Stack, Wrap } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../context/appContext';


function StatsGraph() {

    const { getGraphData } = useAppContext();

    const [currentGraph, setCurrentGraph] = useState("sales")

    const [graphData, setGraphData] = useState();
    const [graphLoaded, setGraphLoaded] = useState(false);

    const fetchGraphData = () => {
        setGraphLoaded(false)
        new Promise(async (resolve, reject) => {
            try {
                const { graphData } = await getGraphData(currentGraph)
                resolve(graphData);
            } catch (error) {
                reject(error)
            }
        }).then((graphData) => {
            setGraphData(graphData)
            setGraphLoaded(true)
            console.log('graphData', graphData);
        }).catch((error) => console.log(error))
    }

    useEffect(() => {
        fetchGraphData()
    }, [currentGraph])

    const data = []


    return (
        <Stack
            direction='column'
            align='center'
        >

            <ButtonGroup
                w='fit-content'
                isAttached
                onClick={(e) => setCurrentGraph(e.target.name)}
            >
                <Button
                    // minW='150px'
                    name='sales'
                    colorScheme={currentGraph === 'sales' ? 'brand_primary' : undefined}
                    variant={currentGraph === 'sales' ? 'solid' : 'outline'}
                >
                    Product Sales
                </Button>
                <Button
                    name='profit'
                    // minW='150px'
                    colorScheme={currentGraph === 'profit' ? 'brand_primary' : undefined}
                    variant={currentGraph === 'profit' ? 'solid' : 'outline'}
                >
                    Profits
                </Button>
                <Button
                    name='orders'
                    // minW='150px'
                    colorScheme={currentGraph === 'orders' ? 'brand_primary' : undefined}
                    variant={currentGraph === 'orders' ? 'solid' : 'outline'}
                >
                    Orders Status
                </Button>
            </ButtonGroup>

            <Stack w='100%' h='300px' p={2}>
                <Skeleton
                    w='full'
                    h='full'
                    isLoaded={graphLoaded}
                >
                    <ResponsiveContainer width="100%" height="100%">
                        {currentGraph !== "orders" ? <AreaChart
                            width={500}
                            height={400}
                            data={graphData}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Day" />
                            <YAxis />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey={graphLoaded && (currentGraph === "sales" ? "ProductsSold" : "ProfitMade")}
                                stroke="#8884d8" fill="#8884d8"
                            />
                        </AreaChart> :
                            <BarChart
                                width={500}
                                height={300}
                                data={graphData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="pending" fill="#FFC93C" />
                                <Bar dataKey="shipped" fill="#05BFDB" />
                                <Bar dataKey="received" fill="#A984FF" />
                                <Bar dataKey="returned" fill="#FF5F5F" />
                            </BarChart>
                        }
                    </ResponsiveContainer>
                </Skeleton>
            </Stack>

        </Stack>
    )
}

export default StatsGraph