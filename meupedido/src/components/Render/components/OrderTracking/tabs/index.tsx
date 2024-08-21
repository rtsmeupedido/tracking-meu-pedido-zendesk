import { useEffect } from "react";
import { Table as TableRTK } from "rtk-ux";
import { Tabs } from "rtk-ux";
import LiveEvents from "./live_events";
import AllEvents from "./all_events";
import { list } from "../../../api";

export default function Tab({ order, isModal }: any) {
    const getOrders = async () => {
        return await list(
            "eventos_consolidados_eventos_sistema",
            {
                before_filter: {
                    id_pacote: order.orderId,
                },
            },
            {},
            "query"
        )
            .then(function () {
                // const _data = data.sort(function (a: any, b: any) {
                //     return new Date(a.date) - new Date(b.date);
                // });
                // setorders(_data);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(() => {
        if (!order?.orderId) return;
        getOrders();
    }, [order]);
    return (
        <Tabs
            defaultActiveKey="1"
            className="-mt-4 w-full"
            items={[
                {
                    label: "Informações",
                    key: "1",
                    children: (
                        <div
                            className="overflow-auto px-4"
                            style={{
                                height: isModal ? 330 : "calc(100vh - 210px)",
                            }}
                        >
                            <LiveEvents id={order?.orderId} />
                            <div className="font-semibold text-black text-base mb-1">Items</div>
                            <TableRTK
                                dataSource={order?.items}
                                pagination={false}
                                components={{
                                    header: {
                                        cell: (props: any) => (
                                            <th {...props} className={`${props.className} bg-white`}>
                                                {props.children}
                                            </th>
                                        ),
                                    },
                                    body: {
                                        cell: (props: any) => (
                                            <td {...props} className={`${props.className} h-10 p-2`}>
                                                {props.children}
                                            </td>
                                        ),
                                    },
                                }}
                                locale={{
                                    emptyText: <div className="p-4 text-center">Nenhum pacote selecionado.</div>,
                                }}
                                columns={[
                                    {
                                        dataIndex: "imageUrl",
                                        title: "",
                                        align: "center",
                                        width: 50,
                                        render: (url) => (
                                            <img
                                                src={url}
                                                style={{
                                                    height: 34,
                                                    width: "auto",
                                                    borderRadius: 8,
                                                }}
                                            />
                                        ),
                                    },
                                    {
                                        dataIndex: "name",
                                        title: "Item",
                                        width: 400,
                                    },
                                    {
                                        dataIndex: "price",
                                        title: "Valor",
                                        width: 100,
                                        render: (price) =>
                                            new Intl.NumberFormat("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            }).format(price / 100),
                                    },
                                ]}
                            />
                        </div>
                    ),
                },
                {
                    label: "Todos os eventos",
                    key: "3",
                    children: <AllEvents isModal={isModal} id={order?.orderId} />,
                },
            ]}
        />
    );
}
