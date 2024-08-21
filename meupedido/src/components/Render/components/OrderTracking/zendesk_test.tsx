import { useState } from "react";
import { Button, Divider, MuiIcon, Input, Loader, Table, Tabs } from "rtk-ux";
import styled from "styled-components";
import LiveEvents from "./tabs/live_events";
import dayjs from "dayjs";

interface PropsInterface {
    orderSelected: any;
    brands: any;
    loading: boolean;
    orders: any;
    setOrderSelected: (data: any) => void;
    handleFilter: (a: string) => void;
}

export default function ZendeskTest({ orderSelected = null, brands = [], setOrderSelected, orders = [], handleFilter, loading }: PropsInterface) {
    const [text, setText] = useState("");
    const currency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value / 100);
    };
    return (
        <Style className={`w-full h-full`}>
            <div className="flex gap-2 flex-col flex-1 p-4 overflow-hidden" style={{ maxHeight: "calc(100% - 16px)" }}>
                <div className="flex items-center gap-1">
                    <Input className="w-72 h-8" placeholder="Ex: email, CPF, pacote, pedido, telefone" value={text} onChange={(e: any) => setText(e.target.value)} />
                    <Button onClick={() => handleFilter(text)}>
                        <MuiIcon icon={["mui", "search"]} color="black" />
                    </Button>
                </div>
                {loading ? (
                    <Loader center />
                ) : (
                    <div className="flex border flex-1 h-full overflow-hidden">
                        <div className="border-r w-1/2">
                            <Table
                                pagination={false}
                                dataSource={orders}
                                size="small"
                                components={{
                                    header: {
                                        cell: (props: any) => <th {...props}>{props.children}</th>,
                                    },
                                    body: {
                                        row: (props: any) => (
                                            <tr {...props} className={`${props.className} ${orderSelected?._id && props?.["data-row-key"] === orderSelected?._id ? "custom bg-blue-500 text-white" : ""}`}>
                                                {props?.children}
                                            </tr>
                                        ),
                                    },
                                }}
                                rowKey={"_id"}
                                columns={[
                                    {
                                        dataIndex: "orderId",
                                        title: "Pacote",
                                        key: "1111",
                                        width: 130,
                                        render: (text, rowData) => (
                                            <div className="hover:brightness-90 cursor-pointer" onClick={() => setOrderSelected(rowData)}>
                                                {text}
                                            </div>
                                        ),
                                    },
                                    {
                                        dataIndex: "hostname",
                                        title: "Marca",
                                        width: 70,
                                        render: (brand) => <div>{brands?.find((b: any) => b?.nome_vtex === brand)?.name}</div>,
                                    },
                                    {
                                        dataIndex: "creationDate",
                                        title: "Data",
                                        width: 100,
                                        render: (date) => <div>{date ? dayjs(date).format("DD/MM/YYYY") : "-"}</div>,
                                    },
                                    {
                                        dataIndex: "orderId",
                                        title: "Status",
                                        align: "center",
                                        width: 190,
                                        render: (info, rowData) => <div onClick={() => console.log(info)}>{rowData?._last_status?.name || "-"}</div>,
                                    },
                                ]}
                            />
                        </div>
                        <div className="w-1/2 px-3 overflow-hidden">
                            <Tabs
                                defaultActiveKey="info-1"
                                className="w-full h-full"
                                items={[
                                    {
                                        label: "Informações do pacote",
                                        key: "info-1",
                                        className: "h-full",
                                        children: (
                                            <div className="flex overflow-auto flex-col pb-4" style={{ height: "calc(100% - 1px)" }}>
                                                <Info title="Cliente">
                                                    <Row>
                                                        <RowItem field="Nome:" value={orderSelected?.clientProfileData?.firstName} />
                                                        <RowItem field="Email:" value={orderSelected?.clientProfileData?.email} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="CPF:" value={orderSelected?.clientProfileData?.document} />
                                                        <RowItem field="Tel:" value={orderSelected?.clientProfileData?.phone} />
                                                    </Row>
                                                </Info>
                                                <Divider className="mt-2 mb-4" />
                                                <Info title="Pedido">
                                                    <Row>
                                                        <RowItem field="Id:" value={orderSelected?.orderId} />
                                                        <RowItem field="Status:" value={orderSelected?.statusDescription} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="Seq:" value={orderSelected?.sequence} />
                                                        <RowItem field="Transp:" value={orderSelected?.shippingData?.logisticsInfo?.[0]?.deliveryCompany} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="Data:" value={dayjs(orderSelected?.creationDate).format("DD/MM/YYYY, HH:mm")} />
                                                        <RowItem field="Canal:" value={orderSelected?.shippingData?.logisticsInfo?.[0]?.deliveryChannel} />
                                                    </Row>
                                                </Info>
                                                <Divider className="mt-2 mb-4" />
                                                <Info title="Itens">
                                                    {orderSelected?.items?.map((i: any, idx: number) => (
                                                        <Item idx={idx} orderSelected={orderSelected} data={i} key={i?.uniqueId} />
                                                    ))}
                                                </Info>
                                                <Divider className="mt-2 mb-4" />
                                                <Info title="Pagamento">
                                                    <Row>
                                                        <RowItem field="NF:" value={"---"} />
                                                        <RowItem field="Data:" value={dayjs(orderSelected?.creationDate).format("DD/MM/YYYY, HH:mm")} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="Chave:" value={orderSelected?.paymentData?.transactions?.[0].transactionId} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="Subtotal:" value={currency(orderSelected?.value)} />
                                                        <RowItem field="Frete:" value={"---"} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="Desconto:" value={"---"} />
                                                        <RowItem field="Taxas:" value={"---"} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="Total:" value={currency(orderSelected?.paymentData?.transactions?.[0]?.payments?.[0].value)} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="Método:" value={"Cartão de crédito"} />
                                                        <RowItem field="TID:" value={orderSelected?.paymentData?.transactions?.[0]?.payments?.[0].connectorResponses?.Tid} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem
                                                            field="Parcelas:"
                                                            value={`${orderSelected?.paymentData?.transactions?.[0]?.payments?.[0].installments || 1}x ${currency(
                                                                orderSelected?.paymentData?.transactions?.[0]?.payments?.[0].value / (orderSelected?.paymentData?.transactions?.[0]?.payments?.[0].installments || 1)
                                                            )}`}
                                                        />
                                                        <RowItem field="NSU:" value={orderSelected?.paymentData?.transactions?.[0]?.payments?.[0].connectorResponses?.nsu} />
                                                    </Row>
                                                </Info>
                                                <Divider className="mt-2 mb-4" />
                                                <Info title="Entrega">
                                                    <Row>
                                                        <RowItem field="Dest:" value={orderSelected?.shippingData?.address?.receiverName} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="End:" value={`${orderSelected?.shippingData?.address?.street}, ${orderSelected?.shippingData?.address?.number}`} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="Compl:" value={orderSelected?.shippingData?.address?.complement} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="Cidade:" value={`${orderSelected?.shippingData?.address?.city} - ${orderSelected?.shippingData?.address?.state}`} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="Transp:" value={orderSelected?.shippingData?.logisticsInfo?.[0]?.deliveryCompany} />
                                                        <RowItem field="Status transp:" value={"---"} />
                                                    </Row>
                                                    <Row>
                                                        <RowItem field="Rastreio:" value={"---"} />
                                                        <RowItem field="Entrega:" value={"---"} />
                                                    </Row>
                                                </Info>
                                            </div>
                                        ),
                                    },
                                    {
                                        label: "Rastreamento",
                                        key: "info-3",
                                        className: "h-full",
                                        children: (
                                            <div className="overflow-auto pt-3  pl-4" style={{ height: "calc(100%)" }}>
                                                {orderSelected?.orderId ? <LiveEvents id={orderSelected?.orderId} isModal={true} /> : <div className="flex items-center justify-center flex-1">Selecione um pacote</div>}
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Style>
    );
}

const Info = ({ title = "", children }: any) => {
    return (
        <>
            <div className="font-bold mb-2">{title}</div>
            <div className="flex px-1 flex-col gap-1">{children}</div>
        </>
    );
};
const Row = ({ children }: any) => {
    return <div className="flex items-center">{children}</div>;
};
const RowItem = ({ field = "", value = "" }) => {
    return (
        <div className="flex items-center w-1/2">
            <div className="min-w-14 text-gray-400">{field}</div>
            <div className="font-semibold overflow-hidden overflow-ellipsis">{value || "-"}</div>
        </div>
    );
};

const Item = ({ data, orderSelected }: any) => {
    return (
        <div className="flex item-center group/item relative mb-2">
            <img style={{ height: 45, width: 30 }} className="object-contain rounded-sm" src={data?.imageUrl} />
            <div className="flex justify-center flex-col flex-1 px-2">
                <a target="_blank" href={`https://${orderSelected?.__brand?.site}${data?.detailUrl}`} className="text-black hover:text-blue-500">
                    {data.name}
                </a>
                <div className="flex items-center justify-between mt-0.5">
                    <div className="flex items-center gap-0.5">
                        <span>SKU:</span>
                        <div className="text-gray-500 font-semibold">206046</div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <span>Ref:</span>
                        <div className="text-gray-500 font-semibold flex items-center gap-1">
                            {data?.refId}
                            <MuiIcon click onClick={() => navigator.clipboard.writeText(data?.refId)} icon={["mui", "file_copy"]} className="text-gray-500 hover:text-blue-600" />
                        </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <span>Tam:</span>
                        <div className="text-gray-500 font-semibold">M</div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <span>Qtd:</span>
                        <div className="text-gray-500 font-semibold">{data?.quantity || 0}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const Style = styled.div`
    display: flex;
    flex-direction: column;
    background: white;
    .ant-table-row {
        &.custom .ant-table-cell-row-hover {
            background: unset;
        }
    }
    .ant-tabs-content {
        height: 100%;
    }
`;
