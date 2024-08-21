/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useEffect, useState } from "react";
import * as Style from "./styles";
import ZendeskTest from "./zendesk_test";
import { list } from "../../api";
import { useZaf } from "../../hooks/useZaf";

export default function OrderTracking() {
    const zafClient = useZaf();
    const [orders, setOrders] = useState([]);
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);
    const [orderSelected, setOrderSelected] = useState<any>(null);

    const handleFilter = (text: string) => {
        if (text.length < 2) return;
        setOrders([]);
        setOrderSelected(null);
        getData(text);
    };

    const getData = async (text: string) => {
        setLoading(true);
        const getItems = async (doc: string) => {
            const textFilter = doc ? doc : text;
            return await list(
                "mp_pacotes_last_status",
                {
                    before_filter: {
                        $or: [{ orderGroup: textFilter }, { "clientProfileData.document": textFilter }, { "clientProfileData.phone": `+55${textFilter}` }, { orderId: textFilter }],
                    },
                },
                {},
                "query"
            )
                .then(({ data }: any) => {
                    if (!data || data?.length === 0) {
                        alert("Error");
                    }
                    setOrders(data);
                    setLoading(false);
                })
                .catch(function (error: any) {
                    console.log("Error get order...", error);
                    setLoading(false);
                });
        };
        await getItems("");
    };

    const getBrands = async () => {
        return await list("mp_brands")
            .then(({ data, success }: { data: any; success: boolean }) => {
                if (!success) return;
                setBrands(data);
            })
            .catch(function (error: any) {
                console.log(error);
            });
    };

    async function init() {
        //@ts-ignore
        const t: any = await zafClient.zafClient?.get("viewport.size");
        zafClient.zafClient?.invoke("resize", { width: (t?.["viewport.size"].width || 1000) * 0.85, height: (t?.["viewport.size"].height || 600) - 150 });
    }
    useEffect(() => {
        getBrands();
        init();
    }, []);

    return (
        <Style.Container>
            <ZendeskTest loading={loading} handleFilter={handleFilter} brands={brands} setOrderSelected={setOrderSelected} orders={orders} orderSelected={orderSelected} />
        </Style.Container>
    );
}
