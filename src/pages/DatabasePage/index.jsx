import { useState, useEffect } from "react";
import { doc, setDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import moment from "moment";
import ReactApexChart from "react-apexcharts";

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

    const columns = ['url', 'Categories', 'title', 'name', 'city', 'addressOnly', 'price', 'frequency', 'property_size', 'content', 'imageLinks'];

    const [keyword, setKeyword] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [properties, setProperties] = useState([{ a: 'a', b: 'b' }])
    const [logs, setLogs] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [todayScrapCount, setTodayScrapCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [popularType, setPopularType] = useState('');
    const [activityInPast, setActivityInPast] = useState(0);
    const [typeDistribution, setTypeDistribution] = useState({
        series: [{
            name: "sales",
            data: []
        }],
        options: {
            chart: {
                type: 'bar',
                height: 380
            },
            xaxis: {
                type: 'category',
                labels: {
                    formatter: function (val) {
                        return val
                    }
                },
                group: {
                    style: {
                        fontSize: '10px',
                        fontWeight: 700
                    }
                }
            },
            title: {
                text: ' ',
            },
            tooltip: {
                x: {
                    formatter: function (val) {
                        return val;
                    }
                }
            },
        },
    });
    const [scrapingAcitivity, setScrapingActivity] = useState({

        series: [{
            name: 'Net Profit',
            data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
            name: 'Revenue',
            data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }],
        options: {
            chart: {
                type: 'bar',
                height: 350
            },
            colors: ['#fa2c37', '#00c950'],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    borderRadius: 5,
                    borderRadiusApplication: 'end'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            },
            yaxis: {
                title: {
                    text: ''
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return val
                    }
                }
            }
        },


    });

    const startDownloading = () => {
        setIsDownloading(true);
    }

    useEffect(() => {

        const days = [];
        const success = [];
        const fails = [];

        for (let i = 0; i < 7; i++) {
            const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
            days.push(date);
        }

        days.forEach(day => {
            const filtered = logs.filter(log => log.time.includes(day));
            const success_sum = filtered.reduce((acc, curr) => acc + curr.success, 0);
            const fail_sum = filtered.reduce((acc, curr) => acc + curr.fail, 0);

            success.push(success_sum);
            fails.push(fail_sum);

        });

        setScrapingActivity({ 
            ...scrapingAcitivity, 
            series: [
                { name: 'Fails', data: fails.reverse() }, 
                { name: 'Success', data: success.reverse() }
            ],
            options:  {
                ...scrapingAcitivity.options,
                xaxis: {
                    categories: days.reverse()
                }
            } 
        })
    }, [logs])

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            const colRef = collection(db, "logs");
            const q = query(colRef, orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLogs(list);
            setIsLoading(false);
        }

        fetchData();
    }, [])

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
                property.time?.toLocaleLowerCase().includes(searchKeyword) ||
                (`https://dubai.dubizzle.com${property.url?.toLocaleLowerCase()}`).includes(searchKeyword)
        ))
    }, [properties, keyword])

    useEffect(() => {
        //----------------- Get Today Count

        const today = moment().format('YYYY-MM-DD').trim();
        setTodayScrapCount(properties.filter((property) => property.time?.includes(today)).length);

        //----------------- Get Total count

        setTotalCount(properties.length);

        //----------------- Get Popular Type

        const categories = properties.map((property) => property.Categories);
        const frequencyMap = {};
        // Count frequencies
        categories.forEach(item => {
            frequencyMap[item] = (frequencyMap[item] || 0) + 1;
        });

        // setTypeDistribution(frequencyMap);

        console.log('frequencyMap ==> ', frequencyMap);

        // Find the most frequent item and count
        let mostFrequentItem = null;
        let maxCount = 0;
        const series = [];

        for (const [item, count] of Object.entries(frequencyMap)) {
            series.push({ x: item, y: count });
            if (count > maxCount) {
                mostFrequentItem = item;
                maxCount = count;
            }
        }

        setTypeDistribution({ ...typeDistribution, series: [{ name: 'types', data: series }] })
        setPopularType(`${mostFrequentItem} / ${maxCount}`)

        setActivityInPast(properties.filter((property) => isWithinPast7Days(property.time?.split(' ')[0].trim())).length);
    }, [properties])

    const isWithinPast7Days = (dateString) => {
        const date = moment(dateString);
        const today = moment();
        const sevenDaysAgo = moment().subtract(7, 'days');

        return date.isBetween(sevenDaysAgo, today, null, '[]'); // inclusive
    };

    return (
        <Layout>
            <div className="w-full h-[calc(100%-114px)] flex justify-center items-center overflow-auto">
                {
                    !isLoading ? <div className="w-[90%] max-w-[1200px] h-full !mt-[20px]">
                        <h1 className="font-bold text-[20px]">Property Database</h1>
                        <p className="text-[#64748b]">View, edit, and manage your saved properties.</p>
                        <div className="w-full !mt-[20px] flex flex-row justify-between items-center">
                            <NumberCart title={"Today's Scraping"} number={todayScrapCount} icon={<MdOutlineCalendarToday color="#64748b" />} description={'Properties scraped today'} />
                            <NumberCart title={"Total Properties"} number={totalCount} icon={<PiHouseLineBold color="#64748b" />} description={'All time scraped properties'} />
                            <NumberCart title={"Popular Type"} number={popularType} icon={<PiBuildingApartmentBold color="#64748b" />} description={'N/A properties'} />
                            <NumberCart title={"7-Day Activity"} number={activityInPast} icon={<LuActivity color="#64748b" />} description={'Properties this week'} />
                        </div>
                        <div className="w-full !mt-[20px] flex flex-row justify-between">
                            <div className="flex flex-col !p-[20px] bg-[white] !border-[1px] !border-[#e2e8f0] rounded-md w-[49%] gap-[5px]">
                                <div className="flex flex-row gap-[10px] items-center">
                                    <FaRegChartBar />
                                    <p className="text-[13px]">Property Types Distribution</p>
                                </div>
                                <div>
                                    <div id="chart">
                                        <ReactApexChart options={typeDistribution.options} series={typeDistribution.series} type="bar" height={380} />
                                    </div>
                                    <div id="html-dist"></div>
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
                                <div>
                                    <div id="chart">
                                        <ReactApexChart options={scrapingAcitivity.options} series={scrapingAcitivity.series} type="bar" height={350} />
                                    </div>
                                    <div id="html-dist"></div>
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