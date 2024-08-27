import { useEffect, useState } from "react";
import { Divider, MuiIcon, Timeline } from "rtk-ux";
import { list } from "../../../api";
import * as _dayjs from "dayjs";
const dayjs = _dayjs;

export default function LiveEvents({ id, isModal }: any) {
    const [data, setData] = useState<any>([]);
    const init = async () => {
        return await list(
            "mp_eventos_tracking_page",
            {
                filter: { pacote: id },
            },
            {},
            "query"
        ).then(({ data }) => {
            const group = data.reduce((r: any, a: any) => {
                r[a?.global_event_name] = [...(r[a?.global_event_name] || []), a];
                return r;
            }, {});

            setData(
                Object.keys(group).map((e: any) => {
                    return {
                        name: e,
                        events: group[e],
                    };
                })
            );
        });
    };
    useEffect(() => {
        if (!id) return;
        init();
    }, [id]);

    return data?.length === 0 || !data ? (
        <></>
    ) : (
        <>
            {!isModal && <div className="font-semibold text-black text-base mb-1">Tracking</div>}
            <div className={isModal ? "" : "px-4 pt-4"}>
                <Timeline
                    items={[
                        ...data.map((rowData: any, id: any) => ({
                            key: id,
                            color: "green",
                            dot: (
                                <MuiIcon
                                    icon={["muil", rowData?.name === "Pedido entregue" ? "check_circle" : "circle"]}
                                    width={rowData?.name === "Pedido entregue" ? 18 : 12}
                                    // pulse={rowData?.name !== "Pedido entregue" && id + 1 === data?.length}
                                    className={"text-green-600"}
                                />
                            ),
                            children: (
                                <div className="flex flex-col gap-1">
                                    {rowData?.name !== "null" && <span className="text-sm text-gray-400 font-light">{rowData?.name || ""}</span>}
                                    {(rowData?.events || [])?.map((event: any) => (
                                        <div key={event._id} className="text-black text-sm flex items-center font-light">
                                            {dayjs(event?.event_date).format("D [de] MMM., HH:mm")}
                                            <Divider type="vertical" className="h-4" />
                                            <div className={event?.show_info_customer ? "" : "text-gray-400"}>
                                                {(event?.message || event?.event_system_name || `Não classificado (${event?.api_event_name})`)?.replace(/{{(\w+)}}/g, (_: any, key: number) => event[key])}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ),
                        })),
                    ]}
                />
            </div>
            {!isModal && <Divider className="my-2" />}
        </>
    );
}
