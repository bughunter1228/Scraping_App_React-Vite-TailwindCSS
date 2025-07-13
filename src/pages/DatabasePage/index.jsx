import { useState, useEffect } from "react";
import { doc, setDoc, collection, getDocs, query, orderBy } from "firebase/firestore";

import { MdOutlineCalendarToday } from "react-icons/md";
import { PiHouseLineBold } from "react-icons/pi";
import { PiBuildingApartmentBold } from "react-icons/pi";
import { LuActivity } from "react-icons/lu";
import { FaRegChartBar } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { TbActivityHeartbeat } from "react-icons/tb";
import { IoSearchSharp } from "react-icons/io5";
import { FaDownload } from "react-icons/fa";

import Layout from "../../layouts"
import Input from "../../components/Input";
import NumberCart from "../../components/NumberCart"
import BlueButton from "../../components/BlueButton";
import { db } from "../../lib/firebase";

const DatabasePage = () => {

    const [keyword, setKeyword] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [properties, setProperties] = useState([{ a: 'a', b: 'b' }])
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [columns, setColumns] = useState([]);

    const startDownloading = () => {
        setIsDownloading(true);
    }

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const colRef = collection(db, "propertis");
            const q = query(colRef, orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProperties(list);
            setIsLoading(false);
        }

        fetchData();
    }, [])

    useEffect(() => {
        if (properties.length === 0) return;

        const cols = Array.from(
            new Set(properties.flatMap(Object.keys))
        );

        setColumns(cols.filter(col => !['createdAt', 'id', 'isSuccess'].includes(col)));

        const searchKeyword = keyword.trim().toLocaleLowerCase();

        setFilteredProperties(properties.filter(
            (property) =>
                property.Categories?.toLocaleLowerCase().includes(searchKeyword) ||
                property.addressOnly?.toLocaleLowerCase().includes(searchKeyword) ||
                property.city?.toLocaleLowerCase().includes(searchKeyword) ||
                property.content?.toLocaleLowerCase().includes(searchKeyword) ||
                property.frequency?.toLocaleLowerCase().includes(searchKeyword) ||
                property.name?.toLocaleLowerCase().includes(searchKeyword) ||
                property.price?.toLocaleLowerCase().includes(searchKeyword) ||
                property.property_size?.toLocaleLowerCase().includes(searchKeyword) ||
                property.title?.toLocaleLowerCase().includes(searchKeyword) ||
                property.time?.toLocaleLowerCase().includes(searchKeyword)
        ))
    }, [properties, keyword])

    useEffect(() => {
        console.log('columns ===> ', columns);
    }, [])

    return (
        <Layout>
            <div className="w-full h-[87%] flex justify-center items-center overflow-auto">
                {
                    !isLoading ? <div className="w-[90%] max-w-[1200px] h-full !mt-[20px]">
                        <h1 className="font-bold text-[20px]">Property Database</h1>
                        <p className="text-[#64748b]">View, edit, and manage your saved properties.</p>
                        <div className="w-full !mt-[20px] flex flex-row justify-between items-center">
                            <NumberCart title={"Today's Scraping"} number={5} icon={<MdOutlineCalendarToday color="#64748b" />} description={'Properties scraped today'} />
                            <NumberCart title={"Total Properties"} number={5} icon={<PiHouseLineBold color="#64748b" />} description={'All time scraped properties'} />
                            <NumberCart title={"Popular Type"} number={5} icon={<PiBuildingApartmentBold color="#64748b" />} description={'N/A properties'} />
                            <NumberCart title={"7-Day Activity"} number={5} icon={<LuActivity color="#64748b" />} description={'Properties this week'} />
                        </div>
                        <div className="w-full !mt-[20px] flex flex-row justify-between">
                            <div className="flex flex-col !p-[20px] bg-[white] !border-[1px] !border-[#e2e8f0] rounded-md w-[49%] gap-[5px]">
                                <div className="flex flex-row gap-[10px] items-center">
                                    <FaRegChartBar />
                                    <p className="text-[13px]">Property Types Distribution</p>
                                </div>

                            </div>
                            <div className="flex flex-col !p-[20px] bg-[white] !border-[1px] !border-[#e2e8f0] rounded-md w-[49%] gap-[5px]">
                                <div className="flex flex-row gap-[10px] items-center">
                                    <IoLocationSharp />
                                    <p className="text-[13px]">Top Locations</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full !mt-[20px]">
                            <div className="flex flex-col !p-[20px] bg-[white] !border-[1px] !border-[#e2e8f0] rounded-md w-[100%]">
                                <div className="flex flex-row gap-[10px] items-center">
                                    <TbActivityHeartbeat />
                                    <p className="text-[13px]">Scraping Activity (Last 7 Days)</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full !mt-[20px] !border-[1px] !border-[#e2e8f0] rounded-md !p-[10px]">
                            <div className="w-full flex flex-row gap-[10px] items-center">
                                <IoSearchSharp />
                                <Input id={'search_input'} placeholder={'Search properties by keywords'} value={keyword} handleOnChange={setKeyword} />
                                <div className="w-[100px]">
                                    <BlueButton text='Download' icon={<FaDownload />} handleOnClick={startDownloading} isLoading={isDownloading} classlist={'!text-[12px] !gap-[5px]'} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full !mt-[20px]">
                            <div className="flex flex-col !p-[20px] bg-[white] !border-[1px] !border-[#e2e8f0] rounded-md max-h-[800px] overflow-auto">
                                <table className="w-full table-auto border-collapse text-sm">
                                    <thead className="bg-gray-100 text-gray-700 uppercase font-semibold text-xs">
                                        <tr>
                                            <th className="px-4 py-3 border">ID</th>
                                            {columns.map((key) => (
                                                <th key={key} className="px-4 py-3 border whitespace-nowrap">
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProperties.map((item, idx) => (
                                            <tr
                                                key={idx}
                                                className="even:bg-gray-50 hover:bg-gray-100 transition duration-200"
                                            >
                                                <td className="px-4 py-2 border text-center">{idx + 1}</td>
                                                {columns.map((key, id) => {
                                                    let value = item[key];
                                                    let classList = "px-4 py-2 border";

                                                    if (Array.isArray(value)) {
                                                        return (
                                                            <td key={id} className={`${classList} text-blue-600 underline whitespace-nowrap`}>
                                                                {value.join(" | ")}
                                                            </td>
                                                        );
                                                    }

                                                    if (typeof value === "object" && value !== null) {
                                                        value = JSON.stringify(value);
                                                    }

                                                    if (typeof value === "string" && value.length > 150) {
                                                        value = value.slice(0, 100) + "...";
                                                    }

                                                    switch (key) {
                                                        case "url":
                                                            classList += " text-blue-600 underline";
                                                            value = `https://dubai.dubizzle.com${value}`;
                                                            break;
                                                        case "title":
                                                        case "content":
                                                        case "addressOnly":
                                                        case "time":
                                                            classList += " whitespace-nowrap";
                                                            break;
                                                        default:
                                                            break;
                                                    }

                                                    return (
                                                        <td key={id} className={classList} title={item[key]}>
                                                            {value}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div> : <span className="loader !w-[150px] !h-[150px] bg-[#6293f7]" ></span>
                }
            </div>
        </Layout>
    )
}

export default DatabasePage